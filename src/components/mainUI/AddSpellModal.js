import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import SpellAccordian from './SpellAccordian';
import { PrepareSpellButton } from './PrepareSpellButton';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { AuthContext, CharacterInfoContext } from '../../Contexts/Context';

const AddSpellsModal = ({ isModalOpen, onClose, numericalSpellLevel, spells }) => {
  const { auth, setAuth } = React.useContext(AuthContext);
  const token = auth?.token;
  const { setCharacterInfo } = React.useContext(CharacterInfoContext);

  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [postAuthAction, setPostAuthAction] = React.useState(null); // 'openCreate' | null

  const [isCustomSpellOpen, setIsCustomSpellOpen] = React.useState(false);
  const [customSpell, setCustomSpell] = React.useState({
    title: '',
    description: '',
    range: '',
    duration: '',
    castingTime: '',
    components: '',
    concentration: false,
    ritual: false,
  });

  const [customSpells, setCustomSpells] = React.useState([]);
  const [customSpellsLoading, setCustomSpellsLoading] = React.useState(false);
  const [customSpellSaving, setCustomSpellSaving] = React.useState(false);
  const [customSpellError, setCustomSpellError] = React.useState('');
  const [editingCustomSpellIndex, setEditingCustomSpellIndex] = React.useState(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState({ open: false, spell: null });

  useEffect(() => {
  }, [spells]);

  useEffect(() => {
    if (!isModalOpen) return;
    if (!token) {
      setCustomSpells([]);
      return;
    }

    setCustomSpellsLoading(true);
    axios
      .get(`http://localhost:3001/custom-spells?level=${numericalSpellLevel}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCustomSpells(res.data?.results || []))
      .catch(() => setCustomSpells([]))
      .finally(() => setCustomSpellsLoading(false));
  }, [isModalOpen, numericalSpellLevel, token]);

  const openCustomSpellModal = (options = {}) => {
    const effectiveToken = options.tokenOverride || token;
    if (!effectiveToken) {
      setPostAuthAction('openCreate');
      setAuthError('');
      setIsAuthOpen(true);
      return;
    }

    setEditingCustomSpellIndex(null);
    setCustomSpell({
      title: '',
      description: '',
      range: '',
      duration: '',
      castingTime: '',
      components: '',
      concentration: false,
      ritual: false,
    });
    setCustomSpellError('');
    setIsCustomSpellOpen(true);
  };

  const openEditCustomSpellModal = (spell, idx) => {
    if (!token) {
      setPostAuthAction(null);
      setAuthError('');
      setIsAuthOpen(true);
      return;
    }

    setEditingCustomSpellIndex(idx);
    setCustomSpell({
      title: spell?.name || '',
      description: Array.isArray(spell?.desc) ? spell.desc.join('\n\n') : '',
      range: spell?.range || '',
      duration: spell?.duration || '',
      castingTime: spell?.casting_time || '',
      components: Array.isArray(spell?.components) ? spell.components.join(', ') : '',
      concentration: Boolean(spell?.concentration),
      ritual: Boolean(spell?.ritual),
    });
    setCustomSpellError('');
    setIsCustomSpellOpen(true);
  };

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

      setIsAuthOpen(false);
      setAuthPassword('');

      if (postAuthAction === 'openCreate') {
        setPostAuthAction(null);
        openCustomSpellModal({ tokenOverride: nextToken });
      } else {
        setPostAuthAction(null);
      }
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

  const getCustomSpellId = (spell) => {
    const index = String(spell?.index || '');
    if (!index.startsWith('custom:')) return null;
    return index.slice('custom:'.length);
  };

  const toTitleCase = (s) =>
    String(s || '')
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(' ');

  const capitalizeFirst = (s) => {
    const str = String(s || '').trim().replace(/\s+/g, ' ');
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1);
  };

  const normalizeComponents = (s) =>
    (() => {
      const raw = String(s || '').trim();
      if (!raw) return '';

      const parenIndex = raw.indexOf('(');
      const base = (parenIndex === -1 ? raw : raw.slice(0, parenIndex)).trim();
      const suffix = parenIndex === -1 ? '' : ` ${raw.slice(parenIndex).trim()}`;

      const cleaned = base.replace(/\s+/g, '');
      if (/^[vsm]+$/i.test(cleaned)) {
        const tokens = cleaned.toUpperCase().split('');
        return `${tokens.join(', ')}${suffix}`.trim();
      }

      const tokens = base
        .replace(/\s+/g, ' ')
        .split(/[, ]+/)
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          if (/^(v|s|m)$/i.test(c)) return c.toUpperCase();
          if (/^(v|s|m)\b/i.test(c)) return c[0].toUpperCase() + c.slice(1);
          return capitalizeFirst(c);
        });

      return `${tokens.join(', ')}${suffix}`.trim();
    })();

  const normalizeSpellPayload = (spell, level) => ({
    level,
    title: toTitleCase(spell.title),
    description: capitalizeFirst(spell.description),
    range: capitalizeFirst(spell.range),
    duration: capitalizeFirst(spell.duration),
    castingTime: capitalizeFirst(spell.castingTime),
    components: normalizeComponents(spell.components),
    concentration: Boolean(spell.concentration),
    ritual: Boolean(spell.ritual),
  });

  const canCreateCustomSpell =
    Boolean(customSpell.title.trim()) &&
    Boolean(customSpell.description.trim()) &&
    Boolean(token);

  const submitCustomSpell = async () => {
    if (!canCreateCustomSpell) return;
    setCustomSpellError('');
    setCustomSpellSaving(true);

    try {
      const isEdit = editingCustomSpellIndex !== null;
      const endpoint = isEdit
        ? `http://localhost:3001/custom-spells/${getCustomSpellId(customSpells[editingCustomSpellIndex])}`
        : 'http://localhost:3001/custom-spells';

      const normalized = normalizeSpellPayload(customSpell, numericalSpellLevel);
      const payload = isEdit
        ? {
            title: normalized.title,
            description: normalized.description,
            range: normalized.range,
            duration: normalized.duration,
            castingTime: normalized.castingTime,
            components: normalized.components,
            concentration: normalized.concentration,
            ritual: normalized.ritual,
          }
        : normalized;

      const res = isEdit
        ? await axios.put(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });

      const created = res.data;

      if (editingCustomSpellIndex !== null) {
        setCustomSpells((prev) =>
          prev.map((s, idx) => (idx === editingCustomSpellIndex ? created : s))
        );
      } else {
        setCustomSpells((prev) => [...prev, created]);
      }

      setCharacterInfo((prev) => {
        const nextPrepared = { ...prev.spellsPrepared };
        Object.keys(nextPrepared).forEach((k) => {
          nextPrepared[k] = nextPrepared[k].map((sp) => (sp.index === created.index ? created : sp));
        });
        return { ...prev, spellsPrepared: nextPrepared };
      });

      setIsCustomSpellOpen(false);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        setCustomSpellError('You were logged out. Please log in again.');
        setIsCustomSpellOpen(false);
        setPostAuthAction('openCreate');
        setIsAuthOpen(true);
      } else {
        setCustomSpellError('Failed to save custom spell. Please try again.');
      }
    } finally {
      setCustomSpellSaving(false);
    }
  };

  const handleCustomSpellSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    submitCustomSpell();
  };

  const handleCustomSpellKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey) return;
    const isMultiline =
      Boolean(e.target?.getAttribute?.('aria-multiline')) || e.target?.tagName === 'TEXTAREA';
    if (isMultiline) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        submitCustomSpell();
      }
      return;
    }
    e.preventDefault();
    submitCustomSpell();
  };

  const requestDeleteCustomSpell = (spell) => {
    setDeleteConfirm({ open: true, spell });
  };

  const confirmDeleteCustomSpell = async () => {
    const spell = deleteConfirm.spell;
    const id = getCustomSpellId(spell);
    if (!token || !id) {
      setDeleteConfirm({ open: false, spell: null });
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/custom-spells/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomSpells((prev) => prev.filter((s) => s.index !== spell.index));
      setCharacterInfo((prev) => {
        const nextPrepared = { ...prev.spellsPrepared };
        Object.keys(nextPrepared).forEach((k) => {
          nextPrepared[k] = nextPrepared[k].filter((sp) => sp.index !== spell.index);
        });
        return { ...prev, spellsPrepared: nextPrepared };
      });
    } finally {
      setDeleteConfirm({ open: false, spell: null });
    }
  };

  const renderSpells = () => {
    return spells.map((spell, index) => {
      return (
        <div key={spell?.index || index}>
          <PrepareSpellButton spell={spell} numericalSpellLevel={numericalSpellLevel} index={index} />
          <SpellAccordian numericalSpellLevel={numericalSpellLevel} spell={spell} />
        </div>
      );
    });
  };

  return (
    <>
      <Dialog onClose={onClose} open={isModalOpen} fullWidth maxWidth="md">
        <DialogTitle>Choose spells to prepare</DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>
            {renderSpells()}

            <Divider sx={{ my: 1 }} />
            <ListItem disableGutters>
              <Box sx={{ width: '100%', px: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '13px', opacity: 0.75 }}>
                  Custom Spells
                </Typography>
                {customSpellsLoading ? (
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                    Loading custom spells…
                  </Typography>
                ) : null}
                {!customSpellsLoading && customSpells.length === 0 ? (
                  <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
                    {token ? 'No custom spells yet.' : 'Log in to view your custom spells.'}
                  </Typography>
                ) : null}

                {customSpells.map((spell, idx) => (
                  <Box key={spell.index || idx} sx={{ mt: 1 }}>
                    <SpellAccordian
                      numericalSpellLevel={numericalSpellLevel}
                      spell={spell}
                      actionButton={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <PrepareSpellButton
                            spell={spell}
                            numericalSpellLevel={numericalSpellLevel}
                            index={`custom-${idx}`}
                          />
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openEditCustomSpellModal(spell, idx)}
                              aria-label="Edit custom spell"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              size="small"
                              onClick={() => requestDeleteCustomSpell(spell)}
                              aria-label="Delete custom spell"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    />
                  </Box>
                ))}
              </Box>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disableGutters>
              <ListItemButton onClick={() => openCustomSpellModal()}>
                <ListItemText primary="Create Custom Spell" />
              </ListItemButton>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Exit Spell List</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAuthOpen} onClose={() => setIsAuthOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{authMode === 'register' ? 'Register' : 'Log In'}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              submitAuth();
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField
              label="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              fullWidth
            />
            {authError ? (
              <Typography variant="body2" sx={{ color: '#c62828' }}>
                {authError}
              </Typography>
            ) : null}
            <Button
              variant="text"
              onClick={() => setAuthMode((m) => (m === 'login' ? 'register' : 'login'))}
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAuthOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAuth} type="submit">
            {authMode === 'register' ? 'Register' : 'Log In'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCustomSpellOpen}
        onClose={() => setIsCustomSpellOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingCustomSpellIndex === null ? 'Create Custom Spell' : 'Edit Custom Spell'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleCustomSpellSubmit}
            onKeyDown={handleCustomSpellKeyDown}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField
              label="Spell Title"
              value={customSpell.title}
              onChange={(e) => setCustomSpell((s) => ({ ...s, title: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={customSpell.description}
              onChange={(e) => setCustomSpell((s) => ({ ...s, description: e.target.value }))}
              fullWidth
              multiline
              minRows={4}
              placeholder="Write the spell description/effects..."
              required
            />
            <TextField
              label="Range"
              value={customSpell.range}
              onChange={(e) => setCustomSpell((s) => ({ ...s, range: e.target.value }))}
              fullWidth
              placeholder="e.g. 60 feet, Touch, Self (15-foot cone)"
            />
            <TextField
              label="Duration"
              value={customSpell.duration}
              onChange={(e) => setCustomSpell((s) => ({ ...s, duration: e.target.value }))}
              fullWidth
              placeholder="e.g. Instantaneous, 1 minute"
            />
            <TextField
              label="Casting Time"
              value={customSpell.castingTime}
              onChange={(e) => setCustomSpell((s) => ({ ...s, castingTime: e.target.value }))}
              fullWidth
              placeholder="e.g. 1 action, 1 bonus action, 1 minute"
            />
            <TextField
              label="Components"
              value={customSpell.components}
              onChange={(e) => setCustomSpell((s) => ({ ...s, components: e.target.value }))}
              fullWidth
              placeholder="e.g. V, S, M (a bit of fleece)"
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customSpell.concentration}
                    onChange={(e) =>
                      setCustomSpell((s) => ({ ...s, concentration: e.target.checked }))
                    }
                  />
                }
                label="Concentration"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customSpell.ritual}
                    onChange={(e) => setCustomSpell((s) => ({ ...s, ritual: e.target.checked }))}
                  />
                }
                label="Ritual"
              />
            </Box>

            {customSpellError ? (
              <Typography variant="body2" sx={{ color: '#c62828' }}>
                {customSpellError}
              </Typography>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomSpellOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!canCreateCustomSpell || customSpellSaving}
            onClick={submitCustomSpell}
            type="submit"
          >
            {customSpellSaving
              ? 'Saving…'
              : editingCustomSpellIndex === null
                ? 'Create'
                : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, spell: null })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Custom Spell?</DialogTitle>
        <DialogContent dividers>
          <Typography>Delete “{deleteConfirm.spell?.name}”? This can’t be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, spell: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDeleteCustomSpell}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSpellsModal;
