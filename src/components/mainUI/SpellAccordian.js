import * as React from 'react';
import {useContext} from 'react'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import { ClassSpellsDetailsContext } from '../../Contexts/Context';

const SpellAccordian = ({numericalSpellLevel, spell, actionButton}) => {

    const { classSpellsDetails } = useContext(ClassSpellsDetailsContext)
    const details = classSpellsDetails[numericalSpellLevel]?.[spell.index];

    return (
        <Accordion
          disableGutters
          elevation={0}
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
                  '& .MuiAccordionSummary-content': {
                    margin: '4px 0',
                    alignItems: 'center',
                    gap: 1.5,
                  },
                  '&.Mui-expanded': { minHeight: 32 },
                }}
              >
                <Typography sx={{ fontSize: '14px', fontWeight: 600, flexGrow: 1 }}>{spell.name}</Typography>
                {actionButton && (
                  <Box onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0 }}>
                    {actionButton}
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, py: 1, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '4px', mx: 1, mb: 0.5 }}>
                <Typography component="div" sx={{ fontSize: '13px', '& p': { margin: '2px 0' } }}>
                  <p><strong>Range:</strong> {details?.range}</p>
                  <p><strong>Duration:</strong> {details?.duration}</p>
                  <p><strong>Casting time:</strong> {details?.casting_time}</p>
                  <p><strong>Components:</strong> {details?.components?.join(', ')}</p>
                  {details?.concentration && (
                    <p style={{ fontStyle: 'italic' }}><strong>Concentration</strong></p>
                  )}
                  {details?.ritual && (
                    <p style={{ fontStyle: 'italic' }}><strong>Ritual</strong></p>
                  )}
                  <p>{details?.desc}</p>
                </Typography>
              </AccordionDetails>
            </Accordion>
    )
}

export default SpellAccordian
