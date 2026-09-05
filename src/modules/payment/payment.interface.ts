export interface IQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  recipientEmail?: string;
  status?: string;
  method?: string;
}

export interface IInitiatePaymentPayload {
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
