import React, { useState, useContext } from "react";
import { Tooltip, Grid, Typography, Card, CardContent, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, SvgIcon } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CharacterInfoContext } from "../../Contexts/Context";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const diceSizes = [4, 6, 8, 10, 12, 20];
const diceCounts = Array.from({ length: 20 }, (_, i) => i + 1);

const formatDamageDice = (weapon) => {
  const diceCount = Number.isFinite(Number(weapon?.diceCount)) ? Number(weapon.diceCount) : 1;
  const diceSize = Number.isFinite(Number(weapon?.diceSize)) ? Number(weapon.diceSize) : 6;
  return `${diceCount}d${diceSize}`;
};

const QuillIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    {/* Feather body */}
    <path d="M21 4c-4.7.9-8.7 4.6-10.4 9.3l-.5 1.3-5.6 6.7 6.7-5.6 1.3-.5C17.2 13.7 20.9 9.7 21.8 5l.2-1z" />
    {/* Feather barbs / cut */}
    <path d="M18.7 6.3c-3 .8-5.6 3.4-6.6 6.5l-.4 1.2-2.5 2.1 2.1-2.5 1.2-.4c3.1-1 5.7-3.6 6.5-6.6z" opacity="0.35" />
    {/* Quill shaft */}
    <path d="M10.7 13.8 7.7 16.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    {/* Nib */}
    <path d="M6.8 17.7 5.2 19.3l2.2-.6.6-2.2z" />
  </SvgIcon>
);

const sanitizeWeaponForEdit = (weapon) => ({
  name: String(weapon?.name || ""),
  dmgType: String(weapon?.dmgType || ""),
  diceCount: Number.isFinite(Number(weapon?.diceCount)) ? Number(weapon.diceCount) : 1,
  diceSize: Number.isFinite(Number(weapon?.diceSize)) ? Number(weapon.diceSize) : 6,
  statMod: String(weapon?.statMod || "str"),
  proficient: Boolean(weapon?.proficient),
});

export const WeaponsDisplay = ({ characterInfo }) => {
  const { setCharacterInfo } = useContext(CharacterInfoContext);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingWeapon, setEditingWeapon] = useState(null);

  const closeEditor = () => {
    setEditingIndex(null);
    setEditingWeapon(null);
  };

  const openEditor = (index) => {
    const weapon = characterInfo?.weapons?.[index];
    if (!weapon) return;
    setEditingIndex(index);
    setEditingWeapon(sanitizeWeaponForEdit(weapon));
  };

  const handleSave = () => {
    if (editingIndex === null || !editingWeapon) return;
    if (!editingWeapon.name.trim() || !editingWeapon.dmgType.trim()) return;
    setCharacterInfo((prev) => {
      const nextWeapons = Array.isArray(prev.weapons) ? [...prev.weapons] : [];
      if (!nextWeapons[editingIndex]) return prev;
      nextWeapons[editingIndex] = { ...nextWeapons[editingIndex], ...editingWeapon };
      return { ...prev, weapons: nextWeapons };
    });
    closeEditor();
  };

  return (
    <>
      <Grid container spacing={1} mt={1}>
        {(characterInfo?.weapons || []).map((weapon, index) => {
          const totalModifier =
            characterInfo.stats[weapon.statMod].mod +
            (weapon.proficient ? characterInfo.proficiencyMod : 0);
          const modifierColor = totalModifier >= 0 ? "#2e7d32" : "#c62828";
          const modifierText = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;
          const damageText = `${formatDamageDice(weapon)} ${capitalize(weapon.dmgType)}`;

          return (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Tooltip
                title={
                  <>
                    <Typography variant="body2">
                      Proficiency Mod: {weapon.proficient ? characterInfo.proficiencyMod : 0}
                    </Typography>
                    <Typography variant="body2">Damage Dice: {formatDamageDice(weapon)}</Typography>
                    <Typography variant="body2">Damage Type: {capitalize(weapon.dmgType)}</Typography>
                    <Typography variant="body2">Modifier: {weapon.statMod.toUpperCase()}</Typography>
                  </>
                }
                arrow
              >
                <Card
                  sx={{
                    position: "relative",
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: "rgba(139,69,19,0.06)",
                    border: "1px solid rgba(139,69,19,0.22)",
                    width: "100%",
                    "&:hover": { borderColor: "rgba(139,69,19,0.38)" },
                    "&:hover .weapon-edit-btn": { opacity: 1, transform: "translateY(0px)" },
                  }}
                >
                  <IconButton
                    className="weapon-edit-btn"
                    size="small"
                    aria-label={`Edit ${weapon.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditor(index);
                    }}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "rgba(245, 245, 245, 0.92)",
                      border: "1px solid rgba(139,69,19,0.25)",
                      opacity: 0,
                      transform: "translateY(-2px)",
                      transition: "opacity 120ms ease, transform 120ms ease",
                      width: 30,
                      height: 30,
                      "&:hover": { backgroundColor: "rgba(245, 245, 245, 1)" },
                    }}
                  >
                    <QuillIcon sx={{ fontSize: 22 }} />
                  </IconButton>

                  <CardContent sx={{ py: 0.75, px: 1, "&:last-child": { pb: 0.75 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "14px",
                          lineHeight: 1.15,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {weapon.name}
                      </Typography>

                      <Typography sx={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.2 }}>
                        Atk{" "}
                        <span style={{ color: modifierColor, fontWeight: 900 }}>{modifierText}</span>
                      </Typography>

                      <Typography sx={{ fontSize: "13px", lineHeight: 1.2, color: "text.secondary" }}>
                        {damageText}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={editingIndex !== null} onClose={closeEditor} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Weapon</DialogTitle>
        <DialogContent dividers>
          {editingWeapon ? (
            <Grid container spacing={1.25} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={editingWeapon.name}
                  onChange={(e) => setEditingWeapon((prev) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Dmg Type"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={editingWeapon.dmgType}
                  onChange={(e) =>
                    setEditingWeapon((prev) => ({ ...prev, dmgType: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-dice-count-label">Qty</InputLabel>
                  <Select
                    labelId="edit-dice-count-label"
                    label="Qty"
                    value={editingWeapon.diceCount}
                    onChange={(e) =>
                      setEditingWeapon((prev) => ({ ...prev, diceCount: Number(e.target.value) }))
                    }
                  >
                    {diceCounts.map((count) => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-dice-size-label">Die</InputLabel>
                  <Select
                    labelId="edit-dice-size-label"
                    label="Die"
                    value={editingWeapon.diceSize}
                    onChange={(e) =>
                      setEditingWeapon((prev) => ({ ...prev, diceSize: Number(e.target.value) }))
                    }
                  >
                    {diceSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        d{size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-stat-mod-label">Stat</InputLabel>
                  <Select
                    labelId="edit-stat-mod-label"
                    label="Stat"
                    value={editingWeapon.statMod}
                    onChange={(e) =>
                      setEditingWeapon((prev) => ({ ...prev, statMod: e.target.value }))
                    }
                    renderValue={(v) => String(v).toUpperCase()}
                  >
                    {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
                      <MenuItem key={stat} value={stat}>
                        {stat.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={editingWeapon.proficient}
                      onChange={(e) =>
                        setEditingWeapon((prev) => ({ ...prev, proficient: e.target.checked }))
                      }
                      sx={{
                        color: "#8B4513",
                        "&.Mui-checked": { color: "#8B4513" },
                        p: 0.5,
                      }}
                    />
                  }
                  label="Proficient"
                  sx={{
                    mr: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "12px",
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 600,
                      color: "#3e2723",
                    },
                  }}
                />
              </Grid>
            </Grid>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditor}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#8B4513", "&:hover": { backgroundColor: "#6d3410" } }}
            disabled={!editingWeapon?.name?.trim() || !editingWeapon?.dmgType?.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const WeaponManager = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [newWeapon, setNewWeapon] = useState({
    name: "",
    dmgType: "",
    diceCount: 1,
    diceSize: 6,
    statMod: "str", // Default to strength
    proficient: false
  });



  const handleAddWeapon = () => {
    if (!newWeapon.name || !newWeapon.dmgType) return; // Ensure required fields are filled
    setCharacterInfo((prev) => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon],
    }));
    setNewWeapon({
      name: "",
      dmgType: "",
      diceCount: 1,
      diceSize: 6,
      statMod: "str",
      proficient: false,
    }); // Reset form
  };

  const canAdd = newWeapon.name.trim() !== "" && newWeapon.dmgType.trim() !== "";

  return (
    <div>
      {/* Add weapon form */}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.name}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm>
          <TextField
            label="Dmg Type"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.dmgType}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, dmgType: e.target.value }))}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="dice-count-label">Qty</InputLabel>
            <Select
              labelId="dice-count-label"
              label="Qty"
              value={newWeapon.diceCount}
              onChange={(e) =>
                setNewWeapon((prev) => ({ ...prev, diceCount: Number(e.target.value) }))
              }
            >
              {diceCounts.map((count) => (
                <MenuItem key={count} value={count}>
                  {count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="dice-size-label">Die</InputLabel>
            <Select
              labelId="dice-size-label"
              label="Die"
              value={newWeapon.diceSize}
              onChange={(e) =>
                setNewWeapon((prev) => ({ ...prev, diceSize: Number(e.target.value) }))
              }
            >
              {diceSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  d{size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sx={{ minWidth: 80 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="Stat-mod-label">Stat</InputLabel>
            <Select
              labelId="Stat-mod-label"
              label="Stat"
              value={newWeapon.statMod}
              onChange={(e) => setNewWeapon((prev) => ({ ...prev, statMod: e.target.value }))}
              renderValue={(v) => v.toUpperCase()}
            >
              {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
                <MenuItem key={stat} value={stat}>
                  {stat.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={newWeapon.proficient}
                onChange={(e) => setNewWeapon((prev) => ({ ...prev, proficient: e.target.checked }))}
                sx={{
                  color: "#8B4513",
                  "&.Mui-checked": { color: "#8B4513" },
                  p: 0.5,
                }}
              />
            }
            label="Prof"
            sx={{
              mr: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "12px",
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: "#3e2723",
              },
            }}
          />
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleAddWeapon}
            disabled={!canAdd}
            sx={{
              backgroundColor: "#8B4513",
              color: "#fff",
              opacity: canAdd ? 1 : 0.45,
              "&:hover": { backgroundColor: "#6d3410" },
              "&.Mui-disabled": {
                backgroundColor: "#8B4513",
                color: "#fff",
                opacity: 0.45,
              },
              width: 36,
              height: 36,
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>

      {/* Weapon cards */}
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {characterInfo.weapons.map((weapon, index) => {
          const totalModifier =
            characterInfo.stats[weapon.statMod].mod +
            (weapon.proficient ? characterInfo.proficiencyMod : 0);
          const modifierColor = totalModifier >= 0 ? "#2e7d32" : "#c62828";
          const modifierText = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;
          return (
            <Grid item key={index} xs={6} sm={4}>
              <Tooltip
                title={
                  <>
                    <Typography variant="body2">
                      Proficiency Mod: {weapon.proficient ? characterInfo.proficiencyMod : 0}
                    </Typography>
                    <Typography variant="body2">Damage Dice: {formatDamageDice(weapon)}</Typography>
                    <Typography variant="body2">Damage Type: {capitalize(weapon.dmgType)}</Typography>
                    <Typography variant="body2">Modifier: {weapon.statMod.toUpperCase()}</Typography>
                  </>
                }
                arrow
              >
                <Card sx={{
                  cursor: "pointer",
                  py: 0.5,
                  px: 1,
                  textAlign: "center",
                  backgroundColor: "rgba(139,69,19,0.08)",
                  border: "1px solid rgba(139,69,19,0.25)",
                }}>
          <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>{weapon.name}</Typography>
                    <Typography sx={{ fontSize: "13px" }}>
                      Atk:{" "}
                      <span style={{ color: modifierColor, fontWeight: 700 }}>{modifierText}</span>
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }}>
                      Dmg: {formatDamageDice(weapon)} {capitalize(weapon.dmgType)}
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export { WeaponManager };
