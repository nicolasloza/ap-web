import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./app/routes";
import LoginDialog from "./components/auth/LoginDialog";
import MainAppBar from "./components/layout/MainAppBar";
import MainFooter from "./components/layout/MainFooter";
import NavigationDrawer from "./components/layout/NavigationDrawer";
import { useAuth } from "./features/auth/context/AuthContext";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading } = useAuth();
  const appBarOffset = isDesktop ? 72 : 56;

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goTo = (to: string) => {
    navigate(to);
    closeDrawer();
  };

  const openLoginModal = () => {
    if (user) {
      navigate("/admin");
      closeDrawer();
      return;
    }
    setLoginOpen(true);
    closeDrawer();
  };

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (isLoading) {
      return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress color="primary" />
        </Box>
      );
    }
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppRoutes />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <MainAppBar pathname={pathname} onOpenDrawer={openDrawer} onOpenLogin={openLoginModal} />

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
