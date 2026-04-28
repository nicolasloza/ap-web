import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { sendContactMessage } from "../../../api/client";
import { composeInquiryMessage } from "./composeInquiryMessage";
import {
  initialFormState,
  type FormErrors,
  type FormState,
  type InquiryMode,
} from "./inquiryFormTypes";
import { validateInquiryForm } from "./validateInquiryForm";

type UseInquiryFormParams = {
  mode: InquiryMode;
  successMessage: string;
};

export function useInquiryForm({ mode, successMessage }: UseInquiryFormParams) {
  const [values, setValues] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
  const isAppraisal = mode === "appraisal";
  const isFormComplete = useMemo(() => {
    const fullNameComplete = isAppraisal
      ? values.firstName.trim() !== "" && values.lastName.trim() !== ""
      : values.fullName.trim() !== "";

    return (
      fullNameComplete &&
      values.email.trim() !== "" &&
      values.phone.trim() !== "" &&
      values.message.trim() !== ""
    );
  }, [isAppraisal, values]);

  const onChange = (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValues = { ...values, [key]: event.target.value };
    setValues(nextValues);
    if (errors[key]) {
      setErrors(validateInquiryForm(nextValues, mode));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setSubmitError(null);

    const nextErrors = validateInquiryForm(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const normalizedFullName = isAppraisal
      ? `${values.firstName.trim()} ${values.lastName.trim()}`.trim()
      : values.fullName.trim();

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        fullName: normalizedFullName,
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: composeInquiryMessage(values, mode),
        source: mode,
      });
      setSuccess(successMessage);
      setValues(initialFormState);
      setErrors({});
    } catch {
      setSubmitError("No se pudo enviar la consulta. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    success,
    submitError,
    hasErrors,
    isAppraisal,
    isFormComplete,
    onChange,
    onSubmit,
  };
}
