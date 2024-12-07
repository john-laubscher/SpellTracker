// This component renders the class features
// Will have a main/section that is always visible (default is tracked?) and expandable, which includes the rest of the relevant classfeatures as listed in ClassesData
// Subclass Features, Racial Features, and additional features (Feats, magic items, custom features, etc) will have their own sections/columns on the mainUI 

import React, { useContext } from "react";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Checkbox, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CharacterInfoContext } from "../../Contexts/Context"; // Adjust the path based on your project structure
import classesData from "../../components/ClassesData"; // Adjust the path based on your project structure

// Reusable FeatureDisplay component
const FeatureDisplay = ({ title, features }) => {
  const trackedFeatures = features.filter((feature) => feature.tracked);
  const untrackedFeatures = features.filter((feature) => !feature.tracked);

  return (
    <div>
      <Typography variant="h6">{title}</Typography>

      {/* Render tracked features */}
      <Grid container spacing={2}>
        {trackedFeatures.map((feature) => (
          <Grid item xs={12} key={feature.id}>
            <Tooltip title={feature.desc} arrow>
              <Typography variant="body1" style={{ display: "inline" }}>
                {feature.name}
              </Typography>
            </Tooltip>
            <Checkbox
              defaultChecked={false} // Add tracking logic if needed
              style={{ marginLeft: "8px" }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Render untracked features in an expandable section */}
      {untrackedFeatures.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Other Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {untrackedFeatures.map((feature) => (
                <Grid item xs={12} key={feature.id}>
                  <Tooltip title={feature.desc} arrow>
                    <Typography variant="body1">{feature.name}</Typography>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
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
  const subclassData = classesData[characterClass].subclasses[subclass].subclassFeatures
  console.log('subclassData', subclassData)
  const subclassFeatures = subclassData.filter((feature) => feature.level <= characterLevel);


  const racialAndMiscFeatures = []; // Replace with racial/misc feature logic

  return (
    <div>
      {/* Class Features Section */}
      <FeatureDisplay
        title="Class Features"
        features={classFeatures}
      />

      {/* Subclass Features Section */}
      <FeatureDisplay
        title="Subclass Features"
        features={subclassFeatures}
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

