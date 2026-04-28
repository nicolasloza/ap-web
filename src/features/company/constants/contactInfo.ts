export const CONTACT_INFO = {
  officeName: "CASA CENTRAL",
  addressLine1: "Av. Corrientes 1302 - Piso 3º",
  addressLine2: "CP 1043 - C.A. de Buenos Aires - Argentina",
  phones: ["4382-4803", "4381-3625"],
  email: "apepe@armandopepe.com.ar",
} as const;

export const FORMATTED_PHONES = CONTACT_INFO.phones.join(" / ");
export const FORMATTED_PHONES_INTERNATIONAL = `(5411) ${CONTACT_INFO.phones.join(" y ")}`;
