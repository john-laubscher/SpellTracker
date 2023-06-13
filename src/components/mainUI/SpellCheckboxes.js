import React, { useContext, useState } from 'react';
import { CharacterInfoContext } from "../../Contexts/Context";
import spellTables from "../spellTables"

const SpellCheckboxes = ({ textualSpellLevel }) => {
  const [checkedSpells, setCheckedSpells] = useState({});
  const { characterInfo } = useContext(CharacterInfoContext);

  const spellSlots = spellTables[characterInfo.characterClass][characterInfo.characterLevel][textualSpellLevel]

  const handleCheckboxChange = (textualSpellLevel) => {
    setCheckedSpells((prevState) => ({
      ...prevState,
      [textualSpellLevel]: !prevState[textualSpellLevel],
    }));
  };

  const renderCheckboxes = () => {
    const checkboxes = [];

    for (let i = 0; i < spellSlots; i++) {
      const textualSpellLevel = i + 1;

      checkboxes.push(
        <label key={textualSpellLevel}>
          <input
            type="checkbox"
            checked={checkedSpells[textualSpellLevel]}
            onChange={() => handleCheckboxChange(textualSpellLevel)}
          />
        </label>
      );
    }

    return checkboxes;
};
return (
    <div>
        {textualSpellLevel !== 'cantrips' ? (
          <>
            <h4>Spell Slots</h4>
            {renderCheckboxes()}
          </>
        ) : null}
    </div>
)
};

export default SpellCheckboxes;
