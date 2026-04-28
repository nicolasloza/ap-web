export type InquiryMode = "contact" | "appraisal";

export type InquiryFormProps = {
  mode: InquiryMode;
  submitLabel?: string;
  successMessage?: string;
};

export type FormState = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

export const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  fullName: "",
  email: "",
  phone: "",
  message: "",
};
