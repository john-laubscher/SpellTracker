// This component renders the class features
// Will have a main/section that is always visible (default is tracked?) and expandable, which includes the rest of the relevant classfeatures as listed in ClassesData
// Subclass Features, Racial Features, and additional features (Feats, magic items, custom features, etc) will have their own sections/columns on the mainUI 

import React, { useContext } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { AuthContext, CharacterInfoContext } from "../../Contexts/Context"; // Adjust the path based on your project structure
import classesData from "../../components/ClassesData"; // Adjust the path based on your project structure
import { HalfElfVersatilityArr, RaceFeaturesData } from "../../components/RacesData";
import AddFeatureModal from "./AddFeatureModal";
import ManageFeaturesModal from "./ManageFeaturesModal";
import ConfirmDialog from "./ConfirmDialog";
import EditCustomFeatureModal from "./EditCustomFeatureModal";
import MagicalSecretsModal from "./MagicalSecretsModal";
import SpiritSessionModal from "./SpiritSessionModal";
import ArcanaInitiateModal from "./ArcanaInitiateModal";
import ArcaneMasteryModal from "./ArcaneMasteryModal";
import ReaperCantripModal from "./ReaperCantripModal";
import AcolyteOfNatureModal from "./AcolyteOfNatureModal";
import ArcaneArcherLoreCantripModal from "./ArcaneArcherLoreCantripModal";
import ArcaneShotOptionsModal from "./ArcaneShotOptionsModal";
import BattleMasterManeuversModal from "./BattleMasterManeuversModal";
import AdditionalFightingStyleModal from "./AdditionalFightingStyleModal";
import BlessedWarriorCantripsModal from "./BlessedWarriorCantripsModal";
import RuneKnightRunesModal from "./RuneKnightRunesModal";
import SpellAccordian from "./SpellAccordian";
import SwordIcon from "./SwordIcon";
import BowIcon from "./BowIcon";
import UntrackedOptionsModal from "./UntrackedOptionsModal";
import { proficiencyBonus } from "./header";
import {
  getFeatureTrackedOverride,
  getFeatureHiddenOverride,
  getOverrideKey,
  loadFeatureOverrides,
  saveFeatureOverrides,
  setFeatureTrackedOverride,
  setFeatureHiddenOverride,
} from "../../utils/featureOverrides";

const FEATURE_TRACKERS_STORAGE_KEY = "spelltracker_featureTrackers_v1";

const loadFeatureTrackers = () => {
  try {
    const raw = localStorage.getItem(FEATURE_TRACKERS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const saveFeatureTrackers = (trackers) => {
  try {
    localStorage.setItem(FEATURE_TRACKERS_STORAGE_KEY, JSON.stringify(trackers || {}));
  } catch {
    // ignore write errors
  }
};

const FeatureAccordionRow = ({
  feature,
  renderTrailingControls,
  detailsIdPrefix,
  renderDetailsHeader,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const descLines = React.useMemo(() => {
    if (!feature) return [];
    if (Array.isArray(feature.desc)) return feature.desc;
    if (typeof feature.desc === "string") return [feature.desc];
    return [];
  }, [feature]);

  const safeIdPrefix = React.useMemo(() => {
    const raw = String(detailsIdPrefix || "feature");
    return raw.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_-]/g, "");
  }, [detailsIdPrefix]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
      sx={{
        backgroundColor: "transparent",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: 0 },
      }}
    >
      <AccordionSummary
        aria-controls={`${safeIdPrefix}-${feature.id}-content`}
        id={`${safeIdPrefix}-${feature.id}-header`}
        sx={{
          minHeight: 28,
          px: 0.5,
          py: 0,
          "& .MuiAccordionSummary-content": {
            margin: "2px 0 !important",
            alignItems: "center",
            gap: 0.5,
            width: "100%",
            display: "flex",
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: "2px 0 !important",
          },
          "&.Mui-expanded": { minHeight: 28 },
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            cursor: "pointer",
            flex: "0 1 auto",
            minWidth: 0,
            pr: 0.25,
          }}
        >
          {feature.name}
        </Typography>

        {renderTrailingControls ? (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            {renderTrailingControls()}
          </div>
        ) : null}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: 1.5,
          py: 1,
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "4px",
          mx: 0.5,
          mb: 0.5,
        }}
      >
        <Typography component="div" sx={{ fontSize: "13px", "& p": { margin: "2px 0" } }}>
          {renderDetailsHeader ? renderDetailsHeader() : null}
          {descLines.length === 0 ? (
            <p style={{ opacity: 0.7 }}>
              <em>No description available.</em>
            </p>
          ) : (
            descLines.map((line, idx) => <p key={idx}>{line}</p>)
          )}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

// Reusable FeatureDisplay component
const FeatureDisplay = ({
  title,
  features,
  untrackedLabel,
  renderTrackedTrailingControls,
  renderUntrackedTrailingControls,
  renderDetailsHeaderForFeature,
  addTooltip,
  onAdd,
  manageTooltip,
  onManage,
  proficiencyBonusValue,
  charismaModValue,
  wisdomModValue,
  strengthModValue,
  constitutionModValue,
  druidLevel,
  fighterLevel,
  paladinLevel,
  characterClass,
  characterLevel,
}) => {
  const trackedFeatures = features.filter(
    (feature) => feature?.tracked || Boolean(feature?.sharedUsePoolKey)
  );
  const untrackedFeatures = features.filter(
    (feature) => !(feature?.tracked || Boolean(feature?.sharedUsePoolKey))
  );
  const [showHeaderActions, setShowHeaderActions] = React.useState(false);
  const touchHideTimerRef = React.useRef(null);
  const [stackingChecksById, setStackingChecksById] = React.useState({});
  const [featureTrackers, setFeatureTrackers] = React.useState(() => loadFeatureTrackers());
  const [untrackedExpanded, setUntrackedExpanded] = React.useState(false);
  const [activeDicePoolEditorKey, setActiveDicePoolEditorKey] = React.useState(null);

  React.useEffect(() => {
    return () => {
      if (touchHideTimerRef.current) window.clearTimeout(touchHideTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    saveFeatureTrackers(featureTrackers);
  }, [featureTrackers]);

  const getUsesCount = (feature) => {
    if (feature?.recharge === "rage") return 1;
    if (feature?.uses === 0) return 0;
    if (Array.isArray(feature?.usesByLevel) && Number.isFinite(characterLevel)) {
      const sorted = [...feature.usesByLevel].sort((a, b) => (a?.level || 0) - (b?.level || 0));
      const match = sorted.reduce((acc, cur) => {
        if (!cur || !Number.isFinite(cur.level)) return acc;
        if (cur.level <= characterLevel) return cur;
        return acc;
      }, null);
      if (match?.uses === "unlimited") return "unlimited";
      if (match?.uses === "cha_mod") {
        const minUses = Math.max(1, Number(match?.minUses) || 1);
        return Math.max(minUses, Math.max(1, Number(charismaModValue) || 1));
      }
      if (match?.uses === 0) return 0;
      if (typeof match?.uses === "number" && Number.isFinite(match.uses) && match.uses > 0) return match.uses;
    }
    if (feature?.uses === "pb") return Number(proficiencyBonusValue) || 1;
    if (feature?.uses === "1_plus_cha_mod") {
      const chaMod = Math.trunc(Number(charismaModValue) || 0);
      return Math.max(1, 1 + chaMod);
    }
    if (feature?.uses === "cha_mod") return Math.max(1, Number(charismaModValue) || 1);
    if (feature?.uses === "wis_mod") return Math.max(1, Number(wisdomModValue) || 1);
    if (feature?.uses === "str_mod") {
      const minUses = Math.max(0, Math.trunc(Number(feature?.minUses) || 0));
      return Math.max(minUses, Math.trunc(Number(strengthModValue) || 0));
    }
    if (feature?.uses === "con_mod") {
      const minUses = Math.max(0, Math.trunc(Number(feature?.minUses) || 0));
      return Math.max(minUses, Math.trunc(Number(constitutionModValue) || 0));
    }
    if (feature?.uses === "druid_level") return Math.max(0, Number(druidLevel) || 0);
    if (typeof feature?.uses === "number" && Number.isFinite(feature.uses) && feature.uses > 0) return feature.uses;
    return 1;
  };

  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        onMouseEnter={() => setShowHeaderActions(true)}
        onMouseLeave={() => setShowHeaderActions(false)}
        onFocusCapture={() => setShowHeaderActions(true)}
        onBlurCapture={() => setShowHeaderActions(false)}
        onTouchStart={() => {
          if (touchHideTimerRef.current) window.clearTimeout(touchHideTimerRef.current);
          setShowHeaderActions(true);
          touchHideTimerRef.current = window.setTimeout(() => setShowHeaderActions(false), 1800);
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: '15px',
            color: '#3e2723',
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        {onManage ? (
          <IconButton
            size="small"
            onClick={onManage}
            aria-label={manageTooltip || "Manage features"}
            sx={{
              mt: "-2px",
              ml: 0.25,
              opacity: showHeaderActions ? 1 : 0.25,
              transition: "opacity 120ms ease",
              "&:focus-visible": { opacity: 1 },
            }}
          >
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        ) : null}

        {onAdd ? (
          <IconButton
            size="small"
            onClick={onAdd}
            aria-label={addTooltip || "Add custom feature"}
            sx={{ mt: "-2px" }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        ) : null}
      </div>

      {trackedFeatures.map((feature) => {
        const stackingHeader =
          feature?.trackedMode === "stackingChecks" ? (
            <p style={{ margin: "2px 0" }}>
              <strong>Current DC:</strong> {10 + (Number(stackingChecksById?.[feature.id]) || 0) * 5}
            </p>
          ) : null;

        const customHeader = renderDetailsHeaderForFeature ? renderDetailsHeaderForFeature(feature) : null;
        const renderHeader =
          stackingHeader || customHeader
            ? () => (
                <>
                  {stackingHeader}
                  {customHeader}
                </>
              )
            : null;

        return (
          <FeatureAccordionRow
            key={feature.id}
            feature={feature}
            detailsIdPrefix={`features-${title}`}
            renderDetailsHeader={renderHeader}
            renderTrailingControls={() => {
              const extraTrailing = renderTrackedTrailingControls
                ? renderTrackedTrailingControls(feature)
                : null;
              let usesCount = getUsesCount(feature);
              const trackerKey = `${String(characterClass || "unknown")}:${String(feature?.id || "feature")}`;
              const tracker = featureTrackers?.[trackerKey] || {};
              const sharedPoolKey = feature?.sharedUsePoolKey
                ? `${String(characterClass || "unknown")}:${String(feature.sharedUsePoolKey)}`
                : null;
              const poolTracker = sharedPoolKey ? featureTrackers?.[sharedPoolKey] || {} : null;

            const setTracker = (nextPartial) => {
              setFeatureTrackers((prev) => ({
                ...(prev || {}),
                [trackerKey]: {
                  ...(prev?.[trackerKey] || {}),
                  ...(nextPartial || {}),
                },
              }));
            };

            const setPoolTracker = (nextPartial) => {
              if (!sharedPoolKey) return;
              setFeatureTrackers((prev) => ({
                ...(prev || {}),
                [sharedPoolKey]: {
                  ...(prev?.[sharedPoolKey] || {}),
                  ...(nextPartial || {}),
                },
              }));
            };

            const clampInt = (value, min, max) => {
              const asNum = Number(value);
              if (!Number.isFinite(asNum)) return min;
              const asInt = Math.trunc(asNum);
              return Math.max(min, Math.min(max, asInt));
            };

            const extraUses = feature?.allowExtraUses ? clampInt(tracker?.extraUses ?? 0, 0, 20) : 0;
            const baseUsesCount = typeof usesCount === "number" ? usesCount : 0;
            if (extraUses > 0 && typeof usesCount === "number") {
              usesCount += extraUses;
            }

            if (feature?.trackedMode === "dicePool") {
              const levelValue = (() => {
                if (feature?.trackedLevelSource === "fighter_level") return Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                if (feature?.trackedLevelSource === "druid_level") return Math.max(0, Math.trunc(Number(druidLevel) || 0));
                return Math.max(0, Math.trunc(Number(characterLevel) || 0));
              })();

              const basePoolMax = (() => {
                if (Array.isArray(feature?.poolSizeByLevel) && Number.isFinite(levelValue)) {
                  const sorted = [...feature.poolSizeByLevel].sort((a, b) => (a?.level || 0) - (b?.level || 0));
                  const match = sorted.reduce((acc, cur) => {
                    if (!cur || !Number.isFinite(cur.level)) return acc;
                    if (cur.level <= levelValue) return cur;
                    return acc;
                  }, null);
                  if (match && Number.isFinite(match.size)) return Math.max(0, Math.trunc(match.size));
                }

                if (feature?.poolSize === "druid_level") return Math.max(0, Math.trunc(Number(druidLevel) || 0));
                if (feature?.poolSize === "fighter_level") return Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                return Math.max(0, Math.trunc(levelValue));
              })();

              const poolBonusRaw = feature?.allowExtraDicePool ? tracker?.poolBonus : 0;
              const poolBonus = feature?.allowExtraDicePool ? clampInt(poolBonusRaw ?? 0, -20, 20) : 0;
              const poolMax = Math.max(0, Math.trunc(basePoolMax + poolBonus));

              const dieLabel = (() => {
                if (Array.isArray(feature?.dieByLevel) && Number.isFinite(levelValue)) {
                  const sorted = [...feature.dieByLevel].sort((a, b) => (a?.level || 0) - (b?.level || 0));
                  const match = sorted.reduce((acc, cur) => {
                    if (!cur || !Number.isFinite(cur.level)) return acc;
                    if (cur.level <= levelValue) return cur;
                    return acc;
                  }, null);
                  if (match?.die) return String(match.die);
                }
                if (feature?.die) return String(feature.die);
                return "d6";
              })();
              const spentDice = clampInt(tracker?.spentDice ?? 0, 0, poolMax);
              const remainingDice = Math.max(0, poolMax - spentDice);
              const isEditing = activeDicePoolEditorKey === trackerKey;

              return (
                <>
                  {!isEditing ? (
                    <Tooltip arrow title="Click to set remaining dice">
                      <Typography
                        onClick={(e) => {
                          e.stopPropagation();
                          if (poolMax <= 0) return;
                          setActiveDicePoolEditorKey(trackerKey);
                        }}
                        sx={{
                          ml: 0.5,
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: poolMax <= 0 ? "default" : "pointer",
                          color: remainingDice === 0 ? "#7c2d12" : "#0f766e",
                          px: 1,
                          py: 0.25,
                          borderRadius: "10px",
                          border: `1px solid ${remainingDice === 0 ? "rgba(124, 45, 18, 0.35)" : "rgba(15, 118, 110, 0.35)"}`,
                          background:
                            remainingDice === 0 ? "rgba(252, 165, 165, 0.20)" : "rgba(167, 243, 208, 0.20)",
                          userSelect: "none",
                        }}
                      >
                        {remainingDice}/{poolMax} {dieLabel}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <FormControl
                      size="small"
                      variant="standard"
                      sx={{ ml: 0.5, minWidth: 62 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        open
                        value={remainingDice}
                        onClose={(e) => {
                          e?.stopPropagation?.();
                          setActiveDicePoolEditorKey(null);
                        }}
                        onChange={(e) => {
                          const nextRemaining = clampInt(e.target.value, 0, poolMax);
                          const nextSpent = Math.max(0, poolMax - nextRemaining);
                          setTracker({ spentDice: nextSpent });
                          setActiveDicePoolEditorKey(null);
                        }}
                        sx={{ fontSize: "12px" }}
                      >
                        {Array.from({ length: poolMax + 1 }).map((_, idx) => (
                          <MenuItem
                            key={`${feature.id}:remaining:${idx}`}
                            value={idx}
                            sx={{ fontSize: "12px" }}
                          >
                            {idx}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {feature?.allowExtraDicePool ? (
                    <>
                      <Tooltip arrow title="Decrease max dice">
                        <span>
                          <IconButton
                            size="small"
                            aria-label="Decrease max dice"
                            onClick={() => {
                              const nextBonus = clampInt((tracker?.poolBonus ?? 0) - 1, -20, 20);
                              setTracker({
                                poolBonus: nextBonus,
                                spentDice: clampInt(tracker?.spentDice ?? 0, 0, Math.max(0, basePoolMax + nextBonus)),
                              });
                            }}
                            sx={{ ml: 0.25, p: 0.25, opacity: 0.9 }}
                          >
                            <RemoveIcon fontSize="inherit" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip arrow title="Increase max dice">
                        <IconButton
                          size="small"
                          aria-label="Increase max dice"
                          onClick={() => {
                            const nextBonus = clampInt((tracker?.poolBonus ?? 0) + 1, -20, 20);
                            setTracker({ poolBonus: nextBonus });
                          }}
                          sx={{ p: 0.25, opacity: 0.9 }}
                        >
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : null}

                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "stackingChecks") {
              const checkedCount = Math.max(
                0,
                Math.min(Number(stackingChecksById?.[feature.id]) || 0, feature?.maxChecks || 10)
              );
              const maxChecks = Math.max(1, Math.min(Number(feature?.maxChecks) || 10, 10));
              const totalBoxes = Math.min(checkedCount + 1, maxChecks);

              return (
                <>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#5d4037", mr: 0.5 }}>
                    DC {10 + (Number(stackingChecksById?.[feature.id]) || 0) * 5}
                  </Typography>
                  {Array.from({ length: totalBoxes }).map((_, idx) => (
                    <Checkbox
                      key={`${feature.id}:stack:${idx}`}
                      checked={idx < checkedCount}
                      onChange={(e) => {
                        const nextChecked = e.target.checked;
                        setStackingChecksById((prev) => {
                          const prevCount = Math.max(
                            0,
                            Math.min(Number(prev?.[feature.id]) || 0, maxChecks)
                          );
                          if (nextChecked) {
                            if (idx !== prevCount) return prev;
                            if (prevCount >= maxChecks) return prev;
                            return { ...prev, [feature.id]: prevCount + 1 };
                          }
                          if (idx >= prevCount) return prev;
                          return { ...prev, [feature.id]: Math.max(0, prevCount - 1) };
                        });
                      }}
                      size="small"
                      sx={{
                        ml: idx === 0 ? 0.25 : 0,
                        p: 0.25,
                        color: "#8B4513",
                        "&.Mui-checked": { color: "#8B4513" },
                      }}
                    />
                  ))}
                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "divineInterventionCooldown") {
              const cooldownDays = Math.max(0, Math.min(Number(tracker?.cooldownDays) || 0, 7));
              const cooldownActive = Boolean(tracker?.cooldownActive);
              const needsLongRest = Boolean(tracker?.needsLongRest);

              const statusLabel = cooldownActive
                ? `Cooldown: ${cooldownDays}/7`
                : needsLongRest
                  ? "Used (needs long rest)"
                  : cooldownDays >= 7
                    ? "Ready (7 days)"
                    : "Ready";

              const statusColor = cooldownActive
                ? "#7c2d12"
                : needsLongRest
                  ? "#075985"
                  : "#0f766e";

              return (
                <>
                  <Typography
                    sx={{
                      ml: 0.5,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: statusColor,
                      px: 1,
                      py: 0.25,
                      borderRadius: "10px",
                      border: `1px solid ${cooldownActive ? "rgba(124, 45, 18, 0.35)" : needsLongRest ? "rgba(7, 89, 133, 0.35)" : "rgba(15, 118, 110, 0.35)"}`,
                      background: cooldownActive
                        ? "rgba(252, 165, 165, 0.20)"
                        : needsLongRest
                          ? "rgba(186, 230, 253, 0.25)"
                          : "rgba(167, 243, 208, 0.20)",
                    }}
                  >
                    {statusLabel}
                  </Typography>

                  {cooldownActive ? (
                    <>
                      <Tooltip arrow title="Decrement cooldown day">
                        <IconButton
                          size="small"
                          aria-label="Decrement Divine Intervention cooldown day"
                          onClick={() => setTracker({ cooldownDays: Math.max(0, cooldownDays - 1) })}
                          sx={{ ml: 0.25, p: 0.25 }}
                        >
                          <RemoveIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow title="Increment cooldown day">
                        <IconButton
                          size="small"
                          aria-label="Increment Divine Intervention cooldown day"
                          onClick={() => {
                            const next = Math.min(7, cooldownDays + 1);
                            setTracker({ cooldownDays: next, cooldownActive: next < 7 });
                          }}
                          sx={{ p: 0.25 }}
                        >
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : needsLongRest ? (
                    <Tooltip arrow title="Mark long rest completed (feature ready)">
                      <IconButton
                        size="small"
                        aria-label="Clear Divine Intervention long-rest lockout"
                        onClick={() => setTracker({ needsLongRest: false })}
                        sx={{ ml: 0.25, p: 0.25 }}
                      >
                        <CheckIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  ) : null}

                  <Tooltip arrow title="Log a failed attempt (recharges after a long rest)">
                    <IconButton
                      size="small"
                      aria-label="Divine Intervention attempt failed"
                      onClick={() =>
                        setTracker({ needsLongRest: true, cooldownActive: false, cooldownDays: 0 })
                      }
                      sx={{ ml: 0.25, p: 0.25, opacity: 0.9 }}
                    >
                      <Typography sx={{ fontSize: "11px", fontWeight: 800 }}>F</Typography>
                    </IconButton>
                  </Tooltip>

                  <Tooltip arrow title="Log a successful intervention (7-day cooldown)">
                    <IconButton
                      size="small"
                      aria-label="Divine Intervention attempt succeeded"
                      onClick={() =>
                        setTracker({ cooldownActive: true, cooldownDays: 0, needsLongRest: false })
                      }
                      sx={{ ml: 0.25, p: 0.25, opacity: 0.9 }}
                    >
                      <Typography sx={{ fontSize: "11px", fontWeight: 800 }}>S</Typography>
                    </IconButton>
                  </Tooltip>

                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "poolDropdown") {
              const maxPool = (() => {
                if (feature?.poolMax === "fighter_level") return Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                if (feature?.poolMax === "druid_level") return Math.max(0, Math.trunc(Number(druidLevel) || 0));
                if (feature?.poolMax === "paladin_level") return Math.max(0, Math.trunc(Number(paladinLevel) || 0));
                if (feature?.poolMax === "paladin_level_x5") return Math.max(0, Math.trunc(Number(paladinLevel) || 0)) * 5;
                if (feature?.poolMax === "character_level") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
                if (typeof feature?.poolMax === "number" && Number.isFinite(feature.poolMax)) {
                  return Math.max(0, Math.trunc(feature.poolMax));
                }
                return 0;
              })();

              const valueKey = String(feature?.poolKey || "poolRemaining");
              const current = clampInt(tracker?.[valueKey] ?? maxPool, 0, maxPool);
              const options = Array.from({ length: maxPool + 1 }).map((_, idx) => maxPool - idx);

              return (
                <>
                  <FormControl variant="standard" sx={{ ml: 0.5, minWidth: 52 }}>
                    <Select
                      value={current}
                      onChange={(e) =>
                        setTracker({ [valueKey]: clampInt(e.target.value, 0, maxPool) })
                      }
                      disableUnderline
                      size="small"
                      sx={{
                        fontSize: "12px",
                        fontWeight: 800,
                        color: "#5d4037",
                        "& .MuiSelect-select": { py: 0, pr: 3 },
                      }}
                    >
                      {options.map((n) => (
                        <MenuItem key={`${feature.id}:pool:${n}`} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#5d4037" }}>
                    /{maxPool}
                  </Typography>

                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "poolInput") {
              const maxPool = (() => {
                if (feature?.poolMax === "fighter_level") return Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                if (feature?.poolMax === "druid_level") return Math.max(0, Math.trunc(Number(druidLevel) || 0));
                if (feature?.poolMax === "paladin_level") return Math.max(0, Math.trunc(Number(paladinLevel) || 0));
                if (feature?.poolMax === "paladin_level_x5") return Math.max(0, Math.trunc(Number(paladinLevel) || 0)) * 5;
                if (feature?.poolMax === "character_level") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
                if (typeof feature?.poolMax === "number" && Number.isFinite(feature.poolMax)) {
                  return Math.max(0, Math.trunc(feature.poolMax));
                }
                return 0;
              })();

              const valueKey = String(feature?.poolKey || "poolRemaining");
              const current = clampInt(tracker?.[valueKey] ?? maxPool, 0, maxPool);

              return (
                <>
                  <TextField
                    value={String(current)}
                    onChange={(e) => {
                      const raw = String(e.target.value ?? "");
                      if (raw.trim() === "") {
                        setTracker({ [valueKey]: 0 });
                        return;
                      }
                      const parsed = Number(raw);
                      if (!Number.isFinite(parsed)) return;
                      setTracker({ [valueKey]: clampInt(parsed, 0, maxPool) });
                    }}
                    variant="standard"
                    size="small"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      style: { textAlign: "right" },
                    }}
                    sx={{
                      ml: 0.5,
                      width: 44,
                      "& .MuiInputBase-root": {
                        px: 0,
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "12px",
                        fontWeight: 800,
                        color: "#5d4037",
                        p: 0,
                        pr: 0.25,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#5d4037" }}>
                    /{maxPool}
                  </Typography>
                  {extraTrailing}
                </>
              );
            }

            if (usesCount === "unlimited") {
              return (
                <>
                  <Typography
                    sx={{
                      ml: 0.5,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#5d4037",
                      px: 1,
                      py: 0.25,
                      borderRadius: "10px",
                      border: "1px solid rgba(93, 64, 55, 0.35)",
                      background: "rgba(244, 233, 221, 0.65)",
                    }}
                  >
                    Unlimited
                  </Typography>
                  {extraTrailing}
                </>
              );
            }

            if (sharedPoolKey) {
              const poolSpentBy = String(poolTracker?.spentBy || "");
              const isUsedByThis = poolSpentBy === String(feature?.id || "");
              const isUsedByOther = Boolean(poolSpentBy) && !isUsedByThis;

              return (
                <>
                  {Array.from({ length: usesCount }).map((_, idx) => (
                    idx === 0 && isUsedByOther ? (
                      <Tooltip arrow title="Channel Divinity only has 1 use per short or long rest.">
                        <span>
                          <Checkbox
                            key={`${feature.id}:pooluse:${idx}`}
                            checked={isUsedByThis}
                            disabled
                            onChange={() => {}}
                            size="small"
                            sx={{
                              ml: 0.25,
                              p: 0.25,
                              color: "#8B4513",
                              "&.Mui-checked": { color: "#8B4513" },
                            }}
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <Checkbox
                        key={`${feature.id}:pooluse:${idx}`}
                        checked={idx === 0 ? isUsedByThis : false}
                        disabled={idx === 0 ? isUsedByOther : true}
                        onChange={(e) => {
                          if (idx !== 0) return;
                          if (isUsedByOther) return;
                          const nextChecked = Boolean(e.target.checked);
                          setPoolTracker({ spentBy: nextChecked ? String(feature?.id || "") : null });
                        }}
                        size="small"
                        sx={{
                          ml: idx === 0 ? 0.25 : 0,
                          p: 0.25,
                          color: "#8B4513",
                          "&.Mui-checked": { color: "#8B4513" },
                        }}
                      />
                    )
                  ))}
                  {extraTrailing}
                </>
              );
            }

            const spentUses = clampInt(tracker?.spentUses ?? 0, 0, typeof usesCount === "number" ? usesCount : 0);

            return (
              <>
                {Array.from({ length: usesCount }).map((_, idx) => (
                  <Checkbox
                    key={`${feature.id}:use:${idx}`}
                    checked={idx < spentUses}
                    onChange={(e) => {
                      const nextChecked = Boolean(e.target.checked);
                      if (nextChecked) {
                        if (idx !== spentUses) return;
                        setTracker({ spentUses: clampInt(spentUses + 1, 0, usesCount) });
                        return;
                      }
                      if (idx >= spentUses) return;
                      setTracker({ spentUses: clampInt(spentUses - 1, 0, usesCount) });
                    }}
                    size="small"
                    sx={{
                      ml: idx === 0 ? 0.25 : 0,
                      p: 0.25,
                      color: "#8B4513",
                      "&.Mui-checked": { color: "#8B4513" },
                    }}
                  />
                ))}
                {feature?.allowExtraUses ? (
                  <>
                    <Tooltip arrow title="Decrease bonus uses">
                      <span>
                        <IconButton
                          size="small"
                          aria-label="Decrease bonus uses"
                          onClick={() => {
                            const nextBonus = Math.max(0, extraUses - 1);
                            const nextMaxUses = Math.max(0, baseUsesCount + nextBonus);
                            setTracker({
                              extraUses: nextBonus,
                              spentUses: clampInt(spentUses, 0, nextMaxUses),
                            });
                          }}
                          disabled={extraUses <= 0}
                          sx={{ ml: 0.25, p: 0.25 }}
                        >
                          <RemoveIcon fontSize="inherit" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#5d4037" }}>
                      +{extraUses}
                    </Typography>
                    <Tooltip arrow title="Increase bonus uses">
                      <IconButton
                        size="small"
                        aria-label="Increase bonus uses"
                        onClick={() => setTracker({ extraUses: extraUses + 1 })}
                        sx={{ p: 0.25 }}
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : null}
                {extraTrailing}
              </>
            );
            }}
          />
        );
      })}

      {untrackedFeatures.length > 0 && (
        <Accordion
          disableGutters
          elevation={0}
          expanded={untrackedExpanded}
          onChange={(_, nextExpanded) => setUntrackedExpanded(nextExpanded)}
          sx={{
            backgroundColor: 'transparent',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { margin: 0 },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
            sx={{ minHeight: 28, px: 0.5, py: 0, '& .MuiAccordionSummary-content': { margin: '2px 0' }, '&.Mui-expanded': { minHeight: 28 } }}
          >
            <Typography sx={{ fontSize: '13px', color: '#5d4037', flexGrow: 1, minWidth: 0 }}>
              {untrackedLabel || 'Other Features'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1, py: 0.5 }}>
            {untrackedFeatures.map((feature) => {
              const trailing = renderUntrackedTrailingControls
                ? renderUntrackedTrailingControls(feature)
                : null;
              const customHeader = renderDetailsHeaderForFeature ? renderDetailsHeaderForFeature(feature) : null;

              return (
                <FeatureAccordionRow
                  key={feature.id}
                  feature={feature}
                  detailsIdPrefix={`untracked-${title}`}
                  renderTrailingControls={trailing ? () => trailing : null}
                  renderDetailsHeader={customHeader ? () => customHeader : null}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

const FeaturesAndTrackables = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);
  const {
    characterClass,
    characterLevel,
    subclass,
    race,
    subrace,
    halfElfVersatility,
    fightingStyle,
    additionalFightingStyle,
  } = characterInfo;
  const { auth } = useContext(AuthContext);
  const token = auth?.token;
  const proficiencyBonusValue = proficiencyBonus[characterLevel] || 2;
  const charismaModValue = characterInfo?.stats?.cha?.mod ?? characterInfo?.stats?.charisma?.mod ?? 0;
  const wisdomModValue = characterInfo?.stats?.wis?.mod ?? characterInfo?.stats?.wisdom?.mod ?? 0;
  const strengthModValue = characterInfo?.stats?.str?.mod ?? characterInfo?.stats?.strength?.mod ?? 0;
  const constitutionModValue = characterInfo?.stats?.con?.mod ?? characterInfo?.stats?.constitution?.mod ?? 0;
  const druidLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.druid;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterClass === "druid") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
    return 0;
  }, [characterInfo?.classLevels?.druid, characterClass, characterLevel]);

  const fighterLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.fighter;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterClass === "fighter") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
    return 0;
  }, [characterInfo?.classLevels?.fighter, characterClass, characterLevel]);

  const paladinLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.paladin;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterClass === "paladin") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
    return 0;
  }, [characterInfo?.classLevels?.paladin, characterClass, characterLevel]);

  const [customFeatures, setCustomFeatures] = React.useState([]);
  const [addModal, setAddModal] = React.useState({ open: false, kind: "class" });
  const [manageModal, setManageModal] = React.useState({ open: false, kind: "class" });
  const [featureOverrides, setFeatureOverrides] = React.useState(() => loadFeatureOverrides());
  const [editingCustom, setEditingCustom] = React.useState(null);
  const [deletingCustom, setDeletingCustom] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);
  const [magicalSecretsModalOpen, setMagicalSecretsModalOpen] = React.useState(false);
  const [spiritSessionModalOpen, setSpiritSessionModalOpen] = React.useState(false);
  const [arcanaInitiateModalOpen, setArcanaInitiateModalOpen] = React.useState(false);
  const [arcaneMasteryModalOpen, setArcaneMasteryModalOpen] = React.useState(false);
  const [reaperCantripModalOpen, setReaperCantripModalOpen] = React.useState(false);
  const [acolyteOfNatureModalOpen, setAcolyteOfNatureModalOpen] = React.useState(false);
  const [arcaneArcherLoreCantripModalOpen, setArcaneArcherLoreCantripModalOpen] = React.useState(false);
  const [arcaneShotOptionsModalOpen, setArcaneShotOptionsModalOpen] = React.useState(false);
  const [battleMasterManeuversModalOpen, setBattleMasterManeuversModalOpen] = React.useState(false);
  const [additionalFightingStyleModalOpen, setAdditionalFightingStyleModalOpen] = React.useState(false);
  const [blessedWarriorCantripsModalOpen, setBlessedWarriorCantripsModalOpen] = React.useState(false);
  const [runeKnightRunesModalOpen, setRuneKnightRunesModalOpen] = React.useState(false);
  const [landTypeMenuAnchorEl, setLandTypeMenuAnchorEl] = React.useState(null);

  const landDruidTypeOptions = React.useMemo(
    () => ["arctic", "coast", "desert", "forest", "grassland", "mountain", "swamp", "underdark"],
    []
  );

  React.useEffect(() => {
    const isLandDruid = characterClass === "druid" && subclass === "land";
    if (!isLandDruid) return;
    if (characterInfo?.druidLandType) return;
    if (landDruidTypeOptions.length === 0) return;

    setCharacterInfo((prev) => ({ ...prev, druidLandType: landDruidTypeOptions[0] }));
  }, [characterClass, subclass, characterInfo?.druidLandType, landDruidTypeOptions, setCharacterInfo]);

  const currentLandType = characterInfo?.druidLandType || landDruidTypeOptions[0] || "arctic";
  const isLandTypeMenuOpen = Boolean(landTypeMenuAnchorEl);
  const openLandTypeMenu = (e) => {
    e?.stopPropagation?.();
    setLandTypeMenuAnchorEl(e.currentTarget);
  };
  const closeLandTypeMenu = (e) => {
    e?.stopPropagation?.();
    setLandTypeMenuAnchorEl(null);
  };

  const hasAdditionalMagicalSecrets =
    characterClass === "bard" &&
    subclass === "lore" &&
    Number(characterLevel || 0) >= 6;

  const magicalSecretsCount = Array.isArray(characterInfo?.magicalSecretsPrepared)
    ? characterInfo.magicalSecretsPrepared.length
    : 0;

  const hasSpiritSession =
    characterClass === "bard" &&
    subclass === "spirits" &&
    Number(characterLevel || 0) >= 6;

  const spiritSessionCount = Array.isArray(characterInfo?.spiritSessionPrepared)
    ? characterInfo.spiritSessionPrepared.length
    : 0;

  const hasArcanaInitiate =
    characterClass === "cleric" &&
    subclass === "arcana" &&
    Number(characterLevel || 0) >= 1;

  const arcanaInitiateCount = Array.isArray(characterInfo?.arcanaInitiateCantrips)
    ? characterInfo.arcanaInitiateCantrips.length
    : 0;

  const hasArcaneMastery =
    characterClass === "cleric" &&
    subclass === "arcana" &&
    Number(characterLevel || 0) >= 17;

  const arcaneMasteryCount = Array.isArray(characterInfo?.arcaneMasterySpells)
    ? characterInfo.arcaneMasterySpells.length
    : 0;

  const hasReaper =
    characterClass === "cleric" &&
    subclass === "death" &&
    Number(characterLevel || 0) >= 1;

  const reaperCantripCount = characterInfo?.reaperCantrip?.index ? 1 : 0;

  const hasAcolyteOfNature =
    characterClass === "cleric" &&
    subclass === "nature" &&
    Number(characterLevel || 0) >= 1;

  const acolyteOfNatureCantripCount = characterInfo?.acolyteOfNatureCantrip?.index ? 1 : 0;

  const hasArcaneArcherLore =
    characterClass === "fighter" &&
    subclass === "arcaneArcher" &&
    Number(characterLevel || 0) >= 3;

  const arcaneArcherLoreCantripCount = characterInfo?.arcaneArcherLoreCantrip?.index ? 1 : 0;

  const hasBattleMaster =
    characterClass === "fighter" &&
    subclass === "battleMaster" &&
    Number(fighterLevel || 0) >= 3;

  const battleMasterManeuverCount = Array.isArray(characterInfo?.battleMasterManeuvers)
    ? characterInfo.battleMasterManeuvers.length
    : 0;

  const hasRuneKnight =
    characterClass === "fighter" &&
    subclass === "runeKnight" &&
    Number(fighterLevel || 0) >= 3;

  const runeKnightRuneCount = Array.isArray(characterInfo?.runeKnightRunes)
    ? characterInfo.runeKnightRunes.length
    : 0;

  const hasChampionAdditionalFightingStyle =
    characterClass === "fighter" &&
    subclass === "champion" &&
    Number(fighterLevel || 0) >= 10;

  const hasBlessedWarrior =
    characterClass === "paladin" &&
    String(fightingStyle || "") === "Blessed Warrior" &&
    Number(characterLevel || 0) >= 2;

  const hasDruidicWarrior =
    characterClass === "ranger" &&
    String(fightingStyle || "") === "Druidic Warrior" &&
    Number(characterLevel || 0) >= 2;

  const blessedWarriorCantripCount = Array.isArray(characterInfo?.blessedWarriorCantrips)
    ? characterInfo.blessedWarriorCantrips.length
    : 0;

  const additionalFightingStyleCount = additionalFightingStyle ? 1 : 0;

  const [rangerFavoredEnemyOptions, setRangerFavoredEnemyOptions] = React.useState([]);
  const [rangerNaturalExplorerOptions, setRangerNaturalExplorerOptions] = React.useState([]);
  const [rangerOptionsModal, setRangerOptionsModal] = React.useState({ open: false, kind: "" });

  React.useEffect(() => {
    if (!hasArcaneArcherLore) return;
    if (characterInfo?.arcaneArcherLoreCantrip?.index) return;
    setCharacterInfo((prev) => {
      if (prev?.arcaneArcherLoreCantrip?.index) return prev;
      return {
        ...prev,
        arcaneArcherLoreCantrip: {
          index: "prestidigitation",
          name: "Prestidigitation",
        },
      };
    });
  }, [hasArcaneArcherLore, characterInfo?.arcaneArcherLoreCantrip?.index, setCharacterInfo]);

  // Retrieve class data
  const classData = React.useMemo(() => classesData[characterClass] || {}, [characterClass]);
  const classFeatures = React.useMemo(() => {
    const all = classData.classFeatures || [];
    return all.filter((f) => f.level <= characterLevel);
  }, [classData.classFeatures, characterLevel]);

  // Placeholder data for subclass and racial/misc features
  const subclassData = React.useMemo(() => {
    return classesData[characterClass]?.subclasses?.[subclass]?.features || [];
  }, [characterClass, subclass]);
  const subclassFeatures = React.useMemo(() => {
    return (subclassData || []).filter((feature) => feature.level <= characterLevel);
  }, [subclassData, characterLevel]);

  const notAvailableFeature = React.useCallback(
    ({ id }) => ({
      id,
      name: "Not available yet",
      desc: "Not available yet",
      tracked: false,
      isPlaceholder: true,
    }),
    []
  );

  const raceData = React.useMemo(() => RaceFeaturesData?.[race] || null, [race]);

  const raceFeatures = React.useMemo(() => {
    const features = raceData?.features || null;
    const base = Array.isArray(features) ? [...features] : [];

    if (race === "Half Elf" && subrace === "Standard Half Elf" && halfElfVersatility) {
      const v = HalfElfVersatilityArr?.[halfElfVersatility] || null;
      if (v?.name) {
        base.push({
          id: `half_elf_versatility:${halfElfVersatility}`,
          name: v.name,
          desc: v.description || "",
          tracked: false,
        });
      }
    }

    if (base.length > 0) return base;
    return [notAvailableFeature({ id: "race:not_available" })];
  }, [raceData, race, subrace, halfElfVersatility, notAvailableFeature]);

  const subraceFeatures = React.useMemo(() => {
    const features = raceData?.subraceFeatures?.[subrace] || null;
    if (Array.isArray(features) && features.length > 0) return features;
    return [notAvailableFeature({ id: "subrace:not_available" })];
  }, [raceData, subrace, notAvailableFeature]);

  const miscCustomRaw = React.useMemo(() => {
    return (customFeatures || []).filter((f) => f.kind === "misc");
  }, [customFeatures]);

  const miscCustomForUi = React.useMemo(() => {
    return miscCustomRaw.map((f) => ({
      id: `custom:${f.id}`,
      apiId: f.id,
      name: f.name,
      desc: f.desc,
      tracked: Boolean(f.tracked),
      isCustom: true,
    }));
  }, [miscCustomRaw]);

  const miscFeatures = React.useMemo(() => {
    if (miscCustomForUi.length > 0) return miscCustomForUi;
    return [notAvailableFeature({ id: "misc:not_available" })];
  }, [miscCustomForUi, notAvailableFeature]);

  const handleManageRaceFeatures = React.useCallback(() => {
    window.alert("Not available yet");
  }, []);
  const handleManageSubraceFeatures = React.useCallback(() => {
    window.alert("Not available yet");
  }, []);
  const handleManageMiscFeatures = React.useCallback(() => {
    window.alert("Not available yet");
  }, []);

  React.useEffect(() => {
    if (!token) {
      setCustomFeatures([]);
      return;
    }

    axios
      .get("/custom-features", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCustomFeatures(res.data?.results || []))
      .catch(() => setCustomFeatures([]));
  }, [token]);

  const classOverrideKey = React.useMemo(
    () => getOverrideKey({ kind: "class", characterClass, subclass: "none" }),
    [characterClass]
  );
  const subclassOverrideKey = React.useMemo(
    () => getOverrideKey({ kind: "subclass", characterClass, subclass }),
    [characterClass, subclass]
  );

  const applyTrackedOverride = React.useCallback(
    ({ overrideKey, feature }) => {
      const override = getFeatureTrackedOverride(featureOverrides, overrideKey, feature.id);
      if (typeof override !== "boolean") return feature;
      return { ...feature, tracked: override };
    },
    [featureOverrides]
  );

  const isHidden = React.useCallback(
    ({ overrideKey, featureId }) => {
      const override = getFeatureHiddenOverride(featureOverrides, overrideKey, featureId);
      return Boolean(override);
    },
    [featureOverrides]
  );

  const allClassFeatures = React.useMemo(() => classData.classFeatures || [], [classData.classFeatures]);
  const allSubclassFeatures = React.useMemo(() => subclassData || [], [subclassData]);

  const classCustomRaw = React.useMemo(() => {
    return (customFeatures || []).filter((f) => f.kind === "class");
  }, [customFeatures]);
  const subclassCustomRaw = React.useMemo(() => {
    return (customFeatures || []).filter((f) => f.kind === "subclass");
  }, [customFeatures]);

  const classCustomForUi = React.useMemo(() => {
    return classCustomRaw.map((f) => ({
      id: `custom:${f.id}`,
      apiId: f.id,
      name: f.name,
      desc: f.desc,
      tracked: Boolean(f.tracked),
      isCustom: true,
    }));
  }, [classCustomRaw]);

  const subclassCustomForUi = React.useMemo(() => {
    return subclassCustomRaw.map((f) => ({
      id: `custom:${f.id}`,
      apiId: f.id,
      name: f.name,
      desc: f.desc,
      tracked: Boolean(f.tracked),
      isCustom: true,
    }));
  }, [subclassCustomRaw]);

  const managedClassFeatures = React.useMemo(() => {
    const base = (allClassFeatures || []).map((f) =>
      applyTrackedOverride({ overrideKey: classOverrideKey, feature: f })
    );
    return [...base, ...classCustomForUi];
  }, [allClassFeatures, applyTrackedOverride, classOverrideKey, classCustomForUi]);

  const managedSubclassFeatures = React.useMemo(() => {
    const base = (allSubclassFeatures || []).map((f) => {
      const next = applyTrackedOverride({ overrideKey: subclassOverrideKey, feature: f });
      if (next?.sharedUsePoolKey === "channel_divinity") return { ...next, tracked: true };
      return next;
    });
    return [...base, ...subclassCustomForUi];
  }, [allSubclassFeatures, applyTrackedOverride, subclassOverrideKey, subclassCustomForUi]);

  const visibleClassFeatures = React.useMemo(() => {
    const base = classFeatures
      .map((f) => applyTrackedOverride({ overrideKey: classOverrideKey, feature: f }))
      .filter((f) => !isHidden({ overrideKey: classOverrideKey, featureId: f.id }));

    if (characterClass === "fighter" && (fightingStyle || additionalFightingStyle)) {
      return base.map((feature) => {
        if (feature?.id !== "fighting_style") return feature;
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];
        const prefixes = [];
        if (fightingStyle) prefixes.push(`Class Fighting Style: ${fightingStyle}.`);
        if (additionalFightingStyle) prefixes.push(`Champion Fighting Style: ${additionalFightingStyle}.`);
        return {
          ...feature,
          desc: [...prefixes, ...descLines],
        };
      });
    }

    if (characterClass === "paladin" && fightingStyle) {
      const chosenCantrips = Array.isArray(characterInfo?.blessedWarriorCantrips)
        ? characterInfo.blessedWarriorCantrips
        : [];
      const chosenNames = chosenCantrips
        .map((s) => String(s?.name || "").trim())
        .filter(Boolean);

      return base.map((feature) => {
        if (feature?.id !== "fighting_style") return feature;
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];
        const prefixes = [`Fighting Style: ${fightingStyle}.`];
        if (hasBlessedWarrior) {
          prefixes.push(
            chosenNames.length > 0
              ? `Blessed Warrior cantrips: ${chosenNames.join(", ")}.`
              : "Blessed Warrior cantrips: Choose cantrips."
          );
        }
        return { ...feature, desc: [...prefixes, ...descLines] };
      });
    }

    if (characterClass === "ranger") {
      const favoredEnemies = Array.isArray(rangerFavoredEnemyOptions) ? rangerFavoredEnemyOptions : [];
      const favoredTerrains = Array.isArray(rangerNaturalExplorerOptions) ? rangerNaturalExplorerOptions : [];

      const chosenCantrips = Array.isArray(characterInfo?.druidicWarriorCantrips)
        ? characterInfo.druidicWarriorCantrips
        : [];
      const chosenNames = chosenCantrips
        .map((s) => String(s?.name || "").trim())
        .filter(Boolean);

      return base.map((feature) => {
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        if (feature?.id === "fighting_style") {
          const prefixes = fightingStyle ? [`Fighting Style: ${fightingStyle}.`] : [];
          if (hasDruidicWarrior) {
            prefixes.push(
              chosenNames.length > 0
                ? `Druidic Warrior cantrips: ${chosenNames.join(", ")}.`
                : "Druidic Warrior cantrips: Choose cantrips."
            );
          }
          return { ...feature, desc: [...prefixes, ...descLines] };
        }

        if (feature?.id === "favored_enemy") {
          const prefix =
            favoredEnemies.length > 0
              ? `Favored enemies: ${favoredEnemies.join(", ")}.`
              : "Favored enemies: (none selected).";
          return { ...feature, desc: [prefix, ...descLines] };
        }

        if (feature?.id === "natural_explorer") {
          const prefix =
            favoredTerrains.length > 0
              ? `Favored terrains: ${favoredTerrains.join(", ")}.`
              : "Favored terrains: (none selected).";
          return { ...feature, desc: [prefix, ...descLines] };
        }

        return feature;
      });
    }

    return base;
  }, [
    classFeatures,
    applyTrackedOverride,
    classOverrideKey,
    isHidden,
    characterClass,
    fightingStyle,
    additionalFightingStyle,
    characterInfo?.blessedWarriorCantrips,
    characterInfo?.druidicWarriorCantrips,
    hasBlessedWarrior,
    hasDruidicWarrior,
    rangerFavoredEnemyOptions,
    rangerNaturalExplorerOptions,
  ]);

  const visibleSubclassFeatures = React.useMemo(() => {
    const base = subclassFeatures
      .map((f) => applyTrackedOverride({ overrideKey: subclassOverrideKey, feature: f }))
      .filter((f) => !isHidden({ overrideKey: subclassOverrideKey, featureId: f.id }));

    let next = base.map((feature) => {
      if (feature?.sharedUsePoolKey === "channel_divinity") return { ...feature, tracked: true };
      return feature;
    });

    if (hasArcaneArcherLore) {
      const cantripName = characterInfo?.arcaneArcherLoreCantrip?.name || "";
      const displayName = cantripName ? `${cantripName} (Arcane Archer Lore)` : "Choose Cantrip (Arcane Archer Lore)";

      next = next.map((feature) => {
        if (feature?.id !== "arcane_archer_lore") return feature;
        return { ...feature, name: displayName };
      });
    }

    if (hasChampionAdditionalFightingStyle) {
      next = next.map((feature) => {
        if (feature?.id !== "additional_fighting_style") return feature;
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];
        const prefixes = [];
        if (fightingStyle) prefixes.push(`Class Fighting Style: ${fightingStyle}.`);
        if (additionalFightingStyle) {
          prefixes.push(`Champion Fighting Style: ${additionalFightingStyle}.`);
        } else {
          prefixes.push("Champion Fighting Style: Choose one.");
        }
        return { ...feature, desc: [...prefixes, ...descLines] };
      });
    }

    if (hasRuneKnight && Number(fighterLevel || 0) >= 15) {
      const runeList = classesData?.fighter?.subclasses?.runeKnight?.runes || [];
      const byId = new Map((Array.isArray(runeList) ? runeList : []).map((r) => [r?.id, r]));
      const selectedIds = Array.isArray(characterInfo?.runeKnightRunes) ? characterInfo.runeKnightRunes : [];

      const selectedRunes = selectedIds
        .map((id) => byId.get(id))
        .filter(Boolean)
        .sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));

      if (selectedRunes.length > 0) {
        const runeFeatures = selectedRunes.map((rune) => ({
          id: `rune_knight_rune:${rune.id}`,
          name: rune.name,
          desc: rune.desc,
          level: 15,
          tracked: true,
          uses: 2,
          recharge: "sr_or_lr",
        }));

        next = [...next, ...runeFeatures];
      }
    }

    return next;
  }, [
    subclassFeatures,
    applyTrackedOverride,
    subclassOverrideKey,
    isHidden,
    hasArcaneArcherLore,
    characterInfo?.arcaneArcherLoreCantrip?.name,
    hasChampionAdditionalFightingStyle,
    hasRuneKnight,
    characterInfo?.runeKnightRunes,
    fightingStyle,
    additionalFightingStyle,
    fighterLevel,
  ]);

  const classTrackedById = React.useMemo(() => {
    const map = {};
    (managedClassFeatures || []).forEach((f) => {
      map[f.id] = Boolean(f.tracked);
    });
    return map;
  }, [managedClassFeatures]);

  const subclassTrackedById = React.useMemo(() => {
    const map = {};
    (managedSubclassFeatures || []).forEach((f) => {
      map[f.id] = Boolean(f.tracked);
    });
    return map;
  }, [managedSubclassFeatures]);

  const classHiddenById = React.useMemo(() => {
    const map = {};
    (managedClassFeatures || []).forEach((f) => {
      map[f.id] = isHidden({ overrideKey: classOverrideKey, featureId: f.id });
    });
    return map;
  }, [managedClassFeatures, isHidden, classOverrideKey]);

  const subclassHiddenById = React.useMemo(() => {
    const map = {};
    (managedSubclassFeatures || []).forEach((f) => {
      map[f.id] = isHidden({ overrideKey: subclassOverrideKey, featureId: f.id });
    });
    return map;
  }, [managedSubclassFeatures, isHidden, subclassOverrideKey]);

  const visibleClassCustom = React.useMemo(() => {
    return classCustomForUi.filter((f) => !isHidden({ overrideKey: classOverrideKey, featureId: f.id }));
  }, [classCustomForUi, isHidden, classOverrideKey]);

  const visibleSubclassCustom = React.useMemo(() => {
    return subclassCustomForUi.filter(
      (f) => !isHidden({ overrideKey: subclassOverrideKey, featureId: f.id })
    );
  }, [subclassCustomForUi, isHidden, subclassOverrideKey]);

  const setOverrideAndPersist = React.useCallback((next) => {
    setFeatureOverrides(next);
    saveFeatureOverrides(next);
  }, []);

  const updateCustomFeatureTracked = React.useCallback(
    async ({ apiId, tracked }) => {
      if (!token) return;
      setCustomFeatures((prev) =>
        (prev || []).map((f) => (f.id === apiId ? { ...f, tracked: Boolean(tracked) } : f))
      );
      try {
        const res = await axios.put(
          `/custom-features/${apiId}`,
          { tracked: Boolean(tracked) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = res.data || null;
        if (!updated?.id) return;
        setCustomFeatures((prev) =>
          (prev || []).map((f) => (f.id === updated.id ? { ...f, ...updated } : f))
        );
      } catch {
        // ignore update failures (UI stays optimistic via state fallback on next fetch)
      }
    },
    [token]
  );

  return (
    <div>
	        <Grid container spacing={2}>
	          <Grid item xs={12} md={6}>
            <FeatureDisplay
              title="Class Features"
              addTooltip="Add custom Class Feature"
              onAdd={() => setAddModal({ open: true, kind: "class" })}
              manageTooltip="Manage which class features are tracked"
              onManage={() => setManageModal({ open: true, kind: "class" })}
              features={[...visibleClassFeatures, ...visibleClassCustom]}
              untrackedLabel="Untracked Class Features"
              renderUntrackedTrailingControls={(feature) => {
                if (characterClass !== "ranger") return null;
                if (feature?.id !== "favored_enemy" && feature?.id !== "natural_explorer") return null;

                const label =
                  feature?.id === "favored_enemy"
                    ? "Edit Favored Enemy options"
                    : "Edit Natural Explorer options";

                return (
                  <Tooltip arrow title={label}>
                    <IconButton
                      size="small"
                      aria-label={label}
                      onClick={() =>
                        setRangerOptionsModal({
                          open: true,
                          kind: feature.id === "favored_enemy" ? "favored_enemy" : "natural_explorer",
                        })
                      }
                      sx={{
                        ml: 0.25,
                        p: 0.25,
                        color: "rgba(93, 64, 55, 0.92)",
                        border: "1px solid rgba(93, 64, 55, 0.25)",
                        backgroundColor: "rgba(244, 233, 221, 0.65)",
                        "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                      }}
                    >
                      <BowIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                );
              }}
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              strengthModValue={strengthModValue}
              constitutionModValue={constitutionModValue}
              druidLevel={druidLevel}
              fighterLevel={fighterLevel}
              paladinLevel={paladinLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
              renderDetailsHeaderForFeature={() => null}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FeatureDisplay
              title="Subclass Features"
              addTooltip="Add custom Subclass Feature"
              onAdd={() => setAddModal({ open: true, kind: "subclass" })}
              manageTooltip="Manage which subclass features are tracked"
              onManage={() => setManageModal({ open: true, kind: "subclass" })}
              features={[...visibleSubclassFeatures, ...visibleSubclassCustom]}
              untrackedLabel="Untracked Subclass Features"
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              strengthModValue={strengthModValue}
              constitutionModValue={constitutionModValue}
              druidLevel={druidLevel}
              fighterLevel={fighterLevel}
              paladinLevel={paladinLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
              renderDetailsHeaderForFeature={(feature) => {
                if (hasBattleMaster && feature?.id === "combat_superiority_maneuvers") {
                  const strMod = characterInfo?.stats?.str?.mod ?? characterInfo?.stats?.strength?.mod ?? 0;
                  const dexMod = characterInfo?.stats?.dex?.mod ?? characterInfo?.stats?.dexterity?.mod ?? 0;
                  const dc = 8 + (Number(proficiencyBonusValue) || 2) + Math.max(Number(strMod) || 0, Number(dexMod) || 0);

                  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                  const allowed =
                    level < 3
                      ? 0
                      : 3 + (level >= 7 ? 2 : 0) + (level >= 10 ? 2 : 0) + (level >= 15 ? 2 : 0);

                  const selectedIds = Array.isArray(characterInfo?.battleMasterManeuvers)
                    ? characterInfo.battleMasterManeuvers
                    : [];

                  const allManeuvers = classesData?.fighter?.subclasses?.battleMaster?.maneuvers || [];
                  const byId = new Map((Array.isArray(allManeuvers) ? allManeuvers : []).map((m) => [m?.id, m]));
                  const selectedNames = selectedIds
                    .map((id) => byId.get(id)?.name || id)
                    .filter(Boolean);

                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Maneuver Save DC:</strong> {dc}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Selected maneuvers:</strong>{" "}
                        {selectedNames.length === 0 ? <em>None</em> : selectedNames.join(", ")} ({selectedNames.length}/{allowed})
                      </p>
                    </div>
                  );
                }

                if (hasRuneKnight && feature?.id === "rune_carver") {
                  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                  const allowed =
                    level < 3
                      ? 0
                      : 2 + (level >= 7 ? 1 : 0) + (level >= 10 ? 1 : 0) + (level >= 15 ? 1 : 0);

                  const selectedIds = Array.isArray(characterInfo?.runeKnightRunes)
                    ? characterInfo.runeKnightRunes
                    : [];

                  const allRunes = classesData?.fighter?.subclasses?.runeKnight?.runes || [];
                  const byId = new Map((Array.isArray(allRunes) ? allRunes : []).map((r) => [r?.id, r]));
                  const selectedNames = selectedIds
                    .map((id) => byId.get(id)?.name || id)
                    .filter(Boolean);

                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Selected runes:</strong>{" "}
                        {selectedNames.length === 0 ? <em>None</em> : selectedNames.join(", ")} ({selectedNames.length}/{allowed})
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Tracking:</strong>{" "}
                        {level >= 15 ? "Runes are tracked (2 uses each)." : "Runes are not tracked until Master of Runes (Fighter 15)."}
                      </p>
                    </div>
                  );
                }

                if (hasArcaneArcherLore && feature?.id === "arcane_shot") {
                  const intMod = characterInfo?.stats?.int?.mod ?? 0;
                  const dc = 8 + (Number(proficiencyBonusValue) || 2) + (Number(intMod) || 0);
                  const selectedIds = Array.isArray(characterInfo?.arcaneShotOptions) ? characterInfo.arcaneShotOptions : [];
                  const bonusSlots = Math.max(0, Math.trunc(Number(characterInfo?.arcaneShotBonusOptions) || 0));
                  const level = Math.max(0, Math.trunc(Number(characterLevel) || 0));
                  const baseAllowed =
                    level < 3
                      ? 0
                      : 2 + (level >= 7 ? 1 : 0) + (level >= 10 ? 1 : 0) + (level >= 15 ? 1 : 0) + (level >= 18 ? 1 : 0);
                  const allowed = baseAllowed + bonusSlots;

                  const allOptions = classesData?.fighter?.subclasses?.arcaneArcher?.arcaneShotOptions || [];
                  const byId = new Map((Array.isArray(allOptions) ? allOptions : []).map((o) => [o?.id, o]));
                  const selectedNames = selectedIds
                    .map((id) => byId.get(id)?.name || id)
                    .filter(Boolean);

                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Arcane Shot DC:</strong> {dc}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Selected options:</strong>{" "}
                        {selectedNames.length === 0 ? <em>None</em> : selectedNames.join(", ")} ({selectedNames.length}/{allowed})
                      </p>
                    </div>
                  );
                }

                if (hasArcaneArcherLore && feature?.id === "arcane_archer_lore") {
                  const cantrip = characterInfo?.arcaneArcherLoreCantrip || null;
                  if (!cantrip?.index) return null;
                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Chosen cantrip:</strong>
                      </p>
                      <SpellAccordian numericalSpellLevel={0} spell={cantrip} />
                    </div>
                  );
                }

                return null;
              }}
              renderTrackedTrailingControls={(feature) => {
                if (hasRuneKnight && feature?.id === "rune_carver") {
                  const selectedCount = runeKnightRuneCount;
                  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                  const allowed =
                    level < 3
                      ? 0
                      : 2 + (level >= 7 ? 1 : 0) + (level >= 10 ? 1 : 0) + (level >= 15 ? 1 : 0);
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose runes (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose runes"
                        onClick={() => setRuneKnightRunesModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasArcaneArcherLore && feature?.id === "arcane_shot") {
                  const selectedCount = Array.isArray(characterInfo?.arcaneShotOptions)
                    ? characterInfo.arcaneShotOptions.length
                    : 0;
                  const bonusSlots = Math.max(0, Math.trunc(Number(characterInfo?.arcaneShotBonusOptions) || 0));
                  const level = Math.max(0, Math.trunc(Number(characterLevel) || 0));
                  const baseAllowed =
                    level < 3
                      ? 0
                      : 2 +
                        (level >= 7 ? 1 : 0) +
                        (level >= 10 ? 1 : 0) +
                        (level >= 15 ? 1 : 0) +
                        (level >= 18 ? 1 : 0);
                  const allowed = baseAllowed + bonusSlots;
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose Arcane Shot options (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Arcane Shot options"
                        onClick={() => setArcaneShotOptionsModalOpen(true)}
                        sx={{
                          ml: 0.5,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(15, 118, 110, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(244, 233, 221, 0.65)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver
                              ? "rgba(194, 65, 12, 0.14)"
                              : isUnder
                                ? "rgba(244, 233, 221, 0.85)"
                                : "rgba(20, 184, 166, 0.14)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (!hasSpiritSession) return null;
                if (feature?.id !== "spirit_session") return null;

                const isOver = spiritSessionCount > 1;
                const isUnder = spiritSessionCount < 1;

                return (
                  <Tooltip arrow title={`Choose Spirit Session Spell (${spiritSessionCount}/1)`}>
                    <IconButton
                      size="small"
                      aria-label="Choose Spirit Session Spell"
                      onClick={() => setSpiritSessionModalOpen(true)}
                      sx={{
                        ml: 0.5,
                        p: 0.25,
                        color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                        border: "1px solid rgba(15, 118, 110, 0.25)",
                        backgroundColor: isOver
                          ? "rgba(194, 65, 12, 0.10)"
                          : isUnder
                            ? "rgba(244, 233, 221, 0.65)"
                            : "rgba(20, 184, 166, 0.10)",
                        "&:hover": {
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.14)"
                            : isUnder
                              ? "rgba(244, 233, 221, 0.85)"
                              : "rgba(20, 184, 166, 0.14)",
                        },
                      }}
                    >
                      <MenuBookIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                );
              }}
		              renderUntrackedTrailingControls={(feature) => {
                if (hasBlessedWarrior && feature?.id === "fighting_style") {
                  const isOver = blessedWarriorCantripCount > 2;
                  const isUnder = blessedWarriorCantripCount < 2;

                  return (
                    <Tooltip arrow title={`Choose Blessed Warrior cantrips (${blessedWarriorCantripCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Blessed Warrior cantrips"
                        onClick={() => setBlessedWarriorCantripsModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasRuneKnight && feature?.id === "rune_carver") {
                  const selectedCount = runeKnightRuneCount;
                  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                  const allowed =
                    level < 3
                      ? 0
                      : 2 + (level >= 7 ? 1 : 0) + (level >= 10 ? 1 : 0) + (level >= 15 ? 1 : 0);
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose runes (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose runes"
                        onClick={() => setRuneKnightRunesModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasChampionAdditionalFightingStyle && feature?.id === "additional_fighting_style") {
                  const selectedCount = additionalFightingStyleCount;
                  const isOver = selectedCount > 1;
                  const isUnder = selectedCount < 1;

                  return (
                    <Tooltip arrow title={`Choose fighting style (${selectedCount}/1)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose additional fighting style"
                        onClick={() => setAdditionalFightingStyleModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <SwordIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasBattleMaster && feature?.id === "combat_superiority_maneuvers") {
                  const selectedCount = battleMasterManeuverCount;
                  const level = Math.max(0, Math.trunc(Number(fighterLevel) || 0));
                  const allowed =
                    level < 3
                      ? 0
                      : 3 + (level >= 7 ? 2 : 0) + (level >= 10 ? 2 : 0) + (level >= 15 ? 2 : 0);
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose maneuvers (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose maneuvers"
                        onClick={() => setBattleMasterManeuversModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <SwordIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasArcaneArcherLore && feature?.id === "arcane_archer_lore") {
                  const isOver = arcaneArcherLoreCantripCount > 1;
                  const isUnder = arcaneArcherLoreCantripCount < 1;
                  return (
                    <Tooltip arrow title={`Choose Arcane Archer Lore cantrip (${arcaneArcherLoreCantripCount}/1)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Arcane Archer Lore cantrip"
                        onClick={() => setArcaneArcherLoreCantripModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasAdditionalMagicalSecrets && feature?.id === "additional_magical_secrets") {
                  const isOver = magicalSecretsCount > 2;

                  return (
                    <Tooltip arrow title={`Choose Magical Secrets (${magicalSecretsCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Magical Secrets"
                        onClick={() => setMagicalSecretsModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : "#5d4037",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver ? "rgba(194, 65, 12, 0.10)" : "rgba(244, 233, 221, 0.65)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasReaper && feature?.id === "reaper") {
                  const isOver = reaperCantripCount > 1;
                  const isUnder = reaperCantripCount < 1;

                  return (
                    <Tooltip arrow title={`Choose Reaper cantrip (${reaperCantripCount}/1)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Reaper cantrip"
                        onClick={() => setReaperCantripModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasAcolyteOfNature && feature?.id === "acolyte_of_nature") {
                  const isOver = acolyteOfNatureCantripCount > 1;
                  const isUnder = acolyteOfNatureCantripCount < 1;

                  return (
                    <Tooltip arrow title={`Choose Acolyte of Nature cantrip (${acolyteOfNatureCantripCount}/1)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Acolyte of Nature cantrip"
                        onClick={() => setAcolyteOfNatureModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasArcanaInitiate && feature?.id === "arcane_initiate") {
                  const isOver = arcanaInitiateCount > 2;
                  const isUnder = arcanaInitiateCount < 2;

                  return (
                    <Tooltip arrow title={`Choose Arcana Initiate cantrips (${arcanaInitiateCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Arcana Initiate cantrips"
                        onClick={() => setArcanaInitiateModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

		                if (hasArcaneMastery && feature?.id === "arcane_mastery") {
                  const isOver = arcaneMasteryCount > 4;
                  const isUnder = arcaneMasteryCount < 4;

                  return (
                    <Tooltip arrow title={`Choose Arcane Mastery spells (${arcaneMasteryCount}/4)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Arcane Mastery spells"
                        onClick={() => setArcaneMasteryModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: isOver
                            ? "rgba(194, 65, 12, 0.10)"
                            : isUnder
                              ? "rgba(2, 132, 199, 0.10)"
                              : "rgba(20, 184, 166, 0.10)",
                          "&:hover": {
                            backgroundColor: isOver ? "rgba(194, 65, 12, 0.14)" : "rgba(244, 233, 221, 0.85)",
                          },
                        }}
                      >
                        <MenuBookIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
		                }

		                if (
		                  characterClass === "druid" &&
		                  subclass === "land" &&
		                  feature?.id === "land_circle_spells"
		                ) {
		                  const label = String(currentLandType || "arctic");
		                  const prettyLabel = label
		                    .split("-")
		                    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
		                    .join(" ");

		                  return (
		                    <Tooltip arrow title={`Land Type: ${prettyLabel} (click to change)`}>
		                      <IconButton
		                        size="small"
		                        aria-label="Choose Land Type"
		                        onClick={openLandTypeMenu}
		                        sx={{
		                          ml: 0.25,
		                          p: 0.25,
		                          color: "#5d4037",
		                          border: "1px solid rgba(93, 64, 55, 0.25)",
		                          backgroundColor: "rgba(244, 233, 221, 0.65)",
		                          "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
		                        }}
		                      >
		                        <MenuBookIcon fontSize="inherit" />
		                      </IconButton>
		                    </Tooltip>
		                  );
		                }

                return null;
              }}
            />
          </Grid>
	        </Grid>

	        {characterClass === "druid" && subclass === "land" ? (
	          <Menu
	            anchorEl={landTypeMenuAnchorEl}
	            open={isLandTypeMenuOpen}
	            onClose={closeLandTypeMenu}
	            onClick={(e) => e.stopPropagation()}
	          >
	            {landDruidTypeOptions.map((landType) => {
	              const pretty = String(landType || "")
	                .split("-")
	                .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
	                .join(" ");
	              const isSelected = String(currentLandType) === String(landType);

	              return (
	                <MenuItem
	                  key={`land-druid:menu:${landType}`}
	                  selected={isSelected}
	                  onClick={(e) => {
	                    e.stopPropagation();
	                    const nextLand = String(landType || "");
	                    setCharacterInfo((prev) => ({ ...prev, druidLandType: nextLand }));
	                    closeLandTypeMenu(e);
	                  }}
	                >
	                  {pretty}
	                </MenuItem>
	              );
	            })}
	          </Menu>
	        ) : null}
	
	        <Grid container spacing={2}>
	          <Grid item xs={12} md={4}>
	            <FeatureDisplay
              title="Race Features"
              manageTooltip="Manage which race features are tracked"
              onManage={handleManageRaceFeatures}
              features={raceFeatures}
              untrackedLabel="Untracked Race Features"
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              druidLevel={druidLevel}
              fighterLevel={fighterLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureDisplay
              title="Subrace Features"
              manageTooltip="Manage which subrace features are tracked"
              onManage={handleManageSubraceFeatures}
              features={subraceFeatures}
              untrackedLabel="Untracked Subrace Features"
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              druidLevel={druidLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureDisplay
              title="Miscellaneous Features"
              manageTooltip="Manage which miscellaneous features are tracked"
              onManage={handleManageMiscFeatures}
              features={miscFeatures}
              untrackedLabel="Untracked Miscellaneous Features"
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              druidLevel={druidLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
            />
          </Grid>
        </Grid>

      <AddFeatureModal
        open={addModal.open}
        kind={addModal.kind}
        onClose={() => setAddModal((s) => ({ ...s, open: false }))}
        onCreated={(created) => setCustomFeatures((prev) => [...prev, created])}
      />

      <ManageFeaturesModal
        open={manageModal.open && manageModal.kind === "class"}
        title="Manage Class Features"
        features={managedClassFeatures}
        trackedById={classTrackedById}
        hiddenById={classHiddenById}
        onChangeTracked={(featureId, tracked) => {
          if (String(featureId).startsWith("custom:")) {
            const apiId = String(featureId).slice("custom:".length);
            updateCustomFeatureTracked({ apiId, tracked });
          } else {
            const next = setFeatureTrackedOverride(featureOverrides, classOverrideKey, featureId, tracked);
            setOverrideAndPersist(next);
          }
        }}
        onChangeHidden={(featureId, hidden) => {
          const next = setFeatureHiddenOverride(featureOverrides, classOverrideKey, featureId, hidden);
          setOverrideAndPersist(next);
        }}
        onEdit={(f) => {
          if (!f?.isCustom) return;
          setEditingCustom({ ...f, kind: "class" });
        }}
        onDelete={(f) => {
          if (!f?.isCustom) return;
          setDeletingCustom({ ...f, kind: "class" });
        }}
        onClose={() => setManageModal((s) => ({ ...s, open: false }))}
      />

      <MagicalSecretsModal
        open={magicalSecretsModalOpen}
        onClose={() => setMagicalSecretsModalOpen(false)}
      />

      <SpiritSessionModal
        open={spiritSessionModalOpen}
        onClose={() => setSpiritSessionModalOpen(false)}
      />

      <ArcanaInitiateModal
        open={arcanaInitiateModalOpen}
        onClose={() => setArcanaInitiateModalOpen(false)}
      />

      <BlessedWarriorCantripsModal
        open={blessedWarriorCantripsModalOpen}
        onClose={() => setBlessedWarriorCantripsModalOpen(false)}
      />

      <ReaperCantripModal
        open={reaperCantripModalOpen}
        onClose={() => setReaperCantripModalOpen(false)}
      />

      <AcolyteOfNatureModal
        open={acolyteOfNatureModalOpen}
        onClose={() => setAcolyteOfNatureModalOpen(false)}
      />

      <ArcaneArcherLoreCantripModal
        open={arcaneArcherLoreCantripModalOpen}
        onClose={() => setArcaneArcherLoreCantripModalOpen(false)}
      />

      <ArcaneShotOptionsModal
        open={arcaneShotOptionsModalOpen}
        onClose={() => setArcaneShotOptionsModalOpen(false)}
      />

      <BattleMasterManeuversModal
        open={battleMasterManeuversModalOpen}
        onClose={() => setBattleMasterManeuversModalOpen(false)}
      />

      <AdditionalFightingStyleModal
        open={additionalFightingStyleModalOpen}
        onClose={() => setAdditionalFightingStyleModalOpen(false)}
      />

      <RuneKnightRunesModal
        open={runeKnightRunesModalOpen}
        onClose={() => setRuneKnightRunesModalOpen(false)}
      />

      <ArcaneMasteryModal
        open={arcaneMasteryModalOpen}
        onClose={() => setArcaneMasteryModalOpen(false)}
      />

      <ManageFeaturesModal
        open={manageModal.open && manageModal.kind === "subclass"}
        title="Manage Subclass Features"
        features={managedSubclassFeatures}
        trackedById={subclassTrackedById}
        hiddenById={subclassHiddenById}
        onChangeTracked={(featureId, tracked) => {
          if (String(featureId).startsWith("custom:")) {
            const apiId = String(featureId).slice("custom:".length);
            updateCustomFeatureTracked({ apiId, tracked });
          } else {
            const next = setFeatureTrackedOverride(featureOverrides, subclassOverrideKey, featureId, tracked);
            setOverrideAndPersist(next);
          }
        }}
        onChangeHidden={(featureId, hidden) => {
          const next = setFeatureHiddenOverride(featureOverrides, subclassOverrideKey, featureId, hidden);
          setOverrideAndPersist(next);
        }}
        onEdit={(f) => {
          if (!f?.isCustom) return;
          setEditingCustom({ ...f, kind: "subclass" });
        }}
        onDelete={(f) => {
          if (!f?.isCustom) return;
          setDeletingCustom({ ...f, kind: "subclass" });
        }}
        onClose={() => setManageModal((s) => ({ ...s, open: false }))}
      />

      <EditCustomFeatureModal
        open={Boolean(editingCustom)}
        feature={editingCustom}
        onClose={() => setEditingCustom(null)}
        onUpdated={(updated) => {
          if (!updated?.id) return;
          setCustomFeatures((prev) =>
            (prev || []).map((f) => (f.id === updated.id ? { ...f, ...updated } : f))
          );
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingCustom)}
        title="Delete Custom Feature?"
        body={deletingCustom ? `Delete “${deletingCustom.name}”? This cannot be undone.` : ""}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onConfirm={async () => {
          if (!deletingCustom?.apiId || !token || deleting) return;
          setDeleting(true);
          try {
            await axios.delete(`/custom-features/${deletingCustom.apiId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCustomFeatures((prev) => (prev || []).filter((f) => f.id !== deletingCustom.apiId));
            setDeletingCustom(null);
          } catch {
            // ignore errors for now
          } finally {
            setDeleting(false);
          }
        }}
        onClose={() => {
          if (deleting) return;
          setDeletingCustom(null);
        }}
      />

      <UntrackedOptionsModal
        open={Boolean(rangerOptionsModal?.open)}
        onClose={() => setRangerOptionsModal({ open: false, kind: "" })}
        title={
          rangerOptionsModal?.kind === "favored_enemy"
            ? "Favored Enemy (Untracked)"
            : "Natural Explorer (Untracked)"
        }
        helperText="Add, edit, or remove your personal notes. These are not tracked as resources/uses."
        options={
          rangerOptionsModal?.kind === "favored_enemy"
            ? rangerFavoredEnemyOptions
            : rangerNaturalExplorerOptions
        }
        onChange={(next) => {
          if (rangerOptionsModal?.kind === "favored_enemy") setRangerFavoredEnemyOptions(next);
          if (rangerOptionsModal?.kind === "natural_explorer") setRangerNaturalExplorerOptions(next);
        }}
        maxLen={25}
      />
    </div>
  );
};

export default FeaturesAndTrackables;

