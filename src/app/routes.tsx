import { Route, Routes } from "react-router-dom";
import BackOfficePage from "../pages/BackOfficePage";
import ContactPage from "../pages/ContactPage";
import HomePage from "../pages/HomePage";
import AppraisalsPage from "../pages/AppraisalsPage";
import PropertyDetailPage from "../pages/PropertyDetailPage";
import PropertyListPage from "../pages/PropertyListPage";

// Router central: mantiene el mapa de rutas públicas y admin.
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/propiedades" element={<PropertyListPage />} />
            <Route path="/propiedades/:id" element={<PropertyDetailPage />} />
            {/* <Route path="/reservas" element={<TasacionesPlaceholder />} /> */}
            <Route path="/tasaciones" element={<AppraisalsPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/admin" element={<BackOfficePage />} />
        </Routes>
    );
}
