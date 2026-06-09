import { MenuItem, TextField } from "@mui/material";
import type { SortOption } from "../utils/sortProperties";
import { SORT_MENU_OPTIONS } from "../constants/sortOptions";

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
      {SORT_MENU_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
