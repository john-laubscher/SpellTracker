import * as React from 'react';
import {useContext} from 'react'
import axios from 'axios';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import { ClassSpellsDetailsContext } from '../../Contexts/Context';

const SpellAccordian = ({numericalSpellLevel, spell, leadingControl, actionButton}) => {

    const { classSpellsDetails, setClassSpellsDetails } = useContext(ClassSpellsDetailsContext)
    const detailsFromApi = classSpellsDetails[numericalSpellLevel]?.[spell.index];
    const details =
      detailsFromApi ||
      (spell && (spell.isCustom || String(spell.index || '').startsWith('custom:')) ? spell : null);

    const [expanded, setExpanded] = React.useState(false);
    const [detailsLoading, setDetailsLoading] = React.useState(false);

    const isCustomSpell =
      Boolean(spell) && (spell.isCustom || String(spell.index || '').startsWith('custom:'));

    React.useEffect(() => {
      if (!expanded) return;
      if (!spell?.index) return;
      if (isCustomSpell) return;
      if (detailsFromApi) return;

      const controller = new AbortController();
      setDetailsLoading(true);

      axios
        .get(`/singlespell/${spell.index}`, { signal: controller.signal })
        .then((res) => {
          const spellDetails = res.data;
          setClassSpellsDetails((prev) => ({
            ...prev,
            [numericalSpellLevel]: {
              ...(prev[numericalSpellLevel] || {}),
              [spell.index]: { ...spellDetails },
            },
          }));
        })
        .catch(() => {
          // leave details empty; UI will show a small fallback message
        })
        .finally(() => {
          if (!controller.signal.aborted) setDetailsLoading(false);
        });

      return () => controller.abort();
    }, [expanded, detailsFromApi, isCustomSpell, numericalSpellLevel, setClassSpellsDetails, spell?.index]);

    const descLines = React.useMemo(() => {
      if (!details) return [];
      if (Array.isArray(details.desc)) return details.desc;
      if (typeof details.desc === 'string') return [details.desc];
      return [];
    }, [details]);

    return (
        <Accordion
          disableGutters
          elevation={0}
          expanded={expanded}
          onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
          sx={{
            backgroundColor: 'transparent',
            '&:before': { display: 'none' },
            '&.Mui-expanded': { margin: 0 },
          }}
        >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
                aria-controls={`${spell.index}-class-spells-content`}
                id={`${spell.index}-class-spells-header`}
                sx={{
                  minHeight: 32,
                  px: 1,
                  py: 0,
                  '& .MuiAccordionSummary-expandIconWrapper': {
                    width: 28,
                    justifyContent: 'center',
                    marginLeft: 0,
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '4px 0 !important',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                    display: 'flex',
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: '4px 0 !important',
                  },
                  '&.Mui-expanded': { minHeight: 32 },
                }}
              >
                {leadingControl ? (
                  <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0, display: 'flex' }}>
                    {leadingControl}
                  </Box>
                ) : null}
                <Typography sx={{ fontSize: '14px', fontWeight: 600, flexGrow: 1, minWidth: 0 }}>
                  {spell.name}
                </Typography>
                {actionButton && (
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{ flexShrink: 0, ml: 'auto', display: 'flex', alignItems: 'center' }}
                  >
                    {actionButton}
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: '4px',
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <Typography component="div" sx={{ fontSize: '13px', '& p': { margin: '2px 0' } }}>
                  {!details && detailsLoading ? (
                    <p style={{ opacity: 0.7 }}><em>Loading spell details…</em></p>
                  ) : null}
                  {!details && !detailsLoading ? (
                    <p style={{ opacity: 0.7 }}><em>Spell details unavailable.</em></p>
                  ) : null}
                  {details ? (
                    <>
                      <p><strong>Range:</strong> {details?.range}</p>
                      <p><strong>Duration:</strong> {details?.duration}</p>
                      <p><strong>Casting time:</strong> {details?.casting_time}</p>
                      <p><strong>Components:</strong> {Array.isArray(details?.components) ? details.components.join(', ') : details?.components}</p>
                      {details?.concentration && (
                        <p style={{ fontStyle: 'italic' }}><strong>Concentration</strong></p>
                      )}
                      {details?.ritual && (
                        <p style={{ fontStyle: 'italic' }}><strong>Ritual</strong></p>
                      )}
                      {descLines.map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </>
                  ) : null}
                </Typography>
              </AccordionDetails>
            </Accordion>
    )
}

export default SpellAccordian
