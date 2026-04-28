import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    Button,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
} from "@mui/material";
import type { FormEvent } from "react";
import type { PropertyTypeOption } from "../../constants/propertyTypes";
import type { Operation } from "../../../types/property";

type PropertySearchBarProps = {
    searchTerm: string;
    propertyType: string;
    operation: "" | Operation;
    propertyTypeOptions: readonly PropertyTypeOption[];
    onSearchTermChange: (value: string) => void;
    onPropertyTypeChange: (value: string) => void;
    onOperationChange: (value: "" | Operation) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function PropertySearchBar({
    searchTerm,
    propertyType,
    operation,
    propertyTypeOptions,
    onSearchTermChange,
    onPropertyTypeChange,
    onOperationChange,
    onSubmit,
}: PropertySearchBarProps) {
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
                    <Grid size={{ xs: 12, md: 5 }}>
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
                            sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 40 }}
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
                    <Grid size={{ xs: 12, md: 1 }} sx={{ display: "flex" }}>
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
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
}
