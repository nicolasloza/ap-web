import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton, Stack } from "@mui/material";
import { FONT_MONO } from "../../../theme/tokens";

type PropertyListPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function formatPageNumber(page: number) {
  return String(page).padStart(2, "0");
}

export default function PropertyListPagination({ page, totalPages, onPageChange }: PropertyListPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mt: { xs: 4, sm: 5 } }}>
      <IconButton
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <IconButton
          key={p}
          aria-label={`Ir a la página ${p}`}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
          sx={{
            border: 1,
            borderColor: p === page ? "primary.main" : "divider",
            borderRadius: 1,
            color: p === page ? "primary.main" : "text.secondary",
            fontFamily: FONT_MONO,
            fontSize: 13,
          }}
        >
          {formatPageNumber(p)}
        </IconButton>
      ))}

      <IconButton
        aria-label="Página siguiente"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
