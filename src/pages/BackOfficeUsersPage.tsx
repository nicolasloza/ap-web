import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminUser, deleteAdminUser, fetchAdminUsers, updateAdminUser } from "../api/client";
import type { AdminUser } from "../types/property";

export default function BackOfficeUsersPage() {
  const navigate = useNavigate();
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userFormUsername, setUserFormUsername] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("");
  const [userFormActive, setUserFormActive] = useState(true);
  const [userFormIsAdmin, setUserFormIsAdmin] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await fetchAdminUsers(true);
      setUsers(response.data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el listado de usuarios");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const isEditingUser = Boolean(editingUser);

  function resetUserForm() {
    setEditingUser(null);
    setUserFormUsername("");
    setUserFormPassword("");
    setUserFormActive(true);
    setUserFormIsAdmin(false);
  }

  function openCreateUserDialog() {
    resetUserForm();
    setUserDialogOpen(true);
  }

  function openEditUserDialog(user: AdminUser) {
    setEditingUser(user);
    setUserFormUsername(user.username);
    setUserFormPassword("");
    setUserFormActive(user.active);
    setUserFormIsAdmin(user.isAdmin);
    setUserDialogOpen(true);
  }

  function closeUserDialog() {
    setUserDialogOpen(false);
    resetUserForm();
  }

  async function handleSubmitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSavingUser(true);
    try {
      if (isEditingUser && editingUser) {
        await updateAdminUser(editingUser.id, {
          username: userFormUsername.trim(),
          password: userFormPassword.trim() ? userFormPassword : undefined,
          active: userFormActive,
          isAdmin: userFormIsAdmin,
        });
        setMessage(`Usuario actualizado: ${userFormUsername}`);
      } else {
        if (!userFormPassword.trim()) {
          throw new Error("La contraseña es obligatoria para crear usuarios.");
        }
        await createAdminUser({
          username: userFormUsername.trim(),
          password: userFormPassword,
          active: userFormActive,
          isAdmin: userFormIsAdmin,
        });
        setMessage(`Usuario creado: ${userFormUsername}`);
      }
      closeUserDialog();
      await loadUsers();
    } catch (userError) {
      setError(userError instanceof Error ? userError.message : "No se pudo guardar el usuario");
    } finally {
      setSavingUser(false);
    }
  }

  async function handleDeleteUser(id: string) {
    setError(null);
    setMessage(null);
    try {
      await deleteAdminUser(id);
      setMessage("Usuario eliminado correctamente.");
      await loadUsers();
    } catch (userError) {
      setError(userError instanceof Error ? userError.message : "No se pudo eliminar el usuario");
    }
  }

  const usersTitle = useMemo(() => (loadingUsers ? "Usuarios (cargando...)" : `Usuarios (${users.length})`), [loadingUsers, users.length]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: "1.4rem", sm: "1.6rem" } }} component="h1">
            Back office · Usuarios
          </Typography>
          <Typography color="text.secondary">Gestión de usuarios del back office.</Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate("/admin")}>
          Volver
        </Button>
      </Stack>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">{usersTitle}</Typography>
            <Button variant="contained" onClick={openCreateUserDialog}>
              Agregar nuevo usuario
            </Button>
          </Stack>

          {loadingUsers ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Cargando usuarios...</Typography>
            </Stack>
          ) : users.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay usuarios cargados.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Activo</TableCell>
                  <TableCell>Fecha de creación</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.active ? "Sí" : "No"}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleString("es-AR")}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                        <Button size="small" onClick={() => openEditUserDialog(user)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" onClick={() => void handleDeleteUser(user.id)}>
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={userDialogOpen} onClose={closeUserDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditingUser ? "Editar usuario" : "Agregar nuevo usuario"}</DialogTitle>
        <Box component="form" onSubmit={handleSubmitUser}>
          <DialogContent>
            <Stack spacing={1.5}>
              <TextField
                label="Usuario"
                value={userFormUsername}
                onChange={(event) => setUserFormUsername(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label={isEditingUser ? "Contraseña (opcional)" : "Contraseña"}
                type="password"
                value={userFormPassword}
                onChange={(event) => setUserFormPassword(event.target.value)}
                required={!isEditingUser}
                fullWidth
              />
              <FormControlLabel
                control={<Switch checked={userFormActive} onChange={(_event, checked) => setUserFormActive(checked)} />}
                label="Activo"
              />
              <FormControlLabel
                control={<Switch checked={userFormIsAdmin} onChange={(_event, checked) => setUserFormIsAdmin(checked)} />}
                label="Administrador"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeUserDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={savingUser}>
              {savingUser ? "Guardando..." : isEditingUser ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
