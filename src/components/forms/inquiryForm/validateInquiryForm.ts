import type { FormErrors, FormState, InquiryMode } from "./inquiryFormTypes";

export function validateInquiryForm(values: FormState, mode: InquiryMode): FormErrors {
  const errors: FormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (mode === "appraisal") {
    if (!values.firstName.trim()) {
      errors.firstName = "El nombre es obligatorio.";
    }
    if (!values.lastName.trim()) {
      errors.lastName = "El apellido es obligatorio.";
    }
  } else if (!values.fullName.trim()) {
    errors.fullName = "El nombre y apellido es obligatorio.";
  }
  if (!values.email.trim()) {
    errors.email = "El email es obligatorio.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }
  if (!values.phone.trim()) {
    errors.phone = "El número de contacto es obligatorio.";
  }
  if (!values.message.trim()) {
    errors.message = "El mensaje es obligatorio.";
  }

  return errors;
}
