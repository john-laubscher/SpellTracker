import React, { useState, useContext } from "react";
import { Tooltip, Grid, Typography, Card, CardContent, FormControlLabel, Checkbox, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CharacterInfoContext } from "../../Contexts/Context";

const WeaponManager = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const [newWeapon, setNewWeapon] = useState({
    name: "",
    dmgType: "",
    statMod: "str", // Default to strength
    proficient: false
  });

  // const totalModifier = characterInfo.stats[weapon.statMod].mod + 
  //                     (weapon.proficient ? characterInfo.proficiencyMod : 0);

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
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Weapon Name"
            variant="outlined"
            size="small"
            value={newWeapon.name}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Damage Type"
            variant="outlined"
            size="small"
            value={newWeapon.dmgType}
            onChange={(e) => setNewWeapon((prev) => ({ ...prev, dmgType: e.target.value }))}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="Stat-mod-label">Stat mod</InputLabel>
            <Select
              labelId="Stat-mod-label"
              value={newWeapon.statMod}
              onChange={(e) => setNewWeapon((prev) => ({ ...prev, statMod: e.target.value }))}
            >
              {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
                <MenuItem key={stat} value={stat}>
                  {/* {stat.toUpperCase()} */}
                  {stat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="proficient"
                checked={newWeapon.proficient}
                onChange={(e) => setNewWeapon((prev) => ({ ...prev, proficient: e.target.checked }))}
                />
            }
            label="Proficient"
          />
        </Grid>
        <Grid item xs={3}>
          <IconButton onClick={handleAddWeapon} color="primary">
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        {characterInfo.weapons.map((weapon, index) => {
          const totalModifier =
            characterInfo.stats[weapon.statMod].mod +
            (weapon.proficient ? characterInfo.proficiencyMod : 0);
          const modifierColor = totalModifier >= 0 ? "green" : "red";
          const modifierText = totalModifier >= 0 ? `+${totalModifier}` : totalModifier;
          return (
            <Grid item key={index} xs={12} sm={6} md={4}>
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
                <Card sx={{ cursor: "pointer", padding: "8px", textAlign: "center" }}>
                  <CardContent>
                    <Typography variant="h6">{weapon.name}</Typography>
                    <Typography variant="body2">
                      Modifier:{" "}
                      <span style={{ color: modifierColor }}>{modifierText}</span>
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

export default WeaponManager;
