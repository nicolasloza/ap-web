import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import {
    Button,
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
} from "@mui/material";
import { useState, type MouseEvent, type SubmitEvent } from "react";
import type { Operation } from "../../../types/property";
import type { PropertyTypeOption } from "../../constants/propertyTypes";
import { SORT_MENU_OPTIONS } from "../../properties/constants/sortOptions";
import type { SortOption } from "../../properties/utils/sortProperties";

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
}: PropertySearchBarProps) {
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
            sx={{
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: 1.5,
                bgcolor: "background.paper",
            }}
        >
            <Stack sx={{ width: "100%" }}>
                <Grid container spacing={1} sx={{ width: "100%" }}>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
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
                        <TextField
                            select
                            label="Tipo de propiedad"
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
                    <Grid size={{ xs: 12, sm: 12, md: 2 }} sx={{ display: "flex" }}>
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
            </Stack>
        </Paper>
    );
}
