import type { InquiryFormValues, InquiryMode } from "./inquiryFormTypes";

export function composeInquiryMessage(values: InquiryFormValues, mode: InquiryMode): string {
  const userMessage = values.message.trim();
  if (mode === "contact") {
    return userMessage;
  }
  const address = values.propertyAddress?.trim();
  return [
    "Solicitud de tasación",
    address ? `Propiedad: ${address}` : null,
    "Mensaje:",
    userMessage,
  ]
    .filter(Boolean)
    .join("\n");
}
