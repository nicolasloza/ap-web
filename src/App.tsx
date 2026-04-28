import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./app/routes";
import LoginDialog from "./components/auth/LoginDialog";
import MainAppBar from "./components/layout/MainAppBar";
import MainFooter from "./components/layout/MainFooter";
import NavigationDrawer from "./components/layout/NavigationDrawer";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const appBarOffset = isDesktop ? 64 : 56;

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goTo = (to: string) => {
    navigate(to);
    closeDrawer();
  };

  const openLoginModal = () => {
    setLoginOpen(true);
    closeDrawer();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <MainAppBar onOpenDrawer={openDrawer} />

      <NavigationDrawer
        open={drawerOpen}
        pathname={pathname}
        appBarOffset={appBarOffset}
        onClose={closeDrawer}
        onNavigate={goTo}
        onOpenLogin={openLoginModal}
      />

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      <Box component="main" sx={{ flex: 1, py: { xs: 0, lg: 0 } }}>
        <AppRoutes />
      </Box>
      <MainFooter />
    </Box>
  );
}
