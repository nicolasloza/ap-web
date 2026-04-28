import type { FormState, InquiryMode } from "./inquiryFormTypes";

export function composeInquiryMessage(values: FormState, mode: InquiryMode): string {
  const userMessage = values.message.trim();
  if (mode === "contact") {
    return userMessage;
  }
  return ["Solicitud de tasación", "Mensaje:", userMessage].join("\n");
}
