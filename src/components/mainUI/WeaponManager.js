import React, { useState, useContext } from "react";
import { Tooltip, Grid, Typography, Card, CardContent, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CharacterInfoContext } from "../../Contexts/Context";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const WeaponsDisplay = ({ characterInfo }) => (
  <Grid container spacing={2} mt={2}>
    {characterInfo.weapons.map((weapon, index) => {
      const totalModifier =
        characterInfo.stats[weapon.statMod].mod +
        (weapon.proficient ? characterInfo.proficiencyMod : 0);
      const modifierColor = totalModifier >= 0 ? "green" : "red";
      const modifierText = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;

      return (
        <Tooltip
          key={index}
          title={
            <>
              <Typography variant="body2">
                Proficiency Mod: {weapon.proficient ? characterInfo.proficiencyMod : 0}
              </Typography>
              <Typography variant="body2">Damage Type: {capitalize(weapon.dmgType)}</Typography>
              <Typography variant="body2">Modifier: {weapon.statMod.toUpperCase()}</Typography>
            </>
          }
          arrow
        >
          <Typography
            variant="body1"
            sx={{ cursor: "pointer", margin: "8px 0", textAlign: "center" }}
          >
            {weapon.name}: atk{" "}
            <span style={{ color: modifierColor }}>{modifierText}</span>
          </Typography>
        </Tooltip>
      );
    })}
  </Grid>
);

const WeaponManager = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [newWeapon, setNewWeapon] = useState({
    name: "",
    dmgType: "",
    statMod: "str", // Default to strength
    proficient: false
  });



  const handleAddWeapon = () => {
    if (!newWeapon.name || !newWeapon.dmgType) return; // Ensure required fields are filled
    setCharacterInfo((prev) => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon],
    }));
    setNewWeapon({ name: "", dmgType: "", statMod: "str", proficiency: false }); // Reset form
  };

  const canAdd = newWeapon.name.trim() !== "" && newWeapon.dmgType.trim() !== "";

  return (
    <div>
      {/* Add weapon form */}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.name}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Dmg Type"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.dmgType}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, dmgType: e.target.value }))}
          />
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
