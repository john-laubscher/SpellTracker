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
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { AuthContext, CharacterInfoContext } from "../../Contexts/Context"; // Adjust the path based on your project structure
import classesData from "../../components/ClassesData"; // Adjust the path based on your project structure
import { HalfElfVersatilityArr, RaceFeaturesData } from "../../components/RacesData";
import AddFeatureModal from "./AddFeatureModal";
import ManageFeaturesModal from "./ManageFeaturesModal";
import ConfirmDialog from "./ConfirmDialog";
import EditCustomFeatureModal from "./EditCustomFeatureModal";
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

// Reusable FeatureDisplay component
const FeatureDisplay = ({
  title,
  features,
  untrackedLabel,
  addTooltip,
  onAdd,
  manageTooltip,
  onManage,
  proficiencyBonusValue,
  characterClass,
  characterLevel,
}) => {
  const trackedFeatures = features.filter((feature) => feature.tracked);
  const untrackedFeatures = features.filter((feature) => !feature.tracked);
  const [showHeaderActions, setShowHeaderActions] = React.useState(false);
  const touchHideTimerRef = React.useRef(null);
  const [stackingChecksById, setStackingChecksById] = React.useState({});

  React.useEffect(() => {
    return () => {
      if (touchHideTimerRef.current) window.clearTimeout(touchHideTimerRef.current);
    };
  }, []);

  const getUsesCount = (feature) => {
    if (feature?.recharge === "rage") return 1;
    if (Array.isArray(feature?.usesByLevel) && Number.isFinite(characterLevel)) {
      const sorted = [...feature.usesByLevel].sort((a, b) => (a?.level || 0) - (b?.level || 0));
      const match = sorted.reduce((acc, cur) => {
        if (!cur || !Number.isFinite(cur.level)) return acc;
        if (cur.level <= characterLevel) return cur;
        return acc;
      }, null);
      if (match?.uses === "unlimited") return "unlimited";
      if (typeof match?.uses === "number" && Number.isFinite(match.uses) && match.uses > 0) return match.uses;
    }
    if (feature?.uses === "pb") return Number(proficiencyBonusValue) || 1;
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
          <Tooltip title={manageTooltip || "Manage features"} arrow>
            <IconButton
              size="small"
              onClick={onManage}
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
          </Tooltip>
        ) : null}

        {onAdd ? (
          <Tooltip title={addTooltip || 'Add custom feature'} arrow>
            <IconButton size="small" onClick={onAdd} sx={{ mt: '-2px' }}>
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>

      {trackedFeatures.map((feature) => (
        <div key={feature.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <Tooltip
            title={
              feature?.trackedMode === "stackingChecks" ? (
                <div style={{ maxWidth: 340 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, mb: 0.5 }}>
                    CURRENT DC: {10 + (Number(stackingChecksById?.[feature.id]) || 0) * 5}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>{feature.desc}</Typography>
                </div>
              ) : (
                feature.desc
              )
            }
            arrow
          >
            <Typography sx={{ fontSize: '14px', cursor: 'pointer' }}>
              {feature.name}
            </Typography>
          </Tooltip>

          {(() => {
            const usesCount = getUsesCount(feature);

            if (feature?.trackedMode === "stackingChecks") {
              const checkedCount = Math.max(0, Math.min(Number(stackingChecksById?.[feature.id]) || 0, feature?.maxChecks || 10));
              const maxChecks = Math.max(1, Math.min(Number(feature?.maxChecks) || 10, 10));
              const totalBoxes = Math.min(checkedCount + 1, maxChecks);

              return Array.from({ length: totalBoxes }).map((_, idx) => (
                <Checkbox
                  key={`${feature.id}:stack:${idx}`}
                  checked={idx < checkedCount}
                  onChange={(e) => {
                    const nextChecked = e.target.checked;
                    setStackingChecksById((prev) => {
                      const prevCount = Math.max(0, Math.min(Number(prev?.[feature.id]) || 0, maxChecks));
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
                  sx={{ ml: idx === 0 ? 0.5 : 0, p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
                />
              ));
            }

            if (usesCount === "unlimited") {
              return (
                <Typography
                  sx={{
                    ml: 1,
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
              );
            }

            return Array.from({ length: usesCount }).map((_, idx) => (
              <Checkbox
                key={`${feature.id}:use:${idx}`}
                defaultChecked={false}
                size="small"
                sx={{ ml: idx === 0 ? 0.5 : 0, p: 0.25, color: "#8B4513", "&.Mui-checked": { color: "#8B4513" } }}
              />
            ));
          })()}
        </div>
      ))}

      {untrackedFeatures.length > 0 && (
        <Accordion disableGutters elevation={0} sx={{
          backgroundColor: 'transparent',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
            sx={{ minHeight: 28, px: 0.5, py: 0, '& .MuiAccordionSummary-content': { margin: '2px 0' }, '&.Mui-expanded': { minHeight: 28 } }}
          >
            <Typography sx={{ fontSize: '13px', color: '#5d4037' }}>{untrackedLabel || 'Other Features'}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1, py: 0.5 }}>
            {untrackedFeatures.map((feature) => (
              <Tooltip key={feature.id} title={feature.desc} arrow>
                <Typography sx={{ fontSize: '13px', cursor: 'pointer', py: 0.25 }}>
                  {feature.name}
                </Typography>
              </Tooltip>
            ))}
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

  const [customFeatures, setCustomFeatures] = React.useState([]);
  const [addModal, setAddModal] = React.useState({ open: false, kind: "class" });
  const [manageModal, setManageModal] = React.useState({ open: false, kind: "class" });
  const [featureOverrides, setFeatureOverrides] = React.useState(() => loadFeatureOverrides());
  const [editingCustom, setEditingCustom] = React.useState(null);
  const [deletingCustom, setDeletingCustom] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

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
              proficiencyBonusValue={proficiencyBonusValue}
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

