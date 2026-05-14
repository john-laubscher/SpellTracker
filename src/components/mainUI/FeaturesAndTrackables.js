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
  IconButton,
  Tooltip,
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
  addTooltip,
  onAdd,
  manageTooltip,
  onManage,
  proficiencyBonusValue,
  charismaModValue,
  wisdomModValue,
  characterClass,
  characterLevel,
}) => {
  const trackedFeatures = features.filter((feature) => feature.tracked);
  const untrackedFeatures = features.filter((feature) => !feature.tracked);
  const [showHeaderActions, setShowHeaderActions] = React.useState(false);
  const touchHideTimerRef = React.useRef(null);
  const [stackingChecksById, setStackingChecksById] = React.useState({});
  const [featureTrackers, setFeatureTrackers] = React.useState(() => loadFeatureTrackers());
  const [untrackedExpanded, setUntrackedExpanded] = React.useState(false);

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
    if (feature?.uses === "cha_mod") return Math.max(1, Number(charismaModValue) || 1);
    if (feature?.uses === "wis_mod") return Math.max(1, Number(wisdomModValue) || 1);
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

      {trackedFeatures.map((feature) => (
        <FeatureAccordionRow
          key={feature.id}
          feature={feature}
          detailsIdPrefix={`features-${title}`}
          renderDetailsHeader={
            feature?.trackedMode === "stackingChecks"
              ? () => (
                  <p style={{ margin: "2px 0" }}>
                    <strong>Current DC:</strong>{" "}
                    {10 + (Number(stackingChecksById?.[feature.id]) || 0) * 5}
                  </p>
                )
              : null
          }
          renderTrailingControls={() => {
            const extraTrailing = renderTrackedTrailingControls
              ? renderTrackedTrailingControls(feature)
              : null;
            const usesCount = getUsesCount(feature);
            const trackerKey = `${String(characterClass || "unknown")}:${String(feature?.id || "feature")}`;
            const tracker = featureTrackers?.[trackerKey] || {};

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

              const setTracker = (nextPartial) => {
                setFeatureTrackers((prev) => ({
                  ...(prev || {}),
                  [trackerKey]: {
                    ...(prev?.[trackerKey] || {}),
                    ...nextPartial,
                  },
                }));
              };

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

            return (
              <>
                {Array.from({ length: usesCount }).map((_, idx) => (
                  <Checkbox
                    key={`${feature.id}:use:${idx}`}
                    defaultChecked={false}
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
          }}
        />
      ))}

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

              return (
                <FeatureAccordionRow
                  key={feature.id}
                  feature={feature}
                  detailsIdPrefix={`untracked-${title}`}
                  renderTrailingControls={trailing ? () => trailing : null}
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
  const { characterInfo } = useContext(CharacterInfoContext);
  const { characterClass, characterLevel, subclass, race, subrace, halfElfVersatility } = characterInfo;
  const { auth } = useContext(AuthContext);
  const token = auth?.token;
  const proficiencyBonusValue = proficiencyBonus[characterLevel] || 2;
  const charismaModValue = characterInfo?.stats?.cha?.mod ?? characterInfo?.stats?.charisma?.mod ?? 0;
  const wisdomModValue = characterInfo?.stats?.wis?.mod ?? characterInfo?.stats?.wisdom?.mod ?? 0;

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
    const base = (allSubclassFeatures || []).map((f) =>
      applyTrackedOverride({ overrideKey: subclassOverrideKey, feature: f })
    );
    return [...base, ...subclassCustomForUi];
  }, [allSubclassFeatures, applyTrackedOverride, subclassOverrideKey, subclassCustomForUi]);

  const visibleClassFeatures = React.useMemo(() => {
    return classFeatures
      .map((f) => applyTrackedOverride({ overrideKey: classOverrideKey, feature: f }))
      .filter((f) => !isHidden({ overrideKey: classOverrideKey, featureId: f.id }));
  }, [classFeatures, applyTrackedOverride, classOverrideKey, isHidden]);

  const visibleSubclassFeatures = React.useMemo(() => {
    return subclassFeatures
      .map((f) => applyTrackedOverride({ overrideKey: subclassOverrideKey, feature: f }))
      .filter((f) => !isHidden({ overrideKey: subclassOverrideKey, featureId: f.id }));
  }, [subclassFeatures, applyTrackedOverride, subclassOverrideKey, isHidden]);

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
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              characterClass={characterClass}
              characterLevel={characterLevel}
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
              renderTrackedTrailingControls={(feature) => {
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

                return null;
              }}
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              wisdomModValue={wisdomModValue}
              characterClass={characterClass}
              characterLevel={characterLevel}
            />
          </Grid>
        </Grid>

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

      <ReaperCantripModal
        open={reaperCantripModalOpen}
        onClose={() => setReaperCantripModalOpen(false)}
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
    </div>
  );
};

export default FeaturesAndTrackables;

