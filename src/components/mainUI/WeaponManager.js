import React, { useState, useContext } from "react";
import { Tooltip, Grid, Typography, Card, CardContent, FormControlLabel, Checkbox, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CharacterInfoContext } from "../../Contexts/Context";

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
              <Typography variant="body2">Damage Type: {weapon.dmgType}</Typography>
              <Typography variant="body2">Modifier: {weapon.statMod}</Typography>
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

  return (
    <div>
      {/* Form to Add Weapon */}
      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={4}>
          <TextField
            label="Weapon Name"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.name}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Damage Type"
            variant="outlined"
            size="small"
            fullWidth
            value={newWeapon.dmgType}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, dmgType: e.target.value }))}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="Stat-mod-label">Stat mod</InputLabel>
            <Select
              labelId="Stat-mod-label"
              value={newWeapon.statMod}
              onChange={(e) => setNewWeapon((prev) => ({ ...prev, statMod: e.target.value }))}
            >
              {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
                <MenuItem key={stat} value={stat}>
                  {stat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Proficient checkbox hidden until needed */}
        {/* Add weapon button hidden until needed */}
      </Grid>
      <Grid container spacing={1.5} mt={1}>
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
                    <Typography variant="body2">Damage Type: {weapon.dmgType}</Typography>
                    <Typography variant="body2">Modifier: {weapon.statMod}</Typography>
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
