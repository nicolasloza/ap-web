import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import BackOfficeLayout from "../components/layout/BackOfficeLayout";
import { deleteProperty, fetchAdminPropertyList } from "../api/client";
import { PRICE_RANGE_OPTIONS } from "../features/properties/constants/priceRanges";
import { STATUS_CHIP_CONFIG } from "../features/properties/constants/propertyStatus";
import { buildReferenceCode } from "../lib/propertyDisplay";
import { formatOperation, formatPrice } from "../lib/format";
import { FONT_MONO } from "../theme/tokens";
import type { Operation } from "../types/property";

const PAGE_SIZE = 10;

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", color: "text.secondary", mb: 0.5 }}>
      {children}
    </Typography>
  );
}

export default function BackOfficePropertiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [operation, setOperation] = useState<"" | Operation>("");
  const [priceRangeValue, setPriceRangeValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ q: "", operation: "" as "" | Operation, priceRangeValue: "" });
  const [message, setMessage] = useState<string | null>(null);

  const priceRange = PRICE_RANGE_OPTIONS.find((option) => option.value === appliedFilters.priceRangeValue);

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", "admin-list", page, appliedFilters],
    queryFn: () =>
      fetchAdminPropertyList(page, PAGE_SIZE, {
        q: appliedFilters.q || undefined,
        operation: appliedFilters.operation || undefined,
        minPrice: priceRange?.minPrice,
        maxPrice: priceRange?.maxPrice,
      }),
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      setMessage("Propiedad eliminada correctamente.");
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const properties = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  function handleFilterSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ q: searchTerm, operation, priceRangeValue });
  }

  return (
    <BackOfficeLayout>
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "flex-end" }, mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Listado de Propiedades
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
              Gestioná el inventario inmobiliario y actualizá estados en tiempo real.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/admin/propiedades/nueva"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.06em" }}
          >
            Nueva Propiedad
          </Button>
        </Stack>

        {message ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage(null)}>{message}</Alert> : null}
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error instanceof Error ? error.message : "Error al cargar"}</Alert> : null}

        <Paper component="form" onSubmit={handleFilterSubmit} variant="outlined" sx={{ p: 2.5, mb: 3 }}>
          <Grid container spacing={1.5} sx={{ alignItems: "flex-end" }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FieldLabel>Búsqueda</FieldLabel>
              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o ID..."
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FieldLabel>Tipo de operación</FieldLabel>
              <TextField
                select
                size="small"
                fullWidth
                value={operation}
                onChange={(e) => setOperation(e.target.value as "" | Operation)}
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="sale">Venta</MenuItem>
                <MenuItem value="rent">Alquiler</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FieldLabel>Rango de precio (USD)</FieldLabel>
              <TextField
                select
                size="small"
                fullWidth
                value={priceRangeValue}
                onChange={(e) => setPriceRangeValue(e.target.value)}
                slotProps={{ select: { displayEmpty: true } }}
              >
                {PRICE_RANGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                startIcon={<FilterListRoundedIcon fontSize="small" />}
                sx={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: "0.06em", minHeight: 40 }}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                {["Imagen", "Título", "Ubicación", "Operación", "Precio", "Estado", "Comercial", "Acciones"].map((head, i) => (
                  <TableCell
                    key={head}
                    align={i === 4 ? "right" : i >= 5 ? "center" : "left"}
                    sx={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton variant="rounded" width={80} height={56} /></TableCell>
                      <TableCell><Skeleton width="70%" /><Skeleton width="30%" /></TableCell>
                      <TableCell><Skeleton width="60%" /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                      <TableCell align="right"><Skeleton width="50%" sx={{ ml: "auto" }} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                      <TableCell align="center"><Skeleton width={70} sx={{ mx: "auto" }} /></TableCell>
                      <TableCell align="center"><Skeleton width={60} sx={{ mx: "auto" }} /></TableCell>
                    </TableRow>
                  ))
                : properties.map((property) => (
                    <TableRow key={property.id} hover>
                      <TableCell>
                        <Box
                          component="img"
                          src={property.images[0]?.url}
                          alt={property.title}
                          sx={{ width: 80, height: 56, objectFit: "cover", borderRadius: 0.75, border: 1, borderColor: "divider", bgcolor: "background.default" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700 }}>{property.title}</Typography>
                        <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, color: "primary.main", mt: 0.25 }}>
                          ID: {buildReferenceCode(property)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {property.neighborhood}, {property.city}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatOperation(property.operation)}
                          size="small"
                          variant="outlined"
                          sx={{ fontFamily: FONT_MONO, fontSize: 11, textTransform: "uppercase" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
                          {formatPrice(property.price, property.currency)}
                          {property.operation === "rent" ? " /mes" : ""}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={property.active ? "Activo" : "Inactivo"}
                          size="small"
                          sx={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            textTransform: "uppercase",
                            bgcolor: property.active ? "rgba(228, 182, 26, 0.1)" : "action.hover",
                            color: property.active ? "primary.main" : "text.secondary",
                            border: 1,
                            borderColor: property.active ? "primary.main" : "divider",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={STATUS_CHIP_CONFIG[property.status].label}
                          size="small"
                          sx={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            textTransform: "uppercase",
                            bgcolor: `${STATUS_CHIP_CONFIG[property.status].color}1a`,
                            color: STATUS_CHIP_CONFIG[property.status].color,
                            border: 1,
                            borderColor: STATUS_CHIP_CONFIG[property.status].color,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "center" }}>
                          <IconButton
                            size="small"
                            aria-label={`Editar ${property.title}`}
                            onClick={() => navigate(`/admin/propiedades/${property.id}/editar`)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label={`Eliminar ${property.title}`}
                            color="error"
                            onClick={() => handleDelete(property.id)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                      No se encontraron propiedades con ese criterio.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", px: 2.5, py: 1.5, borderTop: 1, borderColor: "divider" }}
          >
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12, color: "text.secondary", letterSpacing: "0.04em" }}>
              MOSTRANDO {rangeStart} A {rangeEnd} DE {total} PROPIEDADES
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
                <ChevronLeftRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
                <ChevronRightRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </BackOfficeLayout>
  );
}
