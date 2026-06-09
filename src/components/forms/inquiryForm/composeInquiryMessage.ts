import type { InquiryFormValues, InquiryMode } from "./inquiryFormTypes";

export function composeInquiryMessage(values: InquiryFormValues, mode: InquiryMode): string {
  const userMessage = values.message.trim();
  if (mode === "contact") {
    return userMessage;
  }
  return ["Solicitud de tasación", "Mensaje:", userMessage].join("\n");
}
