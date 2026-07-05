import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { BRAND } from "../../features/company/constants/contactInfo";
import { FONT_MONO } from "../../theme/tokens";

const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Propiedades", to: "/admin/propiedades", Icon: HomeWorkOutlinedIcon },
  { label: "Usuarios", to: "/admin/usuarios", Icon: GroupOutlinedIcon },
] as const;

type BackOfficeLayoutProps = {
  children: ReactNode;
};

export default function BackOfficeLayout({ children }: BackOfficeLayoutProps) {
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.default",
          px: 2.5,
          py: 3,
        }}
      >
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            display: "block",
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "primary.main",
            textDecoration: "none",
            mb: 0.5,
          }}
        >
          {BRAND.name.toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 3 }}>Panel de administración</Typography>

        <Stack spacing={0.5}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Stack
                key={item.to}
                component={RouterLink}
                to={item.to}
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1,
                  textDecoration: "none",
                  color: isActive ? "primary.contrastText" : "text.secondary",
                  bgcolor: isActive ? "primary.main" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  "&:hover": { bgcolor: isActive ? "primary.main" : "action.hover" },
                }}
              >
                <item.Icon fontSize="small" />
                <Typography sx={{ fontSize: 14, fontWeight: "inherit", color: "inherit" }}>{item.label}</Typography>
              </Stack>
            );
          })}
        </Stack>

        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            px: 1.5,
            py: 1.25,
            mt: 3,
            borderRadius: 1,
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography sx={{ fontSize: 14 }}>Volver al sitio</Typography>
        </Stack>
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
