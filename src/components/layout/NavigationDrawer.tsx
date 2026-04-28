import EmailIcon from "@mui/icons-material/Email";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const DRAWER_WIDTH = 280;

const navModules = [
    { label: "Home", to: "/", Icon: HomeIcon },
    { label: "Propiedades", to: "/propiedades", Icon: ListAltIcon },
    { label: "Tasaciones", to: "/tasaciones", Icon: EventAvailableOutlinedIcon },
    { label: "Contacto", to: "/contacto", Icon: EmailIcon },
] as const;

type NavigationDrawerProps = {
    open: boolean;
    pathname: string;
    appBarOffset: number;
    onClose: () => void;
    onNavigate: (to: string) => void;
    onOpenLogin: () => void;
};

export default function NavigationDrawer({
    open,
    pathname,
    appBarOffset,
    onClose,
    onNavigate,
    onOpenLogin,
}: NavigationDrawerProps) {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            keepMounted
            slotProps={{
                paper: {
                    sx: {
                        top: appBarOffset,
                        height: `calc(100% - ${appBarOffset}px)`,
                        width: { xs: "84vw", sm: DRAWER_WIDTH },
                        maxWidth: 320,
                        boxSizing: "border-box",
                        bgcolor: "background.paper",
                    },
                },
            }}
        >
            <Box role="navigation" aria-label="Módulos" sx={{ pt: 1, pb: 2, px: 0 }}>
                <List disablePadding>
                    {navModules.map((item) => {
                        const Icon = item.Icon;
                        const isActive =
                            item.to === "/"
                                ? pathname === "/" || pathname.startsWith("/propiedades/")
                                : pathname === item.to || pathname.startsWith(`${item.to}/`);
                        return (
                            <ListItem key={item.to} disablePadding>
                                <ListItemButton onClick={() => onNavigate(item.to)} selected={isActive}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <Icon fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        slotProps={{ primary: { sx: { fontWeight: isActive ? 600 : 400 } } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Divider />
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onOpenLogin}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <LoginIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Iniciar sesión" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
