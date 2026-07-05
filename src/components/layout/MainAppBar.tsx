import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { BRAND } from "../../features/company/constants/contactInfo";

const NAV_LINKS = [
    { label: "Propiedades", to: "/propiedades" },
    { label: "Tasaciones", to: "/tasaciones" },
    { label: "Contacto", to: "/contacto" },
] as const;

type MainAppBarProps = {
    pathname: string;
    onOpenDrawer: () => void;
    onOpenLogin: () => void;
};

export default function MainAppBar({ pathname, onOpenDrawer, onOpenLogin }: MainAppBarProps) {
    return (
        <AppBar position="sticky" color="default" elevation={0} sx={{ top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
            <Toolbar sx={{ minHeight: { xs: 56, sm: 72 }, gap: 2 }}>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        fontWeight: 700,
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        fontSize: { xs: "1.05rem", sm: "1.25rem" },
                    }}
                >
                    {BRAND.name}
                </Typography>

                <Stack
                    component="nav"
                    direction="row"
                    spacing={3}
                    sx={{ display: { xs: "none", sm: "flex" }, flex: 1, ml: 3 }}
                >
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.to || pathname.startsWith(`${link.to}/`);
                        return (
                            <Typography
                                key={link.to}
                                component={RouterLink}
                                to={link.to}
                                sx={{
                                    position: "relative",
                                    color: isActive ? "primary.main" : "text.secondary",
                                    textDecoration: "none",
                                    fontWeight: isActive ? 700 : 400,
                                    fontSize: "0.95rem",
                                    lineHeight: 1,
                                    transition: "color 0.15s",
                                    "&:hover": { color: "primary.main" },
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        bottom: -8,
                                        height: 2,
                                        bgcolor: isActive ? "primary.main" : "transparent",
                                    },
                                }}
                            >
                                {link.label}
                            </Typography>
                        );
                    })}
                </Stack>

                <Box sx={{ flex: { xs: 1, sm: 0 } }} />

                <IconButton
                    aria-label="Iniciar sesión"
                    onClick={onOpenLogin}
                    sx={{
                        display: { xs: "none", sm: "inline-flex" },
                        color: "primary.main",
                        p: 1,
                    }}
                >
                    <PersonIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="abrir menú de módulos"
                    onClick={onOpenDrawer}
                    sx={{ display: { xs: "inline-flex", sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
