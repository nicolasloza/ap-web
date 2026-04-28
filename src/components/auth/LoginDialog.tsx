import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type LoginDialogProps = { open: boolean; onClose: () => void };

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleClose = () => {
        onClose();
        setEmail("");
        setPassword("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // TODO: integrar con API de autenticación
        handleClose();
        navigate("/admin");
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="login-dialog-title" fullWidth maxWidth="xs">
            <DialogTitle id="login-dialog-title">Iniciar sesión</DialogTitle>
            <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="login-email"
                        name="email"
                        label="Correo"
                        type="email"
                        fullWidth
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button type="button" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Ingresar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
