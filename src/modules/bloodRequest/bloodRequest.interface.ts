export interface ICreateBloodRequestPayload {
  bloodGroup:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE";

  units?: number | undefined;

  hospitalName: string;

  hospitalAddress?: string | undefined;

  requiredDate: Date;

  urgency?:
    | "LOW"
    | "NORMAL"
    | "HIGH"
    | "CRITICAL"
    | undefined;

  contactNumber?: string | undefined;

  patientName?: string | undefined;

  notes?: string | undefined;
}

export interface IUpdateBloodRequestPayload {
  bloodGroup?:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "AB_POSITIVE"
    | "AB_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE"
    | undefined;

  units?: number | undefined;

  hospitalName?: string | undefined;

  hospitalAddress?: string | undefined;

  requiredDate?: Date | undefined;

  urgency?:
    | "LOW"
    | "NORMAL"
    | "HIGH"
    | "CRITICAL"
    | undefined;

  contactNumber?: string | undefined;

  patientName?: string | undefined;

  notes?: string | undefined;
}