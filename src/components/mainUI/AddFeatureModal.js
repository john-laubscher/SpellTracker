import * as React from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AuthContext } from '../../Contexts/Context';

const AddFeatureModal = ({ open, onClose, kind, onCreated }) => {
  const { auth, setAuth } = React.useContext(AuthContext);
  const token = auth?.token;

  const [authMode, setAuthMode] = React.useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [feature, setFeature] = React.useState({ title: '', description: '', tracked: true });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    setAuthError('');
    setSaveError('');
    setSaving(false);
    setFeature({ title: '', description: '', tracked: true });
  }, [open, kind]);

  const submitAuth = async () => {
    setAuthError('');
    const email = authEmail.trim().toLowerCase();
    const password = authPassword;
    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }

    const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
    try {
      const res = await axios.post(`http://localhost:3001${endpoint}`, { email, password });
      const nextToken = res.data?.token;
      const user = res.data?.user || null;
      if (!nextToken) throw new Error('No token returned');

      setAuth({ token: nextToken, user });
      localStorage.setItem('spelltracker_token', nextToken);
      localStorage.setItem('spelltracker_user', JSON.stringify(user));

      setAuthPassword('');
    } catch (e) {
      const status = e?.response?.status;
      if (authMode === 'register' && status === 409) {
        setAuthError('That email is already registered. Try logging in instead.');
      } else {
        setAuthError(
          authMode === 'register'
            ? 'Registration failed. Try a different email/password.'
            : 'Login failed. Check your email/password.'
        );
      }
    }
  };

  const canSave = Boolean(token) && Boolean(feature.title.trim());

  const submitFeature = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await axios.post(
        'http://localhost:3001/custom-features',
        {
          kind,
          title: feature.title.trim(),
          description: feature.description.trim(),
          tracked: Boolean(feature.tracked),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const created = res.data || null;
      if (created && typeof onCreated === 'function') onCreated(created);
      onClose();
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setSaveError('Please log in to add custom features.');
      else setSaveError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const titleLabel = kind === 'subclass' ? 'Subclass Feature' : 'Class Feature';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Cinzel', serif" }}>{`Add Custom ${titleLabel}`}</DialogTitle>
      <DialogContent dividers>
        {!token ? (
          <Box>
            <Typography sx={{ mb: 1.5, fontSize: '14px', color: '#5d4037' }}>
              Log in to add custom features.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                size="small"
                variant={authMode === 'login' ? 'contained' : 'outlined'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </Button>
              <Button
                size="small"
                variant={authMode === 'register' ? 'contained' : 'outlined'}
                onClick={() => setAuthMode('register')}
              >
                Register
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              sx={{ mb: 1 }}
            />
            {authError ? (
              <Typography sx={{ color: 'error.main', fontSize: '13px' }}>{authError}</Typography>
            ) : null}
          </Box>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="Feature Title"
              value={feature.title}
              onChange={(e) => setFeature((f) => ({ ...f, title: e.target.value }))}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              value={feature.description}
              onChange={(e) => setFeature((f) => ({ ...f, description: e.target.value }))}
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(feature.tracked)}
                  onChange={(e) => setFeature((f) => ({ ...f, tracked: e.target.checked }))}
                />
              }
              label="Tracked (shows with checkboxes)"
            />
            {saveError ? (
              <Typography sx={{ color: 'error.main', fontSize: '13px' }}>{saveError}</Typography>
            ) : null}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        {!token ? (
          <Button onClick={submitAuth} variant="contained">
            {authMode === 'register' ? 'Register' : 'Login'}
          </Button>
        ) : (
          <Button onClick={submitFeature} variant="contained" disabled={!canSave || saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddFeatureModal;

