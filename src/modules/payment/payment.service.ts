
import httpStatus from "http-status";
import Stripe from "stripe";
import { Prisma } from "../../generated/prisma/client";

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
import { createAuditLog } from "../../utils/auditLog";
import { uploadToCloudinary } from "../../lib/cloudinaryUpload";
import { generatePaymentReceipt } from "../../utils/generatePaymentReceipt";

import type {
  IBkashCreatePaymentPayload,
  IBkashCreatePaymentResponse,
  IBkashExecutePaymentResponse,
  IInitiatePaymentPayload,
  IQuery,
  IStripeCheckoutPayload,
} from "./payment.interface";

const stripe = new Stripe(config.stripe_secret_key);



const createBkashPayment = async (
  payload: IBkashCreatePaymentPayload,
) => {
  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "No bKash Access Token Found",
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
    },
  );

  const result =
    (await response.json()) as IBkashCreatePaymentResponse;

  console.log("bKash Create Status:", response.status);
  console.log("bKash Create Response:", result);

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      result.statusMessage ||
        "bKash Payment Creation Failed",
    );
  }

  if (!result.paymentID || !result.bkashURL) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Invalid bKash Payment Response",
    );
  }

  return result;
};


const initiatePayment = async (
  recipientId: string,
  payload: IInitiatePaymentPayload,
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
      "Blood Request Not Found",
    );
  }

  if (
    bloodRequest.verificationStatus !==
    VerificationStatus.VERIFIED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Blood Request Must Be Verified Before Payment",
    );
  }

  if (bloodRequest.status !== "FULFILLED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Can Only Be Initiated For Fulfilled Blood Requests",
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
      `Payment is already ${existingPayment.status.toLowerCase()} for this blood request`,
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
      "bKash Payment ID Not Found",
    );
  }

  if (!bkashPayment.bkashURL) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "bKash Payment URL Not Found",
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
                  JSON.stringify(bkashPayment),
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
            "Payment is already pending for this blood request",
          );
        }

        if (
          currentPayment.status ===
          PaymentStatus.PAID
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Payment is already completed for this blood request",
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
              bkashPaymentId:
                bkashPayment.paymentID!,
              stripeSessionId: Prisma.JsonNull
                ? undefined
                : undefined,
              transactionId: null,
              paidAt: null,
              gatewayResponse:
                JSON.parse(
                  JSON.stringify(bkashPayment),
                ),
            },
          });
        }

        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Payment cannot be retried in its current status",
        );
      },
      {
        timeout: 10000,
        maxWait: 10000,
      },
    );

  await createAuditLog({
    userId: recipientId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: payment.id,
    details: {
      bloodRequestId: payment.bloodRequestId,
      amount: payment.amount.toString(),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      bkashPaymentId: payment.bkashPaymentId,
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

/* =========================================================
   STRIPE CREATE CHECKOUT SESSION
========================================================= */

const createStripeCheckoutSession = async (
  recipientId: string,
  payload: IStripeCheckoutPayload,
): Promise<{
  payment: Awaited<
    ReturnType<typeof prisma.payment.update>
  >;
  sessionId: string;
  paymentUrl: string;
}> => {
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
      "Blood Request Not Found",
    );
  }

  if (
    bloodRequest.verificationStatus !==
    VerificationStatus.VERIFIED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Blood Request Must Be Verified Before Payment",
    );
  }

  if (bloodRequest.status !== "FULFILLED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Can Only Be Initiated For Fulfilled Blood Requests",
    );
  }

  const amount = bloodRequest.units * 100;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid payment amount",
    );
  }

  /*
   * Stripe amount is sent in the smallest currency unit.
   * Example:
   * 100 BDT/USD = 10000 minor units.
   */
  const amountInMinorUnit = amount * 100;

  let existingPayment =
    await prisma.payment.findUnique({
      where: {
        bloodRequestId: bloodRequest.id,
      },
    });

  if (
    existingPayment?.status ===
    PaymentStatus.PAID
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment is already completed for this blood request",
    );
  }

  /*
   * If bKash payment is currently pending,
   * don't allow another provider at the same time.
   */
  if (
    existingPayment?.status ===
      PaymentStatus.PENDING &&
    existingPayment.method ===
      PaymentMethod.BKASH
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Another payment is already pending for this blood request",
    );
  }

  /*
   * Reuse an existing Stripe Checkout Session
   * if it is still open.
   */
  if (
    existingPayment?.status ===
      PaymentStatus.PENDING &&
    existingPayment.method ===
      PaymentMethod.STRIPE &&
    existingPayment.stripeSessionId
  ) {
    try {
      const existingSession =
        await stripe.checkout.sessions.retrieve(
          existingPayment.stripeSessionId,
        );

      if (
        existingSession.status === "open" &&
        existingSession.url
      ) {
        return {
          payment: existingPayment as Awaited<
            ReturnType<typeof prisma.payment.update>
          >,
          sessionId: existingSession.id,
          paymentUrl: existingSession.url,
        };
      }

      if (
        existingSession.status ===
        "expired"
      ) {
        existingPayment =
          await prisma.payment.update({
            where: {
              id: existingPayment.id,
            },
            data: {
              status:
                PaymentStatus.CANCELLED,
              gatewayResponse:
                JSON.parse(
                  JSON.stringify(
                    existingSession,
                  ),
                ),
            },
          });
      }
    } catch (error) {
      console.error(
        "Failed to retrieve existing Stripe session:",
        error,
      );
    }
  }

  /*
   * Create/update local payment record.
   */
  const payment =
    await prisma.$transaction(
      async (tx) => {
        const currentPayment =
          await tx.payment.findUnique({
            where: {
              bloodRequestId:
                bloodRequest.id,
            },
          });

        if (
          currentPayment?.status ===
          PaymentStatus.PAID
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Payment is already completed for this blood request",
          );
        }

        if (
          currentPayment?.status ===
            PaymentStatus.PENDING &&
          currentPayment.method ===
            PaymentMethod.BKASH
        ) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Another payment is already pending for this blood request",
          );
        }

        if (!currentPayment) {
          return tx.payment.create({
            data: {
              bloodRequestId:
                bloodRequest.id,
              amount,
              currency: "BDT",
              method:
                PaymentMethod.STRIPE,
              status:
                PaymentStatus.PENDING,
            },
          });
        }

        return tx.payment.update({
          where: {
            id: currentPayment.id,
          },
          data: {
            amount,
            currency: "BDT",
            method:
              PaymentMethod.STRIPE,
            status:
              PaymentStatus.PENDING,
            bkashPaymentId: null,
            stripeSessionId: null,
            transactionId: null,
            paidAt: null,
            receiptPdfUrl: null,

            /*
             * Prisma 7 JSON fields don't accept
             * direct null in this generated client.
             */
            gatewayResponse:
              Prisma.JsonNull,
          },
        });
      },
      {
        timeout: 10000,
        maxWait: 10000,
      },
    );

  let session: Stripe.Checkout.Session;

  try {
    session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        /*
         * IMPORTANT:
         * Do NOT use:
         *
         * payment_method_types: ["card"]
         *
         * New Stripe API manages payment methods
         * from Dashboard.
         */

        line_items: [
          {
            price_data: {
              currency: "bdt",

              product_data: {
                name:
                  "Blood Donation Assistance Payment",

                description:
                  `Blood Request: ${bloodRequest.id}`,
              },

              unit_amount:
                amountInMinorUnit,
            },

            quantity: 1,
          },
        ],

        metadata: {
          paymentId: payment.id,
          bloodRequestId:
            bloodRequest.id,
          recipientId,
        },

        success_url:
          `${config.frontend_url}` +
          `/dashboard/recipient/payments/success` +
          `?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${config.frontend_url}` +
          `/dashboard/recipient/payments/cancel` +
          `?payment_id=${payment.id}`,
      });
  } catch (error) {
    console.error(
      "Stripe Checkout Session creation failed:",
      error,
    );

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status:
          PaymentStatus.FAILED,

        gatewayResponse: {
          provider: "stripe",
          message:
            error instanceof Error
              ? error.message
              : "Stripe Checkout Session creation failed",
        },
      },
    });

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      error instanceof Error
        ? error.message
        : "Stripe Checkout Session Creation Failed",
    );
  }

  if (!session.id || !session.url) {
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status:
          PaymentStatus.FAILED,

        gatewayResponse: {
          provider: "stripe",
          sessionId: session.id,
          message:
            "Stripe did not return a checkout URL",
        },
      },
    });

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Stripe Checkout URL Not Found",
    );
  }

  const updatedPayment =
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        stripeSessionId:
          session.id,

        gatewayResponse:
          JSON.parse(
            JSON.stringify(session),
          ),
      },
    });

  await createAuditLog({
    userId: recipientId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: updatedPayment.id,
    details: {
      bloodRequestId:
        updatedPayment.bloodRequestId,

      amount:
        updatedPayment.amount.toString(),

      currency:
        updatedPayment.currency,

      method:
        updatedPayment.method,

      status:
        updatedPayment.status,

      stripeSessionId:
        session.id,

      message:
        "Stripe payment checkout session created",
    },
  });

  return {
    payment: updatedPayment,
    sessionId: session.id,
    paymentUrl: session.url,
  };
};

/* =========================================================
   STRIPE WEBHOOK
========================================================= */

const handleStripeWebhook = async (
  signature: string,
  rawBody: Buffer,
) => {
  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        config.stripe_webhook_secret,
      );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook signature",
    );
  }

  console.log(
    "Stripe webhook event:",
    event.type,
  );

  /* -----------------------------------------
     CHECKOUT SESSION COMPLETED
  ----------------------------------------- */

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    const paymentId =
      session.metadata?.paymentId;

    if (!paymentId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Payment ID missing from Stripe session metadata",
      );
    }

    if (
      session.payment_status !==
      "paid"
    ) {
      return {
        received: true,
        message:
          "Checkout completed but payment is not marked as paid",
      };
    }

    const payment =
      await prisma.payment.findUnique({
        where: {
          id: paymentId,
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
        "Payment Record Not Found",
      );
    }

    /*
     * Webhook can be delivered more than once.
     */
    if (
      payment.status ===
      PaymentStatus.PAID
    ) {
      return {
        received: true,
        message:
          "Payment already processed",
      };
    }

    const transactionId =
      typeof session.payment_intent ===
      "string"
        ? session.payment_intent
        : session.id;

    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status:
            PaymentStatus.PAID,

          transactionId,

          paidAt: new Date(),

          stripeSessionId:
            session.id,

          gatewayResponse:
            JSON.parse(
              JSON.stringify(session),
            ),
        },
      });

    /*
     * Receipt generation/upload should NOT
     * change the payment back to FAILED.
     */
    try {
      const receiptPdf =
        await generatePaymentReceipt({
          paymentId:
            updatedPayment.id,

          transactionId,

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

      const uploadedReceipt =
        await uploadToCloudinary(
          receiptPdf,
          "bloodlink/payment-receipts",
        );

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

      await createAuditLog({
        userId:
          payment.bloodRequest.recipientId,

        action:
          AuditAction.PAYMENT,

        entity:
          "Payment",

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

          stripeSessionId:
            paymentWithReceipt.stripeSessionId,

          receiptPdfUrl:
            paymentWithReceipt.receiptPdfUrl,

          message:
            "Stripe payment completed and receipt PDF uploaded successfully",
        },
      });

      return {
        received: true,
        payment:
          paymentWithReceipt,
      };
    } catch (receiptError) {
      console.error(
        "Stripe receipt generation/upload failed:",
        receiptError,
      );

      return {
        received: true,
        payment:
          updatedPayment,

        message:
          "Payment completed but receipt generation failed",
      };
    }
  }

  /* -----------------------------------------
     CHECKOUT SESSION EXPIRED
  ----------------------------------------- */

  if (
    event.type ===
    "checkout.session.expired"
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    const paymentId =
      session.metadata?.paymentId;

    if (!paymentId) {
      return {
        received: true,
        message:
          "No payment ID found",
      };
    }

    const payment =
      await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

    if (!payment) {
      return {
        received: true,
        message:
          "Payment not found",
      };
    }

    if (
      payment.status ===
      PaymentStatus.PAID
    ) {
      return {
        received: true,
        message:
          "Payment already paid",
      };
    }

    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status:
            PaymentStatus.CANCELLED,

          gatewayResponse:
            JSON.parse(
              JSON.stringify(session),
            ),
        },
      });

    await createAuditLog({
      userId:
        (
          await prisma.bloodRequest.findUnique({
            where: {
              id: payment.bloodRequestId,
            },
            select: {
              recipientId: true,
            },
          })
        )?.recipientId,

      action:
        AuditAction.PAYMENT,

      entity:
        "Payment",

      entityId:
        updatedPayment.id,

      details: {
        bloodRequestId:
          updatedPayment.bloodRequestId,

        method:
          updatedPayment.method,

        status:
          updatedPayment.status,

        stripeSessionId:
          updatedPayment.stripeSessionId,

        message:
          "Stripe checkout session expired",
      },
    });

    return {
      received: true,
      payment:
        updatedPayment,
    };
  }

  return {
    received: true,
    message:
      `Unhandled Stripe event: ${event.type}`,
  };
};

/* =========================================================
   GET STRIPE CHECKOUT SESSION
========================================================= */

const getStripeCheckoutSession = async (
  sessionId: string,
  recipientId: string,
): Promise<{
  sessionId: string;
  status: Stripe.Checkout.Session.Status | null;
  paymentStatus:
    Stripe.Checkout.Session.PaymentStatus | null;
  payment: Awaited<
    ReturnType<typeof prisma.payment.findUnique>
  >;
}> => {
  if (!sessionId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Stripe Session ID is required",
    );
  }

  const session =
    await stripe.checkout.sessions.retrieve(
      sessionId,
    );

  const paymentId =
    session.metadata?.paymentId;

  if (!paymentId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment ID missing from Stripe session",
    );
  }

  const payment =
    await prisma.payment.findUnique({
      where: {
        id: paymentId,
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
      "Payment Not Found",
    );
  }

  if (
    payment.bloodRequest.recipientId !==
    recipientId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You Are Not Allowed To View This Payment",
    );
  }

  return {
    sessionId:
      session.id,

    status:
      session.status,

    paymentStatus:
      session.payment_status,

    payment,
  };
};

/* =========================================================
   CANCEL STRIPE PAYMENT
========================================================= */

const cancelStripePayment = async (
  paymentId: string,
  recipientId: string,
) => {
  const payment =
    await prisma.payment.findUnique({
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
      "Payment Not Found",
    );
  }

  if (
    payment.bloodRequest.recipientId !==
    recipientId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You Are Not Allowed To Cancel This Payment",
    );
  }

  if (
    payment.method !==
    PaymentMethod.STRIPE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only Stripe Payments Can Be Cancelled Here",
    );
  }

  if (
    payment.status ===
    PaymentStatus.PAID
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Paid Payment Cannot Be Cancelled",
    );
  }

  if (
    payment.status ===
    PaymentStatus.CANCELLED
  ) {
    return payment;
  }

  const updatedPayment =
    await prisma.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        status:
          PaymentStatus.CANCELLED,

        gatewayResponse: {
          provider: "stripe",
          stripeSessionId:
            payment.stripeSessionId,
          cancelledBy:
            recipientId,
          cancelledAt:
            new Date().toISOString(),
        },
      },
    });

  await createAuditLog({
    userId: recipientId,

    action:
      AuditAction.PAYMENT,

    entity:
      "Payment",

    entityId:
      updatedPayment.id,

    details: {
      bloodRequestId:
        updatedPayment.bloodRequestId,

      method:
        updatedPayment.method,

      status:
        updatedPayment.status,

      stripeSessionId:
        updatedPayment.stripeSessionId,

      message:
        "Stripe payment cancelled by recipient",
    },
  });

  return updatedPayment;
};

/* =========================================================
   bKASH EXECUTE PAYMENT
========================================================= */

const executeBkashPayment = async (
  paymentID: string,
) => {
  const bkashIdToken =
    await getBkashIdToken();

  if (!bkashIdToken) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "No bKash Access Token Found",
    );
  }

  const executeUrl =
    `${config.bkash_base_url}/tokenized/checkout/execute`;

  console.log(
    "bKash Execute URL:",
    executeUrl,
  );

  console.log(
    "bKash Payment ID:",
    paymentID,
  );

  const response =
    await fetch(executeUrl, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Accept:
          "application/json",

        Authorization:
          bkashIdToken,

        "X-App-Key":
          config.bkash_app_key,
      },

      body: JSON.stringify({
        paymentID,
      }),
    });

  const result =
    (await response.json()) as
      IBkashExecutePaymentResponse;

  console.log(
    "bKash Execute Status:",
    response.status,
  );

  console.log(
    "bKash Execute Response:",
    result,
  );

  if (!response.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      result.statusMessage ||
        "bKash Payment Execution Failed",
    );
  }

  const payment =
    await prisma.payment.findUnique({
      where: {
        bkashPaymentId:
          paymentID,
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
      "Payment Record Not Found",
    );
  }

  if (
    payment.status ===
    PaymentStatus.PAID
  ) {
    return payment;
  }

  if (
    result.transactionStatus ===
      "Completed" &&
    result.trxID
  ) {
    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status:
            PaymentStatus.PAID,

          transactionId:
            result.trxID,

          paidAt:
            new Date(),

          gatewayResponse:
            JSON.parse(
              JSON.stringify(result),
            ),
        },
      });

    console.log(
      "Payment marked as PAID:",
      updatedPayment.id,
    );

    try {
      const receiptPdf =
        await generatePaymentReceipt({
          paymentId:
            updatedPayment.id,

          transactionId:
            result.trxID,

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
        "Receipt PDF generated successfully",
      );

      const uploadedReceipt =
        await uploadToCloudinary(
          receiptPdf,
          "bloodlink/payment-receipts",
        );

      console.log(
        "Receipt uploaded:",
        uploadedReceipt.secure_url,
      );

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

      await createAuditLog({
        userId:
          payment.bloodRequest
            .recipientId,

        action:
          AuditAction.PAYMENT,

        entity:
          "Payment",

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

      return paymentWithReceipt;
    } catch (receiptError) {
      console.error(
        "Receipt generation/upload failed:",
        receiptError,
      );

      return updatedPayment;
    }
  }

  return result;
};

/* =========================================================
   bKASH CALLBACK
========================================================= */

const bkashCallback = async (
  query: IQuery,
) => {
  console.log(
    "========== bKash CALLBACK ==========",
  );

  console.log(
    "Callback Query:",
    query,
  );

  console.log(
    "====================================",
  );

  const {
    paymentID,
    status,
  } = query;

  if (!paymentID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment ID is missing",
    );
  }

  const payment =
    await prisma.payment.findUnique({
      where: {
        bkashPaymentId:
          paymentID,
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
      "Payment not found",
    );
  }

  if (status === "cancel") {
    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status:
            PaymentStatus.CANCELLED,

          gatewayResponse: {
            callbackStatus:
              status,

            paymentID,

            signature:
              query.signature,

            apiVersion:
              query.apiVersion,
          },
        },
      });

    await createAuditLog({
      userId:
        payment.bloodRequest
          .recipientId,

      action:
        AuditAction.PAYMENT,

      entity:
        "Payment",

      entityId:
        updatedPayment.id,

      details: {
        bloodRequestId:
          updatedPayment.bloodRequestId,

        amount:
          updatedPayment.amount.toString(),

        currency:
          updatedPayment.currency,

        method:
          updatedPayment.method,

        status:
          updatedPayment.status,

        message:
          "bKash payment cancelled by user",
      },
    });

    return {
      status: "cancel",
      message:
        "Payment Cancelled",
      data:
        updatedPayment,
    };
  }

  if (status === "failure") {
    const updatedPayment =
      await prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status:
            PaymentStatus.FAILED,

          gatewayResponse: {
            callbackStatus:
              status,

            paymentID,

            signature:
              query.signature,

            apiVersion:
              query.apiVersion,
          },
        },
      });

    await createAuditLog({
      userId:
        payment.bloodRequest
          .recipientId,

      action:
        AuditAction.PAYMENT,

      entity:
        "Payment",

      entityId:
        updatedPayment.id,

      details: {
        bloodRequestId:
          updatedPayment.bloodRequestId,

        amount:
          updatedPayment.amount.toString(),

        currency:
          updatedPayment.currency,

        method:
          updatedPayment.method,

        status:
          updatedPayment.status,

        message:
          "bKash payment failed",
      },
    });

    return {
      status: "failure",
      message:
        "Payment Failed",
      data:
        updatedPayment,
    };
  }

  if (status === "success") {
    const result =
      await executeBkashPayment(
        paymentID,
      );

    return {
      status: "success",
      message:
        "Payment completed successfully",
      data:
        result,
    };
  }

  throw new AppError(
    httpStatus.BAD_REQUEST,
    `Unknown bKash callback status: ${status}`,
  );
};

/* =========================================================
   GET MY PAYMENTS
========================================================= */

const getMyPayments = async (
  query: IQuery,
  recipientId: string,
) => {
  const limit =
    query.limit
      ? Number(query.limit)
      : 10;

  const page =
    query.page
      ? Number(query.page)
      : 1;

  const skip =
    (page - 1) * limit;

  const sortBy =
    query.sortBy ||
    "createdAt";

  const sortOrder =
    query.sortOrder ||
    "desc";

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
        [sortBy]:
          sortOrder,
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
        AND:
          andConditions,
      },
    });

  return {
    data:
      payments,

    meta: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit,
        ),
    },
  };
};

/* =========================================================
   GET ALL PAYMENTS
========================================================= */

const getAllPayments = async (
  query: IQuery,
) => {
  const limit =
    query.limit
      ? Number(query.limit)
      : 10;

  const page =
    query.page
      ? Number(query.page)
      : 1;

  const skip =
    (page - 1) * limit;

  const sortBy =
    query.sortBy ||
    "createdAt";

  const sortOrder =
    query.sortOrder ||
    "desc";

  const andConditions:
    PaymentWhereInput[] = [];

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
        AND:
          andConditions,
      },

      take:
        limit,

      skip,

      orderBy: {
        [sortBy]:
          sortOrder,
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
        AND:
          andConditions,
      },
    });

  return {
    data:
      payments,

    meta: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit,
        ),
    },
  };
};

/* =========================================================
   GET SINGLE PAYMENT
========================================================= */

const getSinglePayment = async (
  paymentId: string,
  user: {
    id: string;
    role: Role;
  },
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
      "Payment Not Found",
    );
  }

  if (
    user.role ===
    Role.RECIPIENT
  ) {
    if (
      payment.bloodRequest
        .recipientId !==
      user.id
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You Are Not Allowed To View This Payment",
      );
    }
  }

  return payment;
};

/* =========================================================
   UPLOAD PAYMENT RECEIPT
========================================================= */

const uploadPaymentReceipt = async (
  paymentId: string,
  file: Express.Multer.File,
  userId: string,
) => {
  const payment =
    await prisma.payment.findUnique({
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
      "Payment Not Found",
    );
  }

  if (
    payment.bloodRequest
      .recipientId !== userId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You Are Not Allowed To Upload Receipt For This Payment",
    );
  }

  if (
    payment.status !==
    PaymentStatus.PAID
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Must Be Completed Before Uploading Receipt",
    );
  }

  if (!file) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment Receipt PDF Is Required",
    );
  }

  if (
    file.mimetype !==
    "application/pdf"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only PDF Files Are Allowed",
    );
  }

  const uploadedFile =
    await uploadToCloudinary(
      file.buffer,
      "bloodlink/payment-receipts",
    );

  const updatedPayment =
    await prisma.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        receiptPdfUrl:
          uploadedFile.secure_url,
      },
    });

  await createAuditLog({
    userId,

    action:
      AuditAction.PAYMENT,

    entity:
      "Payment",

    entityId:
      payment.id,

    details: {
      paymentId:
        payment.id,

      receiptPdfUrl:
        uploadedFile.secure_url,

      message:
        "Payment receipt PDF uploaded successfully",
    },
  });

  return updatedPayment;
};

/* =========================================================
   PAYMENT SERVICE
========================================================= */

export const PaymentService: {
  createBkashPayment:
    typeof createBkashPayment;

  initiatePayment:
    typeof initiatePayment;

  executeBkashPayment:
    typeof executeBkashPayment;

  bkashCallback:
    typeof bkashCallback;

  createStripeCheckoutSession:
    typeof createStripeCheckoutSession;

  handleStripeWebhook:
    typeof handleStripeWebhook;

  getStripeCheckoutSession:
    typeof getStripeCheckoutSession;

  cancelStripePayment:
    typeof cancelStripePayment;

  uploadPaymentReceipt:
    typeof uploadPaymentReceipt;

  getMyPayments:
    typeof getMyPayments;

  getAllPayments:
    typeof getAllPayments;

  getSinglePayment:
    typeof getSinglePayment;
} = {
  createBkashPayment,

  initiatePayment,

  executeBkashPayment,

  bkashCallback,

  createStripeCheckoutSession,

  handleStripeWebhook,

  getStripeCheckoutSession,

  cancelStripePayment,

  uploadPaymentReceipt,

  getMyPayments,

  getAllPayments,

  getSinglePayment,
};






