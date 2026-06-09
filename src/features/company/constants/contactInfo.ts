// Valores originales (cliente real):
// brand.name:    "Armando Pepe"
// brand.tagline: "Inmobiliaria"
// addressLine1:  "Av. Corrientes 1302 - Piso 3º"
// addressLine2:  "CP 1043 - C.A. de Buenos Aires - Argentina"
// phones:        ["4382-4803", "4381-3625"]
// email:         "apepe@armandopepe.com.ar"

export const BRAND = {
  name: "Horizonte Propiedades",
  tagline: "Inmobiliaria",
} as const;

export const CONTACT_INFO = {
  officeName: "CASA CENTRAL",
  addressLine1: "Av. Corrientes 1000 - Piso 1º",
  addressLine2: "CP 1000 - C.A. de Buenos Aires - Argentina",
  phones: ["0000-0000", "0000-0001"],
  email: "contacto@horizontepropiedades.com.ar",
} as const;

export const FORMATTED_PHONES = CONTACT_INFO.phones.join(" / ");
export const FORMATTED_PHONES_INTERNATIONAL = `(5411) ${CONTACT_INFO.phones.join(" y ")}`;
