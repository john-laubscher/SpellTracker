import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { AuthContext } from "../Contexts/Context";
import { setActiveCharacterIdInStorage } from "../utils/scopedStorage";

export default function AuthControls({
  variant = "text",
  size = "small",
  onLoggedOutNavigateTo = null,
}) {
  const { auth, setAuth } = React.useContext(AuthContext);
  const token = auth?.token;
  const user = auth?.user;
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState("login"); // 'login' | 'register'
  const [authScreen, setAuthScreen] = React.useState("auth"); // 'auth' | 'requestReset' | 'reset'

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const [resetEmail, setResetEmail] = React.useState("");
  const [resetToken, setResetToken] = React.useState("");
  const [resetNewPassword, setResetNewPassword] = React.useState("");
  const [resetStatus, setResetStatus] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setError("");
    setResetStatus("");
    setAuthScreen("auth");
    setAuthMode("login");
    setEmail("");
    setPassword("");
    setResetEmail("");
    setResetToken("");
    setResetNewPassword("");
  }, [open]);

  const submitAuth = async () => {
    setError("");
    const nextEmail = email.trim().toLowerCase();
    const nextPassword = password;
    if (!nextEmail || !nextPassword) {
      setError("Email and password are required.");
      return;
    }

    const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
    try {
      const res = await axios.post(endpoint, { email: nextEmail, password: nextPassword });
      const nextToken = res.data?.token;
      const nextUser = res.data?.user || null;
      if (!nextToken) throw new Error("No token returned");

      setAuth({ token: nextToken, user: nextUser });
      localStorage.setItem("spelltracker_token", nextToken);
      localStorage.setItem("spelltracker_user", JSON.stringify(nextUser));

      setOpen(false);
    } catch (e) {
      const status = e?.response?.status;
      if (authMode === "register" && status === 409) {
        setError("That email is already registered. Try logging in instead.");
      } else {
        setError(
          authMode === "register"
            ? "Registration failed. Try a different email/password."
            : "Login failed. Check your email/password."
        );
      }
    }
  };

  const requestReset = async () => {
    setResetStatus("");
    const nextEmail = String(resetEmail || email || "").trim().toLowerCase();
    if (!nextEmail) {
      setResetStatus("Email is required.");
      return;
    }

    try {
      const res = await axios.post("/auth/request-password-reset", { email: nextEmail });
      const tokenFromServer = String(res.data?.token || "");
      setResetEmail(nextEmail);
      if (tokenFromServer) setResetToken(tokenFromServer);
      setResetStatus(
        tokenFromServer
          ? "Reset token generated (dev only). Use it below to set a new password."
          : "If that email exists, a reset email would be sent."
      );
      setAuthScreen("reset");
    } catch {
      setResetStatus("Failed to request reset. Try again.");
    }
  };

  const resetPassword = async () => {
    setResetStatus("");
    const nextEmail = String(resetEmail || "").trim().toLowerCase();
    const tokenValue = String(resetToken || "").trim();
    const nextPassword = String(resetNewPassword || "");
    if (!nextEmail || !tokenValue || !nextPassword) {
      setResetStatus("Email, token, and new password are required.");
      return;
    }

    try {
      await axios.post("/auth/reset-password", {
        email: nextEmail,
        token: tokenValue,
        newPassword: nextPassword,
      });
      setResetStatus("Password updated. You can log in now.");
      setAuthMode("login");
      setPassword("");
      setResetToken("");
      setResetNewPassword("");
      setAuthScreen("auth");
    } catch (e) {
      const err = e?.response?.data?.error;
      if (err === "weak_password") setResetStatus("Password is too short (min 6 characters).");
      else setResetStatus("Reset failed. Check the token or request a new one.");
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("spelltracker_token");
    localStorage.removeItem("spelltracker_user");
    setActiveCharacterIdInStorage("");

    if (onLoggedOutNavigateTo) navigate(onLoggedOutNavigateTo);
  };

  const label =
    authScreen === "auth"
      ? authMode === "register"
        ? "Register"
        : "Log In"
      : authScreen === "requestReset"
        ? "Request Reset"
        : "Reset Password";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      {token ? (
        <>
          <Tooltip title={user?.email || ""} arrow disableHoverListener={!user?.email}>
            <Button variant={variant} size={size} onClick={logout}>
              Logout
            </Button>
          </Tooltip>
        </>
      ) : (
        <Button variant={variant} size={size} onClick={() => setOpen(true)}>
          Login
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          {authScreen === "auth"
            ? authMode === "register"
              ? "Register"
              : "Log In"
            : authScreen === "requestReset"
              ? "Reset Password"
              : "Set New Password"}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (authScreen === "auth") submitAuth();
              else if (authScreen === "requestReset") requestReset();
              else resetPassword();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            {authScreen === "auth" ? (
              <>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                {error ? (
                  <Typography variant="body2" sx={{ color: "#c62828" }}>
                    {error}
                  </Typography>
                ) : null}
                <Button
                  variant="text"
                  onClick={() => setAuthMode((m) => (m === "login" ? "register" : "login"))}
                >
                  {authMode === "login" ? "Need an account? Register" : "Have an account? Log in"}
                </Button>
                <Button variant="text" onClick={() => setAuthScreen("requestReset")}>
                  Forgot password?
                </Button>
              </>
            ) : null}

            {authScreen === "requestReset" ? (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Enter your email and request a reset token.
                </Typography>
                <TextField
                  label="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  fullWidth
                />
                {resetStatus ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {resetStatus}
                  </Typography>
                ) : null}
              </>
            ) : null}

            {authScreen === "reset" ? (
              <>
                <TextField
                  label="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Reset Token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  fullWidth
                />
                {resetStatus ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {resetStatus}
                  </Typography>
                ) : null}
              </>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {authScreen !== "auth" ? (
            <Button onClick={() => setAuthScreen("auth")} variant="text">
              Back
            </Button>
          ) : null}
          <Button
            variant="contained"
            onClick={() => {
              if (authScreen === "auth") submitAuth();
              else if (authScreen === "requestReset") requestReset();
              else resetPassword();
            }}
            type="submit"
          >
            {label}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
