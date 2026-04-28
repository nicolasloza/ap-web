import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type MainAppBarProps = {
    onOpenDrawer: () => void;
};

export default function MainAppBar({ onOpenDrawer }: MainAppBarProps) {
    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "secondary.dark", color: "secondary.contrastText" }}
        >
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="abrir menú de módulos"
                    onClick={onOpenDrawer}
                    sx={{ mr: { xs: 0.5, sm: 1 } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box
                    component="div"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        gap: { xs: 0.75, sm: 1.5 },
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            color: "secondary.contrastText",
                            textDecoration: "none",
                            fontWeight: 700,
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                            fontSize: { xs: "1.05rem", sm: "1.25rem" },
                        }}
                    >
                        Armando Pepe
                    </Typography>
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{
                            color: "secondary.contrastText",
                            opacity: 0.8,
                            whiteSpace: "nowrap",
                            display: { xs: "none", sm: "inline" },
                        }}
                    >
                        Inmobiliaria
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
