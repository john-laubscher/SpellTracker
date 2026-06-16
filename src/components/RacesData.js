export const Races = ["Dragonborn", "Dwarf", "Elf", "Gnome", "Half Elf", "Half Orc", "Halfling", "Human", "Tiefling"];

// dot notation uses identifiers, but bracket notation doesn't--need bracket notation for key strings
// UA subclasses not included yet as of 6/20/23
export const Subraces = {
    Dragonborn: ['Chromatic', 'Metallic', 'Gem', 'Draconblood', 'Ravenite'],
    Dwarf: ['Hill', 'Mountain', 'Mark of Warding', 'Plane Shift: Kaladesh'],
    Elf: ['Dark Elf', 'High Elf', 'Wood Elf', 'Pallid Elf', 'Mark of Shadow', 'Astral Elf', 'Bishtahar/Tirahar', 'Vahadar', 'Zendikar', 'Tajuru', 'Juraga', 'Mul Daya'],
    Gnome: ['Forest', 'Rock', 'Mark of Scribing'],
    'Half Elf': ['Standard Half Elf', 'Mark of Detection', 'Mark of Storm'],
    'Half Orc': ['Standard', 'Mark of Finding'],
    Halfling: ['Lightfoot', 'Stout', 'Ghostwise', 'Lotusden', 'Mark of Hospitality', 'Mark of Healing'],
    Human: ['Standard', 'Variant', 'Mark of Finding', 'Mark of Handling', 'Mark of Making', 'Mark of Passage', 'Mark of Sentinel', ],
    // Plane Shift Humans not included (but don't have spells)
    Tiefling: ['Bloodline of Asmodeus', 'Bloodline of Baalzebul', 'Bloodline of Dispater', 'Bloodline of Fierna', 'Bloodline of Glasya', 'Bloodline of Levistus', 'Bloodline of Mammon', 'Bloodline of Mephistopheles', 'Bloodline of Zariel', 'Variant Tiefling']
  }

export const TieflingLegacyCantripData = {
  "Bloodline of Asmodeus": {
    featureId: "tiefling_bloodline_of_asmodeus_infernal_legacy",
    featureName: "Infernal Legacy",
    storageKey: "tieflingAsmodeusLegacyCantrip",
    defaultSpellIndex: "thaumaturgy",
    bonusTag: "tiefling_infernal_legacy_cantrip",
    tag: "IL",
  },
  "Bloodline of Baalzebul": {
    featureId: "tiefling_bloodline_of_baalzebul_legacy_of_maladomini",
    featureName: "Legacy of Maladomini",
    storageKey: "tieflingBaalzebulLegacyCantrip",
    defaultSpellIndex: "thaumaturgy",
    bonusTag: "tiefling_legacy_of_maladomini_cantrip",
    tag: "LoM",
  },
  "Bloodline of Dispater": {
    featureId: "tiefling_bloodline_of_dispater_legacy_of_dis",
    featureName: "Legacy of Dis",
    storageKey: "tieflingDispaterLegacyCantrip",
    defaultSpellIndex: "thaumaturgy",
    bonusTag: "tiefling_legacy_of_dis_cantrip",
    tag: "LoD",
  },
  "Bloodline of Fierna": {
    featureId: "tiefling_bloodline_of_fierna_legacy_of_phlegethos",
    featureName: "Legacy of Phlegethos",
    storageKey: "tieflingFiernaLegacyCantrip",
    defaultSpellIndex: "friends",
    bonusTag: "tiefling_legacy_of_phlegethos_cantrip",
    tag: "LoP",
  },
  "Bloodline of Glasya": {
    featureId: "tiefling_bloodline_of_glasya_legacy_of_malbolge",
    featureName: "Legacy of Malbolge",
    storageKey: "tieflingGlasyaLegacyCantrip",
    defaultSpellIndex: "minor-illusion",
    bonusTag: "tiefling_legacy_of_malbolge_cantrip",
    tag: "LoM",
  },
  "Bloodline of Levistus": {
    featureId: "tiefling_bloodline_of_levistus_legacy_of_stygia",
    featureName: "Legacy of Stygia",
    storageKey: "tieflingLevistusLegacyCantrip",
    defaultSpellIndex: "ray-of-frost",
    bonusTag: "tiefling_legacy_of_stygia_cantrip",
    tag: "LoS",
  },
  "Bloodline of Mammon": {
    featureId: "tiefling_bloodline_of_mammon_legacy_of_minauros",
    featureName: "Legacy of Minauros",
    storageKey: "tieflingMammonLegacyCantrip",
    defaultSpellIndex: "mage-hand",
    bonusTag: "tiefling_legacy_of_minauros_cantrip",
    tag: "LoM",
  },
  "Bloodline of Mephistopheles": {
    featureId: "tiefling_bloodline_of_mephistopheles_legacy_of_cania",
    featureName: "Legacy of Cania",
    storageKey: "tieflingMephistophelesLegacyCantrip",
    defaultSpellIndex: "mage-hand",
    bonusTag: "tiefling_legacy_of_cania_cantrip",
    tag: "LoC",
  },
  "Bloodline of Zariel": {
    featureId: "tiefling_bloodline_of_zariel_legacy_of_avernus",
    featureName: "Legacy of Avernus",
    storageKey: "tieflingZarielLegacyCantrip",
    defaultSpellIndex: "thaumaturgy",
    bonusTag: "tiefling_legacy_of_avernus_cantrip",
    tag: "LoA",
  },
  "Variant Tiefling": {
    featureId: "tiefling_variant_devils_tongue",
    featureName: "Devil's Tongue",
    storageKey: "tieflingVariantDevilsTongueCantrip",
    defaultSpellIndex: "vicious-mockery",
    bonusTag: "tiefling_devils_tongue_cantrip",
    tag: "DT",
  },
};

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
    subraceFeatures: {
      Forest: [
        {
          id: "natural_illusionist",
          name: "Natural Illusionist",
          desc: "You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.",
          tracked: false,
        },
        {
          id: "speak_with_small_beasts",
          name: "Speak with Small Beasts",
          desc: "Through sound and gestures, you may communicate simple ideas with Small or smaller beasts.",
          tracked: false,
        },
      ],
      Rock: [],
      "Mark of Scribing": [
        {
          id: "gifted_scribe",
          name: "Gifted Scribe",
          desc: "Whenever you make an Intelligence (History) check or an ability check involving calligrapher's supplies, you can roll a d4 and add the number rolled to the total ability check.",
          tracked: false,
        },
        {
          id: "scribes_insight",
          name: "Scribe's Insight",
          desc: [
            "You know the Message cantrip.",
            "You can cast Comprehend Languages with this trait. Starting at 3rd level, you can also cast Magic Mouth with it.",
            "You regain all expended uses when you finish a long rest. Intelligence is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "scribes_insight_comprehend_languages",
          name: "Scribe's Insight (Comprehend Languages)",
          desc: "Cast [[spell:comprehend-languages|Comprehend Languages]] with your Scribe's Insight trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "scribes_insight_magic_mouth",
          name: "Scribe's Insight (Magic Mouth)",
          desc: "At 3rd level, cast [[spell:magic-mouth|Magic Mouth]] with your Scribe's Insight trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_scribing_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Scribing spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
    },
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
    subraceFeatures: {
      "Standard Half Elf": [],
      "Mark of Detection": [
        {
          id: "mark_of_detection_detect_magic",
          name: "Magical Detection (Detect Magic)",
          desc: "You can cast [[spell:detect-magic|Detect Magic]] with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "mark_of_detection_detect_poison_and_disease",
          name: "Magical Detection (Detect Poison and Disease)",
          desc: "You can cast [[spell:detect-poison-and-disease|Detect Poison and Disease]] with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "mark_of_detection_see_invisibility",
          name: "Magical Detection (See Invisibility)",
          desc: "At 3rd level, you can cast [[spell:see-invisibility|See Invisibility]] with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_detection_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Detection spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Storm": [
        {
          id: "mark_of_storm_windwrights_intuition",
          name: "Windwright's Intuition",
          desc: "Whenever you make a Dexterity (Acrobatics) check or any ability check involving navigator's tools, you can roll a d4 and add the number rolled to the total ability check.",
          tracked: false,
        },
        {
          id: "mark_of_storm_storms_boon",
          name: "Storm's Boon",
          desc: "You have resistance to lightning damage.",
          tracked: false,
        },
        {
          id: "mark_of_storm_headwinds",
          name: "Headwinds",
          desc: [
            "You know the [[spell:gust|Gust]] cantrip.",
            "Starting at 3rd level, you can cast [[spell:gust-of-wind|Gust of Wind]] once with this trait and regain the ability to do so when you finish a long rest.",
            "Charisma is your spellcasting ability for this spell.",
          ],
          tracked: false,
        },
        {
          id: "mark_of_storm_gust_of_wind",
          name: "Headwinds (Gust of Wind)",
          desc: "At 3rd level, you can cast [[spell:gust-of-wind|Gust of Wind]] once with your Headwinds trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_storm_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Storm spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
    },
  },
  "Half Orc": {
    features: [
      {
        id: "relentless_endurance",
        name: "Relentless Endurance",
        desc: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Recharge: long rest.",
        tracked: true,
        recharge: "lr",
        uses: 1,
      },
      {
        id: "savage_attacks",
        name: "Savage Attacks",
        desc: "When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
        tracked: false,
      },
    ],
    subraceFeatures: {
      Standard: [],
      "Mark of Finding": [
        {
          id: "mark_of_finding_finders_magic",
          name: "Finder's Magic",
          desc: [
            "You can cast [[spell:hunters-mark|Hunter's Mark]] with this trait.",
            "Starting at 3rd level, you can also cast [[spell:locate-object|Locate Object]] with it.",
            "Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "mark_of_finding_hunters_mark",
          name: "Finder's Magic (Hunter's Mark)",
          desc: "Cast [[spell:hunters-mark|Hunter's Mark]] with your Finder's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "mark_of_finding_locate_object",
          name: "Finder's Magic (Locate Object)",
          desc: "At 3rd level, cast [[spell:locate-object|Locate Object]] with your Finder's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_finding_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Finding spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
    },
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
    subraceFeatures: {
      Lightfoot: [
        {
          id: "naturally_stealthy",
          name: "Naturally Stealthy",
          desc: "You can attempt to hide even when you are only obscured by a creature that is at least one size larger than you.",
          tracked: false,
        },
      ],
      Stout: [
        {
          id: "stout_resilience",
          name: "Stout Resilience",
          desc: "You have advantage on saving throws against poison, and you have resistance to poison damage.",
          tracked: false,
        },
      ],
      Ghostwise: [
        {
          id: "silent_speech",
          name: "Silent Speech",
          desc: "You can speak telepathically to any creature within 30 feet of you. The creature understands you only if the two of you share a language.",
          tracked: false,
        },
      ],
      Lotusden: [
        {
          id: "children_of_the_woods",
          name: "Children of the Woods",
          desc: [
            "You know the [[spell:druidcraft|Druidcraft]] cantrip.",
            "At 3rd level, you can cast [[spell:entangle|Entangle]] once per long rest.",
            "At 5th level, you can cast [[spell:spike-growth|Spike Growth]] once per long rest.",
            "These spells don't require the material components normally required. Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "children_of_the_woods_entangle",
          name: "Children of the Woods (Entangle)",
          desc: "At 3rd level, you can cast [[spell:entangle|Entangle]] once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "children_of_the_woods_spike_growth",
          name: "Children of the Woods (Spike Growth)",
          desc: "At 5th level, you can cast [[spell:spike-growth|Spike Growth]] once with this trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
        {
          id: "timberwalk",
          name: "Timberwalk",
          desc: "Ability checks made to track you are at disadvantage and you can move through difficult terrain made of non-magical plants and overgrowth without expending extra movement.",
          tracked: false,
        },
      ],
      "Mark of Hospitality": [
        {
          id: "ever_hospitable",
          name: "Ever Hospitable",
          desc: "Whenever you roll a Charisma (Persuasion) check or an ability check involving Brewer's Tools or Cook's Utensils, roll a d4 and add the number rolled to the total ability check.",
          tracked: false,
        },
        {
          id: "innkeepers_magic",
          name: "Innkeeper's Magic",
          desc: [
            "You know the [[spell:prestidigitation|Prestidigitation]] cantrip.",
            "You can also cast [[spell:purify-food-and-drink|Purify Food and Drink]] and [[spell:unseen-servant|Unseen Servant]] with this trait.",
            "Once you cast either spell with this trait, you can't cast that spell again until you finish a long rest. Charisma is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "innkeepers_magic_purify_food_and_drink",
          name: "Innkeeper's Magic (Purify Food and Drink)",
          desc: "Cast [[spell:purify-food-and-drink|Purify Food and Drink]] with your Innkeeper's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "innkeepers_magic_unseen_servant",
          name: "Innkeeper's Magic (Unseen Servant)",
          desc: "Cast [[spell:unseen-servant|Unseen Servant]] with your Innkeeper's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "mark_of_hospitality_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Hospitality spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Healing": [
        {
          id: "medical_intuition",
          name: "Medical Intuition",
          desc: "Whenever you roll a Wisdom (Medicine) check or an ability check involving an Herbalism Kit, roll a d4 and add the number rolled to the total ability check.",
          tracked: false,
        },
        {
          id: "healing_touch",
          name: "Healing Touch",
          desc: [
            "You can cast [[spell:cure-wounds|Cure Wounds]] with this trait.",
            "Beginning at 3rd level, you can also cast [[spell:lesser-restoration|Lesser Restoration]] with this trait.",
            "Once you cast either spell with this trait, you can't cast that spell again until you finish a long rest. Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "healing_touch_cure_wounds",
          name: "Healing Touch (Cure Wounds)",
          desc: "Cast [[spell:cure-wounds|Cure Wounds]] with your Healing Touch trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "healing_touch_lesser_restoration",
          name: "Healing Touch (Lesser Restoration)",
          desc: "At 3rd level, cast [[spell:lesser-restoration|Lesser Restoration]] with your Healing Touch trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "mark_of_healing_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Healing spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
    },
  },
  Human: {
    features: [],
    subraceFeatures: {
      Standard: [],
      Variant: [],
      "Mark of Finding": [
        {
          id: "human_mark_of_finding_finders_magic",
          name: "Finder's Magic",
          desc: [
            "You can cast [[spell:hunters-mark|Hunter's Mark]] with this trait.",
            "Starting at 3rd level, you can also cast [[spell:locate-object|Locate Object]] with it.",
            "Wisdom is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "human_mark_of_finding_hunters_mark",
          name: "Finder's Magic (Hunter's Mark)",
          desc: "Cast [[spell:hunters-mark|Hunter's Mark]] with your Finder's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_finding_locate_object",
          name: "Finder's Magic (Locate Object)",
          desc: "At 3rd level, cast [[spell:locate-object|Locate Object]] with your Finder's Magic trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "human_mark_of_finding_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Finding spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Handling": [
        {
          id: "human_mark_of_handling_primal_connection",
          name: "Primal Connection",
          desc: [
            "You can cast [[spell:animal-friendship|Animal Friendship]] and [[spell:speak-with-animals|Speak with Animals]] with this trait.",
            "These spells require no material components. Wisdom is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "human_mark_of_handling_the_bigger_they_are",
          name: "The Bigger They Are",
          desc: "Starting at 3rd level, you can target a Beast or a Monstrosity when you cast [[spell:animal-friendship|Animal Friendship]] or [[spell:speak-with-animals|Speak with Animals]], provided that the creature's intelligence is 3 or lower.",
          tracked: false,
          level: 3,
        },
        {
          id: "human_mark_of_handling_animal_friendship",
          name: "Primal Connection (Animal Friendship)",
          desc: "Cast [[spell:animal-friendship|Animal Friendship]] with your Primal Connection trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_handling_speak_with_animals",
          name: "Primal Connection (Speak with Animals)",
          desc: "Cast [[spell:speak-with-animals|Speak with Animals]] with your Primal Connection trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_handling_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Handling spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Making": [
        {
          id: "human_mark_of_making_spellsmith",
          name: "Spellsmith",
          desc: [
            "You learn the [[spell:mending|Mending]] cantrip.",
            "You can also cast [[spell:magic-weapon|Magic Weapon]] with this trait.",
            "When you do so, the spell lasts for 1 hour and doesn't require concentration. Intelligence is your spellcasting ability for these spells.",
          ],
          tracked: false,
        },
        {
          id: "human_mark_of_making_magic_weapon",
          name: "Spellsmith (Magic Weapon)",
          desc: "Cast [[spell:magic-weapon|Magic Weapon]] with your Spellsmith trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_making_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Making spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Passage": [
        {
          id: "human_mark_of_passage_magical_passage",
          name: "Magical Passage",
          desc: "You can cast [[spell:misty-step|Misty Step]] with this trait. Dexterity is your spellcasting ability for this spell.",
          tracked: false,
        },
        {
          id: "human_mark_of_passage_misty_step",
          name: "Magical Passage (Misty Step)",
          desc: "Cast [[spell:misty-step|Misty Step]] with your Magical Passage trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_passage_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Passage spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
      "Mark of Sentinel": [
        {
          id: "human_mark_of_sentinel_shield",
          name: "Guardian Shield (Shield)",
          desc: "Cast [[spell:shield|Shield]] with your Guardian Shield trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_sentinel_vigilant_guardian",
          name: "Vigilant Guardian",
          desc: "Once a creature that you can see within 5 feet of you is hit with an attack roll, you can use your reaction to swap places with it, and you are hit by the attack instead. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
        },
        {
          id: "human_mark_of_sentinel_spells_of_the_mark",
          name: "Spells of the Mark",
          desc: "If you have the Spellcasting or Pact Magic class feature, the Mark of Sentinel spells are added to the spell list of your spellcasting class.",
          tracked: false,
        },
      ],
    },
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
    subraceFeatures: {
      "Bloodline of Asmodeus": [
        {
          id: "tiefling_bloodline_of_asmodeus_infernal_legacy",
          name: "Infernal Legacy",
          desc: [
            "You know the [[spell:thaumaturgy|Thaumaturgy]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:hellish-rebuke|Hellish Rebuke]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:darkness|Darkness]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_asmodeus_infernal_legacy_hellish_rebuke",
          name: "Infernal Legacy (Hellish Rebuke)",
          desc: "At 3rd level, cast [[spell:hellish-rebuke|Hellish Rebuke]] as a 2nd-level spell with your Infernal Legacy trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_asmodeus_infernal_legacy_darkness",
          name: "Infernal Legacy (Darkness)",
          desc: "At 5th level, cast [[spell:darkness|Darkness]] with your Infernal Legacy trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Baalzebul": [
        {
          id: "tiefling_bloodline_of_baalzebul_legacy_of_maladomini",
          name: "Legacy of Maladomini",
          desc: [
            "You know the [[spell:thaumaturgy|Thaumaturgy]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:ray-of-sickness|Ray of Sickness]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:crown-of-madness|Crown of Madness]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_baalzebul_legacy_of_maladomini_ray_of_sickness",
          name: "Legacy of Maladomini (Ray of Sickness)",
          desc: "At 3rd level, cast [[spell:ray-of-sickness|Ray of Sickness]] as a 2nd-level spell with your Legacy of Maladomini trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_baalzebul_legacy_of_maladomini_crown_of_madness",
          name: "Legacy of Maladomini (Crown of Madness)",
          desc: "At 5th level, cast [[spell:crown-of-madness|Crown of Madness]] with your Legacy of Maladomini trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Dispater": [
        {
          id: "tiefling_bloodline_of_dispater_legacy_of_dis",
          name: "Legacy of Dis",
          desc: [
            "You know the [[spell:thaumaturgy|Thaumaturgy]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:disguise-self|Disguise Self]] once with this trait.",
            "When you reach 5th level, you can cast [[spell:detect-thoughts|Detect Thoughts]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_dispater_legacy_of_dis_disguise_self",
          name: "Legacy of Dis (Disguise Self)",
          desc: "At 3rd level, cast [[spell:disguise-self|Disguise Self]] with your Legacy of Dis trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_dispater_legacy_of_dis_detect_thoughts",
          name: "Legacy of Dis (Detect Thoughts)",
          desc: "At 5th level, cast [[spell:detect-thoughts|Detect Thoughts]] with your Legacy of Dis trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Fierna": [
        {
          id: "tiefling_bloodline_of_fierna_legacy_of_phlegethos",
          name: "Legacy of Phlegethos",
          desc: [
            "You know the [[spell:friends|Friends]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:charm-person|Charm Person]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:suggestion|Suggestion]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_fierna_legacy_of_phlegethos_charm_person",
          name: "Legacy of Phlegethos (Charm Person)",
          desc: "At 3rd level, cast [[spell:charm-person|Charm Person]] as a 2nd-level spell with your Legacy of Phlegethos trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_fierna_legacy_of_phlegethos_suggestion",
          name: "Legacy of Phlegethos (Suggestion)",
          desc: "At 5th level, cast [[spell:suggestion|Suggestion]] with your Legacy of Phlegethos trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Glasya": [
        {
          id: "tiefling_bloodline_of_glasya_legacy_of_malbolge",
          name: "Legacy of Malbolge",
          desc: [
            "You know the [[spell:minor-illusion|Minor Illusion]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:disguise-self|Disguise Self]] once with this trait.",
            "When you reach 5th level, you can cast [[spell:invisibility|Invisibility]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_glasya_legacy_of_malbolge_disguise_self",
          name: "Legacy of Malbolge (Disguise Self)",
          desc: "At 3rd level, cast [[spell:disguise-self|Disguise Self]] with your Legacy of Malbolge trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_glasya_legacy_of_malbolge_invisibility",
          name: "Legacy of Malbolge (Invisibility)",
          desc: "At 5th level, cast [[spell:invisibility|Invisibility]] with your Legacy of Malbolge trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Levistus": [
        {
          id: "tiefling_bloodline_of_levistus_legacy_of_stygia",
          name: "Legacy of Stygia",
          desc: [
            "You know the [[spell:ray-of-frost|Ray of Frost]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:armor-of-agathys|Armor of Agathys]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:darkness|Darkness]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_levistus_legacy_of_stygia_armor_of_agathys",
          name: "Legacy of Stygia (Armor of Agathys)",
          desc: "At 3rd level, cast [[spell:armor-of-agathys|Armor of Agathys]] as a 2nd-level spell with your Legacy of Stygia trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_levistus_legacy_of_stygia_darkness",
          name: "Legacy of Stygia (Darkness)",
          desc: "At 5th level, cast [[spell:darkness|Darkness]] with your Legacy of Stygia trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Mammon": [
        {
          id: "tiefling_bloodline_of_mammon_legacy_of_minauros",
          name: "Legacy of Minauros",
          desc: [
            "You know the [[spell:mage-hand|Mage Hand]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:tensers-floating-disk|Tenser's Floating Disk]] once with this trait.",
            "When you reach 5th level, you can cast [[spell:arcane-lock|Arcane Lock]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_mammon_legacy_of_minauros_tensers_floating_disk",
          name: "Legacy of Minauros (Tenser's Floating Disk)",
          desc: "At 3rd level, cast [[spell:tensers-floating-disk|Tenser's Floating Disk]] with your Legacy of Minauros trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_mammon_legacy_of_minauros_arcane_lock",
          name: "Legacy of Minauros (Arcane Lock)",
          desc: "At 5th level, cast [[spell:arcane-lock|Arcane Lock]] with your Legacy of Minauros trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Mephistopheles": [
        {
          id: "tiefling_bloodline_of_mephistopheles_legacy_of_cania",
          name: "Legacy of Cania",
          desc: [
            "You know the [[spell:mage-hand|Mage Hand]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:burning-hands|Burning Hands]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:flame-blade|Flame Blade]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_mephistopheles_legacy_of_cania_burning_hands",
          name: "Legacy of Cania (Burning Hands)",
          desc: "At 3rd level, cast [[spell:burning-hands|Burning Hands]] as a 2nd-level spell with your Legacy of Cania trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_mephistopheles_legacy_of_cania_flame_blade",
          name: "Legacy of Cania (Flame Blade)",
          desc: "At 5th level, cast [[spell:flame-blade|Flame Blade]] with your Legacy of Cania trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Bloodline of Zariel": [
        {
          id: "tiefling_bloodline_of_zariel_legacy_of_avernus",
          name: "Legacy of Avernus",
          desc: [
            "You know the [[spell:thaumaturgy|Thaumaturgy]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:searing-smite|Searing Smite]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:branding-smite|Branding Smite]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_bloodline_of_zariel_legacy_of_avernus_searing_smite",
          name: "Legacy of Avernus (Searing Smite)",
          desc: "At 3rd level, cast [[spell:searing-smite|Searing Smite]] as a 2nd-level spell with your Legacy of Avernus trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_bloodline_of_zariel_legacy_of_avernus_branding_smite",
          name: "Legacy of Avernus (Branding Smite)",
          desc: "At 5th level, cast [[spell:branding-smite|Branding Smite]] with your Legacy of Avernus trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
      ],
      "Variant Tiefling": [
        {
          id: "tiefling_variant_devils_tongue",
          name: "Devil's Tongue",
          desc: [
            "You know the [[spell:vicious-mockery|Vicious Mockery]] cantrip.",
            "When you reach 3rd level, you can cast [[spell:charm-person|Charm Person]] as a 2nd-level spell once with this trait.",
            "When you reach 5th level, you can cast [[spell:enthrall|Enthrall]] once with this trait.",
            "You regain the ability to cast these spells with this trait when you finish a long rest. Charisma is your spellcasting ability for them.",
          ],
          tracked: false,
        },
        {
          id: "tiefling_variant_devils_tongue_charm_person",
          name: "Devil's Tongue (Charm Person)",
          desc: "At 3rd level, cast [[spell:charm-person|Charm Person]] as a 2nd-level spell with your Devil's Tongue trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_variant_devils_tongue_enthrall",
          name: "Devil's Tongue (Enthrall)",
          desc: "At 5th level, cast [[spell:enthrall|Enthrall]] with your Devil's Tongue trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 5,
        },
        {
          id: "tiefling_variant_hellfire_burning_hands",
          name: "Hellfire (Burning Hands)",
          desc: "At 3rd level, cast [[spell:burning-hands|Burning Hands]] as a 2nd-level spell with your Hellfire trait. Recharge: long rest.",
          tracked: true,
          uses: 1,
          recharge: "lr",
          level: 3,
        },
        {
          id: "tiefling_variant_winged",
          name: "Winged",
          desc: "You have bat-like wings sprouting from your shoulder blades. You have a flying speed of 30 feet while you aren't wearing heavy armor.",
          tracked: false,
        },
      ],
    },
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
        Forest: {
          dailySpells: {
            1: ["minor-illusion"],
          },
        },
        'Mark of Scribing': {
            dailySpells: {
                1: ['message', 'comprehend-languages'],
                3: ['magic-mouth']
            },
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
      "Half Elf": {
        "Mark of Detection": {
            dailySpells: {
                1: ["detect-magic", "detect-poison-and-disease"],
                3: ["see-invisibility"]
            },
            additionalPreparedSpells: {
                "first": ["detect-magic", "detect-poison-and-disease"],
                "second": ["detect-thoughts", "find-traps"],
                "third": ["clairvoyance", "nondetection"],
                "fourth": ["arcane-eye", "divination"],
                "fifth": ["legend-lore"]
            }
        },
        "Mark of Storm": {
            dailySpells: {
                1: ["gust"],
                3: ["gust-of-wind"]
            },
            additionalPreparedSpells: {
                "first": ["feather-fall", "fog-cloud"],
                "second": ["gust-of-wind", "levitate"],
                "third": ["sleet-storm", "wind-wall"],
                "fourth": ["conjure-minor-elementals", "control-water"],
                "fifth": ["conjure-elemental"]
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
                1: ['animal-friendship', 'speak-with-animals'],
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
                1: ['mending', 'magic-weapon']
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
      },
      "Half Orc": {
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
      };
