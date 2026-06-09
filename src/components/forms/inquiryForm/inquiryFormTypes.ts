import { z } from "zod";

export type InquiryMode = "contact" | "appraisal";

export type InquiryFormProps = {
  mode: InquiryMode;
  submitLabel?: string;
  successMessage?: string;
};

const baseFields = {
  email: z.string().min(1, "El email es obligatorio.").email("Ingresá un email válido."),
  phone: z.string().min(1, "El teléfono es obligatorio."),
  message: z.string().min(1, "El mensaje es obligatorio."),
};

export const contactSchema = z.object({
  fullName: z.string().min(1, "El nombre y apellido es obligatorio."),
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  ...baseFields,
});

export const appraisalSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio."),
  lastName: z.string().min(1, "El apellido es obligatorio."),
  fullName: z.string().optional().default(""),
  ...baseFields,
});

export type InquiryFormValues = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};
