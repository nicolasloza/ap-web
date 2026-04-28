import { Alert } from "@mui/material";

type PageErrorStateProps = {
  message: string;
};

export default function PageErrorState({ message }: PageErrorStateProps) {
  return <Alert severity="error">{message}</Alert>;
}
