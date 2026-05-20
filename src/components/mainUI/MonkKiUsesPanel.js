import React, { useContext } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context";

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
  const { characterInfo } = useContext(CharacterInfoContext);

  const level = clampInt(characterInfo?.characterLevel, 0, 20);
  const subclass = String(characterInfo?.subclass || "");
  const wisdomMod = Number(characterInfo?.stats?.wis?.mod ?? characterInfo?.stats?.wisdom?.mod ?? 0) || 0;
  const proficiencyBonus = proficiencyBonusForLevel(level);
  const kiSaveDc = 8 + proficiencyBonus + wisdomMod;

  const uses = React.useMemo(() => {
    const list = buildMonkKiUses(level, subclass);
    return list.map((u) => ({ ...u, id: normalizeId(u.name) || normalizeId(u.id) || "ki_use" }));
  }, [level, subclass]);

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
              textTransform: "uppercase",
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
          <Typography sx={{ mt: 1, fontSize: "12px", opacity: 0.7 }}>
            Some monk subclasses add additional ki options.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MonkKiUsesPanel;
