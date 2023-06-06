import React, { useContext, useState } from 'react';
import { CharacterInfoContext } from "../../Contexts/CharacterInfoContext";
import spellTables from "../spellTables"



const SpellCheckboxes = ({ spellLevel }) => {
  const [checkedSpells, setCheckedSpells] = useState({});
  const { characterInfo } = useContext(CharacterInfoContext);


  const spellSlots = spellTables[characterInfo.characterClass][characterInfo.characterLevel][spellLevel]

  const handleCheckboxChange = (spellLevel) => {
    setCheckedSpells((prevState) => ({
      ...prevState,
      [spellLevel]: !prevState[spellLevel],
    }));
  };

  const renderCheckboxes = () => {
    const checkboxes = [];

    for (let i = 0; i < spellSlots; i++) {
      const spellLevel = i + 1;

      checkboxes.push(
        <label key={spellLevel}>
          <input
            type="checkbox"
            checked={checkedSpells[spellLevel]}
            onChange={() => handleCheckboxChange(spellLevel)}
          />
        </label>
      );
    }

    return checkboxes;
};
return (
    <div>
        {spellLevel !== 'cantrips' ? (
          <>
            <h4>Spell Slots</h4>
            {renderCheckboxes()}
          </>
        ) : null}
    </div>
)
};

export default SpellCheckboxes;


