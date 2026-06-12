export const Races = ["Dragonborn", "Dwarf", "Elf", "Gnome", "Half Elf", "Half Orc", "Halfling", "Human", "Tiefling"];

// dot notation uses identifiers, but bracket notation doesn't--need bracket notation for key strings
// UA subclasses not included yet as of 6/20/23
export const Subraces = {
    Dragonborn: ['Chromatic', 'Metallic', 'Gem', 'Draconblood', 'Ravenite'],
    Dwarf: ['Hill', 'Mountain', 'Mark of Warding', 'Plane Shift: Kaladesh'],
    Elf: ['Dark Elf', 'High Elf', 'Wood Elf', 'Pallid Elf', 'Mark of Shadow', 'Astral Elf', 'Bishtahar/Tirahar', 'Vahadar', 'Zendikar', 'Tajuru', 'Juraga', 'Mul Daya'],
    Gnome: ['Forest', 'Rock', 'Mark of Scribing'],
    'Half Elf': ['Standard Half Elf', 'Mark of Detection', 'Mark of Storm'],
    'Half Orc': ['No Subrace', 'Mark of Finding'],
    Halfling: ['Lightfoot', 'Stout', 'Ghostwise', 'Lotusden', 'Mark of Hospitality', 'Mark of Healing'],
    Human: ['No Subrace', 'Variant', 'Mark of Finding', 'Mark of Handling', 'Mark of Making', 'Mark of Passage', 'Mark of Sentinel', ],
    // Plane Shift Humans not included (but don't have spells)
    Tiefling: ['Bloodline of Asmodeus', 'Bloodline of Baalzebul', 'Bloodline of Dispater', 'Bloodline of Fierna', 'Bloodline of Glasya', 'Bloodline of Levistus', 'Bloodline of Mammon', 'Bloodline of Mephistopheles', 'Bloodline of Zariel', 'Variant Tiefling']
  }

export const DragonbornAncestryData = {
  Black: {
    family: "Chromatic",
    damageType: "Acid",
    breathWeapon: { area: "30-foot line that is 5 feet wide", saveAbility: "DEX" },
  },
  Blue: {
    family: "Chromatic",
    damageType: "Lightning",
    breathWeapon: { area: "30-foot line that is 5 feet wide", saveAbility: "DEX" },
  },
  Green: {
    family: "Chromatic",
    damageType: "Poison",
    breathWeapon: { area: "30-foot line that is 5 feet wide", saveAbility: "DEX" },
  },
  Red: {
    family: "Chromatic",
    damageType: "Fire",
    breathWeapon: { area: "30-foot line that is 5 feet wide", saveAbility: "DEX" },
  },
  White: {
    family: "Chromatic",
    damageType: "Cold",
    breathWeapon: { area: "30-foot line that is 5 feet wide", saveAbility: "DEX" },
  },
  Brass: {
    family: "Metallic",
    damageType: "Fire",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Bronze: {
    family: "Metallic",
    damageType: "Lightning",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Copper: {
    family: "Metallic",
    damageType: "Acid",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Gold: {
    family: "Metallic",
    damageType: "Fire",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Silver: {
    family: "Metallic",
    damageType: "Cold",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Amethyst: {
    family: "Gem",
    damageType: "Force",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Crystal: {
    family: "Gem",
    damageType: "Radiant",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Emerald: {
    family: "Gem",
    damageType: "Psychic",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Sapphire: {
    family: "Gem",
    damageType: "Thunder",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
  Topaz: {
    family: "Gem",
    damageType: "Necrotic",
    breathWeapon: { area: "15-foot cone", saveAbility: "DEX" },
  },
};

export const DragonbornAncestryGroups = {
  Chromatic: ["Black", "Blue", "Green", "Red", "White"],
  Metallic: ["Brass", "Bronze", "Copper", "Gold", "Silver"],
  Gem: ["Amethyst", "Crystal", "Emerald", "Sapphire", "Topaz"],
};

export const getDragonbornAncestryOptions = (subrace) => {
  if (subrace === "Chromatic" || subrace === "Metallic" || subrace === "Gem") {
    return DragonbornAncestryGroups[subrace] || [];
  }

  if (subrace === "Draconblood" || subrace === "Ravenite") {
    return [
      ...DragonbornAncestryGroups.Chromatic,
      ...DragonbornAncestryGroups.Metallic,
      ...DragonbornAncestryGroups.Gem,
    ];
  }

  return [];
};

// Combat/trackable-focused race traits (not a full character builder dataset).
// Source: Roll20 Compendium — Free Basic Rules (2014).
//
// Conventions:
// - `tracked: true` means the UI should treat it like a trackable feature (uses/rest, DCs, etc).
// - `options` holds user-choice tables (e.g., Draconic Ancestry) used to parameterize features.
export const RaceFeaturesData = {
  Dragonborn: {
    options: {
      draconicAncestry: DragonbornAncestryData,
      ancestryGroups: DragonbornAncestryGroups,
    },
    features: [],
    subraceFeatures: {
      Chromatic: [
        {
          id: "chromatic_warding",
          name: "Chromatic Warding",
          desc: [
            "Starting at 5th level, as an action, you can channel your draconic energy to protect yourself.",
            "For 1 minute, you become immune to the damage type associated with your Chromatic Ancestry.",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      Metallic: [
        {
          id: "metallic_breath_weapon",
          name: "Metallic Breath Weapon",
          desc: [
            "At 5th level, you gain a second breath weapon that you can use when you take the Attack action, replacing one of your attacks.",
            "It affects creatures in a 15-foot cone. The save DC is 8 + your Constitution modifier + your proficiency bonus.",
            "Choose one each time you use it: Enervating Breath (Constitution save or incapacitated until the start of your next turn) or Repulsion Breath (Strength save or pushed 20 feet away from you and knocked prone).",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      Gem: [
        {
          id: "psionic_mind",
          name: "Psionic Mind",
          desc: "You can telepathically speak to any creature you can see within 30 feet of you. You do not need to share a language, but the creature must understand at least one language.",
          tracked: false,
        },
        {
          id: "gem_flight",
          name: "Gem Flight",
          desc: [
            "Starting at 5th level, you can use a bonus action to manifest spectral wings on your body for 1 minute.",
            "For the duration, you gain a flying speed equal to your walking speed and can hover.",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      Draconblood: [
        {
          id: "darkvision",
          name: "Darkvision",
          desc: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. In darkness, you see only shades of gray.",
          tracked: false,
        },
        {
          id: "forceful_presence",
          name: "Forceful Presence",
          desc: "When you make an Intimidation or Persuasion check, you can do so with advantage once per long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
      ],
      Ravenite: [
        {
          id: "darkvision",
          name: "Darkvision",
          desc: "You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light. In darkness, you see only shades of gray.",
          tracked: false,
        },
        {
          id: "vengeful_assault",
          name: "Vengeful Assault",
          desc: "When you take damage from a creature in range of a weapon you are wielding, you can use your reaction to make an attack against that creature once per short or long rest.",
          tracked: true,
          uses: 1,
          recharge: "sr_or_lr",
        },
      ],
    },
  },
  Dwarf: {
    features: [
      {
        id: "dwarven_resilience",
        name: "Dwarven Resilience",
        desc: "You have advantage on saving throws against poison, and you have resistance against poison damage.",
        tracked: false,
      },
    ],
    subraceFeatures: {
      Hill: [],
      Mountain: [],
      "Mark of Warding": [
        {
          id: "mark_of_warding_wards_and_seals",
          name: "Wards and Seals",
          desc: [
            "You can cast Message of Warding (Alarm) and Message of Warding (Mage Armor) with this trait. Starting at 3rd level, you can also cast Message of Warding (Arcane Lock) with it.",
            "After you cast one of those spells with this trait, you can't cast that spell again until you finish a long rest.",
            "Intelligence is your spellcasting ability for these spells, and you don't require material components when you cast them with this trait.",
          ],
          tracked: false,
        },
        {
          id: "mark_of_warding_alarm",
          name: "Message of Warding (Alarm)",
          desc: [
            "Cast [[spell:alarm|Alarm]] with your Message of Warding trait.",
            "This shares 1 total use with your other Message of Warding options and recharges on a long rest.",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          sharedUsePoolKey: "mark_of_warding_message_pool",
          sharedUsePoolDisabledMessage: "Message of Warding has 1 use total.",
        },
        {
          id: "mark_of_warding_mage_armor",
          name: "Message of Warding (Mage Armor)",
          desc: [
            "Cast [[spell:mage-armor|Mage Armor]] with your Message of Warding trait.",
            "This shares 1 total use with your other Message of Warding options and recharges on a long rest.",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          sharedUsePoolKey: "mark_of_warding_message_pool",
          sharedUsePoolDisabledMessage: "Message of Warding has 1 use total.",
        },
        {
          id: "mark_of_warding_arcane_lock",
          name: "Message of Warding (Arcane Lock)",
          desc: [
            "Starting at 3rd level, you can cast [[spell:arcane-lock|Arcane Lock]] with your Message of Warding trait.",
            "This shares 1 total use with your other Message of Warding options and recharges on a long rest.",
          ],
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
          sharedUsePoolKey: "mark_of_warding_message_pool",
          sharedUsePoolDisabledMessage: "Message of Warding has 1 use total.",
        },
        {
          id: "mark_of_warding_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Warding spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Plane Shift: Kaladesh": [],
    },
  },
  Elf: {
    features: [
      {
        id: "fey_ancestry",
        name: "Fey Ancestry",
        desc: "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
        tracked: false,
      },
    ],
    subraceFeatures: {
      "Dark Elf": [
        {
          id: "drow_magic",
          name: "Drow Magic",
          desc: [
            "You know the Dancing Lights cantrip.",
            "When you reach 3rd level, you can cast Faerie Fire once with this trait and regain the ability to do so when you finish a long rest.",
            "When you reach 5th level, you can cast Darkness once with this trait and regain the ability to do so when you finish a long rest.",
            "Charisma is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "drow_magic_faerie_fire",
          name: "Drow Magic (Faerie Fire)",
          desc: "At 3rd level, you can cast [[spell:faerie-fire|Faerie Fire]] once with your Drow Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "drow_magic_darkness",
          name: "Drow Magic (Darkness)",
          desc: "At 5th level, you can cast [[spell:darkness|Darkness]] once with your Drow Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "High Elf": [
        {
          id: "high_elf_cantrip",
          name: "Cantrip",
          desc: "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.",
          tracked: false,
        },
      ],
      "Pallid Elf": [
        {
          id: "blessing_of_the_moonweaver",
          name: "Blessing of the Moonweaver",
          desc: [
            "You know the Light cantrip.",
            "When you reach 3rd level, you can cast Sleep once, and it recharges after a long rest.",
            "When you reach 5th level, you can cast Invisibility (self only) once, and it recharges after a long rest.",
            "You do not need the material components required of these spells.",
            "Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "blessing_of_the_moonweaver_sleep",
          name: "Blessing of the Moonweaver (Sleep)",
          desc: "At 3rd level, you can cast [[spell:sleep|Sleep]] once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "blessing_of_the_moonweaver_invisibility",
          name: "Blessing of the Moonweaver (Invisibility)",
          desc: "At 5th level, you can cast [[spell:invisibility|Invisibility]] (self only) once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Mark of Shadow": [
        {
          id: "shape_shadows",
          name: "Shape Shadows",
          desc: [
            "You know the Minor Illusion cantrip.",
            "Starting at 3rd level, you can cast Invisibility with this trait, and you regain the ability to cast it when you finish a long rest.",
            "Charisma is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "mark_of_shadow_invisibility",
          name: "Mark of Shadows (Invisibility)",
          desc: "At 3rd level, you can cast [[spell:invisibility|Invisibility]] once with your Shape Shadows trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_shadow_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Shadow spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Astral Elf": [
        {
          id: "astral_fire",
          name: "Astral Fire",
          desc: "You know one of these cantrips of your choice: Dancing Lights, Light, or Sacred Flame.",
          tracked: false,
        },
        {
          id: "starlight_step",
          name: "Starlight Step",
          desc: "As a bonus action, you can magically teleport up to 30 feet to an unoccupied space you can see. Recharge: long rest.",
          tracked: true,
          uses: "pb",
          recharge: "lr",
        },
      ],
      "Vahadar": [
        {
          id: "vahadar_cantrip",
          name: "Cantrip",
          desc: "You know one cantrip of your choice from the druid spell list. Wisdom is your spellcasting ability for it.",
          tracked: false,
        },
      ],
      "Mul Daya": [
        {
          id: "mul_daya_magic",
          name: "Mul Daya Magic",
          desc: [
            "You know the Chill Touch cantrip.",
            "When you reach 3rd level, you can cast Hex once with this trait and regain the ability to do so when you finish a long rest.",
            "When you reach 5th level, you can cast Darkness once with this trait and regain the ability to do so when you finish a long rest.",
            "Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "mul_daya_magic_hex",
          name: "Mul Daya Magic (Hex)",
          desc: "At 3rd level, you can cast [[spell:hex|Hex]] once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mul_daya_magic_darkness",
          name: "Mul Daya Magic (Darkness)",
          desc: "At 5th level, you can cast [[spell:darkness|Darkness]] once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
    },
  },
  Gnome: {
    features: [
      {
        id: "gnome_cunning",
        name: "Gnome Cunning",
        desc: "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
        tracked: false,
      },
    ],
  },
  "Half Elf": {
    features: [
      {
        id: "fey_ancestry",
        name: "Fey Ancestry",
        desc: "You have advantage on saving throws against being charmed, and magic can't put you to sleep.",
        tracked: false,
      },
    ],
  },
  "Half Orc": {
    features: [
      {
        id: "relentless_endurance",
        name: "Relentless Endurance",
        desc: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Recharge: long rest.",
        tracked: true,
        recharge: "longRest",
        uses: 1,
      },
      {
        id: "savage_attacks",
        name: "Savage Attacks",
        desc: "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
        tracked: false,
      },
    ],
  },
  Halfling: {
    features: [
      {
        id: "lucky",
        name: "Lucky",
        desc: "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die. You must use the new result.",
        tracked: false,
      },
      {
        id: "brave",
        name: "Brave",
        desc: "You have advantage on saving throws against being frightened.",
        tracked: false,
      },
      {
        id: "nimble",
        name: "Nimble",
        desc: "You can move through the space of any creature that is of a size larger than yours.",
        tracked: false,
      },
    ],
  },
  Human: {
    features: [],
  },
  Tiefling: {
    features: [
      {
        id: "hellish_resistance",
        name: "Hellish Resistance",
        desc: "You have resistance to fire damage.",
        tracked: false,
      },
    ],
  },
};

//   add this dropdown to the character creation menu
export const HalfElfVersatilityArr = {
    "Skill Versatility": {
    "name": "Skill Versatility",
    "description": "You gain proficiency in two skills of your choice."
    },
    "Elf Weapon Training": {
    "name": "Elf Weapon Training",
    "description": "(High or Wood Elf Heritage). You have proficiency with the longsword, shortsword, shortbow, and longbow."
    },
    "Cantrip": {
    "name": "Cantrip",
    "description": "(High Elf Heritage). You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it."
    },
    "Fleet of Foot": {
    "name": "Fleet of Foot",
    "description": "(Wood Elf Heritage). Your base walking speed increases to 35 feet."
    },
    "Mask of the Wild": {
    "name": "Mask of the Wild",
    "description": "(Wood Elf Heritage). You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena."
    },
    "Drow Magic": {
    "name": "Drow Magic",
    "description": "(Dark Elf Heritage). You know the Dancing Lights cantrip. When you reach 3rd level, you can cast Faerie Fire once, and it recharges after a long rest. When you reach 5th level, you can cast Darkness once, and it recharges after a long rest. Charisma is your spellcasting ability for these spells."
    },
    "Swim Speed": {
    "name": "Swim Speed",
    "description": "(Sea Elf Heritage). You have a swimming speed of 30 feet."
    }
    }

export const subRaceSpells = {
    // some spells are not in api, so will need feature added to account for a spell with no description
    // might need refactoring to make the front end easy to access across the board for each race
    // ADD TO SPELL LIST  means they are prepared and don't count towards the number of prepared spells
    Dwarf: {
        'Mark of Warding': { //if subclass === this name,
          'dailySpells': { //rename this 1/day spells?
            1: ['alarm', 'mage-armor'],
            3: ['arcane-lock']
            // 1/LR
            // Uses Character Level
          },
            additionalPreparedSpells: { //rename this added to spellList (tack on to end of spellList with identifier)
            // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
            'first': ['alarm', 'armor-of-agathys'],
            'second': ['arcane-lock', 'knock'],
            'third': ['glyph-of-warding', 'magic-circle'],
            'fourth': ['leomunds-secret-chest', 'mordenkainens-faithful-hound'],
            'fifth': ['antilife-shell']
            //  ADD TO SPELL LIST
          }
        }
      },
      Elf: {
        // HIGH ELF adds 1 wizard cantrip
        // Astral Elf adds either dancing lights, light, or sacred flame to their cantrips known
        // Vahadar Elf adds 1 druid cantrip
        'Dark Elf': {
          dailySpells: {
            // need to account for cantrips and leveled spells
            1: ['dancing-lights'], //CANTRIP
            3: ['faerie-fire'],
            5: ['darkness']
            // 1/LR
          }
        },
        'Pallid Elf': {
          dailySpells: {
            3: ['sleep'],
            // invis is only self
            5: ['invisibility']
            // 1/LR
          }
        },
        'Mark of Shadow': {
            additionalPreparedSpells: {
              'first': ['disguise-self', 'silent-image'],
              'second': ['darkness', 'pass-without-trace'],
              'third': ['clairvoyance', 'major-image'],
              'fourth': ['greater-invisibility', 'hallucinatory-terrain'],
              'fifth': ['mislead']
                // ADD TO SPELL LIST
            }
          },
        'Mul Daya': {
          dailySpells: {
            1: ['chill-touch'],
            3: ['hex'],
            5: ['darkness']
          }
        }
      },
      Gnome: {
        // Forest Gnome adds minor illusion cantrip
        'Mark of Scribing': {
            additionalPreparedSpells: {
                // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                'first': ['comprehend-languages', 'illusory-script'],
                'second': ['animal-messenger', 'silence'],
                'third': ['sending', 'tongues'],
                'fourth': ['arcane-eye', 'divination'],
                'fifth': ['dream']
                //  ADD TO SPELL LIST
            }
        }
      },
      Human: {
        // all Mark subraces have 1/LR for 1st spell trait

        'Mark of Finding': {
            dailySpells: {
                1: ['hunters-mark'],
                3: ['locate-object']
                // 1/LR
            },
            additionalPreparedSpells: {
                // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                'first': ['faerie-fire', 'longstrider'],
                'second': ['locate-plants-or-animals', 'locate-object'],
                'third': ['clairvoyance', 'speak-with-plants'],
                'fourth': ['divination', 'locate-creature'],
                'fifth': ['commune-with-nature']
                //  ADD TO SPELL LIST
            }
        },
        'Mark of Handling': {
            dailySpells: {
                1: ['animal-friendship, speak-with-animals'],
                // 1/LR
            },
            additionalPreparedSpells: {
                // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                'first': ['animal-friendship', 'speak-with-animals'],
                'second': ['beast-sense', 'calm-emotions'],
                'third': ['beacon-of-hope', 'conjure-animals'],
                'fourth': ['aura-of-life', 'dominate-beast'],
                'fifth': ['awaken']
                //  ADD TO SPELL LIST
            }
        },
        'Mark of Making': {
            dailySpells: {
                1: ['mending, magic-weapon']
            },
            additionalPreparedSpells: {
                'first': ['identify', 'tensers-floating-disk'],
                'second': ['continual-flame', 'magic-weapon'],
                'third': ['conjure-barrage', 'elemental-weapon'],
                'fourth': ['fabricate', 'stone-shape'],
                'fifth': ['creation']
            }
        },
        'Mark of Passage': {
            dailySpells: {
                1: ['misty-step']
            },
            additionalPreparedSpells: {
                'first': ['expeditious-retreat', 'jump'],
                'second': ['misty-step', 'pass-without-trace'],
                'third': ['blink', 'phantom-steed'],
                'fourth': ['dimension-door', 'freedom-of-movement'],
                'fifth': ['teleportation-circle']
            }
        },
        'Mark of Sentinel': {
            dailySpells: {
                1: ['shield']
            },
            additionalPreparedSpells: {
                'first': ['compelled-duel', 'shield-of-faith'],
                'second': ['warding-bond', 'zone-of-truth'],
                'third': ['counterspell', 'protection-from-energy'],
                'fourth': ['death-ward', 'guardian-of-faith'],
                'fifth': ['bigbys-hand']
            }
        },
        'Half-Elf': {
            'Standard': {
                // not sure how to do this--Only if the player chooses Cantrip or Drow magic does the player get spells
                'Half-Elf Versatility': {
                    'Cantrip': 'You know one cantrip of your choice from the wizard spell list.',
                    'Drow Magic': {
                        1: 'dancing-lights',
                        3: 'faerie-fire',
                        5: 'darkness'
                        // 1xLR
                    }
                }
            },
            'Mark of Detection': {
                dailySpells: {
                    1: ['detect-magic', 'detect-poison-and-disease'],
                    3: ['see-invisibility']
                },
                additionalPreparedSpells: {
                    'first': ['detect-magic', 'detect-poison-and-disease'],
                    'second': ['detect-thoughts', 'find-traps'],
                    'third': ['clairvoyance', 'nondetection'],
                    'fourth': ['arcane-eye', 'divination'],
                    'fifth': ['legend-lore']
                }
            },
            'Mark of Storm': {
                dailySpells: {
                    1: ['gust', 'gust-of-wind'],
                    // 1XLR
                },
                additionalPreparedSpells: {
                    'first': ['feather-fall', 'fog-cloud'],
                    'second': ['gust-of-wind', 'levitate'],
                    'third': ['sleet-storm', 'wind-wall'],
                    'fourth': ['conjure-minor-elementals', 'control-water'],
                    'fifth': ['conjure-elemental']
                    // ADD TO SPELL LIST
                }
            },
        },
        'Half-Orc': {
            'Mark of Finding': {
                dailySpells: {
                    1: ['hunters-mark'],
                    3: ['locate-object']
                    // 1/LR
                },
                additionalPreparedSpells: {
                    // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                    'first': ['faerie-fire', 'longstrider'],
                    'second': ['locate-plants-or-animals', 'locate-object'],
                    'third': ['clairvoyance', 'speak-with-plants'],
                    'fourth': ['divination', 'locate-creature'],
                    'fifth': ['commune-with-nature']
                    //  ADD TO SPELL LIST
                }
            },
        },
        Halfling: {
            'Lotusden': {
                dailySpells: {
                    1: ['druidcraft'],
                    3: ['entangle'],
                    5: ['spike-growth']
                }
            },
            'Mark of Hospitality': {
                dailySpells: {
                    1: ['prestidigitation', 'purify-food-and-drink', 'unseen-servant'],
                    // 1/LR
                },
                additionalPreparedSpells: {
                    // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                    'first': ['goodberry', 'sleep'],
                    'second': ['aid', 'calm-emotions'],
                    'third': ['create-food-and-water', 'leomunds-tiny-hut'],
                    'fourth': ['aura-of-purity', 'mordenkainens-private-sanctum'],
                    'fifth': ['hallow']
                    //  ADD TO SPELL LIST
                }
            },
            'Mark of Healing': {
                dailySpells: {
                    1: ['cure-wounds'],
                    3: ['lesser-restoration']
                    // 1/LR
                },
                additionalPreparedSpells: {
                    // uses Spell Level consistent with spellTables.js (can check if character's level has spells greater than 0 of that level)
                    'first': ['cure-wounds', 'healing-word'],
                    'second': ['lesser-restoration', 'prayer-of-healing'],
                    'third': ['aura-of-vitality', 'mass-healing-word'],
                    'fourth': ['aura-of-purity', 'aura-of-life'],
                    'fifth': ['greater-restoration']
                    //  ADD TO SPELL LIST
                }
            },
        },
        Tiefling: {
            'Bloodline of Asmodeus': {
                dailySpells: {
                    1: ['thaumaturgy'],
                    3: ['hellish-rebuke'],
                    5: ['darkness']
                }
            },
            'Bloodline of Baalzebul': {
                dailySpells: {
                    1: ['thaumaturgy'],
                    3: ['ray-of-sickness'],
                    5: ['crown-of-madness']
                  }
            },
            'Bloodline of Dispater': {
                dailySpells: {
                  1: ['thaumaturgy'],
                  3: ['disguise-self'],
                  5: ['detect-thoughts']
                }
            },
            'Bloodline of Fierna': {
                dailySpells: {
                  1: ['friends'],
                  3: ['charm-person'],
                  5: ['suggestion']
                }
            },
            'Bloodline of Glasya': {
                dailySpells: {
                  1: ['minor-illusion'],
                  3: ['disguise-self'],
                  5: ['invisibility']
                }
            },
            'Bloodline of Levistus': {
                dailySpells: {
                  1: ['ray-of-frost'],
                  3: ['armor-of-agathys'],
                  5: ['darkness']
                }
            },
            'Bloodline of Mammon': {
                dailySpells: {
                  1: ['mage-hand'],
                  3: ['tensers-floating-disk'],
                  5: ['arcane-lock']
                }
            },
            'Bloodline of Mephistopheles': {
                dailySpells: {
                  1: ['mage-hand'],
                  3: ['burning-hands'],
                  5: ['flame-blade']
                }
            },
            'Bloodline of Zariel': {
                dailySpells: {
                  1: ['thaumaturgy'],
                  3: ['searing-smite'],
                  5: ['branding-smite']
                }
            },
            'Variant Tiefling': {
                dailySpells :{ // and includes Hellfire--Burning hands at lvl 2
                    1: ['vicious-mockery'],
                    3: ['charm-person', 'burning-hands'], //both as 2nd lvl instead of first lvl
                    5: ['enthrall']
                    // 1x/LR
                }
            }
        }
      },

}
