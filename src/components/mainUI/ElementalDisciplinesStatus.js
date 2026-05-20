import React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const pluralize = (n, one, many) => (Number(n) === 1 ? one : many);

export const ElementalDisciplinesStatus = ({
  label = "Elemental Disciplines",
  totalAllowed = 1,
  actualSelected = 0,
  includeAttunementNote = true,
  typographySx = null,
}) => {
  const total = Math.max(0, Number(totalAllowed) || 0);
  const actual = Math.max(0, Number(actualSelected) || 0);

  const isOver = total > 0 && actual > total;
  const isAt = total > 0 && actual === total;
  const isUnder = total > 0 && actual < total;

  const overBy = Math.max(0, actual - total);
  const underBy = Math.max(0, total - actual);

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <Box sx={{ py: 0.25 }}>
          {total <= 0 ? (
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              Unlocks at Monk level 3.
            </Typography>
          ) : (
            <>
              {isOver && (
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
                  *You have chosen more disciplines than allowed*
                </Typography>
              )}

              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Allowed (choices): {total}
              </Typography>
              <Typography variant="body2">
                Selected:{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: isOver ? 900 : 800,
                    color: "#111827",
                    display: "inline-block",
                    px: 0.75,
                    py: 0.15,
                    borderRadius: 1,
                    textShadow: "0 0 1px rgba(255, 255, 255, 0.70)",
                    ...(isOver
                      ? {
                          backgroundColor: "rgba(194, 65, 12, 0.14)",
                          border: "1px solid rgba(194, 65, 12, 0.40)",
                        }
                      : isUnder
                        ? {
                            backgroundColor: "rgba(2, 132, 199, 0.14)",
                            border: "1px solid rgba(2, 132, 199, 0.40)",
                          }
                        : isAt
                          ? {
                              backgroundColor: "rgba(46, 125, 50, 0.14)",
                              border: "1px solid rgba(46, 125, 50, 0.40)",
                            }
                          : null),
                  }}
                >
                  {actual}
                </Box>
              </Typography>

              {includeAttunementNote && (
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
                  Elemental Attunement is always known (not counted in the choices).
                </Typography>
              )}

              {isOver && (
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
                  *Remove {overBy} {pluralize(overBy, "discipline", "disciplines")} to match the rules*
                </Typography>
              )}
              {isUnder && (
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
                  You can choose {underBy} more {pluralize(underBy, "discipline", "disciplines")}.
                </Typography>
              )}
            </>
          )}
        </Box>
      }
    >
      <Typography
        sx={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "18px",
          color: isOver ? "#b71c1c" : isUnder ? "#075985" : "#3e2723",
          textTransform: "uppercase",
          letterSpacing: "1px",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          ...(isOver
            ? {
                "@keyframes disciplinesOverLimitPulse": {
                  "0%": { transform: "translateY(0px) scale(1)", textShadow: "none" },
                  "100%": {
                    transform: "translateY(-1px) scale(1.02)",
                    textShadow: "0 0 10px rgba(183, 28, 28, 0.25)",
                  },
                },
                animation: "disciplinesOverLimitPulse 1.6s ease-in-out infinite alternate",
              }
            : isUnder
              ? {
                  "@keyframes disciplinesUnderLimitPulse": {
                    "0%": { transform: "translateY(0px) scale(1)", textShadow: "none" },
                    "100%": {
                      transform: "translateY(-1px) scale(1.02)",
                      textShadow: "0 0 10px rgba(2, 132, 199, 0.22)",
                    },
                  },
                  animation: "disciplinesUnderLimitPulse 1.8s ease-in-out infinite alternate",
                }
              : null),
          ...(typographySx || null),
        }}
      >
        {label} ({actual}/{total})
      </Typography>
    </Tooltip>
  );
};

export default ElementalDisciplinesStatus;

