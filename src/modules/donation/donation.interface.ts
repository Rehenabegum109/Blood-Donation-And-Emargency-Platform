export interface ICreateDonationPayload {
  bloodRequestId: string;
  units?: number | undefined;
  notes?: string | undefined;
}