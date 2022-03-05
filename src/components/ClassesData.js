export const Classes = {
  // Nesting goes as follows: Class, Subclass, level, ability gained from subclass (name: descritption).
  noClass: {
    subclasses: "",
    spellcastingAbility: "nonCaster",
  },
  barbarian: {
    hitDice: "D12",
    isSpellCaster: "nonCaster",
    spellcastingAbility: "nonCaster",
    subclasses: {
      ancestralGuardian: {
        3: {
          ancestralProtectors:
            "Starting when you choose this path at 3rd level, spectral warriors appear when you enter your rage. While you’re raging, the first creature you hit with an attack on your turn becomes the target of the warriors, which hinder its attacks. Until the start of your next turn, that target has disadvantage on any attack roll that isn't against you, and when the target hits a creature other than you with an attack, that creature has resistance to the damage of the target’s attacks.",
        },

        6: {
          spiritShield:
            "Beginning at 6th level, the guardian spirits that aid you can provide supernatural protection to those you defend. If you are raging and a creature you can see within 30 feet of you takes damage, you can use your reaction to reduce that damage by 2d6. When you reach certain levels in this class, you can reduce the damage by more: by 3d6 at 10th level and by 4d6 at 14th level.",
        },

        10: {
          consultTheSpirits:
            "At 10th level, you gain the ability to consult with your ancestral spirits. When you do so, you cast the Augury or Clairvoyance spell, without using a spell slot or material components. Rather than creating a spherical sensor, this use of Clairvoyance invisibly summons one of your ancestral spirits to the chosen location. Wisdom is your spellcasting ability for these spells. After you cast either spell in this way, you can’t use this feature again until you finish a short or long rest.",
        },

        14: {
          vengefulAncestors:
            "At 14th level, your ancestral spirits grow powerful enough to retaliate. When you use your Spirit Shield to reduce the damage of an attack, the attacker takes an amount of force damage that your Spirit Shield prevents.",
        },
      },
      battleRager: "",
      beast: "",
      berserker: "",
      stormHerald: "",
      totemWarrior: "",
      wildMagic: "",
      zealot: "",
    },
  },
  bard: {
    hitDice: "D8",
    // "refer to spellTables" means that spellsKnown is also the same as spells prepared for this class, and is found on spellTables.js
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "charisma",
    subclasses: {
      creation: "",
      eloquence: "",
      glamour: "",
      lore: "",
      spirits: "",
      swords: "",
      valor: "",
      whispers: "",
    },
  },
  cleric: {
    hitDice: "D8",
    isSpellCaster: "fullCaster",
    spellcastingAbility: "wisdom",
    subclasses: {
      arcana: "",
      death: "",
      forge: "",
      grave: "",
      knowledge: "",
      life: "",
      light: "",
      nature: "",
      order: "",
      peace: "",
      tempest: "",
      trickery: "",
      twilight: "",
      war: "",
      ambition: "",
      solidarity: "",
      strength: "",
      zeal: "",
    },
  },
  druid: {
    hitDice: "D8",
    isSpellCaster: "fullCaster",
    spellcastingAbility: "wisdom",
    subclasses: {
      dreams: "",
      land: "",
      moon: "",
      shepherd: "",
      spores: "",
      stars: "",
      wildfire: "",
    },
  },
  fighter: {
    hitDice: "D10",
    isSpellCaster: "nonCaster",
    spellcastingAbility: "nonCaster",
    subclasses: {
      arcaneArcher: "",
      banneret: "",
      battleMaster: "",
      cavalier: "",
      champion: "",
      echoKnight: "",
      eldritchKnight: "",
      psiWarrior: "",
      runeKnight: "",
      samurai: "",
    },
  },
  monk: {
    hitDice: "D8",
    spellcastingAbility: "nonCaster",
    isSpellCaster: "nonCaster",
    subclasses: {
      mercy: "",
      ascendentDragon: "",
      astralSelf: "",
      drunkenMaster: "",
      fourElements: "",
      kensei: "",
      longDeath: "",
      openHand: "",
      shadow: "",
      sunSoul: "",
    },
  },
  paladin: {
    hitDice: "D10",
    isSpellCaster: "halfCaster",
    spellcastingAbility: "charisma",
    subclasses: {
      ancients: "",
      conquest: "",
      crown: "",
      devotion: "",
      glory: "",
      redemption: "",
      vengeance: "",
      watchers: "",
      oathbreaker: "",
    },
  },
  ranger: {
    hitDice: "D10",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "wisdom",
    subclasses: {
      beastMaster: "",
      drakewarden: "",
      feyWanderer: "",
      gloomStalker: "",
      horizonWalker: "",
      hunter: "",
      monsterSlayer: "",
      swarmKeeper: "",
    },
  },
  rogue: {
    hitDice: "D8",
    isSpellCaster: "nonCaster",
    spellcastingAbility: "nonCaster",
    subclasses: {
      arcaneTrickster: "",
      assassin: "",
      inquisitive: "",
      mastermind: "",
      phantom: "",
      scout: "",
      soulknife: "",
      swashbuckler: "",
      thief: "",
    },
  },
  sorceror: {
    hitDice: "D6",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "charisma",
    subclasses: {
      aberrantMind: "",
      clockworkSoul: "",
      draconicBloodline: "",
      divineSoul: "",
      shadowMagic: "",
      stormSorcery: "",
      wildMagic: "",
      Pyromancy: "",
    },
  },
  warlock: {
    hitDice: "D8",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "charisma",
    subclasses: {
      archfey: "",
      celestial: "",
      fathomless: "",
      fiend: "",
      genie: "",
      greatOldOne: "",
      hexblade: "",
      undead: "",
      undying: "",
    },
  },
  wizard: {
    hitDice: "D6",
    isSpellCaster: "fullCaster",
    spellcastingAbility: "intelligence",
    subclasses: {
      abjuration: "",
      bladesinging: "",
      chronurgy: "",
      conjuration: "",
      divination: "",
      enchantment: "",
      evocation: "",
      graviturgy: "",
      illusion: "",
      necromancy: "",
      scribes: "",
      transmutation: "",
      warMagic: "",
    },
  },
};

export default Classes;