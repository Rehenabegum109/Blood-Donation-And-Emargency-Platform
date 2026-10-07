

export interface IQuery {
 
  page?: string;
  limit?: string;

  // Sorting
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // Filters
  recipientEmail?: string;
  status?: string;
  method?: string;

  // bKash Callback
  paymentID?: string;
  signature?: string;
  apiVersion?: string;

  // Stripe
  session_id?: string;
}

export interface IInitiatePaymentPayload {
  bloodRequestId: string;
}

export interface IStripeCheckoutPayload {
  bloodRequestId: string;
}

export interface IBkashCreatePaymentPayload {
  mode: string;
  payerReference: string;
  callbackURL: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface IBkashCreatePaymentResponse {
  paymentID?: string;
  bkashURL?: string;
  callbackURL?: string;
  transactionStatus?: string;
  statusCode?: string;
  statusMessage?: string;
  amount?: string;
  currency?: string; 
  intent?: string;
  merchantInvoiceNumber?: string;
  [key: string]: unknown;
}

export interface IBkashExecutePaymentResponse {
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  statusCode?: string;
  statusMessage?: string;
  amount?: string;
  currency?: string;
  merchantInvoiceNumber?: string;
  [key: string]: unknown;
}

export interface IBkashQueryPaymentResponse {
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  statusCode?: string;
  statusMessage?: string;
  amount?: string;
  currency?: string;
  merchantInvoiceNumber?: string;
  [key: string]: unknown;
}
