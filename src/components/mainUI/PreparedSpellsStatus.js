import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { CharacterInfoContext } from "../../Contexts/Context";
import { calculateActualPreparedSpells, calculateTotalPreparedSpells } from "../../utils/preparedSpells";

export const PreparedSpellsStatus = ({ label = "Spell Tracker", typographySx = null }) => {
  const { characterInfo } = useContext(CharacterInfoContext);

  const totalPreparedSpells = calculateTotalPreparedSpells(characterInfo);
  const actualPreparedSpells = calculateActualPreparedSpells(characterInfo);

  const isPreparedOverLimit =
    totalPreparedSpells > 0 && actualPreparedSpells > totalPreparedSpells;
  const overLimitBy = Math.max(0, actualPreparedSpells - totalPreparedSpells);

  const isPreparedAtLimit =
    totalPreparedSpells > 0 && actualPreparedSpells === totalPreparedSpells;
  const isPreparedUnderLimit =
    totalPreparedSpells > 0 && actualPreparedSpells < totalPreparedSpells;
  const underLimitBy = Math.max(0, totalPreparedSpells - actualPreparedSpells);

  const actualPreparedTextColor =
    isPreparedOverLimit || isPreparedUnderLimit || isPreparedAtLimit ? "#111827" : "#3e2723";

  const overSpellWord = overLimitBy === 1 ? "spell" : "spells";
  const underSpellWord = underLimitBy === 1 ? "spell" : "spells";

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <Box sx={{ py: 0.25 }}>
          {isPreparedOverLimit && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 900,
                color: "#3e2723",
                mb: 0.75,
                px: 0.75,
                py: 0.35,
                borderRadius: 1,
                backgroundColor: "rgba(194, 65, 12, 0.14)",
                border: "1px solid rgba(194, 65, 12, 0.35)",
              }}
            >
              *You have prepared more spells than allowed*
            </Typography>
          )}
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Total Prepared Spells: {totalPreparedSpells}
          </Typography>
          <Typography variant="body2">
            Actual # of Spells Prepared:{" "}
            <Box
              component="span"
              sx={{
                fontWeight: isPreparedOverLimit ? 900 : 800,
                color: actualPreparedTextColor,
                ...(isPreparedOverLimit || isPreparedUnderLimit || isPreparedAtLimit
                  ? {
                      display: "inline-block",
                      px: 0.75,
                      py: 0.15,
                      borderRadius: 1,
                      textShadow: "0 0 1px rgba(255, 255, 255, 0.70)",
                    }
                  : null),
                ...(isPreparedOverLimit
                  ? {
                      backgroundColor: "rgba(194, 65, 12, 0.14)",
                      border: "1px solid rgba(194, 65, 12, 0.40)",
                    }
                  : null),
                ...(isPreparedUnderLimit
                  ? {
                      backgroundColor: "rgba(2, 132, 199, 0.14)",
                      border: "1px solid rgba(2, 132, 199, 0.40)",
                    }
                  : null),
                ...(isPreparedAtLimit
                  ? {
                      backgroundColor: "rgba(46, 125, 50, 0.14)",
                      border: "1px solid rgba(46, 125, 50, 0.40)",
                    }
                  : null),
              }}
            >
              {actualPreparedSpells}
            </Box>
          </Typography>
          {isPreparedOverLimit && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                mt: 0.85,
                px: 0.75,
                py: 0.35,
                borderRadius: 1,
                backgroundColor: "rgba(194, 65, 12, 0.10)",
                border: "1px solid rgba(194, 65, 12, 0.28)",
              }}
            >
              *Please unprepare {overLimitBy} {overSpellWord} or add a new magic item or boon to your
              character sheet to accurately reflect the number of prepared spells you have
              available*
            </Typography>
          )}
          {isPreparedUnderLimit && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 800,
                mt: 0.85,
                px: 0.75,
                py: 0.35,
                borderRadius: 1,
                backgroundColor: "rgba(2, 132, 199, 0.10)",
                border: "1px solid rgba(2, 132, 199, 0.28)",
              }}
            >
              You can prepare {underLimitBy} more {underSpellWord}.
            </Typography>
          )}
        </Box>
      }
    >
      <Typography
        sx={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "18px",
          color: isPreparedOverLimit ? "#b71c1c" : isPreparedUnderLimit ? "#075985" : "#3e2723",
          textTransform: "uppercase",
          letterSpacing: "1px",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          ...(isPreparedOverLimit
            ? {
                "@keyframes preparedOverLimitPulse": {
                  "0%": { transform: "translateY(0px) scale(1)", textShadow: "none" },
                  "100%": {
                    transform: "translateY(-1px) scale(1.02)",
                    textShadow: "0 0 10px rgba(183, 28, 28, 0.25)",
                  },
                },
                animation: "preparedOverLimitPulse 1.6s ease-in-out infinite alternate",
              }
            : isPreparedUnderLimit
              ? {
                  "@keyframes preparedUnderLimitPulse": {
                    "0%": { transform: "translateY(0px) scale(1)", textShadow: "none" },
                    "100%": {
                      transform: "translateY(-1px) scale(1.02)",
                      textShadow: "0 0 10px rgba(2, 132, 199, 0.22)",
                    },
                  },
                  animation: "preparedUnderLimitPulse 1.8s ease-in-out infinite alternate",
                }
              : null),
          ...(typographySx || null),
        }}
      >
        {label}
      </Typography>
    </Tooltip>
  );
};

export default PreparedSpellsStatus;

