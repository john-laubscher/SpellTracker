// This component renders the class features
// Will have a main/section that is always visible (default is tracked?) and expandable, which includes the rest of the relevant classfeatures as listed in ClassesData
// Subclass Features, Racial Features, and additional features (Feats, magic items, custom features, etc) will have their own sections/columns on the mainUI 

import React, { useContext } from "react";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context"; // Adjust the path based on your project structure
import classesData from "../../components/ClassesData"; // Adjust the path based on your project structure

// Reusable FeatureDisplay component
const FeatureDisplay = ({ title, features, untrackedLabel }) => {
  const trackedFeatures = features.filter((feature) => feature.tracked);
  const untrackedFeatures = features.filter((feature) => !feature.tracked);

  return (
    <div style={{ marginBottom: '8px' }}>
      <Typography sx={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '15px', color: '#3e2723', mb: 0.5 }}>
        {title}
      </Typography>

      {trackedFeatures.map((feature) => (
        <div key={feature.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <Tooltip title={feature.desc} arrow>
            <Typography sx={{ fontSize: '14px', cursor: 'pointer' }}>
              {feature.name}
            </Typography>
          </Tooltip>
          <Checkbox
            defaultChecked={false}
            size="small"
            sx={{ ml: 0.5, p: 0.25, color: '#8B4513', '&.Mui-checked': { color: '#8B4513' } }}
          />
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
  const { characterClass, characterLevel, subclass } = characterInfo;

  // Retrieve class data
  const classData = classesData[characterClass] || {};
  const classFeatures = classData.classFeatures?.filter((f) => f.level <= characterLevel) || [];

  // Placeholder data for subclass and racial/misc features
  const subclassData = classesData[characterClass].subclasses[subclass].features
  console.log('subclassData', subclassData)
  const subclassFeatures = subclassData.filter((feature) => feature.level <= characterLevel);


  const racialAndMiscFeatures = []; // Replace with racial/misc feature logic

  return (
    <div>
      {/* Class Features Section */}
      <FeatureDisplay
        title="Class Features"
        features={classFeatures}
        untrackedLabel="Untracked Class Features"
      />

      {/* Subclass Features Section */}
      <FeatureDisplay
        title="Subclass Features"
        features={subclassFeatures}
        untrackedLabel="Untracked Subclass Features"
      />

      {/* Racial and Miscellaneous Features Section */}
      <FeatureDisplay
        title="Racial and Miscellaneous Features"
        features={racialAndMiscFeatures}
      />
    </div>
  );
};

export default FeaturesAndTrackables;

