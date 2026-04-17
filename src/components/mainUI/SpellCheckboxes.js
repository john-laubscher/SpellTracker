import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

const SpellCheckboxes = ({ textualSpellLevel, slotCount }) => {
  const [checkedSlots, setCheckedSlots] = useState({});

  const handleCheckboxChange = (slotIndex) => {
    setCheckedSlots((prev) => ({
      ...prev,
      [slotIndex]: !prev[slotIndex],
    }));
  };

  if (textualSpellLevel === 'cantrips' || !slotCount) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#5d4037', mr: 0.5 }}>
        Slots
      </Typography>
      {Array.from({ length: slotCount }, (_, i) => (
        <Checkbox
          key={i}
          size="small"
          checked={!!checkedSlots[i]}
          onChange={() => handleCheckboxChange(i)}
          sx={{
            p: 0.25,
            color: '#8B4513',
            '&.Mui-checked': { color: '#8B4513' },
          }}
        />
      ))}
    </Box>
  );
};

export default SpellCheckboxes;
