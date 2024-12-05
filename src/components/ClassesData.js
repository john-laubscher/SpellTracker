export const ClassesData = {
  // Nesting goes as follows: Class, Subclass, level, ability gained from subclass (name: descritption).
  noClass: {
    subclasses: "",
    spellcastingAbility: "nonCaster",
  },

  // When building out rendering/component for this, ADV Feature: allow users to send features to expanded section or main/header section to be more immediately visible, and give user control over what they are seeing/what they think is most important. (probably need to give each feature an additional feature/key value pair like header: true/false)
  // To build out new header: true/false section, copy and paste into ai, and have it explicitly return the structure with all the previous data, and all the new data too (default: if tracked is 1, put it in header, 0 is in expandable. User can change it later)
  // Desc might be incomplete
  // Check comments of the tracked to see for exceptions that need to be made for individual features or classes
  barbarian: {
    hitDice: "D12",
    isSpellCaster: "nonCaster",
    spellcastingAbility: "nonCaster",
    classFeatures: [
      {
        id: "rage",
        name: "Rage",
        desc: "Enter a rage as a bonus action, granting bonuses to melee damage and resistance to physical damage.",
        level: 1,
        tracked: true,
      },
      {
        id: "danger_sense",
        name: "Danger Sense",
        desc: "Advantage on Dexterity saving throws against effects you can see.",
        level: 2,
        tracked: false,
      },
      {
        id: "reckless_attack",
        name: "Reckless Attack",
        desc: "Gain advantage on melee attack rolls during your turn, but attack rolls against you also have advantage until your next turn.",
        level: 2,
        tracked: false,
      },
      {
        id: "extra_attack",
        name: "Extra Attack",
        desc: "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
        level: 5,
        tracked: true,
      },
      {
        id: "fast_movement",
        name: "Fast Movement",
        desc: "Your speed increases by 10 feet while you aren't wearing heavy armor.",
        level: 5,
        tracked: false,
      },
      {
        id: "feral_instinct",
        name: "Feral Instinct",
        desc: "Advantage on initiative rolls. Additionally, if you are surprised, you can act normally if you enter your rage first.",
        level: 7,
        tracked: false,
      },
      {
        id: "brutal_critical",
        name: "Brutal Critical",
        desc: "You can roll one additional weapon damage die when determining the extra damage for a critical hit.",
        level: 9,
        tracked: false,
      },
      {
        id: "relentless_rage",
        name: "Relentless Rage",
        desc: "If you drop to 0 HP while raging, you can make a DC 10 Constitution saving throw to drop to 1 HP instead. Each time you use this feature, the DC increases by 5 until you finish a short or long rest.",
        level: 11,
        tracked: true,
      },
      {
        id: "indomitable_might",
        name: "Indomitable Might",
        desc: "If your total for a Strength check is less than your Strength score, you can use your Strength score in place of the total.",
        level: 15,
        tracked: false,
      },
    ],
    subclasses: {
      ancestralGuardian: [
        {
          id: "ancestral_protectors",
          name: "Ancestral Protectors",
          desc: "Spectral warriors appear when you enter your rage. The first creature you hit with an attack on your turn becomes the target of the warriors, granting resistance to damage dealt by it to others and disadvantage on its attacks.",
          level: 3,
          tracked: false,
        },
        {
          id: "spirit_shield",
          name: "Spirit Shield",
          desc: "When a creature you can see within 30 feet takes damage, you can use your reaction to reduce that damage by 2d6.",
          level: 6,
          tracked: false,
        },
        {
          id: "consult_the_spirits",
          name: "Consult the Spirits",
          desc: "Cast Augury or Clairvoyance without using a spell slot or material components. Requires a short or long rest to use again.",
          level: 10,
          tracked: false,
        },
        {
          id: "vengeful_ancestors",
          name: "Vengeful Ancestors",
          desc: "When you use Spirit Shield to reduce damage, the attacker takes force damage equal to the damage reduced.",
          level: 14,
          tracked: false,
        },
      ],
      battleRager: [],
      beast: [],
      berserker: [],
      stormHerald: [],
      totemWarrior: [],
      wildMagic: [],
      zealot: [],
    },
  },
    // Add other classes here...  
  bard: {
    hitDice: "D8",
    isSpellCaster: "refer to spellTables", // Reference to external spell table for spell slots/prepared
    spellcastingAbility: "cha",
    classFeatures: [
      {
        id: "bardic_inspiration",
        name: "Bardic Inspiration",
        desc: "You can inspire others through stirring words or music. Use a bonus action to give one creature within 60 feet an inspiration die (1d6 at 1st level). The die increases as you gain levels.",
        level: 1,
        tracked: 1, // Cha mod, min of 1.
      },
      {
        id: "song_of_rest",
        name: "Song of Rest",
        desc: "You can use soothing music or oration to help revitalize your allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points at the end of the short rest, each of those creatures regains an extra 1d6 hit points.",
        level: 2,
        tracked: 0,
      },
      {
        id: "font_of_inspiration",
        name: "Font of Inspiration",
        desc: "Beginning at 5th level, you regain all your expended uses of Bardic Inspiration when you finish a short or long rest.",
        level: 5,
        tracked: 0,
      },
      {
        id: "countercharm",
        name: "Countercharm",
        desc: "At 6th level, you gain the ability to use music or oration to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet who can hear you gain advantage on saving throws against being frightened or charmed.",
        level: 6,
        tracked: 0,
      },
      {
        id: "magical_secrets",
        name: "Magical Secrets",
        desc: "At 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.",
        level: 10,
        tracked: 0,
        // **FEATURE NEEDED: spell list needs to account for this feature to add more spells**
      },
      {
        id: "superior_inspiration",
        name: "Superior Inspiration",
        desc: "At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.",
        level: 20,
        tracked: 0,
      },
    ],
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
    spellcastingAbility: "wis",
    classFeatures: [
      {
        id: "channel_divinity",
        name: "Channel Divinity",
        desc: "You gain the ability to channel divine energy directly from your deity, using it to fuel magical effects. At 2nd level, you can use your Channel Divinity once per short or long rest. Additional uses and effects are gained as you level.",
        level: 2,
        tracked: 1, // 2nd lvl:1, 6th lvl: 2,  18th lvl: 3
      },
      {
        id: "destroy_undead",
        name: "Destroy Undead",
        desc: "When an undead fails its saving throw against your Turn Undead feature, it is instantly destroyed if its challenge rating is at or below a certain threshold based on your cleric level.",
        level: 5,
        tracked: 0, // Tracks undead CR threshold
      },
      {
        id: "divine_intervention",
        name: "Divine Intervention",
        desc: "Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great. As an action, you describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. If successful, you can’t use this feature again for 7 days. Otherwise, you can use it again after a long rest.",
        level: 10,
        tracked: 7, // (typically once every 7 days if successful), need tooltip to explain checkboxes track days between uses
      },
    ],
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
  spellcastingAbility: "wis",
  classFeatures: [
    {
      id: "wild_shape",
      name: "Wild Shape",
      desc: "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice, and regain expended uses when you finish a short or long rest. Your druid level determines the beasts you can transform into.",
      level: 2,
      tracked: 2, // 2/SR
    },
    {
      id: "beast_spells",
      name: "Beast Spells",
      desc: "Starting at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren’t able to provide material components.",
      level: 18,
      tracked: 0, 
    },
    {
      id: "archdruid",
      name: "Archdruid",
      desc: "At 20th level, you can use your Wild Shape an unlimited number of times. Additionally, you ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren’t consumed by a spell.",
      level: 20,
      tracked: 0, 
    },
  ],
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
  classFeatures: [
    {
      id: "fighting_style",
      name: "Fighting Style",
      desc: "At 1st level, you adopt a particular style of fighting as your specialty. Choose one Fighting Style option. You can’t take a Fighting Style option more than once, even if you later get to choose again.",
      level: 1,
      tracked: 0, 
      // "**NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**"
    },
    {
      id: "second_wind",
      name: "Second Wind",
      desc: "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.",
      level: 1,
      tracked: 1, //1/sr 
    },
    {
      id: "action_surge",
      name: "Action Surge",
      desc: "Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action. Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.",
      level: 2,
      tracked: 1, // 1/sr
    },
    {
      id: "extra_attack",
      name: "Extra Attack",
      desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.",
      level: 5,
      tracked: 0, 
    },
    {
      id: "indomitable",
      name: "Indomitable",
      desc: "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll. You can use this feature once between long rests. You can use it twice between long rests starting at 13th level and three times between long rests starting at 17th level.",
      level: 9,
      tracked: 1, //2x at lvl 13, 3x at lvl 17
    },
  ],
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
  classFeatures: [
    {
      id: "martial_arts",
      name: "Martial Arts",
      desc: "When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action.",
      level: 1,
      tracked: 0,
    },
    {
      id: "ki",
      name: "Ki",
      desc: "Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points equal to your monk level. You can spend these points to fuel various ki features.",
      level: 2,
      tracked: 0, // Tracks ki points
    },
    {
      id: "deflect_missiles",
      name: "Deflect Missiles",
      desc: "You can use your reaction to deflect or catch a missile when you are hit by a ranged weapon attack. When you do so, the damage you take is reduced by 1d10 + your Dexterity modifier + your monk level.",
      level: 3,
      tracked: 0,
    },
    {
      id: "slow_fall",
      name: "Slow Fall",
      desc: "Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.",
      level: 4,
      tracked: 0,
    },
    {
      id: "extra_attack",
      name: "Extra Attack",
      desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
      level: 5,
      tracked: 0,
    },
    {
      id: "stunning_strike",
      name: "Stunning Strike",
      desc: "Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.",
      level: 5,
      tracked: 0,
    },
    {
      id: "ki_empowered_strikes",
      name: "Ki-Empowered Strikes",
      desc: "Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
      level: 6,
      tracked: 0,
    },
    {
      id: "evasion",
      name: "Evasion",
      desc: "At 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
      level: 7,
      tracked: 0,
    },
    {
      id: "stillness_of_mind",
      name: "Stillness of Mind",
      desc: "Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.",
      level: 7,
      tracked: 0,
    },
    {
      id: "diamond_soul",
      name: "Diamond Soul",
      desc: "Beginning at 14th level, you gain proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.",
      level: 14,
      tracked: 0,
    },
    {
      id: "empty_body",
      name: "Empty Body",
      desc: "Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.",
      level: 18,
      tracked: 0,
    },
    {
      id: "perfect_self",
      name: "Perfect Self",
      desc: "At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.",
      level: 20,
      tracked: 0,
    },
  ],
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
  spellcastingAbility: "cha",
  classFeatures: [
    {
      id: "divine_sense",
      name: "Divine Sense",
      desc: "The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover.",
      level: 1,
      tracked: 1, // 1+ cha mod, Regain on LR.
    },
    {
      id: "lay_on_hands",
      name: "Lay on Hands",
      desc: "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.",
      level: 1,
      tracked: 1, // 5x Paladin LVL. Need to render small input that can be changed. Probably also need to add to state?
    },
    {
      id: "fighting_style",
      name: "Fighting Style",
      desc: "You adopt a style of fighting as your specialty.",
      level: 2,
      tracked: 0, // **NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**
    },
    {
      id: "divine_smite",
      name: "Divine Smite",
      desc: "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8.",
      level: 2,
      tracked: 0, //Use spell slots to cast
    },
    {
      id: "channel_divinity",
      name: "Channel Divinity",
      desc: "At 3rd level, you gain the ability to channel divine energy to fuel magical effects unique to your Oath.",
      level: 3,
      tracked: 1, // 1/sr
    },
    {
      id: "extra_attack",
      name: "Extra Attack",
      desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
      level: 5,
      tracked: 0,
    },
    {
      id: "aura_of_protection",
      name: "Aura of Protection",
      desc: "Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.",
      level: 6,
      tracked: 0,
    },
    {
      id: "aura_of_courage",
      name: "Aura of Courage",
      desc: "Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.",
      level: 10,
      tracked: 0,
    },
    {
      id: "improved_divine_smite",
      name: "Improved Divine Smite",
      desc: "By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.",
      level: 11,
      tracked: 0,
    },
    {
      id: "cleansing_touch",
      name: "Cleansing Touch",
      desc: "Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.",
      level: 14,
      tracked: 0,
    },
  ],
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
// Desc might be too short or not complete
  ranger: {
    hitDice: "D10",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "wis",
    classFeatures: [
      {
        id: "fighting_style",
        name: "Fighting Style",
        desc: "You adopt a style of fighting as your specialty.",
        level: 2,
        tracked: 0, // **NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**
      },
      {
        id: "extra_attack",
        name: "Extra Attack",
        desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
        level: 5,
        tracked: 0,
      },
      {
        id: "land_stride",
        name: "Land's Stride",
        desc: "Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through plants without being slowed by them and without taking damage from them if they are toxic or hazardous.",
        level: 8,
        tracked: 0,
      },
      {
        id: "vanish",
        name: "Vanish",
        desc: "Starting at 14th level, you can use the Hide action as a bonus action on your turn.",
        level: 14,
        tracked: 0,
      },
      {
        id: "feral_senses",
        name: "Feral Senses",
        desc: "At 18th level, you gain preternatural senses that help you fight creatures you can't see.",
        level: 18,
        tracked: 0,
      },
      {
        id: "foe_slayer",
        name: "Foe Slayer",
        desc: "At 20th level, you become an unparalleled hunter of your enemies.",
        level: 20,
        tracked: 0,
      },
    ],
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
    classFeatures: [
      {
        id: "sneak_attack",
        name: "Sneak Attack",
        desc: "You know how to strike subtly and exploit a foe’s distraction.",
        level: 1,
        tracked: 0,
      },
      {
        id: "cunning_action",
        name: "Cunning Action",
        desc: "You can take a bonus action on each of your turns to Dash, Disengage, or Hide.",
        level: 2,
        tracked: 0,
      },
      {
        id: "uncanny_dodge",
        name: "Uncanny Dodge",
        desc: "When an attacker you can see hits you with an attack, you can use your reaction to halve the attack's damage.",
        level: 5,
        tracked: 0,
      },
      {
        id: "evasion",
        name: "Evasion",
        desc: "When subjected to an effect that allows a Dexterity saving throw for half damage, you instead take no damage if you succeed.",
        level: 7,
        tracked: 0,
      },
      {
        id: "blindsense",
        name: "Blindsense",
        desc: "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.",
        level: 14,
        tracked: 0,
      },
      {
        id: "slippery_mind",
        name: "Slippery Mind",
        desc: "You gain proficiency in Wisdom saving throws.",
        level: 15,
        tracked: 0,
      },
      {
        id: "elusive",
        name: "Elusive",
        desc: "No attack roll has advantage against you while you aren’t incapacitated.",
        level: 18,
        tracked: 0,
      },
      {
        id: "stroke_of_luck",
        name: "Stroke of Luck",
        desc: "If your attack misses a target, you can turn it into a hit.",
        level: 20,
        tracked: 1, // Comment: 1/SR
      },
    ],
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
    spellcastingAbility: "cha",
    classFeatures: [
      {
        id: "font_of_magic",
        name: "Font of Magic",
        desc: "You have a pool of sorcery points that you can use to create spell slots or fuel Metamagic.",
        level: 2,
        tracked: 0, // Comment: Refer to chart for sorcery points
      },
      {
        id: "metamagic",
        name: "Metamagic",
        desc: "You gain the ability to twist spells to suit your needs.",
        level: 3,
        tracked: 0, // Maybe part of Char Creation user an choose metamagic if higher than lvl 3 (gain 1 more at 10 and 17 too)
      },
      {
        id: "sorcerous_restoration",
        name: "Sorcerous Restoration",
        desc: "You regain 4 expended sorcery points whenever you finish a short rest.",
        level: 20,
        tracked: 0,
      },
    ],
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
    spellcastingAbility: "cha",
    classFeatures: [
      {
        id: "eldritch_invocations",
        name: "Eldritch Invocations",
        desc: "At 2nd level, you gain two Eldritch Invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.",
        level: 2,
        tracked: 0, //Should be part of Char Creation after lvl 2, and levelups. Refer to chart for number of invocations
      },
      {
        id: "pact_boon",
        name: "Pact Boon",
        desc: "At 3rd level, you gain a pact boon feature of your choice.",
        level: 3,
        tracked: 0,
      },
      {
        id: "mystic_arcanum",
        name: "Mystic Arcanum",
        desc: "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum. You can cast it once without expending a spell slot.",
        level: 11,
        tracked: 0, // **NEEDS Spelllist to account for this--might already be in spellTable page?**
      },
      {
        id: "eldritch_master",
        name: "Eldritch Master",
        desc: "At 20th level, you can draw on your inner reserve of mystical power while entreating your patron for aid. Once per long rest, you can regain all your expended spell slots as an action.",
        level: 20,
        tracked: 1, //1/LR
      },
    ],
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
    spellcastingAbility: "int",
    classFeatures: [
      {
        id: "spell_mastery",
        name: "Spell Mastery",
        desc: "You can cast certain 1st- and 2nd-level spells at will.",
        level: 18,
        tracked: 0,
      },
      {
        id: "signature_spells",
        name: "Signature Spells",
        desc: "You gain two 3rd-level spells that you can cast without expending a spell slot.",
        level: 20,
        tracked: 2, //Each spell can only be used 1/SR
      },
    ],
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

export default ClassesData;
