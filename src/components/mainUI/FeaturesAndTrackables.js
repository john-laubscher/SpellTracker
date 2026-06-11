// This component renders the class features
// Will have a main/section that is always visible (default is tracked?) and expandable, which includes the rest of the relevant classfeatures as listed in ClassesData
// Subclass Features, Racial Features, and additional features (Feats, magic items, custom features, etc) will have their own sections/columns on the mainUI 

import React, { useContext } from "react";
import axios from "axios";
import {
  Box,
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
import CasinoIcon from "@mui/icons-material/Casino";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { AuthContext, CharacterInfoContext, FeatureTrackersContext } from "../../Contexts/Context"; // Adjust the path based on your project structure
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
import WarlockInvocationsModal from "./WarlockInvocationsModal";
import WarlockPactBoonModal from "./WarlockPactBoonModal";
import WarlockMysticArcanumModal from "./WarlockMysticArcanumModal";
import SpellAccordian from "./SpellAccordian";
import SwordIcon from "./SwordIcon";
import BowIcon from "./BowIcon";
import DragonHeadIcon from "./DragonHeadIcon";
import GenieLampIcon from "./GenieLampIcon";
import MagicSparklesIcon from "./MagicSparklesIcon";
import PactScrollIcon from "./PactScrollIcon";
import TotemAnimalIcon from "./TotemAnimalIcon";
import FeatureChoiceModal from "./FeatureChoiceModal";
import UntrackedOptionsModal from "./UntrackedOptionsModal";
import MetamagicOptionsModal from "./MetamagicOptionsModal";
import LunarEmbodimentPhaseModal from "./LunarEmbodimentPhaseModal";
import WildMagicSurgeTableModal from "./WildMagicSurgeTableModal";
import WizardSpellbookModal from "./WizardSpellbookModal";
import WizardSpellMasteryModal from "./WizardSpellMasteryModal";
import WizardSignatureSpellsModal from "./WizardSignatureSpellsModal";
import WizardMasterScrivinerModal from "./WizardMasterScrivinerModal";
import WizardOneWithTheWordModal from "./WizardOneWithTheWordModal";
import TiedScrollIcon from "./TiedScrollIcon";
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
import {
  getChoiceKey,
  getFeatureChoice,
  loadUntrackedFeatureChoices,
  saveUntrackedFeatureChoices,
  setFeatureChoice,
} from "../../utils/untrackedFeatureChoices";
import {
  getWarlockInvocationAllowance,
  getWarlockMysticArcanumExpectedTotal,
  getWarlockUnlockedArcanumLevels,
} from "../warlockOptionsData";
import { GENIE_KIND_OPTIONS, getGenieBenefitsSummaryLines, getGenieKindData } from "../../utils/genieData";

const getRogueSneakAttackDice = (rogueLevel) => {
  const level = Number(rogueLevel || 0);
  if (level >= 19) return "10d6";
  if (level >= 17) return "9d6";
  if (level >= 15) return "8d6";
  if (level >= 13) return "7d6";
  if (level >= 11) return "6d6";
  if (level >= 9) return "5d6";
  if (level >= 7) return "4d6";
  if (level >= 5) return "3d6";
  if (level >= 3) return "2d6";
  return "1d6";
};

const DIVINE_SOUL_AFFINITY_OPTIONS = [
  { id: "good", name: "Good", desc: "Affinity spell: Cure Wounds (DM spell; does not count against spells known)." },
  { id: "evil", name: "Evil", desc: "Affinity spell: Inflict Wounds (DM spell; does not count against spells known)." },
  { id: "law", name: "Law", desc: "Affinity spell: Bless (DM spell; does not count against spells known)." },
  { id: "chaos", name: "Chaos", desc: "Affinity spell: Bane (DM spell; does not count against spells known)." },
  {
    id: "neutrality",
    name: "Neutrality",
    desc: "Affinity spell: Protection from Evil and Good (DM spell; does not count against spells known).",
  },
];

const formatSpellCountLabel = (entry) => {
  const name = String(entry?.name || entry?.index || "Unknown Spell").trim() || "Unknown Spell";
  const count = Math.max(1, Number(entry?.count || 1));
  return count > 1 ? `${name} x${count}` : name;
};


const FeatureAccordionRow = ({
  feature,
  renderTrailingControls,
  detailsIdPrefix,
  renderDetailsHeader,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [inlineSpellState, setInlineSpellState] = React.useState({});
  const inlineSpellRequestControllersRef = React.useRef(new Map());

  const descLines = React.useMemo(() => {
    if (!feature) return [];
    if (Array.isArray(feature.desc)) return feature.desc;
    if (typeof feature.desc === "string") return [feature.desc];
    return [];
  }, [feature]);

  const activeInlineSpellIndexes = React.useMemo(() => {
    if (!inlineSpellState || typeof inlineSpellState !== "object") return [];
    return Object.keys(inlineSpellState).filter((idx) => inlineSpellState?.[idx]?.open);
  }, [inlineSpellState]);

  const handleInlineSpellToggle = React.useCallback(
    (spellIndex, spellName) => {
      const idx = String(spellIndex || "").trim();
      if (!idx) return;

      setInlineSpellState((prev) => {
        const cur = prev && typeof prev === "object" ? prev : {};
        const existing = cur[idx] || {};
        return {
          ...cur,
          [idx]: {
            ...existing,
            name: existing?.name || spellName || idx,
            open: !existing?.open,
          },
        };
      });
    },
    [setInlineSpellState]
  );

  React.useEffect(() => {
    const controllers = inlineSpellRequestControllersRef.current;
    return () => {
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, []);

  React.useEffect(() => {
    const openSet = new Set(activeInlineSpellIndexes);

    // Abort any in-flight requests for spells that were closed.
    inlineSpellRequestControllersRef.current.forEach((controller, spellIndex) => {
      if (!openSet.has(spellIndex)) {
        controller.abort();
        inlineSpellRequestControllersRef.current.delete(spellIndex);
      }
    });

    if (activeInlineSpellIndexes.length === 0) return;

    activeInlineSpellIndexes.forEach((spellIndex) => {
      const entry = inlineSpellState?.[spellIndex] || {};
      if (!entry?.open) return;
      if (entry?.details) return;
      if (entry?.loading) return;
      if (entry?.error) return;
      if (inlineSpellRequestControllersRef.current.has(spellIndex)) return;

      const controller = new AbortController();
      inlineSpellRequestControllersRef.current.set(spellIndex, controller);

      setInlineSpellState((prev) => ({
        ...(prev && typeof prev === "object" ? prev : {}),
        [spellIndex]: { ...(prev?.[spellIndex] || {}), loading: true, error: false },
      }));

      axios
        .get(`/singlespell/${spellIndex}`, { signal: controller.signal })
        .then((res) => {
          if (controller.signal.aborted) return;
          const details = res?.data || null;
          setInlineSpellState((prev) => ({
            ...(prev && typeof prev === "object" ? prev : {}),
            [spellIndex]: { ...(prev?.[spellIndex] || {}), details, loading: false, error: false },
          }));
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setInlineSpellState((prev) => ({
            ...(prev && typeof prev === "object" ? prev : {}),
            [spellIndex]: { ...(prev?.[spellIndex] || {}), loading: false, error: true },
          }));
        })
        .finally(() => {
          inlineSpellRequestControllersRef.current.delete(spellIndex);
        });
    });
  }, [activeInlineSpellIndexes, inlineSpellState]);

  const renderDescLine = React.useCallback(
    (line) => {
      const text = String(line ?? "");
      const pattern = /\[\[spell:([a-zA-Z0-9_-]+)\|([^\]]+)\]\]/g;

      let lastIdx = 0;
      let match = null;
      const parts = [];

      // eslint-disable-next-line no-cond-assign
      while ((match = pattern.exec(text))) {
        const fullMatch = match[0] || "";
        const spellIndex = String(match[1] || "").trim();
        const spellName = String(match[2] || "").trim() || spellIndex;
        const start = match.index || 0;

        if (start > lastIdx) parts.push(text.slice(lastIdx, start));

        parts.push(
          <span
            key={`spellref:${spellIndex}:${start}`}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              handleInlineSpellToggle(spellIndex, spellName);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              handleInlineSpellToggle(spellIndex, spellName);
            }}
            style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
          >
            {spellName}
          </span>
        );

        lastIdx = start + fullMatch.length;
      }

      if (lastIdx < text.length) parts.push(text.slice(lastIdx));
      return parts.length === 0 ? text : parts;
    },
    [handleInlineSpellToggle]
  );

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
            descLines.map((line, idx) => <p key={idx}>{renderDescLine(line)}</p>)
          )}

          {activeInlineSpellIndexes.map((spellIndex) => {
            const entry = inlineSpellState?.[spellIndex] || {};
            const details = entry?.details || null;
            const loading = entry?.loading === true;
            const error = entry?.error === true;
            const name = String(entry?.name || spellIndex);

            const desc = Array.isArray(details?.desc) ? details.desc : typeof details?.desc === "string" ? [details.desc] : [];
            const components = Array.isArray(details?.components)
              ? details.components.join(", ")
              : details?.components;

            return (
              <div
                key={`inline-spell:${spellIndex}`}
                style={{
                  marginTop: 8,
                  padding: "8px 10px",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ fontSize: 13 }}>{name}</strong>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => handleInlineSpellToggle(spellIndex, name)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      handleInlineSpellToggle(spellIndex, name);
                    }}
                    style={{ cursor: "pointer", textDecoration: "underline", fontSize: 12, opacity: 0.9 }}
                  >
                    Hide
                  </span>
                </div>

                {loading ? (
                  <p style={{ opacity: 0.7 }}>
                    <em>Loading spell details…</em>
                  </p>
                ) : null}
                {error ? (
                  <p style={{ opacity: 0.7 }}>
                    <em>Spell details unavailable.</em>
                  </p>
                ) : null}

                {details ? (
                  <>
                    <p>
                      <strong>Range:</strong> {details?.range}
                    </p>
                    <p>
                      <strong>Duration:</strong> {details?.duration}
                    </p>
                    <p>
                      <strong>Casting time:</strong> {details?.casting_time}
                    </p>
                    <p>
                      <strong>Components:</strong> {components}
                    </p>
                    {details?.concentration ? (
                      <p style={{ fontStyle: "italic" }}>
                        <strong>Concentration</strong>
                      </p>
                    ) : null}
                    {details?.ritual ? (
                      <p style={{ fontStyle: "italic" }}>
                        <strong>Ritual</strong>
                      </p>
                    ) : null}
                    {desc.map((d, i) => (
                      <p key={i}>{d}</p>
                    ))}
                  </>
                ) : null}
              </div>
            );
          })}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

// Reusable FeatureDisplay component
const FeatureDisplay = ({
  title,
  features,
  defaultUntrackedExpanded,
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
  intelligenceModValue,
  wisdomModValue,
  strengthModValue,
  constitutionModValue,
  druidLevel,
  fighterLevel,
  paladinLevel,
  sorcererLevel,
  warlockLevel,
  characterClass,
  characterLevel,
}) => {
  const { featureTrackers, setFeatureTrackers } = useContext(FeatureTrackersContext);
  const trackedFeatures = features.filter(
    (feature) => feature?.tracked || Boolean(feature?.sharedUsePoolKey)
  );
  const untrackedFeatures = features.filter(
    (feature) => !(feature?.tracked || Boolean(feature?.sharedUsePoolKey))
  );

  const featureSetKey = React.useMemo(() => {
    const ids = (Array.isArray(features) ? features : [])
      .map((f) => String(f?.id || "").trim())
      .filter(Boolean)
      .sort()
      .join("|");
    return `${String(title || "")}:${ids}`;
  }, [features, title]);
  const [showHeaderActions, setShowHeaderActions] = React.useState(false);
  const touchHideTimerRef = React.useRef(null);
  // Track whether the user manually toggled the untracked section (so we don't auto-collapse it later).
  const [untrackedTouched, setUntrackedTouched] = React.useState(false);
  const [untrackedExpanded, setUntrackedExpanded] = React.useState(
    typeof defaultUntrackedExpanded === "boolean"
      ? defaultUntrackedExpanded
      : trackedFeatures.length === 0 && untrackedFeatures.length > 0
  );
  const [lastFeatureSetKey, setLastFeatureSetKey] = React.useState(featureSetKey);
  const [activeDicePoolEditorKey, setActiveDicePoolEditorKey] = React.useState(null);

  React.useEffect(() => {
    return () => {
      if (touchHideTimerRef.current) window.clearTimeout(touchHideTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (featureSetKey === lastFeatureSetKey) return;
    setLastFeatureSetKey(featureSetKey);
    if (!untrackedTouched) {
      setUntrackedExpanded(
        typeof defaultUntrackedExpanded === "boolean"
          ? defaultUntrackedExpanded
          : trackedFeatures.length === 0 && untrackedFeatures.length > 0
      );
    }
  }, [
    featureSetKey,
    lastFeatureSetKey,
    trackedFeatures.length,
    untrackedFeatures.length,
    untrackedTouched,
    defaultUntrackedExpanded,
  ]);

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
    if (feature?.uses === "int_mod") {
      const minUses = Math.max(0, Math.trunc(Number(feature?.minUses) || 0));
      return Math.max(minUses, Math.trunc(Number(intelligenceModValue) || 0));
    }
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

  const getStackingChecksSummary = React.useCallback((feature, checkedCount) => {
    const safeCount = Math.max(0, Math.trunc(Number(checkedCount) || 0));
    if (String(feature?.stackingVariant || "") === "overchannelDamage") {
      return {
        compactLabel: safeCount <= 0 ? "No self-dmg" : `${safeCount + 1}d12/level`,
        detailHeader: (
          <>
            <p style={{ margin: "2px 0" }}>
              <strong>Current self-damage:</strong>{" "}
              {safeCount <= 0 ? "No damage yet." : `${safeCount + 1}d12 necrotic per spell level.`}
            </p>
            <p style={{ margin: "2px 0" }}>
              <strong>Tracking:</strong> First use is free. Check one box for each additional use before a long rest.
            </p>
          </>
        ),
      };
    }

    return {
      compactLabel: `DC ${10 + safeCount * 5}`,
      detailHeader: (
        <p style={{ margin: "2px 0" }}>
          <strong>Current DC:</strong> {10 + safeCount * 5}
        </p>
      ),
    };
  }, []);

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
        const trackerKey = `${String(characterClass || "unknown")}:${String(feature?.id || "feature")}`;
        const tracker = featureTrackers?.[trackerKey] || {};
        const stackingCheckedCount =
          feature?.trackedMode === "stackingChecks"
            ? Math.max(0, Math.min(Number(tracker?.stackingCount) || 0, Number(feature?.maxChecks) || 10))
            : 0;
        const stackingSummary =
          feature?.trackedMode === "stackingChecks"
            ? getStackingChecksSummary(feature, stackingCheckedCount)
            : null;
        const stackingHeader = stackingSummary?.detailHeader || null;

        const customHeader = renderDetailsHeaderForFeature
          ? renderDetailsHeaderForFeature(feature, { featureTrackers, setFeatureTrackers })
          : null;
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
                if (feature?.trackedLevelSource === "warlock_level") return Math.max(0, Math.trunc(Number(warlockLevel) || 0));
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
                if (feature?.poolSize === "warlock_level") return Math.max(0, Math.trunc(Number(warlockLevel) || 0));
                if (feature?.poolSize === "warlock_level_plus_one") {
                  return Math.max(0, Math.trunc(Number(warlockLevel) || 0)) + 1;
                }
                if (feature?.poolSize === "pb") return Math.max(0, Math.trunc(Number(proficiencyBonusValue) || 0));
                if (feature?.poolSize === "pbx2") return Math.max(0, Math.trunc(Number(proficiencyBonusValue) || 0)) * 2;
                return Math.max(0, Math.trunc(levelValue));
              })();

              const poolBonusRaw = feature?.allowExtraDicePool ? tracker?.poolBonus : 0;
              const poolBonus = feature?.allowExtraDicePool ? clampInt(poolBonusRaw ?? 0, -20, 20) : 0;
              const poolOverride = feature?.allowPoolSizeOverride
                ? clampInt(tracker?.poolMaxOverride ?? basePoolMax, 0, 99)
                : null;
              const poolMax = Math.max(
                0,
                Math.trunc(feature?.allowPoolSizeOverride ? poolOverride : basePoolMax + poolBonus)
              );

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

                  {feature?.allowExtraDicePool && !feature?.allowPoolSizeOverride ? (
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

            if (feature?.trackedMode === "phaseCheckboxes") {
              const phases = [
                { id: "full", label: "Full" },
                { id: "new", label: "New" },
                { id: "crescent", label: "Crescent" },
              ];

              const phaseUsedRaw = tracker?.phaseUsed;
              const phaseUsed =
                phaseUsedRaw && typeof phaseUsedRaw === "object" ? phaseUsedRaw : {};

              const setPhase = (phaseId, checked) => {
                setTracker({
                  phaseUsed: {
                    ...phaseUsed,
                    [phaseId]: Boolean(checked),
                  },
                });
              };

              return (
                <>
                  {phases.map((phase) => {
                    const checked = Boolean(phaseUsed?.[phase.id]);
                    return (
                      <Box
                        key={`${trackerKey}:phase:${phase.id}`}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ display: "flex", alignItems: "center", ml: 0.5 }}
                      >
                        <Typography sx={{ fontSize: "11px", fontWeight: 800, opacity: 0.75, mr: 0.25 }}>
                          {phase.label}
                        </Typography>
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={(e) => setPhase(phase.id, e.target.checked)}
                          sx={{
                            p: 0.25,
                            "& .MuiSvgIcon-root": { fontSize: 18 },
                          }}
                        />
                      </Box>
                    );
                  })}

                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "stackingChecks") {
              const checkedCount = stackingCheckedCount;
              const maxChecks = Math.max(1, Math.min(Number(feature?.maxChecks) || 10, 10));
              const totalBoxes = Math.min(checkedCount + 1, maxChecks);
              const resetTooltip =
                feature?.recharge === "sr_or_lr"
                  ? "Reset after a short or long rest"
                  : feature?.recharge === "lr"
                    ? "Reset after a long rest"
                    : "Reset tracker";

              return (
                <>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#5d4037", mr: 0.5 }}>
                    {stackingSummary?.compactLabel || `DC ${10 + checkedCount * 5}`}
                  </Typography>
                  {Array.from({ length: totalBoxes }).map((_, idx) => (
                    <Checkbox
                      key={`${feature.id}:stack:${idx}`}
                      checked={idx < checkedCount}
                      onChange={(e) => {
                        const nextChecked = e.target.checked;
                        if (nextChecked) {
                          if (idx !== checkedCount) return;
                          if (checkedCount >= maxChecks) return;
                          setTracker({ stackingCount: checkedCount + 1 });
                          return;
                        }
                        if (idx >= checkedCount) return;
                        setTracker({ stackingCount: Math.max(0, checkedCount - 1) });
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
                  {checkedCount > 0 ? (
                    <Tooltip arrow title={resetTooltip}>
                      <IconButton
                        size="small"
                        aria-label={`Reset ${String(feature?.name || "feature")} tracker`}
                        onClick={() => setTracker({ stackingCount: 0 })}
                        sx={{ ml: 0.25, p: 0.25 }}
                      >
                        <CheckIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
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

            if (feature?.trackedMode === "rolledLongRestCooldown") {
              const cooldownDaysRemaining = clampInt(tracker?.cooldownDaysRemaining ?? 0, 0, 999);
              const lastRoll = clampInt(tracker?.lastRoll ?? 0, 0, 4);
              const ready = cooldownDaysRemaining <= 0;
              const featureLabel = String(feature?.name || "feature").trim() || "feature";

              return (
                <>
                  <Typography
                    sx={{
                      ml: 0.5,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: ready ? "#0f766e" : "#7c2d12",
                      px: 1,
                      py: 0.25,
                      borderRadius: "10px",
                      border: `1px solid ${ready ? "rgba(15, 118, 110, 0.35)" : "rgba(124, 45, 18, 0.35)"}`,
                      background: ready ? "rgba(167, 243, 208, 0.20)" : "rgba(252, 165, 165, 0.20)",
                    }}
                  >
                    {ready
                      ? "Ready"
                      : `${cooldownDaysRemaining} LR left${lastRoll > 0 ? ` (rolled ${lastRoll})` : ""}`}
                  </Typography>

                  <Tooltip
                    arrow
                    title={
                      ready
                        ? "Roll the 1d4-long-rest recharge after you use this feature"
                        : "Roll a new 1d4 recharge"
                    }
                  >
                    <IconButton
                      size="small"
                      aria-label={`Roll ${featureLabel} recharge`}
                      onClick={() => {
                        const roll = Math.floor(Math.random() * 4) + 1;
                        setTracker({ cooldownDaysRemaining: roll, lastRoll: roll });
                      }}
                      sx={{ ml: 0.25, p: 0.25 }}
                    >
                      <CasinoIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip arrow title="Subtract one long rest from the remaining recharge">
                    <IconButton
                      size="small"
                      aria-label={`Subtract one long rest from ${featureLabel} recharge`}
                      onClick={() =>
                        setTracker({
                          cooldownDaysRemaining: Math.max(0, cooldownDaysRemaining - 1),
                        })
                      }
                      sx={{ p: 0.25 }}
                    >
                      <RemoveIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip arrow title="Add one long rest to the remaining recharge">
                    <IconButton
                      size="small"
                      aria-label={`Add one long rest to ${featureLabel} recharge`}
                      onClick={() =>
                        setTracker({
                          cooldownDaysRemaining: Math.min(999, cooldownDaysRemaining + 1),
                        })
                      }
                      sx={{ p: 0.25 }}
                    >
                      <AddIcon fontSize="inherit" />
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
                if (feature?.poolMax === "sorcerer_level") return Math.max(0, Math.trunc(Number(sorcererLevel) || 0));
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
                if (feature?.poolMax === "sorcerer_level") return Math.max(0, Math.trunc(Number(sorcererLevel) || 0));
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

            if (feature?.trackedMode === "portentRolls") {
              const portentCount = Math.max(1, Number(feature?.portentCount) || 2);
              const rawRolls = Array.isArray(tracker?.rolls) ? tracker.rolls : [];
              const rolls = rawRolls
                .slice(0, portentCount)
                .map((entry) => ({
                  value: clampInt(entry?.value ?? 0, 1, 20),
                  used: Boolean(entry?.used),
                }))
                .filter((entry) => Number.isFinite(entry.value) && entry.value >= 1 && entry.value <= 20);

              const rollLabel = `${portentCount}d20`;

              return (
                <>
                  <Tooltip arrow title={`Roll ${rollLabel} for ${feature?.name || "Portent"}`}>
                    <IconButton
                      size="small"
                      aria-label={`Roll ${rollLabel} for ${feature?.name || "Portent"}`}
                      onClick={() => {
                        const nextRolls = Array.from({ length: portentCount }, () => ({
                          value: Math.floor(Math.random() * 20) + 1,
                          used: false,
                        }));
                        setTracker({ rolls: nextRolls });
                      }}
                      sx={{ ml: 0.25, p: 0.25 }}
                    >
                      <CasinoIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>

                  {rolls.length > 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 0.25, flexWrap: "wrap" }}>
                      {rolls.map((entry, idx) => (
                        <Typography
                          key={`${trackerKey}:portent:${idx}:${entry.value}`}
                          onClick={() => {
                            const nextRolls = rolls.map((roll, rollIdx) =>
                              rollIdx === idx ? { ...roll, used: !roll.used } : roll
                            );
                            setTracker({ rolls: nextRolls });
                          }}
                          sx={{
                            fontSize: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            px: 0.85,
                            py: 0.2,
                            borderRadius: "999px",
                            border: `1px solid ${entry.used ? "rgba(120, 113, 108, 0.45)" : "rgba(15, 118, 110, 0.35)"}`,
                            color: entry.used ? "rgba(120, 113, 108, 0.9)" : "#0f766e",
                            backgroundColor: entry.used ? "rgba(231, 229, 228, 0.75)" : "rgba(167, 243, 208, 0.2)",
                            textDecoration: entry.used ? "line-through" : "none",
                            userSelect: "none",
                          }}
                        >
                          {entry.value}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography sx={{ ml: 0.5, fontSize: "12px", fontWeight: 700, color: "#075985" }}>
                      Roll {rollLabel}
                    </Typography>
                  )}

                  {extraTrailing}
                </>
              );
            }

            if (feature?.trackedMode === "chargeCheckboxes") {
              const maxCharges = Math.max(1, Math.trunc(Number(usesCount) || 1));
              const currentCharges = clampInt(
                tracker?.currentCharges ?? feature?.startingCharges ?? 0,
                0,
                maxCharges
              );
              const longRestCharges = clampInt(
                feature?.longRestCharges ?? feature?.startingCharges ?? 0,
                0,
                maxCharges
              );
              const chargeLabel = String(feature?.chargeLabel || "charges");

              return (
                <>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#5d4037", mr: 0.5 }}>
                    {currentCharges}/{maxCharges} {chargeLabel}
                  </Typography>
                  {Array.from({ length: maxCharges }).map((_, idx) => (
                    <Checkbox
                      key={`${feature.id}:charge:${idx}`}
                      checked={idx < currentCharges}
                      onChange={(e) => {
                        const nextChecked = Boolean(e.target.checked);
                        if (nextChecked) {
                          if (idx !== currentCharges) return;
                          setTracker({ currentCharges: clampInt(currentCharges + 1, 0, maxCharges) });
                          return;
                        }
                        if (idx !== currentCharges - 1) return;
                        setTracker({ currentCharges: clampInt(currentCharges - 1, 0, maxCharges) });
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
                  <Tooltip arrow title={`Set ${String(feature?.name || "feature")} to ${longRestCharges} ${chargeLabel} after a long rest`}>
                    <IconButton
                      size="small"
                      aria-label={`Reset ${String(feature?.name || "feature")} to ${longRestCharges} ${chargeLabel}`}
                      onClick={() => setTracker({ currentCharges: longRestCharges })}
                      sx={{ ml: 0.25, p: 0.25 }}
                    >
                      <CheckIcon fontSize="inherit" />
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

            const rechargeBySpendingFeatureId = String(feature?.rechargeBySpendingFeatureId || "").trim();
            const rechargeBySpendingTrackerKey = rechargeBySpendingFeatureId
              ? `${String(characterClass || "unknown")}:${rechargeBySpendingFeatureId}`
              : null;
            const rechargeBySpendingTracker = rechargeBySpendingTrackerKey
              ? featureTrackers?.[rechargeBySpendingTrackerKey] || {}
              : null;
            const rechargeBySpendingAvailable = rechargeBySpendingTrackerKey
              ? clampInt(rechargeBySpendingTracker?.spentUses ?? 0, 0, 50)
              : 0;
            const rechargeBySpendingEligible =
              Boolean(rechargeBySpendingTrackerKey) &&
              typeof usesCount === "number" &&
              Number.isFinite(usesCount) &&
              spentUses >= usesCount;

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
                {rechargeBySpendingTrackerKey ? (
                  <Tooltip
                    arrow
                    title={
                      !rechargeBySpendingEligible
                        ? "Already recharged"
                        : rechargeBySpendingAvailable > 0
                        ? "Destroy 1 Soul Trinket to recharge this feature"
                        : "No Soul Trinkets available"
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        aria-label="Spend a Soul Trinket to recharge this feature"
                        onClick={() => {
                          if (!rechargeBySpendingEligible) return;
                          if (rechargeBySpendingAvailable <= 0) return;
                          setFeatureTrackers((prev) => {
                            const prevSafe = prev || {};
                            const prevRechargeTracker = prevSafe?.[rechargeBySpendingTrackerKey] || {};
                            const prevRechargeCount = clampInt(prevRechargeTracker?.spentUses ?? 0, 0, 50);
                            const nextRechargeCount = Math.max(0, prevRechargeCount - 1);
                            return {
                              ...prevSafe,
                              [rechargeBySpendingTrackerKey]: {
                                ...prevRechargeTracker,
                                spentUses: nextRechargeCount,
                              },
                              [trackerKey]: {
                                ...(prevSafe?.[trackerKey] || {}),
                                spentUses: 0,
                              },
                            };
                          });
                        }}
                        disabled={!rechargeBySpendingEligible || rechargeBySpendingAvailable <= 0}
                        sx={{ ml: 0.25, p: 0.25, opacity: 0.9 }}
                      >
                        <RemoveIcon fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : null}
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
          onChange={(_, nextExpanded) => {
            setUntrackedTouched(true);
            setUntrackedExpanded(nextExpanded);
          }}
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
  const intelligenceModValue = characterInfo?.stats?.int?.mod ?? characterInfo?.stats?.intelligence?.mod ?? 0;
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

  const sorcererLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.sorcerer;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterClass === "sorcerer" || characterClass === "sorceror") {
      return Math.max(0, Math.trunc(Number(characterLevel) || 0));
    }
    return 0;
  }, [characterInfo?.classLevels?.sorcerer, characterClass, characterLevel]);

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
  const [wizardSpellbookModalOpen, setWizardSpellbookModalOpen] = React.useState(false);
  const [wizardSpellMasteryModalOpen, setWizardSpellMasteryModalOpen] = React.useState(false);
  const [wizardSignatureSpellsModalOpen, setWizardSignatureSpellsModalOpen] = React.useState(false);
  const [wizardMasterScrivinerModalOpen, setWizardMasterScrivinerModalOpen] = React.useState(false);
  const [wizardOneWithTheWordModalOpen, setWizardOneWithTheWordModalOpen] = React.useState(false);
  const [reaperCantripModalOpen, setReaperCantripModalOpen] = React.useState(false);
  const [acolyteOfNatureModalOpen, setAcolyteOfNatureModalOpen] = React.useState(false);
  const [arcaneArcherLoreCantripModalOpen, setArcaneArcherLoreCantripModalOpen] = React.useState(false);
  const [arcaneShotOptionsModalOpen, setArcaneShotOptionsModalOpen] = React.useState(false);
  const [battleMasterManeuversModalOpen, setBattleMasterManeuversModalOpen] = React.useState(false);
  const [additionalFightingStyleModalOpen, setAdditionalFightingStyleModalOpen] = React.useState(false);
  const [blessedWarriorCantripsModalOpen, setBlessedWarriorCantripsModalOpen] = React.useState(false);
  const [runeKnightRunesModalOpen, setRuneKnightRunesModalOpen] = React.useState(false);
  const [warlockInvocationsModalOpen, setWarlockInvocationsModalOpen] = React.useState(false);
  const [warlockPactBoonModalOpen, setWarlockPactBoonModalOpen] = React.useState(false);
  const [warlockMysticArcanumModalOpen, setWarlockMysticArcanumModalOpen] = React.useState(false);
  const [metamagicOptionsModalOpen, setMetamagicOptionsModalOpen] = React.useState(false);
  const [divineSoulAffinityModalOpen, setDivineSoulAffinityModalOpen] = React.useState(false);
  const [genieKindModalOpen, setGenieKindModalOpen] = React.useState(false);
  const [lunarEmbodimentModalOpen, setLunarEmbodimentModalOpen] = React.useState(false);
  const [wildMagicSurgeModalOpen, setWildMagicSurgeModalOpen] = React.useState(false);
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

  React.useEffect(() => {
    const isGenieWarlock = characterClass === "warlock" && subclass === "genie";
    if (!isGenieWarlock) return;
    if (characterInfo?.genieKind) return;
    if (GENIE_KIND_OPTIONS.length === 0) return;

    setCharacterInfo((prev) => ({ ...prev, genieKind: GENIE_KIND_OPTIONS[0].id }));
  }, [characterClass, subclass, characterInfo?.genieKind, setCharacterInfo]);

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
  const wizardSpellbookCount = Object.values(characterInfo?.wizardSpellbook || {}).reduce(
    (acc, entries) => acc + (Array.isArray(entries) ? entries.length : 0),
    0
  );
  const wizardSpellMasteryCount =
    [characterInfo?.wizardSpellMastery?.[1], characterInfo?.wizardSpellMastery?.[2]].filter((entry) => entry?.index)
      .length;
  const wizardSignatureSpellCount = Array.isArray(characterInfo?.wizardSignatureSpells)
    ? characterInfo.wizardSignatureSpells.length
    : 0;
  const wizardMasterScrivinerEntries = Array.isArray(characterInfo?.wizardScribesMasterScriviner)
    ? characterInfo.wizardScribesMasterScriviner
    : [];
  const wizardMasterScrivinerCount = wizardMasterScrivinerEntries.reduce(
    (sum, entry) => sum + Math.max(1, Number(entry?.count || 1)),
    0
  );
  const wizardLostSpellEntries = Array.isArray(characterInfo?.wizardScribesLostSpells)
    ? characterInfo.wizardScribesLostSpells
    : [];
  const wizardLostSpellLevelTotal = wizardLostSpellEntries.reduce(
    (sum, entry) => sum + Math.max(0, Number(entry?.level) || 0),
    0
  );
  const wizardLostSpellRestCount = Math.max(0, Math.min(6, Number(characterInfo?.wizardScribesLostSpellRestCount) || 0));

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

  const warlockLevel = React.useMemo(() => {
    const raw = characterInfo?.classLevels?.warlock;
    const numeric = Number(raw);
    if (Number.isFinite(numeric) && numeric >= 0) return Math.trunc(numeric);
    if (characterClass === "warlock") return Math.max(0, Math.trunc(Number(characterLevel) || 0));
    return 0;
  }, [characterInfo?.classLevels?.warlock, characterClass, characterLevel]);

  const hasWarlockInvocations = characterClass === "warlock" && warlockLevel >= 2;
  const hasWarlockPactBoon = characterClass === "warlock" && warlockLevel >= 3;
  const hasWarlockMysticArcanum = characterClass === "warlock" && warlockLevel >= 11;

  const warlockInvocationCount = Array.isArray(characterInfo?.warlockInvocations)
    ? characterInfo.warlockInvocations.length
    : 0;
  const warlockInvocationAllowed = getWarlockInvocationAllowance(warlockLevel);
  const warlockPactBoonCount = characterInfo?.warlockPactBoon ? 1 : 0;
  const warlockMysticArcanum = React.useMemo(
    () => (Array.isArray(characterInfo?.warlockMysticArcanum) ? characterInfo.warlockMysticArcanum : []),
    [characterInfo?.warlockMysticArcanum]
  );
  const warlockMysticArcanumCount = warlockMysticArcanum.length;
  const warlockMysticArcanumExpected = getWarlockMysticArcanumExpectedTotal(warlockLevel);
  const warlockMysticArcanumLevels = getWarlockUnlockedArcanumLevels(warlockLevel);

  const [rangerFavoredEnemyOptions, setRangerFavoredEnemyOptions] = React.useState([]);
  const [rangerNaturalExplorerOptions, setRangerNaturalExplorerOptions] = React.useState([]);
  const [rangerOptionsModal, setRangerOptionsModal] = React.useState({ open: false, kind: "" });

  const [untrackedFeatureChoices, setUntrackedFeatureChoices] = React.useState(() =>
    loadUntrackedFeatureChoices()
  );
  const [featureChoiceModal, setFeatureChoiceModal] = React.useState({ open: false, featureId: "" });

  const subclassChoiceKey = React.useMemo(
    () => getChoiceKey({ kind: "subclass", characterClass, subclass }),
    [characterClass, subclass]
  );

  React.useEffect(() => {
    saveUntrackedFeatureChoices(untrackedFeatureChoices);
  }, [untrackedFeatureChoices]);

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
    return all.filter((f) => f.level <= characterLevel && f?.id !== "extra_attack");
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
    if (characterClass === "wizard") {
      const signatureEntries = Array.isArray(characterInfo?.wizardSignatureSpells)
        ? characterInfo.wizardSignatureSpells
        : [];
      const generatedSignatureFeatures = signatureEntries.map((spell) => ({
        id: `wizard_signature_spell:${spell?.index}`,
        name: `Signature Spell: ${spell?.name || spell?.index || "Unknown Spell"}`,
        desc: [
          "You can cast this signature spell once at 3rd level without expending a spell slot.",
          "You regain this use when you finish a short or long rest.",
        ],
        tracked: true,
        uses: 1,
        recharge: "sr_or_lr",
      }));
      return [...base, ...generatedSignatureFeatures, ...classCustomForUi];
    }
    return [...base, ...classCustomForUi];
  }, [allClassFeatures, applyTrackedOverride, classOverrideKey, classCustomForUi, characterClass, characterInfo?.wizardSignatureSpells]);

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

    if (characterClass === "wizard") {
      const spellbookCount = Object.values(characterInfo?.wizardSpellbook || {}).reduce(
        (acc, entries) => acc + (Array.isArray(entries) ? entries.length : 0),
        0
      );
      const masteryFirst = String(characterInfo?.wizardSpellMastery?.[1]?.name || "").trim();
      const masterySecond = String(characterInfo?.wizardSpellMastery?.[2]?.name || "").trim();
      const signatureEntries = Array.isArray(characterInfo?.wizardSignatureSpells)
        ? characterInfo.wizardSignatureSpells
        : [];
      const signatureNames = signatureEntries
        .map((spell) => String(spell?.name || "").trim())
        .filter(Boolean);

      const mapped = base.map((feature) => {
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        if (feature?.id === "spellbook") {
          return {
            ...feature,
            desc: [`Spells currently in spellbook: ${spellbookCount}.`, ...descLines],
          };
        }

        if (feature?.id === "spell_mastery") {
          return {
            ...feature,
            desc: [
              masteryFirst
                ? `Chosen 1st-level Spell Mastery spell: ${masteryFirst}.`
                : "Chosen 1st-level Spell Mastery spell: none selected.",
              masterySecond
                ? `Chosen 2nd-level Spell Mastery spell: ${masterySecond}.`
                : "Chosen 2nd-level Spell Mastery spell: none selected.",
              ...descLines,
            ],
          };
        }

        if (feature?.id === "signature_spells") {
          return {
            ...feature,
            desc: [
              signatureNames.length > 0
                ? `Chosen Signature Spells: ${signatureNames.join(", ")}.`
                : "Chosen Signature Spells: none selected.",
              ...descLines,
            ],
          };
        }

        return feature;
      });
      const generatedSignatureFeatures = signatureEntries.map((spell) => ({
        id: `wizard_signature_spell:${spell?.index}`,
        name: `Signature Spell: ${spell?.name || spell?.index || "Unknown Spell"}`,
        desc: [
          "You can cast this signature spell once at 3rd level without expending a spell slot.",
          "You regain this use when you finish a short or long rest.",
        ],
        tracked: true,
        uses: 1,
        recharge: "sr_or_lr",
      }));
      return [...mapped, ...generatedSignatureFeatures];
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

    if (characterClass === "rogue") {
      const dice = getRogueSneakAttackDice(characterLevel);
      return base.map((feature) => {
        if (feature?.id !== "sneak_attack") return feature;
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];
        return { ...feature, desc: [`Current Sneak Attack extra damage: ${dice}.`, ...descLines] };
      });
    }

    if (characterClass === "warlock") {
      const invocationList = classesData?.warlock?.eldritchInvocations || [];
      const invocationById = new Map((Array.isArray(invocationList) ? invocationList : []).map((entry) => [entry?.id, entry]));
      const selectedInvocationIds = Array.isArray(characterInfo?.warlockInvocations)
        ? characterInfo.warlockInvocations
        : [];
      const selectedInvocations = selectedInvocationIds
        .map((id) => invocationById.get(id))
        .filter(Boolean);

      const pactOptions = classesData?.warlock?.pactBoons || [];
      const pactById = new Map((Array.isArray(pactOptions) ? pactOptions : []).map((entry) => [entry?.id, entry]));
      const selectedPact = pactById.get(String(characterInfo?.warlockPactBoon || "")) || null;

      let next = base.map((feature) => {
        const descLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        if (feature?.id === "eldritch_invocations") {
          const prefix =
            selectedInvocations.length > 0
              ? `Chosen invocations: ${selectedInvocations.map((entry) => entry?.name).join(", ")}.`
              : "Chosen invocations: (none selected).";
          return { ...feature, desc: [prefix, ...descLines] };
        }

        if (feature?.id === "pact_boon") {
          const prefix = selectedPact ? `Chosen pact boon: ${selectedPact.name}.` : "Chosen pact boon: (none selected).";
          const pactDesc = selectedPact?.desc || [];
          return { ...feature, desc: [prefix, ...pactDesc, ...descLines] };
        }

        if (feature?.id === "mystic_arcanum") {
          const prefix =
            warlockMysticArcanum.length > 0
              ? `Chosen arcanum spells: ${warlockMysticArcanum.map((spell) => spell?.name).filter(Boolean).join(", ")}.`
              : "Chosen arcanum spells: (none selected).";
          const guidance = `Expected arcanum selections at Warlock level ${warlockLevel}: ${warlockMysticArcanumExpected}.`;
          return { ...feature, desc: [prefix, guidance, ...descLines] };
        }

        return feature;
      });

      if (hasWarlockMysticArcanum && warlockMysticArcanum.length > 0) {
        const arcanumFeatures = warlockMysticArcanum.map((spell) => {
          const spellLevel = Number(spell?.level) || 0;
          const ordinalLevelLabel = (() => {
            if (spellLevel === 1) return "1st";
            if (spellLevel === 2) return "2nd";
            if (spellLevel === 3) return "3rd";
            if (spellLevel > 3) return `${spellLevel}th`;
            return "Unknown";
          })();
          const levelLabel = spellLevel > 0 ? `${spellLevel}th-level` : "Arcanum";
          return {
            id: `warlock_mystic_arcanum:${spell.index}`,
            name: `${ordinalLevelLabel} lvl Mystic Arcanum: ${spell.name}`,
            desc: [
              `${levelLabel} arcanum spell.`,
              `Spell details: [[spell:${spell.index}|${spell.name}]].`,
              "You can cast this spell once without expending a spell slot, and it refreshes on a long rest.",
            ],
            level: 11,
            tracked: true,
            uses: 1,
            recharge: "lr",
          };
        });

        next = [...next, ...arcanumFeatures];
      }

      return next;
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
    characterLevel,
    characterInfo?.warlockInvocations,
    characterInfo?.warlockPactBoon,
    characterInfo?.wizardSignatureSpells,
    characterInfo?.wizardSpellMastery,
    characterInfo?.wizardSpellbook,
    warlockLevel,
    warlockMysticArcanum,
    warlockMysticArcanumExpected,
    hasWarlockMysticArcanum,
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

    if (characterClass === "ranger" && subclass === "hunter") {
      next = next.map((feature) => {
        const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
          ? feature.untrackedChoiceOptions
          : [];
        if (choiceOptions.length === 0) return feature;

        const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
        const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;

        const baseDescLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        const selectedDescLines = selected
          ? Array.isArray(selected?.desc)
            ? selected.desc
            : typeof selected?.desc === "string"
              ? [selected.desc]
              : []
          : [];

        const prefixLines = selected
          ? [`Chosen: ${selected.name}.`, ...selectedDescLines]
          : ["Chosen: (none selected). Click the bow icon to choose one."];

        const nextName = selected?.name ? `${feature.name} (${selected.name})` : `${feature.name} (Choose)`;

        return { ...feature, name: nextName, desc: [...prefixLines, ...baseDescLines] };
      });
    }

    if (characterClass === "sorcerer" && subclass === "draconicBloodline") {
      next = next.map((feature) => {
        if (feature?.id !== "dragon_ancestor") return feature;

        const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
          ? feature.untrackedChoiceOptions
          : [];
        if (choiceOptions.length === 0) return feature;

        const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
        const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;

        const baseDescLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        const damageType = selected?.damageType ? String(selected.damageType) : "";
        const prefixLines = selected
          ? [`Chosen: ${selected.name}${damageType ? ` (${damageType})` : ""}.`]
          : ["Chosen: (none selected). Click the dragon icon to choose one."];

        const nextName = selected?.name ? `${feature.name} (${selected.name})` : `${feature.name} (Choose)`;

        return { ...feature, name: nextName, desc: [...prefixLines, ...baseDescLines] };
      });
    }

    if (characterClass === "warlock" && subclass === "genie") {
      const genieKindData = getGenieKindData(characterInfo?.genieKind);
      const genieSummaryLines = getGenieBenefitsSummaryLines(characterInfo?.genieKind);

      next = next.map((feature) => {
        if (!["genies_vessel", "genies_wrath", "elemental_gift"].includes(String(feature?.id || ""))) {
          return feature;
        }

        const baseDescLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        if (feature?.id === "genies_vessel") {
          const nextName = genieKindData ? `${feature.name} (${genieKindData.name})` : `${feature.name} (Choose Kind)`;
          return { ...feature, name: nextName, desc: [...genieSummaryLines, ...baseDescLines] };
        }

        if (feature?.id === "genies_wrath") {
          const prefix = genieKindData
            ? `Current damage type: ${genieKindData.damageType}.`
            : "Choose a genie kind to set the damage type.";
          return { ...feature, desc: [prefix, ...baseDescLines] };
        }

        if (feature?.id === "elemental_gift") {
          const prefix = genieKindData
            ? `Current permanent resistance: ${genieKindData.damageType}.`
            : "Choose a genie kind to set the permanent resistance type.";
          return { ...feature, desc: [prefix, ...baseDescLines] };
        }

        return feature;
      });
    }

    if (characterClass === "barbarian" && subclass === "totemWarrior") {
      next = next.map((feature) => {
        if (!["totem_spirit", "aspect_of_the_beast", "totemic_attunement"].includes(String(feature?.id || ""))) {
          return feature;
        }

        const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
          ? feature.untrackedChoiceOptions
          : [];
        if (choiceOptions.length === 0) return feature;

        const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
        const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;
        const baseDescLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];
        const selectedDescLines = selected
          ? Array.isArray(selected?.desc)
            ? selected.desc
            : typeof selected?.desc === "string"
              ? [selected.desc]
              : []
          : [];
        const promptByFeatureId = {
          totem_spirit: "Click the totem icon to choose your spirit animal.",
          aspect_of_the_beast: "Click the totem icon to choose your beast aspect.",
          totemic_attunement: "Click the totem icon to choose your attunement animal.",
        };
        const prefixLines = selected
          ? [`Chosen: ${selected.name}.`, ...selectedDescLines]
          : [`Chosen: (none selected). ${promptByFeatureId[feature.id] || "Click the totem icon to choose one."}`];
        const nextName = selected?.name ? `${feature.name} (${selected.name})` : `${feature.name} (Choose)`;

        return {
          ...feature,
          name: nextName,
          desc: [...prefixLines, ...baseDescLines],
        };
      });
    }

    if (characterClass === "wizard" && subclass === "divination") {
      const hasGreaterPortent = Number(characterLevel || 0) >= 14;

      next = next.map((feature) => {
        if (feature?.id !== "portent") return feature;

        const baseDescLines = Array.isArray(feature?.desc)
          ? feature.desc
          : typeof feature?.desc === "string"
            ? [feature.desc]
            : [];

        const prefixLines = hasGreaterPortent
          ? ["Greater Portent active: roll 3 d20s for Portent instead of 2."]
          : [];

        return {
          ...feature,
          portentCount: hasGreaterPortent ? 3 : 2,
          desc: [...prefixLines, ...baseDescLines],
        };
      });
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
    characterClass,
    subclass,
    characterLevel,
    characterInfo?.genieKind,
    untrackedFeatureChoices,
    subclassChoiceKey,
  ]);

  const activeChoiceFeature = React.useMemo(() => {
    const featureId = String(featureChoiceModal?.featureId || "");
    if (!featureChoiceModal?.open || !featureId) return null;
    const raw = classesData?.[characterClass]?.subclasses?.[subclass]?.features || [];
    const list = Array.isArray(raw) ? raw : [];
    return list.find((f) => f?.id === featureId) || null;
  }, [featureChoiceModal?.open, featureChoiceModal?.featureId, characterClass, subclass]);

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

  React.useEffect(() => {
    setCharacterInfo((prev) => {
      const spellbook = prev?.wizardSpellbook || {};
      const availableMaster = new Map();
      const availableLost = new Map();

      [1, 2].forEach((level) => {
        const entries = Array.isArray(spellbook?.[level]) ? spellbook[level] : [];
        entries.forEach((spell) => {
          if (!spell?.index) return;
          availableMaster.set(String(spell.index), {
            index: spell.index,
            name: spell.name,
            level,
          });
        });
      });

      for (let level = 1; level <= 9; level += 1) {
        const entries = Array.isArray(spellbook?.[level]) ? spellbook[level] : [];
        entries.forEach((spell) => {
          if (!spell?.index) return;
          availableLost.set(String(spell.index), {
            index: spell.index,
            name: spell.name,
            level,
          });
        });
      }

      const currentMaster = Array.isArray(prev?.wizardScribesMasterScriviner) ? prev.wizardScribesMasterScriviner : [];
      const nextMaster = currentMaster
        .map((entry) => {
          const available = availableMaster.get(String(entry?.index || ""));
          if (!available) return null;
          return {
            ...available,
            count: Math.max(1, Number(entry?.count || 1)),
          };
        })
        .filter(Boolean);

      const currentLost = Array.isArray(prev?.wizardScribesLostSpells) ? prev.wizardScribesLostSpells : [];
      const nextLost = currentLost
        .map((entry) => {
          const available = availableLost.get(String(entry?.index || ""));
          if (!available) return null;
          return available;
        })
        .filter(Boolean);

      const lostIndexes = new Set(nextLost.map((entry) => String(entry?.index || "")));
      const currentPrepared = prev?.spellsPrepared || {};
      const nextPrepared = Object.keys(currentPrepared).reduce((acc, key) => {
        acc[key] = Array.isArray(currentPrepared[key])
          ? currentPrepared[key].filter((entry) => !lostIndexes.has(String(entry?.index || "")))
          : [];
        return acc;
      }, {});

      const masterChanged =
        JSON.stringify(currentMaster) !== JSON.stringify(nextMaster);
      const lostChanged =
        JSON.stringify(currentLost) !== JSON.stringify(nextLost);
      const preparedChanged =
        JSON.stringify(currentPrepared) !== JSON.stringify(nextPrepared);

      if (!masterChanged && !lostChanged && !preparedChanged) return prev;

      return {
        ...prev,
        wizardScribesMasterScriviner: nextMaster,
        wizardScribesLostSpells: nextLost,
        spellsPrepared: nextPrepared,
      };
    });
  }, [characterInfo?.wizardSpellbook, setCharacterInfo]);

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
                if (characterClass === "wizard" && feature?.id === "spellbook") {
                  return (
                    <Tooltip arrow title={`Open Spellbook (${wizardSpellbookCount} spells)`}>
                      <IconButton
                        size="small"
                        aria-label="Open Spellbook"
                        onClick={() => setWizardSpellbookModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: wizardSpellbookCount > 0 ? "#0f766e" : "#075985",
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

                if (characterClass === "wizard" && feature?.id === "spell_mastery") {
                  const isOver = wizardSpellMasteryCount > 2;
                  const isUnder = wizardSpellMasteryCount < 2;
                  return (
                    <Tooltip arrow title={`Choose Spell Mastery spells (${wizardSpellMasteryCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Spell Mastery spells"
                        onClick={() => setWizardSpellMasteryModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
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

                if (characterClass === "wizard" && feature?.id === "signature_spells") {
                  const isOver = wizardSignatureSpellCount > 2;
                  const isUnder = wizardSignatureSpellCount < 2;
                  return (
                    <Tooltip arrow title={`Choose Signature Spells (${wizardSignatureSpellCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Signature Spells"
                        onClick={() => setWizardSignatureSpellsModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
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

                if (hasWarlockInvocations && feature?.id === "eldritch_invocations") {
                  const selectedCount = warlockInvocationCount;
                  const allowed = warlockInvocationAllowed;
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose Eldritch Invocations (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Eldritch Invocations"
                        onClick={() => setWarlockInvocationsModalOpen(true)}
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
                            backgroundColor: isOver
                              ? "rgba(194, 65, 12, 0.14)"
                              : isUnder
                                ? "rgba(244, 233, 221, 0.85)"
                                : "rgba(20, 184, 166, 0.14)",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src="https://www.clipartmax.com/png/small/30-301325_official-eldritch-moon-set-symbol-star-wars-destiny.png"
                          alt="Choose Eldritch Invocations"
                          sx={{ width: 16, height: 16, display: "block", filter: "contrast(1.15) saturate(0.8)" }}
                        />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasWarlockPactBoon && feature?.id === "pact_boon") {
                  const selectedCount = warlockPactBoonCount;
                  const isOver = selectedCount > 1;
                  const isUnder = selectedCount < 1;

                  return (
                    <Tooltip arrow title={`Choose Pact Boon (${selectedCount}/1)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Pact Boon"
                        onClick={() => setWarlockPactBoonModalOpen(true)}
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
                            backgroundColor: isOver
                              ? "rgba(194, 65, 12, 0.14)"
                              : isUnder
                                ? "rgba(244, 233, 221, 0.85)"
                                : "rgba(20, 184, 166, 0.14)",
                          },
                        }}
                      >
                        <PactScrollIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (hasWarlockMysticArcanum && feature?.id === "mystic_arcanum") {
                  const selectedCount = warlockMysticArcanumCount;
                  const allowed = warlockMysticArcanumExpected;
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose Mystic Arcanum spells (${selectedCount}/${allowed} expected, max 10)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Mystic Arcanum spells"
                        onClick={() => setWarlockMysticArcanumModalOpen(true)}
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

                if ((characterClass === "sorcerer" || characterClass === "sorceror") && feature?.id === "metamagic") {
                  const selectedCount = Array.isArray(characterInfo?.metamagicOptions)
                    ? characterInfo.metamagicOptions.length
                    : 0;
                  const level = Math.max(0, Math.trunc(Number(sorcererLevel) || 0));
                  const allowed = level < 3 ? 0 : level >= 17 ? 4 : level >= 10 ? 3 : 2;
                  const isOver = selectedCount > allowed;
                  const isUnder = selectedCount < allowed;

                  return (
                    <Tooltip arrow title={`Choose Metamagic options (${selectedCount}/${allowed})`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Metamagic options"
                        onClick={() => setMetamagicOptionsModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
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
              intelligenceModValue={intelligenceModValue}
              wisdomModValue={wisdomModValue}
              strengthModValue={strengthModValue}
              constitutionModValue={constitutionModValue}
              druidLevel={druidLevel}
              fighterLevel={fighterLevel}
              paladinLevel={paladinLevel}
              sorcererLevel={sorcererLevel}
              warlockLevel={warlockLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
              renderDetailsHeaderForFeature={(feature, trackerHelpers) => {
                const featureTrackers = trackerHelpers?.featureTrackers || {};
                const setFeatureTrackers = trackerHelpers?.setFeatureTrackers;
                if (characterClass === "warlock") {
                  if (feature?.id === "eldritch_invocations") {
                    const invocationList = classesData?.warlock?.eldritchInvocations || [];
                    const byId = new Map((Array.isArray(invocationList) ? invocationList : []).map((entry) => [entry?.id, entry]));
                    const selected = (Array.isArray(characterInfo?.warlockInvocations) ? characterInfo.warlockInvocations : [])
                      .map((id) => byId.get(id))
                      .filter(Boolean);

                    return (
                      <div style={{ margin: "2px 0 8px 0" }}>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Selected invocations:</strong>{" "}
                          {selected.length === 0 ? <em>None</em> : selected.map((entry) => entry?.name).join(", ")} ({selected.length}/{warlockInvocationAllowed})
                        </p>
                      </div>
                    );
                  }

                  if (feature?.id === "pact_boon") {
                    const pactList = classesData?.warlock?.pactBoons || [];
                    const selected =
                      (Array.isArray(pactList) ? pactList : []).find(
                        (entry) => String(entry?.id || "") === String(characterInfo?.warlockPactBoon || "")
                      ) || null;

                    return (
                      <div style={{ margin: "2px 0 8px 0" }}>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Chosen pact boon:</strong> {selected ? selected.name : <em>None</em>}
                        </p>
                      </div>
                    );
                  }

                  if (feature?.id === "mystic_arcanum") {
                    const unlockedLabel =
                      warlockMysticArcanumLevels.length > 0 ? warlockMysticArcanumLevels.join(", ") : "none";

                    return (
                      <div style={{ margin: "2px 0 8px 0" }}>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Unlocked arcanum levels:</strong> {unlockedLabel}
                        </p>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Chosen arcanum spells:</strong>{" "}
                          {warlockMysticArcanum.length === 0
                            ? <em>None</em>
                            : warlockMysticArcanum.map((spell) => `${spell?.name} (${spell?.level})`).join(", ")} ({warlockMysticArcanumCount}/{warlockMysticArcanumExpected})
                        </p>
                      </div>
                    );
                  }

                  if (feature?.id === "healing_light") {
                    const trackerKey = `${String(characterClass || "unknown")}:${String(feature?.id || "feature")}`;
                    const tracker = featureTrackers?.[trackerKey] || {};
                    const autoMax = Math.max(0, Math.trunc(Number(warlockLevel) || 0)) + 1;
                    const overrideActive = Number.isFinite(Number(tracker?.poolMaxOverride));
                    const currentMax = overrideActive
                      ? Math.max(0, Math.trunc(Number(tracker?.poolMaxOverride) || 0))
                      : autoMax;

                    return (
                      <div style={{ margin: "2px 0 8px 0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <p style={{ margin: "2px 0" }}>
                          <strong>Max dice:</strong> {currentMax} d6
                          {overrideActive ? ` (auto ${autoMax})` : ""}
                        </p>
                        <Tooltip arrow title="Override max Healing Light dice">
                          <IconButton
                            size="small"
                            aria-label="Override Healing Light max dice"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextValue = window.prompt(
                                "Set Healing Light max dice. Leave blank to reset to automatic.",
                                String(currentMax)
                              );
                              if (nextValue === null || typeof setFeatureTrackers !== "function") return;
                              const trimmed = String(nextValue).trim();
                              if (!trimmed) {
                                setFeatureTrackers((prev) => ({
                                  ...(prev || {}),
                                  [trackerKey]: {
                                    ...(prev?.[trackerKey] || {}),
                                    poolMaxOverride: null,
                                    spentDice: Math.max(0, Math.min(Number(prev?.[trackerKey]?.spentDice) || 0, autoMax)),
                                  },
                                }));
                                return;
                              }
                              const parsed = Number(trimmed);
                              if (!Number.isFinite(parsed)) return;
                              const nextMax = Math.max(0, Math.min(99, Math.trunc(parsed)));
                              setFeatureTrackers((prev) => ({
                                ...(prev || {}),
                                [trackerKey]: {
                                  ...(prev?.[trackerKey] || {}),
                                  poolMaxOverride: nextMax,
                                  spentDice: Math.max(0, Math.min(Number(prev?.[trackerKey]?.spentDice) || 0, nextMax)),
                                },
                              }));
                            }}
                            sx={{
                              p: 0.25,
                              border: "1px solid rgba(93, 64, 55, 0.25)",
                              backgroundColor: "rgba(244, 233, 221, 0.65)",
                              "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                            }}
                          >
                            <SettingsIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    );
                  }
                }

                if (!(characterClass === "sorcerer" || characterClass === "sorceror")) return null;
                if (feature?.id !== "metamagic") return null;

                const selectedIds = Array.isArray(characterInfo?.metamagicOptions)
                  ? characterInfo.metamagicOptions
                  : [];
                const allOptions =
                  classesData?.sorcerer?.metamagicOptions || classesData?.sorceror?.metamagicOptions || [];

                const selected = selectedIds
                  .map((id) => allOptions.find((opt) => String(opt?.id || "") === String(id)))
                  .filter(Boolean);

                if (selected.length === 0) {
                  return (
                    <p style={{ margin: "2px 0", opacity: 0.8 }}>
                      <em>No Metamagic options selected yet.</em>
                    </p>
                  );
                }

                return (
                  <div style={{ margin: "2px 0 8px 0" }}>
                    <p style={{ margin: "2px 0" }}>
                      <strong>Chosen Metamagic options:</strong>
                    </p>
                    {selected.map((opt) => {
                      const descLines = Array.isArray(opt?.desc)
                        ? opt.desc
                        : opt?.desc
                          ? [String(opt.desc)]
                          : [];
                      const cost = opt?.cost;
                      const costLabel =
                        cost === "spell_level"
                          ? "Cost: spell level (1 for cantrip)"
                          : Number.isFinite(Number(cost))
                            ? `Cost: ${Number(cost)} sorcery point${Number(cost) === 1 ? "" : "s"}`
                            : "";

                      return (
                        <Accordion
                          key={`metamagic:${opt.id}`}
                          disableGutters
                          elevation={0}
                          sx={{
                            backgroundColor: "transparent",
                            "&:before": { display: "none" },
                            "&.Mui-expanded": { margin: 0 },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px" }} />}
                            sx={{
                              minHeight: 32,
                              px: 0.5,
                              py: 0,
                              "& .MuiAccordionSummary-content": {
                                margin: "4px 0 !important",
                                alignItems: "center",
                                gap: 0.5,
                                width: "100%",
                                display: "flex",
                              },
                              "&.Mui-expanded": { minHeight: 32 },
                            }}
                          >
                            <Typography sx={{ fontSize: "13px", fontWeight: 700, flexGrow: 1, minWidth: 0 }}>
                              {opt?.name}
                            </Typography>
                            {costLabel ? (
                              <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "rgba(62, 39, 35, 0.75)" }}>
                                {costLabel.replace(/^Cost:\s*/i, "")}
                              </Typography>
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
                              {descLines.length === 0 ? (
                                <p style={{ opacity: 0.7 }}>
                                  <em>No description available.</em>
                                </p>
                              ) : (
                                descLines.map((line, idx) => <p key={`metamagic:${opt.id}:desc:${idx}`}>{line}</p>)
                              )}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </div>
                );
              }}
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
              defaultUntrackedExpanded={true}
              untrackedLabel="Untracked Subclass Features"
              proficiencyBonusValue={proficiencyBonusValue}
              charismaModValue={charismaModValue}
              intelligenceModValue={intelligenceModValue}
              wisdomModValue={wisdomModValue}
              strengthModValue={strengthModValue}
              constitutionModValue={constitutionModValue}
              druidLevel={druidLevel}
              fighterLevel={fighterLevel}
              paladinLevel={paladinLevel}
              sorcererLevel={sorcererLevel}
              warlockLevel={warlockLevel}
              characterClass={characterClass}
              characterLevel={characterLevel}
              renderDetailsHeaderForFeature={(feature, trackerHelpers) => {
                const featureTrackers = trackerHelpers?.featureTrackers || {};
                const setFeatureTrackers = trackerHelpers?.setFeatureTrackers;
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

                if (characterClass === "wizard" && subclass === "scribes" && feature?.id === "master_scriviner") {
                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Stored Scrolls</strong>
                      </p>
                      {wizardMasterScrivinerEntries.length === 0 ? (
                        <p style={{ margin: "2px 0", opacity: 0.8 }}>
                          <em>No scrolls chosen yet.</em>
                        </p>
                      ) : (
                        wizardMasterScrivinerEntries.map((entry) => (
                          <div
                            key={`master-scriviner-entry:${entry?.index}`}
                            style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0" }}
                          >
                            <span style={{ flexGrow: 1 }}>{formatSpellCountLabel(entry)}</span>
                            <IconButton
                              size="small"
                              aria-label={`Remove one ${entry?.name || entry?.index || "scroll"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCharacterInfo((prev) => {
                                  const current = Array.isArray(prev?.wizardScribesMasterScriviner)
                                    ? prev.wizardScribesMasterScriviner
                                    : [];
                                  const next = current
                                    .map((row) =>
                                      String(row?.index || "") === String(entry?.index || "")
                                        ? { ...row, count: Math.max(0, Number(row?.count || 1) - 1) }
                                        : row
                                    )
                                    .filter((row) => Math.max(0, Number(row?.count || 0)) > 0);
                                  return { ...prev, wizardScribesMasterScriviner: next };
                                });
                              }}
                              sx={{ p: 0.2 }}
                            >
                              <RemoveIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label={`Add one ${entry?.name || entry?.index || "scroll"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCharacterInfo((prev) => {
                                  const current = Array.isArray(prev?.wizardScribesMasterScriviner)
                                    ? prev.wizardScribesMasterScriviner
                                    : [];
                                  const next = current.map((row) =>
                                    String(row?.index || "") === String(entry?.index || "")
                                      ? { ...row, count: Math.max(1, Number(row?.count || 1)) + 1 }
                                      : row
                                  );
                                  return { ...prev, wizardScribesMasterScriviner: next };
                                });
                              }}
                              sx={{ p: 0.2 }}
                            >
                              <AddIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label={`Delete ${entry?.name || entry?.index || "scroll"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCharacterInfo((prev) => ({
                                  ...prev,
                                  wizardScribesMasterScriviner: (Array.isArray(prev?.wizardScribesMasterScriviner)
                                    ? prev.wizardScribesMasterScriviner
                                    : []
                                  ).filter((row) => String(row?.index || "") !== String(entry?.index || "")),
                                }));
                              }}
                              sx={{ p: 0.2 }}
                            >
                              <DeleteOutlineIcon fontSize="inherit" />
                            </IconButton>
                          </div>
                        ))
                      )}
                    </div>
                  );
                }

                if (characterClass === "wizard" && subclass === "scribes" && feature?.id === "one_with_the_word") {
                  return (
                    <div style={{ margin: "2px 0 8px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0" }}>
                        <strong>Lost Spells</strong>
                        <Tooltip arrow title="Choose disappeared spells">
                          <IconButton
                            size="small"
                            aria-label="Choose disappeared spells"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWizardOneWithTheWordModalOpen(true);
                            }}
                            sx={{
                              p: 0.25,
                              border: "1px solid rgba(93, 64, 55, 0.25)",
                              backgroundColor: "rgba(244, 233, 221, 0.65)",
                              "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                            }}
                          >
                            <MenuBookIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Selected spell levels:</strong> {wizardLostSpellLevelTotal}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Long rests remaining:</strong> {wizardLostSpellRestCount}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Spells:</strong>{" "}
                        {wizardLostSpellEntries.length === 0
                          ? <em>None</em>
                          : wizardLostSpellEntries.map((entry) => entry?.name).join(", ")}
                      </p>
                    </div>
                  );
                }

                if (
                  characterClass === "warlock" &&
                  String(subclass || "") === "celestial" &&
                  feature?.id === "healing_light"
                ) {
                  const trackerKey = `${String(characterClass || "unknown")}:${String(feature?.id || "feature")}`;
                  const tracker = featureTrackers?.[trackerKey] || {};
                  const autoMax = Math.max(0, Math.trunc(Number(warlockLevel) || 0)) + 1;
                  const overrideActive = Number.isFinite(Number(tracker?.poolMaxOverride));
                  const currentMax = overrideActive
                    ? Math.max(0, Math.trunc(Number(tracker?.poolMaxOverride) || 0))
                    : autoMax;

                  return (
                    <div style={{ margin: "2px 0 8px 0", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Max dice:</strong> {currentMax} d6
                        {overrideActive ? ` (auto ${autoMax})` : ""}
                      </p>
                      <Tooltip arrow title="Override max Healing Light dice">
                        <IconButton
                          size="small"
                          aria-label="Override Healing Light max dice"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof setFeatureTrackers !== "function") return;
                            const nextValue = window.prompt(
                              "Set Healing Light max dice. Leave blank to reset to automatic.",
                              String(currentMax)
                            );
                            if (nextValue === null) return;
                            const trimmed = String(nextValue).trim();
                            if (!trimmed) {
                              setFeatureTrackers((prev) => ({
                                ...(prev || {}),
                                [trackerKey]: {
                                  ...(prev?.[trackerKey] || {}),
                                  poolMaxOverride: null,
                                  spentDice: Math.max(0, Math.min(Number(prev?.[trackerKey]?.spentDice) || 0, autoMax)),
                                },
                              }));
                              return;
                            }
                            const parsed = Number(trimmed);
                            if (!Number.isFinite(parsed)) return;
                            const nextMax = Math.max(0, Math.min(99, Math.trunc(parsed)));
                            setFeatureTrackers((prev) => ({
                              ...(prev || {}),
                              [trackerKey]: {
                                ...(prev?.[trackerKey] || {}),
                                poolMaxOverride: nextMax,
                                spentDice: Math.max(0, Math.min(Number(prev?.[trackerKey]?.spentDice) || 0, nextMax)),
                              },
                            }));
                          }}
                          sx={{
                            p: 0.25,
                            border: "1px solid rgba(93, 64, 55, 0.25)",
                            backgroundColor: "rgba(244, 233, 221, 0.65)",
                            "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                          }}
                        >
                          <SettingsIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
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
                if (characterClass === "wizard" && subclass === "scribes" && feature?.id === "master_scriviner") {
                  return (
                    <Tooltip arrow title={`Manage Master Scriviner scrolls (${wizardMasterScrivinerCount} total)`}>
                      <IconButton
                        size="small"
                        aria-label="Manage Master Scriviner scrolls"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWizardMasterScrivinerModalOpen(true);
                        }}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: wizardMasterScrivinerCount > 0 ? "#0f766e" : "#075985",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: "rgba(244, 233, 221, 0.65)",
                          "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                        }}
                      >
                        <TiedScrollIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (characterClass === "wizard" && subclass === "scribes" && feature?.id === "one_with_the_word") {
                  return (
                    <>
                      <Tooltip arrow title="Roll 1d6 long rests for the lost spells to return">
                        <IconButton
                          size="small"
                          aria-label="Roll 1d6 long rests"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCharacterInfo((prev) => ({
                              ...prev,
                              wizardScribesLostSpellRestCount: Math.floor(Math.random() * 6) + 1,
                            }));
                          }}
                          sx={{
                            ml: 0.25,
                            p: 0.25,
                            color: "rgba(93, 64, 55, 0.92)",
                            border: "1px solid rgba(93, 64, 55, 0.25)",
                            backgroundColor: "rgba(244, 233, 221, 0.65)",
                            "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                          }}
                        >
                          <CasinoIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <FormControl
                        size="small"
                        variant="standard"
                        sx={{ ml: 0.5, minWidth: 46 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={wizardLostSpellRestCount}
                          onChange={(e) => {
                            const nextValue = Math.max(0, Math.min(6, Number(e.target.value) || 0));
                            setCharacterInfo((prev) => ({
                              ...prev,
                              wizardScribesLostSpellRestCount: nextValue,
                            }));
                          }}
                          sx={{ fontSize: "12px", fontWeight: 700 }}
                        >
                          {Array.from({ length: 7 }).map((_, idx) => (
                            <MenuItem key={`one-with-the-word:rest:${idx}`} value={idx} sx={{ fontSize: "12px" }}>
                              {idx}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
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

                if (characterClass === "wizard" && feature?.id === "spellbook") {
                  return (
                    <Tooltip arrow title={`Open Spellbook (${wizardSpellbookCount} spells)`}>
                      <IconButton
                        size="small"
                        aria-label="Open Spellbook"
                        onClick={() => setWizardSpellbookModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: wizardSpellbookCount > 0 ? "#0f766e" : "#075985",
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

                if (characterClass === "wizard" && feature?.id === "spell_mastery") {
                  const isOver = wizardSpellMasteryCount > 2;
                  const isUnder = wizardSpellMasteryCount < 2;
                  return (
                    <Tooltip arrow title={`Choose Spell Mastery spells (${wizardSpellMasteryCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Spell Mastery spells"
                        onClick={() => setWizardSpellMasteryModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
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

                if (characterClass === "wizard" && feature?.id === "signature_spells") {
                  const isOver = wizardSignatureSpellCount > 2;
                  const isUnder = wizardSignatureSpellCount < 2;
                  return (
                    <Tooltip arrow title={`Choose Signature Spells (${wizardSignatureSpellCount}/2)`}>
                      <IconButton
                        size="small"
                        aria-label="Choose Signature Spells"
                        onClick={() => setWizardSignatureSpellsModalOpen(true)}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#0f766e",
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

                if (characterClass === "ranger" && subclass === "hunter") {
                  const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
                    ? feature.untrackedChoiceOptions
                    : [];
                  if (choiceOptions.length > 0) {
                    const baseName = String(feature?.name || "").replace(/\s*\(.*\)\s*$/, "") || "Feature";
                    const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
                    const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;
                    const label = selected?.name
                      ? `Change ${baseName} (${selected.name})`
                      : `Choose ${baseName}`;

                    return (
                      <Tooltip arrow title={label}>
                        <IconButton
                          size="small"
                          aria-label={label}
                          onClick={() => setFeatureChoiceModal({ open: true, featureId: feature.id })}
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
                  }
                }

                if (characterClass === "warlock" && subclass === "genie" && feature?.id === "genies_vessel") {
                  const selected = getGenieKindData(characterInfo?.genieKind);
                  const label = selected?.name ? `Change Genie Kind (${selected.name})` : "Choose Genie Kind";

                  return (
                    <Tooltip arrow title={label}>
                      <IconButton
                        size="small"
                        aria-label={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGenieKindModalOpen(true);
                        }}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: "rgba(93, 64, 55, 0.92)",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: "rgba(244, 233, 221, 0.65)",
                          "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                        }}
                      >
                        <GenieLampIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (
                  (characterClass === "sorcerer" || characterClass === "sorceror") &&
                  subclass === "wildMagic" &&
                  feature?.id === "wild_magic_surge"
                ) {
                  const label = "Open Wild Magic Surge table";

                  return (
                    <Tooltip arrow title={label}>
                      <IconButton
                        size="small"
                        aria-label={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setWildMagicSurgeModalOpen(true);
                        }}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: "rgba(93, 64, 55, 0.92)",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: "rgba(244, 233, 221, 0.65)",
                          "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                        }}
                      >
                        <MagicSparklesIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (characterClass === "sorcerer" && subclass === "draconicBloodline" && feature?.id === "dragon_ancestor") {
                  const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
                    ? feature.untrackedChoiceOptions
                    : [];
                  if (choiceOptions.length > 0) {
                    const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
                    const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;
                    const label = selected?.name ? `Change Dragon Ancestor (${selected.name})` : "Choose Dragon Ancestor";

                    return (
                      <Tooltip arrow title={label}>
                        <IconButton
                          size="small"
                          aria-label={label}
                          onClick={() => setFeatureChoiceModal({ open: true, featureId: feature.id })}
                          sx={{
                            ml: 0.25,
                            p: 0.25,
                            color: "rgba(93, 64, 55, 0.92)",
                            border: "1px solid rgba(93, 64, 55, 0.25)",
                            backgroundColor: "rgba(244, 233, 221, 0.65)",
                            "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                          }}
                        >
                          <DragonHeadIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    );
                  }
                }

                if (
                  characterClass === "barbarian" &&
                  subclass === "totemWarrior" &&
                  ["totem_spirit", "aspect_of_the_beast", "totemic_attunement"].includes(String(feature?.id || ""))
                ) {
                  const choiceOptions = Array.isArray(feature?.untrackedChoiceOptions)
                    ? feature.untrackedChoiceOptions
                    : [];
                  if (choiceOptions.length > 0) {
                    const baseName = String(feature?.name || "").replace(/\s*\(.*\)\s*$/, "") || "Feature";
                    const selectedId = getFeatureChoice(untrackedFeatureChoices, subclassChoiceKey, feature.id);
                    const selected = choiceOptions.find((opt) => String(opt?.id || "") === selectedId) || null;
                    const label = selected?.name
                      ? `Change ${baseName} (${selected.name})`
                      : `Choose ${baseName}`;

                    return (
                      <Tooltip arrow title={label}>
                        <IconButton
                          size="small"
                          aria-label={label}
                          onClick={() => setFeatureChoiceModal({ open: true, featureId: feature.id })}
                          sx={{
                            ml: 0.25,
                            p: 0.25,
                            color: "rgba(93, 64, 55, 0.92)",
                            border: "1px solid rgba(93, 64, 55, 0.25)",
                            backgroundColor: "rgba(244, 233, 221, 0.65)",
                            "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                          }}
                        >
                          <TotemAnimalIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    );
                  }
                }

                if (characterClass === "sorcerer" && subclass === "divineSoul" && feature?.id === "divine_magic") {
                  const selectedId = String(characterInfo?.divineSoulAffinity || "");
                  const selected =
                    DIVINE_SOUL_AFFINITY_OPTIONS.find((opt) => String(opt?.id || "") === selectedId) || null;
                  const label = selected?.name ? `Change Divine Affinity (${selected.name})` : "Choose Divine Affinity";

                  return (
                    <Tooltip arrow title={label}>
                      <IconButton
                        size="small"
                        aria-label={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDivineSoulAffinityModalOpen(true);
                        }}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: "rgba(93, 64, 55, 0.92)",
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

                if (characterClass === "sorcerer" && subclass === "lunarSorcery" && feature?.id === "lunar_embodiment") {
                  const phaseId = String(characterInfo?.lunarEmbodimentPhase || "full");
                  const phaseLabel =
                    phaseId === "new" ? "New Moon" : phaseId === "crescent" ? "Crescent Moon" : "Full Moon";
                  const label = `Lunar Embodiment Phase (${phaseLabel})`;

                  return (
                    <Tooltip arrow title={label}>
                      <IconButton
                        size="small"
                        aria-label={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLunarEmbodimentModalOpen(true);
                        }}
                        sx={{
                          ml: 0.25,
                          p: 0.25,
                          color: "rgba(93, 64, 55, 0.92)",
                          border: "1px solid rgba(93, 64, 55, 0.25)",
                          backgroundColor: "rgba(244, 233, 221, 0.65)",
                          "&:hover": { backgroundColor: "rgba(244, 233, 221, 0.85)" },
                        }}
                      >
                        <Brightness2Icon fontSize="inherit" />
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
              intelligenceModValue={intelligenceModValue}
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
              intelligenceModValue={intelligenceModValue}
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
              intelligenceModValue={intelligenceModValue}
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

      <WarlockInvocationsModal
        open={warlockInvocationsModalOpen}
        onClose={() => setWarlockInvocationsModalOpen(false)}
      />

      <WarlockPactBoonModal
        open={warlockPactBoonModalOpen}
        onClose={() => setWarlockPactBoonModalOpen(false)}
      />

      <WarlockMysticArcanumModal
        open={warlockMysticArcanumModalOpen}
        onClose={() => setWarlockMysticArcanumModalOpen(false)}
      />

      <MetamagicOptionsModal
        open={metamagicOptionsModalOpen}
        onClose={() => setMetamagicOptionsModalOpen(false)}
      />

      <FeatureChoiceModal
        open={Boolean(featureChoiceModal?.open)}
        onClose={() => setFeatureChoiceModal({ open: false, featureId: "" })}
        title={activeChoiceFeature?.name || "Choose Option"}
        helperText={
          characterClass === "barbarian" &&
          subclass === "totemWarrior" &&
          ["totem_spirit", "aspect_of_the_beast", "totemic_attunement"].includes(String(activeChoiceFeature?.id || ""))
            ? "Choose one animal. The selected animal is shown in the feature description, and the other options stay tucked inside this picker."
            : "Choose one option. This feature is untracked (no uses are tracked here)."
        }
        options={activeChoiceFeature?.untrackedChoiceOptions || []}
        selectedId={getFeatureChoice(
          untrackedFeatureChoices,
          subclassChoiceKey,
          String(featureChoiceModal?.featureId || "")
        )}
        onSelect={(optionId) => {
          const featureId = String(featureChoiceModal?.featureId || "");
          if (!featureId) return;
          setUntrackedFeatureChoices((prev) =>
            setFeatureChoice(prev, subclassChoiceKey, featureId, optionId)
          );
          setFeatureChoiceModal({ open: false, featureId: "" });
        }}
      />

      <FeatureChoiceModal
        open={divineSoulAffinityModalOpen}
        onClose={() => setDivineSoulAffinityModalOpen(false)}
        title="Divine Magic: Affinity"
        helperText="Choose an affinity for the source of your divine power. This adds a free DM spell in the spell tracker (does not count against spells known)."
        options={DIVINE_SOUL_AFFINITY_OPTIONS}
        selectedId={String(characterInfo?.divineSoulAffinity || "")}
        onSelect={(optionId) => {
          setCharacterInfo((prev) => ({ ...prev, divineSoulAffinity: String(optionId || "") }));
        }}
      />

      <FeatureChoiceModal
        open={genieKindModalOpen}
        onClose={() => setGenieKindModalOpen(false)}
        title="Genie Kind"
        helperText="Choose your patron's kind. This updates Genie's Wrath, Elemental Gift, and the extra Genie expanded spells available to you."
        options={GENIE_KIND_OPTIONS}
        selectedId={String(characterInfo?.genieKind || "")}
        onSelect={(optionId) => {
          setCharacterInfo((prev) => ({ ...prev, genieKind: String(optionId || "") }));
          setGenieKindModalOpen(false);
        }}
        allowClear={false}
      />

      <LunarEmbodimentPhaseModal
        open={lunarEmbodimentModalOpen}
        onClose={() => setLunarEmbodimentModalOpen(false)}
        sorcererLevel={sorcererLevel}
        selectedPhaseId={String(characterInfo?.lunarEmbodimentPhase || "full")}
        onSelectPhase={(phaseId) => {
          setCharacterInfo((prev) => ({ ...prev, lunarEmbodimentPhase: String(phaseId || "full") }));
        }}
      />

      <WildMagicSurgeTableModal
        open={wildMagicSurgeModalOpen}
        onClose={() => setWildMagicSurgeModalOpen(false)}
      />

      <ArcaneMasteryModal
        open={arcaneMasteryModalOpen}
        onClose={() => setArcaneMasteryModalOpen(false)}
      />

      <WizardSpellbookModal
        open={wizardSpellbookModalOpen}
        onClose={() => setWizardSpellbookModalOpen(false)}
      />

      <WizardSpellMasteryModal
        open={wizardSpellMasteryModalOpen}
        onClose={() => setWizardSpellMasteryModalOpen(false)}
      />

      <WizardSignatureSpellsModal
        open={wizardSignatureSpellsModalOpen}
        onClose={() => setWizardSignatureSpellsModalOpen(false)}
      />

      <WizardMasterScrivinerModal
        open={wizardMasterScrivinerModalOpen}
        onClose={() => setWizardMasterScrivinerModalOpen(false)}
      />

      <WizardOneWithTheWordModal
        open={wizardOneWithTheWordModalOpen}
        onClose={() => setWizardOneWithTheWordModalOpen(false)}
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

