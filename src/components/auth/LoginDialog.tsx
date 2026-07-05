import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

type LoginDialogProps = { open: boolean; onClose: () => void };

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleClose = () => {
        onClose();
        setUsername("");
        setPassword("");
        setError(null);
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(username.trim(), password);
            handleClose();
            navigate("/admin");
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="login-dialog-title" fullWidth maxWidth="xs">
            <DialogTitle id="login-dialog-title">Iniciar sesión</DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    {error ? <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert> : null}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="login-username"
                        name="username"
                        label="Usuario"
                        type="text"
                        fullWidth
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        id="login-password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        fullWidth
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button type="button" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
