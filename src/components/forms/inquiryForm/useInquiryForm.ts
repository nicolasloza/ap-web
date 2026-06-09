import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { sendContactMessage } from "../../../api/client";
import { composeInquiryMessage } from "./composeInquiryMessage";
import {
  contactSchema,
  appraisalSchema,
  type InquiryFormValues,
  type InquiryMode,
} from "./inquiryFormTypes";

type UseInquiryFormParams = {
  mode: InquiryMode;
  successMessage: string;
};

export function useInquiryForm({ mode, successMessage }: UseInquiryFormParams) {
  const isAppraisal = mode === "appraisal";
  const [success, setSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(isAppraisal ? appraisalSchema : contactSchema) as Resolver<InquiryFormValues>,
    defaultValues: { fullName: "", firstName: "", lastName: "", propertyAddress: "", email: "", phone: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setSuccess(null);
    setSubmitError(null);

    const normalizedFullName = isAppraisal
      ? `${values.firstName.trim()} ${values.lastName.trim()}`.trim()
      : values.fullName.trim();

    try {
      await sendContactMessage({
        fullName: normalizedFullName,
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: composeInquiryMessage(values, mode),
        source: mode,
      });
      setSuccess(successMessage);
      reset();
    } catch {
      setSubmitError("No se pudo enviar la consulta. Intentá nuevamente.");
    }
  });

  return {
    register,
    errors,
    isSubmitting,
    success,
    submitError,
    isAppraisal,
    onSubmit,
  };
}
