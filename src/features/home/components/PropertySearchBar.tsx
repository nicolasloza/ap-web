import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import {
    Button,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { useState, type MouseEvent, type SubmitEvent } from "react";
import type { NeighborhoodOption, Operation } from "../../../types/property";
import { FONT_MONO } from "../../../theme/tokens";
import type { PropertyTypeOption } from "../../constants/propertyTypes";
import { PRICE_RANGE_OPTIONS } from "../../properties/constants/priceRanges";
import { MIN_ROOMS_OPTIONS } from "../../properties/constants/roomOptions";
import { SORT_MENU_OPTIONS } from "../../properties/constants/sortOptions";
import type { SortOption } from "../../properties/utils/sortProperties";

function FieldLabel({ children }: { children: string }) {
    return (
        <Typography
            sx={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "text.secondary",
                mb: 0.5,
                display: "block",
            }}
        >
            {children}
        </Typography>
    );
}

type PropertySearchBarProps = {
    searchTerm: string;
    propertyType: string;
    operation: "" | Operation;
    propertyTypeOptions: readonly PropertyTypeOption[];
    onSearchTermChange: (value: string) => void;
    onPropertyTypeChange: (value: string) => void;
    onOperationChange: (value: "" | Operation) => void;
    sort?: SortOption;
    onSortChange?: (value: SortOption) => void;
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
    /** Filtros avanzados (ubicación, precio, ambientes) — solo se muestran si se pasa `neighborhoods`. */
    neighborhoods?: readonly NeighborhoodOption[];
    selectedNeighborhood?: string;
    onNeighborhoodChange?: (value: string) => void;
    selectedPriceRange?: string;
    onPriceRangeChange?: (value: string) => void;
    selectedMinRooms?: number;
    onMinRoomsChange?: (value: number | undefined) => void;
};

export default function PropertySearchBar({
    searchTerm,
    propertyType,
    operation,
    propertyTypeOptions,
    onSearchTermChange,
    onPropertyTypeChange,
    onOperationChange,
    sort,
    onSortChange,
    onSubmit,
    neighborhoods,
    selectedNeighborhood,
    onNeighborhoodChange,
    selectedPriceRange,
    onPriceRangeChange,
    selectedMinRooms,
    onMinRoomsChange,
}: PropertySearchBarProps) {
    const showAdvancedFilters = Boolean(neighborhoods);
    const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null);
    const showSortControl = Boolean(sort && onSortChange);
    const isSortMenuOpen = Boolean(sortMenuAnchor);
    const sortMenuId = "property-sort-menu";

    const handleSortMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setSortMenuAnchor(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortMenuAnchor(null);
    };

    const handleSortSelect = (value: SortOption) => {
        if (onSortChange) {
            onSortChange(value);
        }
        handleSortMenuClose();
    };

    return (
        <Paper
            component="form"
            onSubmit={onSubmit}
            variant="outlined"
            sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                bgcolor: "background.paper",
                borderColor: "divider",
            }}
        >
            <Stack sx={{ width: "100%" }}>
                <Grid container spacing={1.5} sx={{ width: "100%" }}>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                        <FieldLabel>Búsqueda</FieldLabel>
                        <TextField
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            placeholder="Que buscas?"
                            variant="outlined"
                            size="small"
                            fullWidth
                            slotProps={{ htmlInput: { "aria-label": "Buscar propiedades por zona o titulo" } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FieldLabel>Operación</FieldLabel>
                        <RadioGroup
                            value={operation}
                            onChange={(e) => onOperationChange(e.target.value as "" | Operation)}
                            aria-label="Operación"
                            sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", minHeight: 40 }}
                        >
                            <FormControlLabel value="sale" control={<Radio size="small" />} label="Venta" sx={{ ml: 0, mr: 0 }} />
                            <FormControlLabel value="rent" control={<Radio size="small" />} label="Alquiler" sx={{ ml: 0, mr: 0 }} />
                        </RadioGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FieldLabel>Propiedad</FieldLabel>
                        <TextField
                            select
                            size="small"
                            value={propertyType}
                            onChange={(e) => onPropertyTypeChange(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {propertyTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 2 }} sx={{ display: "flex", alignItems: "flex-end" }}>
                        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                            {showSortControl ? (
                                <>
                                    <IconButton
                                        aria-label="Ordenar propiedades"
                                        aria-controls={isSortMenuOpen ? sortMenuId : undefined}
                                        aria-expanded={isSortMenuOpen ? "true" : undefined}
                                        aria-haspopup="true"
                                        onClick={handleSortMenuOpen}
                                        sx={{ border: 1, borderColor: "divider", borderRadius: 1, minHeight: 40 }}
                                    >
                                        <SortRoundedIcon />
                                    </IconButton>
                                    <Menu
                                        id={sortMenuId}
                                        anchorEl={sortMenuAnchor}
                                        open={isSortMenuOpen}
                                        onClose={handleSortMenuClose}
                                    >
                                        {SORT_MENU_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                selected={sort === option.value}
                                                onClick={() => handleSortSelect(option.value)}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            ) : null}
                            <Button
                                aria-label="Buscar propiedades"
                                type="submit"
                                variant="contained"
                                startIcon={<SearchRoundedIcon />}
                                fullWidth
                                sx={{ minHeight: 40 }}
                            >
                                Buscar
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                {showAdvancedFilters ? (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={1.5} sx={{ width: "100%" }}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FieldLabel>Ubicación</FieldLabel>
                                <TextField
                                    select
                                    size="small"
                                    value={selectedNeighborhood ?? ""}
                                    onChange={(e) => onNeighborhoodChange?.(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="">Todos los barrios</MenuItem>
                                    {neighborhoods?.map((option) => (
                                        <MenuItem key={option.id} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <FieldLabel>Precio</FieldLabel>
                                <TextField
                                    select
                                    size="small"
                                    value={selectedPriceRange ?? ""}
                                    onChange={(e) => onPriceRangeChange?.(e.target.value)}
                                    fullWidth
                                >
                                    {PRICE_RANGE_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                                <FieldLabel>Ambientes</FieldLabel>
                                <ToggleButtonGroup
                                    value={selectedMinRooms ?? null}
                                    exclusive
                                    size="small"
                                    onChange={(_e, value: number | null) => onMinRoomsChange?.(value ?? undefined)}
                                    sx={{ width: "100%" }}
                                >
                                    {MIN_ROOMS_OPTIONS.map((n) => (
                                        <ToggleButton
                                            key={n}
                                            value={n}
                                            sx={{ flex: 1, fontFamily: FONT_MONO, fontSize: 13 }}
                                        >
                                            {n}+
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    </>
                ) : null}
            </Stack>
        </Paper>
    );
}
