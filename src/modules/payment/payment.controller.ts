// import type { Request, Response } from "express";


// import httpStatus from "http-status";

// import type { AuthenticatedRequest } from "../../middlewares/auth";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";

// import { PaymentService } from "./payment.service";
// import config from "../../config";



// const initiatePayment = catchAsync(
//   async (
//     req: AuthenticatedRequest,
//     res: Response
//   ) => {
//     const recipientId = req.user?.id;

//     if (!recipientId) {
//       throw new Error("User not found");
//     }

//     const result =
//       await PaymentService.initiatePayment(
//         recipientId,
//         req.body
//       );

//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: "Payment initiated successfully",
//       data: result,
//     });
//   }
// );



// const executeBkashPayment = catchAsync(
//   async (
//     req: AuthenticatedRequest,
//     res: Response
//   ) => {
//     const paymentID = req.params.paymentID;

//     if (
//       !paymentID ||
//       Array.isArray(paymentID)
//     ) {
//       throw new Error("Invalid payment ID");
//     }

//     const result =
//       await PaymentService.executeBkashPayment(
//         paymentID
//       );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Payment executed successfully",
//       data: result,
//     });
//   }
// );

// // const bkashCallback = catchAsync(
// //   async (
// //     req: Request,
// //     res: Response
// //   ) => {
// //     const paymentID =
// //       typeof req.query.paymentID === "string"
// //         ? req.query.paymentID
// //         : undefined;

// //     const status =
// //       typeof req.query.status === "string"
// //         ? req.query.status
// //         : undefined;

// //     if (!paymentID) {
// //       throw new Error("Payment ID missing");
// //     }

// //     if (!status) {
// //       throw new Error("Payment status missing");
// //     }

// //     const result =
// //       await PaymentService.bkashCallback({
// //         paymentID,
// //         status,
// //       });

// //     sendResponse(res, {
// //       statusCode: httpStatus.OK,
// //       success: result.status === "success",
// //       message: result.message,
// //       data: result.payment,
// //     });
// //   }
// // );

// const bkashCallback = catchAsync(
//   async (req: Request, res: Response) => {
//     const result = await PaymentService.bkashCallback(
//       req.query as Record<string, string | undefined>
//     );

//     const paymentStatus = result.status;

//     if (paymentStatus === "success") {
//       return res.redirect(
//         `${config.frontend_url}/dashboard/recipient/payments/success?paymentID=${req.query.paymentID}`
//       );
//     }

//     if (paymentStatus === "failure") {
//       return res.redirect(
//         `${config.frontend_url}/dashboard/recipient/payments?payment=failed`
//       );
//     }

//     if (paymentStatus === "cancel") {
//       return res.redirect(
//         `${config.frontend_url}/dashboard/recipient/payments?payment=cancelled`
//       );
//     }

//     return res.redirect(
//       `${config.frontend_url}/dashboard/recipient/payments?payment=failed`
//     );
//   }
// );


// const getMyPayments = catchAsync(
//   async (
//     req: AuthenticatedRequest,
//     res: Response
//   ) => {
//     const recipientId = req.user?.id;

//     if (!recipientId) {
//       throw new Error("User not found");
//     }

//     const result =
//       await PaymentService.getMyPayments(
//         req.query,
//         recipientId
//       );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My payments retrieved successfully",
//       data: result.data,
//       meta: result.meta,
//     });
//   }
// );



// const getAllPayments = catchAsync(
//   async (
//     req: AuthenticatedRequest,
//     res: Response
//   ) => {
//     const result =
//       await PaymentService.getAllPayments(
//         req.query
//       );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "All payments retrieved successfully",
//       data: result.data,
//       meta: result.meta,
//     });
//   }
// );



// const getSinglePayment = catchAsync(
//   async (
//     req: AuthenticatedRequest,
//     res: Response
//   ) => {
//     const paymentId = req.params.id;

//     if (
//       !paymentId ||
//       Array.isArray(paymentId)
//     ) {
//       throw new Error("Invalid payment ID");
//     }

//     if (!req.user) {
//       throw new Error("User not found");
//     }

//     const result =
//       await PaymentService.getSinglePayment(
//         paymentId,
//         req.user
//       );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Payment retrieved successfully",
//       data: result,
//     });
//   }
// );

// export const PaymentController = {
//   initiatePayment,
//   executeBkashPayment,
//   bkashCallback,

//   getMyPayments,
//   getAllPayments,
//   getSinglePayment,
// }; 

import type { Request, Response } from "express";
import httpStatus from "http-status";

import type { AuthenticatedRequest } from "../../middlewares/auth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { PaymentService } from "./payment.service";
import config from "../../config";

const initiatePayment = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result = await PaymentService.initiatePayment(
      recipientId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  }
);

const executeBkashPayment = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const paymentID = req.params.paymentID;

    if (!paymentID || Array.isArray(paymentID)) {
      throw new Error("Invalid payment ID");
    }

    const result =
      await PaymentService.executeBkashPayment(paymentID);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment executed successfully",
      data: result,
    });
  }
);

const bkashCallback = catchAsync(
  async (req: Request, res: Response) => {
    console.log("========== bKash CALLBACK ==========");
    console.log("Callback Query:", req.query);

    const paymentID =
      typeof req.query.paymentID === "string"
        ? req.query.paymentID
        : "";

    console.log("Payment ID:", paymentID);
    console.log("Status:", req.query.status);
    console.log("====================================");

    const result = await PaymentService.bkashCallback(
      req.query as Record<string, string | undefined>
    );

    console.log("bKash Service Result:", result);

    if (result.status === "success") {
      console.log("✅ Payment successful. Redirecting to frontend.");

      return res.redirect(
        `${config.frontend_url}/dashboard/recipient/payments/success?paymentID=${encodeURIComponent(
          paymentID
        )}`
      );
    }

    if (result.status === "failure") {
      console.log("❌ Payment failed. Redirecting to frontend.");

      return res.redirect(
        `${config.frontend_url}/dashboard/recipient/payments?payment=failed&paymentID=${encodeURIComponent(
          paymentID
        )}`
      );
    }

    if (result.status === "cancel") {
      console.log("⚠️ Payment cancelled. Redirecting to frontend.");

      return res.redirect(
        `${config.frontend_url}/dashboard/recipient/payments?payment=cancelled&paymentID=${encodeURIComponent(
          paymentID
        )}`
      );
    }

    console.log("❌ Unknown payment status.");

    return res.redirect(
      `${config.frontend_url}/dashboard/recipient/payments?payment=failed&paymentID=${encodeURIComponent(
        paymentID
      )}`
    );
  }
);

const getMyPayments = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result = await PaymentService.getMyPayments(
      req.query,
      recipientId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My payments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getAllPayments = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const result =
      await PaymentService.getAllPayments(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All payments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSinglePayment = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new Error("Invalid payment ID");
    }

    if (!req.user) {
      throw new Error("User not found");
    }

    const result =
      await PaymentService.getSinglePayment(
        paymentId,
        req.user
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  initiatePayment,
  executeBkashPayment,
  bkashCallback,
  getMyPayments,
  getAllPayments,
  getSinglePayment,
};