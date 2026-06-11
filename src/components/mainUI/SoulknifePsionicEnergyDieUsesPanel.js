import * as React from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  CharacterInfoContext,
  FeatureTrackersContext,
  SoulknifeCustomUsesContext,
} from "../../Contexts/Context";
import { proficiencyBonus } from "./header";

const clampInt = (value, min, max) => {
  const asNum = Number(value);
  if (!Number.isFinite(asNum)) return min;
  const asInt = Math.trunc(asNum);
  return Math.max(min, Math.min(max, asInt));
};

const dieLabelForRogueLevel = (level) => {
  const n = Math.max(0, Math.trunc(Number(level) || 0));
  if (n >= 17) return "d12";
  if (n >= 11) return "d10";
  if (n >= 5) return "d8";
  return "d6";
};

const buildTrackerKey = (featureId) => `rogue:${String(featureId || "").trim()}`;

export default function SoulknifePsionicEnergyDieUsesPanel() {
  const { characterInfo } = React.useContext(CharacterInfoContext);
  const { featureTrackers, setFeatureTrackers } = React.useContext(FeatureTrackersContext);
  const { soulknifeCustomUses: customUses, setSoulknifeCustomUses: setCustomUses } =
    React.useContext(SoulknifeCustomUsesContext);

  const characterLevel = Math.max(0, Math.trunc(Number(characterInfo?.characterLevel) || 0));
  const pb = proficiencyBonus[characterLevel] || 2;
  const poolMax = Math.max(0, Math.trunc(Number(pb) || 0) * 2);
  const dieLabel = dieLabelForRogueLevel(characterLevel);

  const psionicPowerKey = buildTrackerKey("psionic_power");
  const psionicFirstUseKey = buildTrackerKey("psionic_first_use");
  const psionicRecoveryKey = buildTrackerKey("psionic_recovery");
  const psychicVeilKey = buildTrackerKey("psychic_veil");
  const rendMindKey = buildTrackerKey("rend_mind");

  const spentDice = clampInt(featureTrackers?.[psionicPowerKey]?.spentDice ?? 0, 0, poolMax);
  const remainingDice = Math.max(0, poolMax - spentDice);

  const firstUseSpent = clampInt(featureTrackers?.[psionicFirstUseKey]?.spentUses ?? 0, 0, 1);
  const firstUseAvailable = firstUseSpent < 1;

  const recoverySpent = clampInt(featureTrackers?.[psionicRecoveryKey]?.spentUses ?? 0, 0, 1);
  const recoveryAvailable = recoverySpent < 1;

  const psychicVeilSpent = clampInt(featureTrackers?.[psychicVeilKey]?.spentUses ?? 0, 0, 1);
  const rendMindSpent = clampInt(featureTrackers?.[rendMindKey]?.spentUses ?? 0, 0, 1);

  const [addOpen, setAddOpen] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState("");
  const [draftDescription, setDraftDescription] = React.useState("");

  const bumpSpentDice = React.useCallback(
    (delta) => {
      const change = Math.trunc(Number(delta) || 0);
      if (!change) return;
      setFeatureTrackers((prev) => {
        const prevSafe = prev || {};
        const prevSpent = clampInt(prevSafe?.[psionicPowerKey]?.spentDice ?? 0, 0, poolMax);
        const nextSpent = clampInt(prevSpent + change, 0, poolMax);
        if (nextSpent === prevSpent) return prevSafe;
        return {
          ...prevSafe,
          [psionicPowerKey]: {
            ...(prevSafe?.[psionicPowerKey] || {}),
            spentDice: nextSpent,
          },
        };
      });
    },
    [poolMax, psionicPowerKey, setFeatureTrackers]
  );

  const markFirstUseSpent = React.useCallback(() => {
    setFeatureTrackers((prev) => {
      const prevSafe = prev || {};
      const prevTracker = prevSafe?.[psionicFirstUseKey] || {};
      const prevSpent = clampInt(prevTracker?.spentUses ?? 0, 0, 1);
      if (prevSpent >= 1) return prevSafe;
      return {
        ...prevSafe,
        [psionicFirstUseKey]: { ...prevTracker, spentUses: 1 },
      };
    });
  }, [psionicFirstUseKey, setFeatureTrackers]);

  const spendPsionicDice = React.useCallback(
    (rawCost) => {
      const baseCost = Math.max(0, Math.trunc(Number(rawCost) || 0));
      if (baseCost === 0) return;

      const effectiveCost = firstUseAvailable ? Math.max(0, baseCost - 1) : baseCost;
      if (effectiveCost > remainingDice) return;

      if (firstUseAvailable) markFirstUseSpent();
      if (effectiveCost > 0) bumpSpentDice(effectiveCost);
    },
    [bumpSpentDice, firstUseAvailable, markFirstUseSpent, remainingDice]
  );

  const useRecovery = React.useCallback(() => {
    if (!recoveryAvailable) return;
    if (remainingDice >= poolMax) return;

    setFeatureTrackers((prev) => {
      const prevSafe = prev || {};
      const prevRecoveryTracker = prevSafe?.[psionicRecoveryKey] || {};
      const prevRecoverySpent = clampInt(prevRecoveryTracker?.spentUses ?? 0, 0, 1);
      if (prevRecoverySpent >= 1) return prevSafe;

      const prevSpent = clampInt(prevSafe?.[psionicPowerKey]?.spentDice ?? 0, 0, poolMax);
      const nextSpent = clampInt(prevSpent - 1, 0, poolMax);

      return {
        ...prevSafe,
        [psionicRecoveryKey]: { ...prevRecoveryTracker, spentUses: 1 },
        [psionicPowerKey]: {
          ...(prevSafe?.[psionicPowerKey] || {}),
          spentDice: nextSpent,
        },
      };
    });
  }, [poolMax, psionicPowerKey, psionicRecoveryKey, recoveryAvailable, remainingDice, setFeatureTrackers]);

  const rechargeFeatureBySpendingDice = React.useCallback(
    ({ targetFeatureKey, rawCost }) => {
      const cost = Math.max(0, Math.trunc(Number(rawCost) || 0));
      if (cost === 0) return;

      const prevSpentUses = clampInt(featureTrackers?.[targetFeatureKey]?.spentUses ?? 0, 0, 1);
      if (prevSpentUses < 1) return;

      const effectiveCost = firstUseAvailable ? Math.max(0, cost - 1) : cost;
      if (effectiveCost > remainingDice) return;

      setFeatureTrackers((prev) => {
        const prevSafe = prev || {};
        const prevTargetTracker = prevSafe?.[targetFeatureKey] || {};
        const prevTargetSpent = clampInt(prevTargetTracker?.spentUses ?? 0, 0, 1);
        if (prevTargetSpent < 1) return prevSafe;

        const prevDiceSpent = clampInt(prevSafe?.[psionicPowerKey]?.spentDice ?? 0, 0, poolMax);
        const nextDiceSpent = clampInt(prevDiceSpent + effectiveCost, 0, poolMax);

        return {
          ...prevSafe,
          [targetFeatureKey]: { ...prevTargetTracker, spentUses: 0 },
          [psionicPowerKey]: { ...(prevSafe?.[psionicPowerKey] || {}), spentDice: nextDiceSpent },
          ...(firstUseAvailable ? { [psionicFirstUseKey]: { ...(prevSafe?.[psionicFirstUseKey] || {}), spentUses: 1 } } : {}),
        };
      });
    },
    [
      featureTrackers,
      firstUseAvailable,
      poolMax,
      psionicFirstUseKey,
      psionicPowerKey,
      remainingDice,
      setFeatureTrackers,
    ]
  );

  const builtinUses = React.useMemo(
    () => [
      {
        id: "psi_bolstered_knack",
        title: "Psi-Bolstered Knack",
        description:
          "If you fail an ability check using a skill or tool with which you have proficiency, roll 1 Psionic Energy die and add it to the check (expend the die only if the roll succeeds).",
        cost: 1,
      },
      {
        id: "psychic_whispers",
        title: "Psychic Whispers",
        description:
          "As an action, choose creatures you can see up to your proficiency bonus, roll 1 Psionic Energy die, and for hours equal to the roll you can communicate telepathically within 1 mile.",
        cost: 1,
      },
      {
        id: "homing_strikes",
        title: "Homing Strikes",
        description:
          "When you miss with an attack roll using Psychic Blades, roll 1 Psionic Energy die and add it to the attack roll (expend the die only if the attack then hits).",
        cost: 1,
      },
      {
        id: "psychic_teleportation",
        title: "Psychic Teleportation",
        description:
          "As a bonus action, manifest a Psychic Blade, expend 1 Psionic Energy die, roll it, throw the blade up to 10 × the roll feet to an unoccupied space you can see, then teleport there.",
        cost: 1,
      },
    ],
    []
  );

  const rechargeActions = React.useMemo(() => {
    const base = [
      characterLevel >= 13
        ? {
            id: "recharge_psychic_veil",
            title: "Recharge Psychic Veil",
            description: "Expend 1 Psionic Energy die to regain use of Psychic Veil.",
            cost: 1,
            onUse: () =>
              rechargeFeatureBySpendingDice({
                targetFeatureKey: psychicVeilKey,
                rawCost: 1,
              }),
            featureReady: psychicVeilSpent < 1,
          }
        : null,
      characterLevel >= 17
        ? {
            id: "recharge_rend_mind",
            title: "Recharge Rend Mind",
            description: "Expend 3 Psionic Energy dice to regain use of Rend Mind.",
            cost: 3,
            onUse: () =>
              rechargeFeatureBySpendingDice({
                targetFeatureKey: rendMindKey,
                rawCost: 3,
              }),
            featureReady: rendMindSpent < 1,
          }
        : null,
    ].filter(Boolean);

    return base;
  }, [
    characterLevel,
    psychicVeilKey,
    psychicVeilSpent,
    rechargeFeatureBySpendingDice,
    rendMindKey,
    rendMindSpent,
  ]);

  const mergedUses = React.useMemo(() => {
    const custom = (customUses || []).map((u) => ({
      id: `custom:${u.id}`,
      title: u.title,
      description: u.description,
      cost: 1,
      isCustom: true,
      customId: u.id,
    }));
    return [...builtinUses, ...custom];
  }, [builtinUses, customUses]);

  const addCustomUse = () => {
    const title = draftTitle.trim();
    if (!title) return;
    const description = draftDescription.trim();
    const next = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      description,
    };
    setCustomUses((prev) => [next, ...(Array.isArray(prev) ? prev : [])]);
    setDraftTitle("");
    setDraftDescription("");
    setAddOpen(false);
  };

  const deleteCustomUse = (id) => {
    const target = String(id || "");
    if (!target) return;
    setCustomUses((prev) => (Array.isArray(prev) ? prev.filter((u) => String(u?.id || "") !== target) : []));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Tooltip arrow title="Uses the same tracker as your Psionic Power dice pool in Tracked Features">
            <Chip
              label={`${remainingDice}/${poolMax} ${dieLabel}`}
              size="small"
              sx={{
                fontWeight: 800,
                backgroundColor: remainingDice === 0 ? "rgba(194, 65, 12, 0.12)" : "rgba(20, 184, 166, 0.12)",
                border: "1px solid rgba(62, 39, 35, 0.22)",
              }}
            />
          </Tooltip>

          <Tooltip
            arrow
            title={
              firstUseAvailable
                ? "First Use is available: your next psionic die spend is reduced by 1 (then this is consumed)."
                : "First Use already used (reset it after a long rest)."
            }
          >
            <Chip
              label={firstUseAvailable ? "First Use: Ready" : "First Use: Used"}
              size="small"
              sx={{
                fontWeight: 800,
                backgroundColor: firstUseAvailable ? "rgba(2, 132, 199, 0.10)" : "rgba(0,0,0,0.05)",
                border: "1px solid rgba(62, 39, 35, 0.22)",
              }}
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip
            arrow
            title={
              !recoveryAvailable
                ? "Psionic Recovery already used (reset it after a short or long rest)."
                : remainingDice >= poolMax
                  ? "No expended dice to recover."
                  : "Bonus action: regain 1 expended Psionic Energy die (once per short or long rest)."
            }
          >
            <span>
              <Button
                variant="outlined"
                size="small"
                disabled={!recoveryAvailable || remainingDice >= poolMax}
                onClick={useRecovery}
                sx={{ textTransform: "none", fontSize: "11px" }}
              >
                Regain 1 Die
              </Button>
            </span>
          </Tooltip>

          <Tooltip arrow title="Add a custom psionic die use (defaults to costing 1 die)">
            <IconButton
              size="small"
              aria-label="Add custom psionic die use"
              onClick={() => setAddOpen(true)}
              sx={{
                p: 0.25,
                color: "rgba(124, 45, 18, 0.95)",
                border: "1px solid rgba(124, 45, 18, 0.22)",
                backgroundColor: "rgba(124, 45, 18, 0.06)",
                "&:hover": { backgroundColor: "rgba(124, 45, 18, 0.10)" },
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: 1 }}>
        {mergedUses.map((use) => {
          const cost = Math.max(0, Math.trunc(Number(use?.cost) || 0));
          const baseDisabled = cost <= 0 || remainingDice <= 0 || cost > remainingDice;
          const disabled = Boolean(use?.disabled) || baseDisabled;

          const handleUse = () => {
            if (disabled) return;
            if (typeof use?.onUse === "function") {
              use.onUse();
              return;
            }
            spendPsionicDice(cost);
          };

          return (
            <Box
              key={use.id}
              sx={{
                border: "1px solid rgba(62, 39, 35, 0.18)",
                borderRadius: 1.5,
                px: 1.25,
                py: 1,
                backgroundColor: "rgba(255,255,255,0.55)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 800, color: "#3e2723", lineHeight: 1.2 }}>
                    {use.title}
                  </Typography>
                  {use.description ? (
                    <Typography sx={{ fontSize: "12px", color: "rgba(62,39,35,0.78)", mt: 0.25 }}>
                      {use.description}
                    </Typography>
                  ) : null}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                  {use.isCustom ? (
                    <Tooltip arrow title="Delete custom use">
                      <IconButton
                        size="small"
                        aria-label="Delete custom use"
                        onClick={() => deleteCustomUse(use.customId)}
                        sx={{ p: 0.25, opacity: 0.85 }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  ) : null}

                  <Tooltip
                    arrow
                    title={
                      disabled
                        ? use.disabled
                          ? "Feature is not currently expended."
                          : remainingDice <= 0
                            ? "No Psionic Energy dice remaining."
                            : "Not enough Psionic Energy dice remaining."
                        : firstUseAvailable
                          ? "First Use will reduce this spend by 1 die."
                          : `Spend ${cost} Psionic Energy die${cost === 1 ? "" : "s"}.`
                    }
                  >
                    <span>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={disabled}
                        onClick={handleUse}
                        sx={{ textTransform: "none", fontSize: "11px" }}
                      >
                        {cost === 1 ? "Use (1 die)" : `Use (${cost} dice)`}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {rechargeActions.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: 1,
            flexWrap: "wrap",
            mt: 1.5,
          }}
        >
          {rechargeActions.map((action) => {
            const cost = Math.max(0, Math.trunc(Number(action?.cost) || 0));
            const notExpended = Boolean(action?.featureReady);
            const baseDisabled = cost <= 0 || remainingDice <= 0 || cost > remainingDice;
            const disabled = notExpended || baseDisabled;

            const tooltip = disabled
              ? notExpended
                ? "Feature is not currently expended."
                : remainingDice <= 0
                  ? "No Psionic Energy dice remaining."
                  : "Not enough Psionic Energy dice remaining."
              : firstUseAvailable
                ? "First Use will reduce this spend by 1 die."
                : `Spend ${cost} Psionic Energy die${cost === 1 ? "" : "s"}.`;

            return (
              <Box
                key={action.id}
                sx={{
                  width: { xs: "100%", sm: 360 },
                  maxWidth: "100%",
                  border: "1px solid rgba(62, 39, 35, 0.18)",
                  borderRadius: 1.5,
                  px: 1.25,
                  py: 1,
                  backgroundColor: "rgba(255,255,255,0.55)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "14px", fontWeight: 900, color: "#3e2723", lineHeight: 1.2 }}>
                  {action.title}
                </Typography>
                {action.description ? (
                  <Typography sx={{ fontSize: "12px", color: "rgba(62,39,35,0.78)", mt: 0.25 }}>
                    {action.description}
                  </Typography>
                ) : null}
                <Box sx={{ mt: 1 }}>
                  <Tooltip arrow title={tooltip}>
                    <span>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          action.onUse();
                        }}
                        sx={{ textTransform: "none", fontSize: "11px" }}
                      >
                        {cost === 1 ? "Recharge (1 die)" : `Recharge (${cost} dice)`}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : null}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Cinzel', serif" }}>Add Psionic Die Use</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            multiline
            minRows={3}
          />
          <Typography sx={{ mt: 1, fontSize: "12px", color: "rgba(62,39,35,0.7)" }}>
            Custom uses default to costing 1 Psionic Energy die.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={addCustomUse} disabled={!draftTitle.trim()} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
