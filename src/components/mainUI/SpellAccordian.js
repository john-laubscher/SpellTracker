import * as React from 'react';
import {useContext} from 'react'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ClassSpellsDetailsContext } from '../../Contexts/Context';

// typically will be used with an array of spells being iterated over, but would work with single spells as long as the classSpellsDetails for that spellLevel is set in state
const SpellAccordian = (props) => {
    const spellLevel = props.spellLevel
    const spell = props.spell

    const { classSpellsDetails } = useContext(ClassSpellsDetailsContext)

    return (
        <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${spell.index}-class-spells-content`}
                id={`${spell.index}-class-spells-header`} 
              >
                <Typography>{spell.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <p><strong>Range:</strong> {classSpellsDetails[spellLevel][spell.index]?.range}</p>
                  <p><strong>Duration:</strong> {classSpellsDetails[spellLevel][spell.index]?.duration}</p>
                  <p><strong>Casting time:</strong> {classSpellsDetails[spellLevel][spell.index]?.casting_time}</p>
                  <p><strong>Spell components:</strong> {classSpellsDetails[spellLevel][spell.index]?.components.join(', ')}</p>
                  {classSpellsDetails[spellLevel][spell.index]?.concentration ? (
                    <p style={{ fontStyle: 'italic' }}><strong>Concentration</strong></p>
                    ) : null}
                  {classSpellsDetails[spellLevel][spell.index]?.ritual ? (
                    <p style={{ fontStyle: 'italic' }}><strong>Ritual</strong></p>
                    ) : null}
                  <p>{classSpellsDetails[spellLevel][spell.index]?.desc}</p>
                </Typography>
              </AccordionDetails>
            </Accordion>
    )
}

export default SpellAccordian
