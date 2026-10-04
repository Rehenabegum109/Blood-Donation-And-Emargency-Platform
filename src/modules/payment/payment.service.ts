import httpStatus from "http-status";

import {
  AuditAction,
  PaymentMethod,
  PaymentStatus,
  Role,
  VerificationStatus,
} from "../../generated/prisma/enums";

import type { PaymentWhereInput } from "../../generated/prisma/models";

import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";

import type {
  IBkashCreatePaymentPayload,
  IBkashCreatePaymentResponse,
  IBkashExecutePaymentResponse,
  IBkashQueryPaymentResponse,
  IInitiatePaymentPayload,
  IQuery,
} from "./payment.interface";
import { createAuditLog } from "../../utils/auditLog";
import { uploadToCloudinary } from "../../lib/cloudinaryUpload";
import { generatePaymentReceipt } from "../../utils/generatePaymentReceipt";



const createBkashPayment = async (
  payload: IBkashCreatePaymentPayload
) => {
  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "No bKash Access Token Found"
    );
  }

  const response = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config.bkash_app_key,
      },
      body: JSON.stringify(payload),
    }
  );

  const result =
    (await response.json()) as IBkashCreatePaymentResponse;

  console.log(
    "bKash Create Status:",
    response.status
  );

  console.log(
    "bKash Create Response:",
    result
  );

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      result.statusMessage ||
        "bKash Payment Creation Failed"
    );
  }

  if (
    !result.paymentID ||
    !result.bkashURL
  ) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Invalid bKash Payment Response"
    );
  }

  return result;
};

const initiatePayment = async (
  recipientId: string,
  payload: IInitiatePaymentPayload
) => {
  

 const bloodRequest =
  await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
      recipientId,
      deletedAt: null,
    },
  });

if (!bloodRequest) {
  throw new AppError(
    httpStatus.NOT_FOUND,
    "Blood Request Not Found"
  );
}

// Payment only for verified blood requests
if (
  bloodRequest.verificationStatus !==
  VerificationStatus.VERIFIED
) {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Blood Request Must Be Verified Before Payment"
  );
}


if (bloodRequest.status !== "FULFILLED") {
  throw new AppError(
    httpStatus.BAD_REQUEST,
    "Payment Can Only Be Initiated For Fulfilled Blood Requests"
  );
}
  

  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        bloodRequestId: bloodRequest.id,
      },
    });

  
  if (
    existingPayment &&
    (
      existingPayment.status === PaymentStatus.PENDING ||
      existingPayment.status === PaymentStatus.PAID
    )
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment is already ${existingPayment.status.toLowerCase()} for this blood request`
    );
  }


  const amount = bloodRequest.units * 100;



  const bkashPayload: IBkashCreatePaymentPayload = {
    mode: "0011",
    payerReference: recipientId,
    callbackURL: config.bkash_callback_url,
    amount: amount.toString(),
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: `BL-${bloodRequest.id}`,
  };

  const bkashPayment =
    await createBkashPayment(bkashPayload);

  if (!bkashPayment.paymentID) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "bKash Payment ID Not Found"
    );
  }

  if (!bkashPayment.bkashURL) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "bKash Payment URL Not Found"
    );
  }


  const payment =
    await prisma.$transaction(
      async (tx) => {
        const currentPayment =
          await tx.payment.findUnique({
            where: {
              bloodRequestId: bloodRequest.id,
            },
          });


        if (!currentPayment) {
          return tx.payment.create({
            data: {
              bloodRequestId: bloodRequest.id,
              amount,
              currency: "BDT",
              method: PaymentMethod.BKASH,
              status: PaymentStatus.PENDING,
              bkashPaymentId:
                bkashPayment.paymentID!,
              gatewayResponse:
                JSON.parse(
                  JSON.stringify(bkashPayment)
                ),
            },
          });
        }


        if (
          currentPayment.status ===
          PaymentStatus.PENDING
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Payment is already pending for this blood request"
          );
        }

        if (
          currentPayment.status ===
          PaymentStatus.PAID
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Payment is already completed for this blood request"
          );
        }

      

        if (
          currentPayment.status ===
            PaymentStatus.FAILED ||
          currentPayment.status ===
            PaymentStatus.CANCELLED
        ) {
          return tx.payment.update({
            where: {
              id: currentPayment.id,
            },
            data: {
              amount,
              currency: "BDT",
              method: PaymentMethod.BKASH,
              status: PaymentStatus.PENDING,

              // New bKash payment ID
              bkashPaymentId:
                bkashPayment.paymentID!,

              // Reset previous transaction data
              transactionId: null,
              paidAt: null,

              // Save new bKash response
              gatewayResponse:
                JSON.parse(
                  JSON.stringify(bkashPayment)
                ),
            },
          });
        }

        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Payment cannot be retried in its current status"
        );
      },
      {
        timeout: 10000,
        maxWait: 10000,
      }
    );



  await createAuditLog({
    userId: recipientId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: payment.id,
    details: {
      bloodRequestId:
        payment.bloodRequestId,

      amount:
        payment.amount.toString(),

      currency:
        payment.currency,

      method:
        payment.method,

      status:
        payment.status,

      bkashPaymentId:
        payment.bkashPaymentId,

      message:
        "bKash payment initiated/retried by recipient",
    },
  });

  return {
    payment,
    paymentID: bkashPayment.paymentID,
    paymentUrl: bkashPayment.bkashURL,
  };
};

// const executeBkashPayment = async (
//   paymentID: string
// ) => {
//   const bkashIdToken = await getBkashIdToken();

//   if (!bkashIdToken) {
//     throw new AppError(
//       httpStatus.BAD_GATEWAY,
//       "No bKash Access Token Found"
//     );
//   }

//   const executeUrl =
//     `${config.bkash_base_url}/tokenized/checkout/execute`;

//   console.log(
//     "bKash Execute URL:",
//     executeUrl
//   );

//   console.log(
//     "bKash Payment ID:",
//     paymentID
//   );

//   const response = await fetch(
//     executeUrl,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: bkashIdToken,
//         "X-App-Key":
//           config.bkash_app_key,
//       },
//       body: JSON.stringify({
//         paymentID,
//       }),
//     }
//   );

//   const result =
//     (await response.json()) as IBkashExecutePaymentResponse;

//   console.log(
//     "bKash Execute Status:",
//     response.status
//   );

//   console.log(
//     "bKash Execute Response:",
//     result
//   );

//   if (!response.ok) {
//     throw new AppError(
//       httpStatus.BAD_GATEWAY,
//       result.statusMessage ||
//         "bKash Payment Execution Failed"
//     );
//   }

//   const payment =
//     await prisma.payment.findUnique({
//       where: {
//         bkashPaymentId: paymentID,
//       },

//       include: {
//         bloodRequest: {
//           select: {
//             id: true,
//             recipientId: true,
//           },
//         },
//       },
//     });

//   if (!payment) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Payment Record Not Found"
//     );
//   }

//   // Already paid
//   if (
//     payment.status ===
//     PaymentStatus.PAID
//   ) {
//     return payment;
//   }

//   // Successful payment
//   if (
//     result.transactionStatus ===
//       "Completed" &&
//     result.trxID
//   ) {
//     // ------------------------------------------
//     // 1. Update payment as PAID
//     // ------------------------------------------

//     const updatedPayment =
//       await prisma.payment.update({
//         where: {
//           id: payment.id,
//         },

//         data: {
//           status:
//             PaymentStatus.PAID,

//           transactionId:
//             result.trxID,

//           paidAt: new Date(),

//           gatewayResponse:
//             JSON.parse(
//               JSON.stringify(result)
//             ),
//         },
//       });



//     const receiptPdf =
//       await generatePaymentReceipt({
//         paymentId:
//           updatedPayment.id,

//         transactionId:
//           result.trxID,

//         amount:
//           updatedPayment.amount.toString(),

//         currency:
//           updatedPayment.currency,

//         method:
//           updatedPayment.method,

//         paidAt:
//           updatedPayment.paidAt!,

//         bloodRequestId:
//           updatedPayment.bloodRequestId,
//       });

    

//     const uploadedReceipt =
//       await uploadToCloudinary(
//         receiptPdf,
//         "bloodlink/payment-receipts"
//       );

//     // ------------------------------------------
//     // 4. Save PDF URL
//     // ------------------------------------------

//     const paymentWithReceipt =
//       await prisma.payment.update({
//         where: {
//           id: updatedPayment.id,
//         },

//         data: {
//           receiptPdfUrl:
//             uploadedReceipt.secure_url,
//         },
//       });

//     // ------------------------------------------
//     // 5. Audit log
//     // ------------------------------------------

//     await createAuditLog({
//       userId:
//         payment.bloodRequest.recipientId,

//       action:
//         AuditAction.PAYMENT,

//       entity: "Payment",

//       entityId:
//         paymentWithReceipt.id,

//       details: {
//         bloodRequestId:
//           paymentWithReceipt.bloodRequestId,

//         amount:
//           paymentWithReceipt.amount.toString(),

//         currency:
//           paymentWithReceipt.currency,

//         method:
//           paymentWithReceipt.method,

//         status:
//           paymentWithReceipt.status,

//         transactionId:
//           paymentWithReceipt.transactionId,

//         receiptPdfUrl:
//           paymentWithReceipt.receiptPdfUrl,

//         message:
//           "Payment completed and receipt PDF uploaded successfully",
//       },
//     });

//     return paymentWithReceipt;
//   }

//   return result;
// };


// const bkashCallback = async (
//   query: Record<string, string | undefined>
// ) => {
//   const paymentID = query.paymentID;

//   const status = query.status;

//   if (!paymentID) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Payment ID Missing"
//     );
//   }

//   if (!status) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "Payment Status Missing"
//     );
//   }

//   const payment =
//     await prisma.payment.findUnique({
//       where: {
//         bkashPaymentId: paymentID,
//       },

//       include: {
//         bloodRequest: {
//           select: {
//             id: true,
//             recipientId: true,
//           },
//         },
//       },
//     });

//   if (!payment) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Payment Not Found"
//     );
//   }



//   if (status === "cancel") {
//     const updatedPayment =
//       await prisma.payment.update({
//         where: {
//           id: payment.id,
//         },

//         data: {
//           status:
//             PaymentStatus.CANCELLED,

//           gatewayResponse: {
//             callbackStatus: status,
//             paymentID,
//           },
//         },
//       });

//     // Audit log
//     await createAuditLog({
//       userId:
//         payment.bloodRequest.recipientId,

//       action:
//         AuditAction.PAYMENT,

//       entity: "Payment",

//       entityId:
//         updatedPayment.id,

//       details: {
//         bloodRequestId:
//           updatedPayment.bloodRequestId,

//         amount:
//           updatedPayment.amount.toString(),

//         currency:
//           updatedPayment.currency,

//         method:
//           updatedPayment.method,

//         status:
//           updatedPayment.status,

//         message:
//           "Payment cancelled by user",
//       },
//     });

//     return {
//       payment: updatedPayment,
//       status: "cancel",
//       message: "Payment Cancelled",
//     };
//   }



//   if (status === "failure") {
//     const updatedPayment =
//       await prisma.payment.update({
//         where: {
//           id: payment.id,
//         },

//         data: {
//           status:
//             PaymentStatus.FAILED,

//           gatewayResponse: {
//             callbackStatus: status,
//             paymentID,
//           },
//         },
//       });

//     // Audit log
//     await createAuditLog({
//       userId:
//         payment.bloodRequest.recipientId,

//       action:
//         AuditAction.PAYMENT,

//       entity: "Payment",

//       entityId:
//         updatedPayment.id,

//       details: {
//         bloodRequestId:
//           updatedPayment.bloodRequestId,

//         amount:
//           updatedPayment.amount.toString(),

//         currency:
//           updatedPayment.currency,

//         method:
//           updatedPayment.method,

//         status:
//           updatedPayment.status,

//         message:
//           "Payment failed",
//       },
//     });

//     return {
//       payment: updatedPayment,
//       status: "failure",
//       message: "Payment Failed",
//     };
//   }

//   // ----------------------------------------------
//   // SUCCESS
//   // ----------------------------------------------

//   if (status === "success") {
//     const executeResult =
//       await executeBkashPayment(
//         paymentID
//       );

//     return {
//       payment: executeResult,
//       status: "success",
//       message:
//         "Payment Completed Successfully",
//     };
//   }

//   throw new AppError(
//     httpStatus.BAD_REQUEST,
//     "Unknown Payment Status"
//   );
// };

const executeBkashPayment = async (
  paymentID: string
) => {
  console.log("========== bKash EXECUTE ==========");
  console.log("Payment ID:", paymentID);

  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "No bKash Access Token Found"
    );
  }

  const executeUrl =
    `${config.bkash_base_url}/tokenized/checkout/execute`;

  console.log("Execute URL:", executeUrl);

  const response = await fetch(
    executeUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config.bkash_app_key,
      },
      body: JSON.stringify({
        paymentID,
      }),
    }
  );

  const result =
    (await response.json()) as IBkashExecutePaymentResponse;

  console.log(
    "bKash Execute Status:",
    response.status
  );

  console.log(
    "bKash Execute Response:",
    result
  );

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      result.statusMessage ||
        "bKash Payment Execution Failed"
    );
  }

  const payment =
    await prisma.payment.findUnique({
      where: {
        bkashPaymentId: paymentID,
      },
      include: {
        bloodRequest: {
          select: {
            id: true,
            recipientId: true,
          },
        },
      },
    });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Record Not Found"
    );
  }

  // Already PAID
  if (
    payment.status === PaymentStatus.PAID
  ) {
    console.log(
      "✅ Payment is already PAID"
    );

    return payment;
  }

  // bKash payment completed
  if (
    result.transactionStatus === "Completed" &&
    result.trxID
  ) {
    console.log(
      "========== PAYMENT COMPLETED =========="
    );

    // 1. Mark payment as PAID
    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: PaymentStatus.PAID,
          transactionId: result.trxID,
          paidAt: new Date(),
          gatewayResponse:
            JSON.parse(
              JSON.stringify(result)
            ),
        },
      });

    console.log(
      "✅ Payment updated to PAID"
    );

    // 2. Generate receipt
    try {
      const receiptPdf =
        await generatePaymentReceipt({
          paymentId: updatedPayment.id,
          transactionId: result.trxID,
          amount:
            updatedPayment.amount.toString(),
          currency:
            updatedPayment.currency,
          method:
            updatedPayment.method,
          paidAt:
            updatedPayment.paidAt!,
          bloodRequestId:
            updatedPayment.bloodRequestId,
        });

      console.log(
        "✅ Receipt generated"
      );

      // 3. Upload receipt
      try {
        const uploadedReceipt =
          await uploadToCloudinary(
            receiptPdf,
            "bloodlink/payment-receipts"
          );

        console.log(
          "✅ Receipt uploaded:",
          uploadedReceipt.secure_url
        );

        // 4. Save receipt URL
        const paymentWithReceipt =
          await prisma.payment.update({
            where: {
              id: updatedPayment.id,
            },
            data: {
              receiptPdfUrl:
                uploadedReceipt.secure_url,
            },
          });

        console.log(
          "✅ Receipt URL saved"
        );

        // 5. Audit log
        try {
          await createAuditLog({
            userId:
              payment.bloodRequest.recipientId,

            action:
              AuditAction.PAYMENT,

            entity: "Payment",

            entityId:
              paymentWithReceipt.id,

            details: {
              bloodRequestId:
                paymentWithReceipt.bloodRequestId,

              amount:
                paymentWithReceipt.amount.toString(),

              currency:
                paymentWithReceipt.currency,

              method:
                paymentWithReceipt.method,

              status:
                paymentWithReceipt.status,

              transactionId:
                paymentWithReceipt.transactionId,

              receiptPdfUrl:
                paymentWithReceipt.receiptPdfUrl,

              message:
                "Payment completed and receipt PDF uploaded successfully",
            },
          });

          console.log(
            "✅ Audit log created"
          );
        } catch (error) {
          console.error(
            "⚠️ Audit log failed:",
            error
          );
        }

        return paymentWithReceipt;
      } catch (error) {
        console.error(
          "⚠️ Cloudinary upload failed:",
          error
        );

        return updatedPayment;
      }
    } catch (error) {
      console.error(
        "⚠️ Receipt generation failed:",
        error
      );

      return updatedPayment;
    }
  }

  console.log(
    "⚠️ Payment not completed:",
    result.transactionStatus
  );

  return result;
};
const bkashCallback = async (query: IQuery) => {
  console.log("========== bKash CALLBACK ==========");
  console.log("Callback Query:", query);
  console.log("====================================");

  const { paymentID, status } = query;


  if (!paymentID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment ID is missing"
    );
  }

  const payment = await prisma.payment.findUnique({
    where: {
      bkashPaymentId: paymentID,
    },
    include: {
      bloodRequest: {
        select: {
          id: true,
          recipientId: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment not found"
    );
  }

  if (status === "cancel") {
    console.log("========== bKash CANCEL ==========");
    console.log("Payment ID:", paymentID);
    console.log("Callback Query:", query);
    console.log("==================================");

    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.CANCELLED,
        gatewayResponse: {
          callbackStatus: status,
          paymentID,
          signature: query.signature,
          apiVersion: query.apiVersion,
        },
      },
    });

    return {
      status: "cancel",
      message: "Payment Cancelled",
      data: updatedPayment,
    };
  }

  if (status === "failure") {
    console.log("========== bKash FAILURE ==========");
    console.log("Payment ID:", paymentID);
    console.log("Callback Query:", query);
    console.log("===================================");

    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: {
          callbackStatus: status,
          paymentID,
          signature: query.signature,
          apiVersion: query.apiVersion,
        },
      },
    });

    return {
      status: "failure",
      message: "Payment Failed",
      data: updatedPayment,
    };
  }

  // =========================
  // SUCCESS
  // =========================
  if (status === "success") {
    console.log("========== bKash SUCCESS ==========");
    console.log("Payment ID:", paymentID);
    console.log("Callback Query:", query);
    console.log("===================================");

    const result = await executeBkashPayment(paymentID);

    return {
      status: "success",
      message: "Payment completed successfully",
      data: result,
    };
  }

  // =========================
  // UNKNOWN STATUS
  // =========================
  console.log("========== UNKNOWN bKash STATUS ==========");
  console.log("Payment ID:", paymentID);
  console.log("Status:", status);
  console.log("Callback Query:", query);
  console.log("==========================================");

  throw new AppError(
    httpStatus.BAD_REQUEST,
    `Unknown bKash callback status: ${status}`
  );
};
const getMyPayments = async (
  query: IQuery,
  recipientId: string
) => {
  const limit = query.limit
    ? Number(query.limit)
    : 10;

  const page = query.page
    ? Number(query.page)
    : 1;

  const skip =
    (page - 1) * limit;

  const sortBy =
    query.sortBy || "createdAt";

  const sortOrder =
    query.sortOrder || "desc";

  const andConditions:
    PaymentWhereInput[] = [
      {
        bloodRequest: {
          recipientId,
          deletedAt: null,
        },
      },
    ];

  if (query.status) {
    andConditions.push({
      status:
        query.status as PaymentStatus,
    });
  }

  if (query.method) {
    andConditions.push({
      method:
        query.method as PaymentMethod,
    });
  }

  const payments =
    await prisma.payment.findMany({
      where: {
        AND: andConditions,
      },

      take: limit,

      skip,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        bloodRequest: {
          select: {
            id: true,
            bloodGroup: true,
            units: true,
            hospitalName: true,
            hospitalAddress: true,
            requiredDate: true,
            urgency: true,
            status: true,
          },
        },
      },
    });

  const total =
    await prisma.payment.count({
      where: {
        AND: andConditions,
      },
    });

  return {
    data: payments,

    meta: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};



const getAllPayments = async (
  query: IQuery
) => {
  const limit = query.limit
    ? Number(query.limit)
    : 10;

  const page = query.page
    ? Number(query.page)
    : 1;

  const skip =
    (page - 1) * limit;

  const sortBy =
    query.sortBy || "createdAt";

  const sortOrder =
    query.sortOrder || "desc";

  const andConditions:
    PaymentWhereInput[] = [];

  // Recipient email filter
  if (query.recipientEmail) {
    andConditions.push({
      bloodRequest: {
        recipient: {
          email:
            query.recipientEmail,
        },
      },
    });
  }

  // Payment status filter
  if (query.status) {
    andConditions.push({
      status:
        query.status as PaymentStatus,
    });
  }

  // Payment method filter
  if (query.method) {
    andConditions.push({
      method:
        query.method as PaymentMethod,
    });
  }

  const payments =
    await prisma.payment.findMany({
      where: {
        AND: andConditions,
      },

      take: limit,

      skip,

      orderBy: {
        [sortBy]: sortOrder,
      },

      include: {
        bloodRequest: {
          select: {
            id: true,
            bloodGroup: true,
            units: true,
            hospitalName: true,
            hospitalAddress: true,
            requiredDate: true,
            urgency: true,
            status: true,

            recipient: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

  const total =
    await prisma.payment.count({
      where: {
        AND: andConditions,
      },
    });

  return {
    data: payments,

    meta: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};


const getSinglePayment = async (
  paymentId: string,
  user: {
    id: string;
    role: Role;
  }
) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        bloodRequest: {
          include: {
            recipient: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found"
    );
  }

  // Recipient can only see own payment
  if (
    user.role === Role.RECIPIENT
  ) {
    if (
      payment.bloodRequest
        .recipientId !== user.id
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You Are Not Allowed To View This Payment"
      );
    }
  }

  return payment;
};

const uploadPaymentReceipt = async (
  paymentId: string,
  file: Express.Multer.File,
  userId: string
) => {

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      bloodRequest: {
        select: {
          recipientId: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found"
    );
  }

  
  if (payment.bloodRequest.recipientId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You Are Not Allowed To Upload Receipt For This Payment"
    );
  }

  if (payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Must Be Completed Before Uploading Receipt"
    );
  }

  // 4. Check file
  if (!file) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Receipt PDF Is Required"
    );
  }


  if (file.mimetype !== "application/pdf") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only PDF Files Are Allowed"
    );
  }

  
  const uploadedFile = await uploadToCloudinary(
    file.buffer,
    "bloodlink/payment-receipts"
  );


  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      receiptPdfUrl: uploadedFile.secure_url,
    },
  });


  await createAuditLog({
    userId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: payment.id,
    details: {
      paymentId: payment.id,
      receiptPdfUrl: uploadedFile.secure_url,
      message: "Payment receipt PDF uploaded successfully",
    },
  });

  return updatedPayment;
};


export const PaymentService = {
  createBkashPayment,
  initiatePayment,
  executeBkashPayment,
  bkashCallback,
  uploadPaymentReceipt,
  getMyPayments,
  getAllPayments,
  getSinglePayment,
};