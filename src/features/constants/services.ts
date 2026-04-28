import { Agriculture, RoomService } from "@mui/icons-material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";

export const SERVICE_ITEMS = [
    {
        title: "Compra y venta",
        description: "Acompanamiento completo para operaciones seguras y eficientes.",
        Icon: HandshakeRoundedIcon,
    },
    {
        title: "Tasaciones",
        description: "Valuaciones profesionales para tomar decisiones con respaldo.",
        Icon: CheckCircleOutlineRoundedIcon,
    },
    {
        title: "Hoteles",
        description: "Contamos con un equipo altamente especializado en la comercialización de hoteles, brindando asesoramiento en su desarrollo como inversión inmobiliaria a clientes del país y del exterior. Operamos con importantes cadenas internacionales como Barceló, Inns y Hawthorn.",
        Icon: RoomService,
    },
    {
        title: "Campos",
        description:
            "La compra de tierra para su arrendamiento o explotación directa es una alternativa interesante que compite con las opciones del mercado financiero. Nuestros ingenieros asesoran en forma integral este tipo de inversiones.",
        Icon: Agriculture,
    },
] as const;