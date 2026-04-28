import { Box, CircularProgress } from "@mui/material";

type PageLoadingCenterProps = {
  ariaLabel: string;
  py?: number;
};

export default function PageLoadingCenter({
  ariaLabel,
  py = 8,
}: PageLoadingCenterProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py }}>
      <CircularProgress aria-label={ariaLabel} />
    </Box>
  );
}
