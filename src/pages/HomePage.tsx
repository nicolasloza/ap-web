import { Box } from "@mui/material";
import { PROPERTY_TYPE_OPTIONS } from "../features/constants/propertyTypes";
import { SERVICE_ITEMS } from "../features/constants/services";
import ClientTagsSection from "../features/home/components/ClientTagsSection";
import FeaturedPropertiesSection from "../features/home/components/FeaturedPropertiesSection";
import HomeCtaSection from "../features/home/components/HomeCtaSection";
import HomeHeroSection from "../features/home/components/HomeHeroSection";
import PropertySearchBar from "../features/home/components/PropertySearchBar";
import ServicesSection from "../features/home/components/ServicesSection";
import { useFeaturedProperties } from "../features/home/hooks/useFeaturedProperties";
import { usePropertySearch } from "../features/home/hooks/usePropertySearch";

const HERO_BG_URL =
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80";

const clientTags = [
    "Empresas",
    "Inversores",
    "Desarrolladoras",
    "Particulares",
    "Estudios profesionales",
];

export default function HomePage() {
    const { featured, loadingFeatured, featuredError } = useFeaturedProperties();
    const { searchTerm, propertyType, operation, setSearchTerm, setPropertyType, setOperation, onSearchSubmit } =
        usePropertySearch();

    return (
        <Box component="div">
            <HomeHeroSection backgroundImageUrl={HERO_BG_URL}>
                <PropertySearchBar
                    searchTerm={searchTerm}
                    propertyType={propertyType}
                    operation={operation}
                    propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
                    onSearchTermChange={setSearchTerm}
                    onPropertyTypeChange={setPropertyType}
                    onOperationChange={setOperation}
                    onSubmit={onSearchSubmit}
                />
            </HomeHeroSection>
            <FeaturedPropertiesSection items={featured} loading={loadingFeatured} error={featuredError} />
            <ServicesSection items={SERVICE_ITEMS} />
            <ClientTagsSection tags={clientTags} />
            <HomeCtaSection />
        </Box>
    );
}