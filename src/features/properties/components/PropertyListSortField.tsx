import { MenuItem, TextField } from "@mui/material";
import type { SortOption } from "../utils/sortProperties";

type PropertyListSortFieldProps = {
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
};

export default function PropertyListSortField({
  sort,
  onSortChange,
}: PropertyListSortFieldProps) {
  return (
    <TextField
      select
      size="small"
      label="Ordenar"
      value={sort}
      onChange={(event) => onSortChange(event.target.value as SortOption)}
      sx={{ minWidth: { xs: "100%", sm: 280 } }}
    >
      <MenuItem value="title_asc">Nombre: A a Z</MenuItem>
      <MenuItem value="title_desc">Nombre: Z a A</MenuItem>
      <MenuItem value="price_desc">Precio: Mayor a menor</MenuItem>
      <MenuItem value="price_asc">Precio: Menor a mayor</MenuItem>
    </TextField>
  );
}
