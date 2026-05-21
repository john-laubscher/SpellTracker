import React, { useContext } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatshotIcon from "@mui/icons-material/Whatshot";

import { CharacterInfoContext } from "../../Contexts/Context";
import classesData from "../../components/ClassesData";
import FourElementsDisciplinesModal from "./FourElementsDisciplinesModal";

const clampInt = (v, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
};

const proficiencyBonusForLevel = (level) => {
  const l = clampInt(level, 0, 20);
  if (l >= 17) return 6;
  if (l >= 13) return 5;
  if (l >= 9) return 4;
  if (l >= 5) return 3;
  return 2;
};

const normalizeId = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const allowedExtraDisciplinesByLevel = (monkLevel) => {
  const l = clampInt(monkLevel, 0, 20);
  if (l < 3) return 0;
  return 1 + (l >= 6 ? 1 : 0) + (l >= 11 ? 1 : 0) + (l >= 17 ? 1 : 0);
};

// PHB: Way of the Four Elements "Spells and Ki Points" table (as shown on wikidot).
const maxKiPointsForSpellByLevel = (monkLevel) => {
  const l = clampInt(monkLevel, 0, 20);
  if (l < 5) return null;
  if (l <= 8) return 3;
  if (l <= 12) return 4;
  if (l <= 16) return 5;
  return 6;
};

const buildMonkKiUses = (level, subclass) => {
  const uses = [];
  const l = clampInt(level, 0, 20);
  const sc = String(subclass || "");

  if (l < 2) return uses;

  uses.push(
    {
      name: "Flurry of Blows",
      costLabel: "1 ki",
      desc: [
        "After you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.",
      ],
    },
    {
      name: "Patient Defense",
      costLabel: "1 ki",
      desc: ["You can spend 1 ki point to take the Dodge action as a bonus action on your turn."],
    },
    {
      name: "Step of the Wind",
      costLabel: "1 ki",
      desc: [
        "You can spend 1 ki point to take the Disengage or Dash action as a bonus action on your turn.",
        "Your jump distance is doubled for the turn.",
      ],
    }
  );

  if (l >= 3) {
    uses.push({
      name: "Deflect Missiles (throw it back)",
      costLabel: "1 ki",
      desc: [
        "When you reduce the damage of a ranged weapon attack to 0 using Deflect Missiles, you can spend 1 ki point to make a ranged attack with the caught missile as part of the same reaction.",
      ],
    });

    if (sc === "mercy") {
      uses.push(
        {
          name: "Hands of Healing",
          costLabel: "1 ki",
          desc: [
            "As an action, spend 1 ki point to touch a creature and restore hit points equal to a roll of your Martial Arts die + your Wisdom modifier.",
            "When you use Flurry of Blows, you can replace one unarmed strike with this healing without spending the ki point.",
            "At Monk level 6, you can also end one disease or one condition on the creature (blinded, deafened, paralyzed, poisoned, or stunned).",
            "At Monk level 11, you can replace each Flurry of Blows strike with this healing (no ki for the healing).",
          ],
        },
        {
          name: "Hands of Harm",
          costLabel: "1 ki",
          desc: [
            "When you hit a creature with an unarmed strike, you can spend 1 ki point to deal extra necrotic damage equal to one roll of your Martial Arts die + your Wisdom modifier.",
            "You can use this feature only once per turn.",
            "At Monk level 6, you can poison the target until the end of your next turn.",
            "At Monk level 11, you can use this with a Flurry of Blows unarmed strike without spending the ki point (still only once per turn).",
          ],
        }
      );
    }

    if (sc === "astralSelf") {
      uses.push({
        name: "Arms of the Astral Self",
        costLabel: "1 ki",
        desc: [
          "As a bonus action, you can spend 1 ki point to summon the arms of your astral self for 10 minutes.",
          "When you do so, each creature of your choice that you can see within 10 feet of you must succeed on a Dexterity saving throw or take force damage equal to two rolls of your Martial Arts die.",
          "While the arms are present, you can use Wisdom in place of Strength for Strength checks and saving throws.",
          "You can make unarmed strikes with the arms: reach +5 feet, can use Wisdom for attack/damage, and the damage type is force.",
        ],
      });

      if (l >= 6) {
        uses.push({
          name: "Visage of the Astral Self",
          costLabel: "1 ki",
          desc: [
            "As a bonus action (or as part of summoning your astral arms), you can spend 1 ki point to summon your astral visage for 10 minutes.",
            "Astral Sight: see normally in magical and nonmagical darkness out to 120 feet.",
            "Wisdom of the Spirit: advantage on Insight and Intimidation checks.",
            "Word of the Spirit: direct your speech to a creature you can see within 60 feet so only it can hear you, or amplify your voice to be heard within 600 feet.",
          ],
        });
      }
    }

    if (sc === "drunkenMaster") {
      if (l >= 6) {
        uses.push({
          name: "Redirect Attack (Tipsy Sway)",
          costLabel: "1 ki",
          desc: [
            "When a creature misses you with a melee attack roll, you can spend 1 ki point as a reaction",
            "to cause that attack to hit one creature of your choice, other than the attacker,",
            "that you can see within 5 feet of you.",
          ],
        });
      }

      if (l >= 11) {
        uses.push({
          name: "Drunkard's Luck",
          costLabel: "2 ki",
          desc: [
            "When you make an ability check, an attack roll, or a saving throw and have disadvantage,",
            "you can spend 2 ki points to cancel the disadvantage for that roll.",
          ],
        });
      }
    }

    if (sc === "kensei") {
      if (l >= 6) {
        uses.push({
          name: "Deft Strike",
          costLabel: "1 ki",
          desc: [
            "When you hit a target with a kensei weapon, you can spend 1 ki point to deal extra damage equal to your Martial Arts die.",
            "You can use this only once on each of your turns.",
          ],
        });
      }

      if (l >= 11) {
        uses.push({
          name: "Sharpen the Blade",
          costLabel: "1-3 ki",
          desc: [
            "As a bonus action, you can expend up to 3 ki points to grant one kensei weapon you touch a bonus to attack and damage rolls.",
            "The bonus equals the number of ki points spent and lasts for 1 minute (or until you use this feature again).",
            "This has no effect on a magic weapon that already has a bonus to attack and damage rolls.",
          ],
        });
      }
    }

    if (sc === "longDeath") {
      if (l >= 11) {
        uses.push({
          name: "Mastery of Death",
          costLabel: "1 ki",
          desc: [
            "When you are reduced to 0 hit points, you can expend 1 ki point (no action required) to have 1 hit point instead.",
          ],
        });
      }

      if (l >= 17) {
        uses.push({
          name: "Touch of the Long Death",
          costLabel: "1-10 ki",
          desc: [
            "As an action, you touch one creature within 5 feet of you and expend 1 to 10 ki points.",
            "The target makes a Constitution saving throw, taking 2d10 necrotic damage per ki point spent on a failed save, or half as much on a successful one.",
          ],
        });
      }
    }

    if (sc === "openHand") {
      if (l >= 17) {
        uses.push({
          name: "Quivering Palm",
          costLabel: "3 ki",
          desc: [
            "When you hit a creature with an unarmed strike, you can spend 3 ki points to start subtle vibrations in it.",
            "Before the vibrations expire, you can use your action to end them if you're on the same plane. The target makes a Constitution save: on a failure it drops to 0 hit points; on a success it takes 10d10 necrotic damage.",
            "Only one creature can be affected at a time; you can also end the vibrations harmlessly.",
          ],
        });
      }
    }
  }

  if (l >= 5) {
    uses.push({
      name: "Stunning Strike",
      costLabel: "1 ki",
      desc: [
        "When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike.",
        "The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.",
      ],
    });
  }

  if (l >= 14) {
    uses.push({
      name: "Diamond Soul (reroll save)",
      costLabel: "1 ki",
      desc: ["When you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result."],
    });
  }

  if (l >= 18) {
    uses.push(
      {
        name: "Empty Body (invisibility)",
        costLabel: "4 ki",
        desc: [
          "You can spend 4 ki points to become invisible for 1 minute.",
          "During that time, you have resistance to all damage but force damage.",
        ],
      },
      {
        name: "Empty Body (astral projection)",
        costLabel: "8 ki",
        desc: [
          "You can spend 8 ki points to cast astral projection without needing material components.",
          "When you do so, you can't take any other creatures with you.",
        ],
      }
    );
  }

  return uses;
};

const buildFourElementsDisciplineUses = (fourElementsExtraIds) => {
  const disciplineDefs = classesData?.monk?.subclasses?.fourElements?.disciplines || [];
  const list = Array.isArray(disciplineDefs) ? disciplineDefs : [];
  const extraIds = Array.isArray(fourElementsExtraIds) ? fourElementsExtraIds : [];

  const normalizedExtraIds = extraIds
    .map((x) => String(x || "").trim())
    .filter(Boolean)
    .filter((id, idx, arr) => arr.indexOf(id) === idx);

  const knownIds = ["elemental_attunement", ...normalizedExtraIds];

  const uses = [];
  knownIds.forEach((id) => {
    const def = list.find((d) => String(d?.id || "") === id);
    if (!def?.name) return;
    uses.push({
      name: def.name,
      costLabel: String(def?.costLabel || ""),
      desc: def?.desc || "",
    });
  });

  return uses;
};

const KiUseAccordionRow = ({ useItem }) => {
  const [expanded, setExpanded] = React.useState(false);
  const descLines = Array.isArray(useItem?.desc) ? useItem.desc : useItem?.desc ? [useItem.desc] : [];
  const costLabel = String(useItem?.costLabel || "").trim();

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
        expandIcon={<ExpandMoreIcon sx={{ fontSize: "18px" }} />}
        aria-controls={`${useItem.id}-ki-use-content`}
        id={`${useItem.id}-ki-use-header`}
        sx={{
          minHeight: 32,
          px: 1,
          py: 0,
          "& .MuiAccordionSummary-expandIconWrapper": {
            width: 28,
            justifyContent: "center",
            marginLeft: 0,
          },
          "& .MuiAccordionSummary-content": {
            margin: "4px 0 !important",
            alignItems: "center",
            gap: 0.75,
            width: "100%",
            display: "flex",
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: "4px 0 !important",
          },
          "&.Mui-expanded": { minHeight: 32 },
        }}
      >
        <Typography sx={{ fontSize: "14px", fontWeight: 600, flexGrow: 1, minWidth: 0 }}>
          {useItem.name}
        </Typography>
        {costLabel ? (
          <Chip
            size="small"
            label={costLabel}
            sx={{
              height: 18,
              fontSize: "11px",
              fontWeight: 800,
              opacity: 0.85,
              backgroundColor: "rgba(46, 125, 50, 0.10)",
              color: "rgba(46, 125, 50, 0.95)",
              border: "1px solid rgba(46, 125, 50, 0.30)",
            }}
          />
        ) : null}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          px: 2,
          py: 1,
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "4px",
          mx: 1,
          mb: 0.5,
        }}
      >
        <Typography component="div" sx={{ fontSize: "13px", "& p": { margin: "2px 0" } }}>
          {descLines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const MonkKiUsesPanel = () => {
  const { characterInfo, setCharacterInfo } = useContext(CharacterInfoContext);

  const level = clampInt(characterInfo?.characterLevel, 0, 20);
  const subclass = String(characterInfo?.subclass || "");
  const wisdomMod = Number(characterInfo?.stats?.wis?.mod ?? characterInfo?.stats?.wisdom?.mod ?? 0) || 0;
  const proficiencyBonus = proficiencyBonusForLevel(level);
  const kiSaveDc = 8 + proficiencyBonus + wisdomMod;

  const isFourElements = subclass === "fourElements";
  const allowedExtraDisciplines = React.useMemo(() => allowedExtraDisciplinesByLevel(level), [level]);
  const selectedExtraDisciplines = React.useMemo(() => {
    return Array.isArray(characterInfo?.fourElementsDisciplines) ? characterInfo.fourElementsDisciplines : [];
  }, [characterInfo?.fourElementsDisciplines]);
  const selectedExtraCount = selectedExtraDisciplines.length;

  const [disciplinesModalOpen, setDisciplinesModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isFourElements) return;
    if (allowedExtraDisciplines <= 0) return;
    if (selectedExtraCount > 0) return;
    const defs = classesData?.monk?.subclasses?.fourElements?.disciplines || [];
    const list = Array.isArray(defs) ? defs : [];
    const defaultId =
      list.find((d) => d?.id === "fangs_of_the_fire_snake")?.id ||
      list.find((d) => d?.id && d.id !== "elemental_attunement")?.id ||
      "";
    if (!defaultId) return;
    setCharacterInfo((prev) => {
      const current = Array.isArray(prev?.fourElementsDisciplines) ? prev.fourElementsDisciplines : [];
      if (current.length > 0) return prev;
      return { ...prev, fourElementsDisciplines: [defaultId] };
    });
  }, [isFourElements, allowedExtraDisciplines, selectedExtraCount, setCharacterInfo]);

  const uses = React.useMemo(() => {
    const list = buildMonkKiUses(level, subclass);
    return list.map((u) => ({ ...u, id: normalizeId(u.name) || normalizeId(u.id) || "ki_use" }));
  }, [level, subclass]);

  const disciplineUses = React.useMemo(() => {
    if (!isFourElements) return [];
    if (level < 3) return [];
    const list = buildFourElementsDisciplineUses(selectedExtraDisciplines);
    return list.map((u) => ({ ...u, id: normalizeId(u.name) || normalizeId(u.id) || "discipline" }));
  }, [isFourElements, level, selectedExtraDisciplines]);

  const disciplineStatus = React.useMemo(() => {
    const total = Math.max(0, Number(allowedExtraDisciplines) || 0);
    const actual = Math.max(0, Number(selectedExtraCount) || 0);
    if (total <= 0) return { state: "locked", color: "rgba(124, 45, 18, 0.95)" };
    if (actual > total) return { state: "over", color: "#b71c1c" };
    if (actual < total) return { state: "under", color: "#075985" };
    return { state: "at", color: "rgba(46, 125, 50, 0.95)" };
  }, [allowedExtraDisciplines, selectedExtraCount]);

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "18px",
              color: "#3e2723",
              letterSpacing: "1px",
            }}
          >
            Ki Uses
          </Typography>
          {level >= 2 ? (
            <Typography sx={{ fontSize: "12px", fontWeight: 700, opacity: 0.75 }}>
              Ki Save DC: {kiSaveDc}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {uses.length === 0 ? (
        <Typography sx={{ opacity: 0.75, fontStyle: "italic" }}>
          Ki features unlock at Monk level 2.
        </Typography>
      ) : (
        <Box>
          {uses.map((u) => (
            <KiUseAccordionRow key={u.id} useItem={u} />
          ))}
          {isFourElements && disciplineUses.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    <Typography variant="body2" sx={{ fontWeight: 800, py: 0.25 }}>
                      Max Ki Points for a Spell:{" "}
                      {maxKiPointsForSpellByLevel(level) == null
                        ? "— (Monk level 5+)"
                        : maxKiPointsForSpellByLevel(level)}
                    </Typography>
                  }
                >
                  <Typography
                    sx={{
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#3e2723",
                      letterSpacing: "1px",
                      opacity: 0.95,
                      cursor: "help",
                    }}
                  >
                    Elemental Disciplines
                  </Typography>
                </Tooltip>
                <Tooltip
                  arrow
                  placement="top"
                  title={
                      <Box sx={{ py: 0.25 }}>
                        {allowedExtraDisciplines <= 0 ? (
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            Unlocks at Monk level 3.
                          </Typography>
                        ) : (
                          <>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                              Allowed choices: {allowedExtraDisciplines}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                              Selected: {selectedExtraCount}
                            </Typography>
                            {disciplineStatus.state === "over" ? (
                              <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 900 }}>
                                *Too many disciplines selected*
                              </Typography>
                            ) : disciplineStatus.state === "under" ? (
                              <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 900 }}>
                                *You can choose more disciplines*
                              </Typography>
                            ) : disciplineStatus.state === "at" ? (
                              <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 900 }}>
                                *Correct number of disciplines selected*
                              </Typography>
                            ) : null}
                            <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
                              Elemental Attunement is always known.
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  >
                    <IconButton
                      size="small"
                      aria-label="Choose elemental disciplines"
                      onClick={() => setDisciplinesModalOpen(true)}
                      sx={{
                        p: 0.25,
                        color: disciplineStatus.color,
                        border: `1px solid ${disciplineStatus.state === "over"
                          ? "rgba(183, 28, 28, 0.40)"
                          : disciplineStatus.state === "under"
                            ? "rgba(2, 132, 199, 0.40)"
                            : disciplineStatus.state === "at"
                              ? "rgba(46, 125, 50, 0.40)"
                              : "rgba(124, 45, 18, 0.22)"}`,
                        backgroundColor:
                          disciplineStatus.state === "over"
                            ? "rgba(183, 28, 28, 0.06)"
                            : disciplineStatus.state === "under"
                              ? "rgba(2, 132, 199, 0.06)"
                              : disciplineStatus.state === "at"
                                ? "rgba(46, 125, 50, 0.06)"
                                : "rgba(124, 45, 18, 0.06)",
                        "&:hover": {
                          backgroundColor:
                            disciplineStatus.state === "over"
                              ? "rgba(183, 28, 28, 0.10)"
                              : disciplineStatus.state === "under"
                                ? "rgba(2, 132, 199, 0.10)"
                                : disciplineStatus.state === "at"
                                  ? "rgba(46, 125, 50, 0.10)"
                                  : "rgba(124, 45, 18, 0.10)",
                        },
                        ...(disciplineStatus.state === "over"
                          ? {
                              "@keyframes disciplinesIconOverPulse": {
                                "0%": { transform: "translateY(0px) scale(1)" },
                                "100%": { transform: "translateY(-1px) scale(1.06)" },
                              },
                              animation: "disciplinesIconOverPulse 1.6s ease-in-out infinite alternate",
                            }
                          : disciplineStatus.state === "under"
                            ? {
                                "@keyframes disciplinesIconUnderPulse": {
                                  "0%": { transform: "translateY(0px) scale(1)" },
                                  "100%": { transform: "translateY(-1px) scale(1.04)" },
                                },
                                animation: "disciplinesIconUnderPulse 1.8s ease-in-out infinite alternate",
                              }
                            : null),
                      }}
                    >
                      <WhatshotIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {disciplineUses.map((u) => (
                <KiUseAccordionRow key={u.id} useItem={u} />
              ))}
            </Box>
          ) : (
            <Typography sx={{ mt: 1, fontSize: "12px", opacity: 0.7 }}>
              Some monk subclasses add additional ki options.
            </Typography>
          )}
        </Box>
      )}

      <FourElementsDisciplinesModal
        open={disciplinesModalOpen}
        onClose={() => setDisciplinesModalOpen(false)}
      />
    </Box>
  );
};

export default MonkKiUsesPanel;
