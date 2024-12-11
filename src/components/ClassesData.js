export const ClassesData = {
  // Nesting goes as follows: Class, Subclass, level, ability gained from subclass (name: descritption).
  // Includes subclasses***
  noClass: {
    subclasses: "",
    spellcastingAbility: "nonCaster",
  },

  // When building out rendering/component for this, ADV Feature: allow users to send features to expanded section or main/header section to be more immediately visible, and give user control over what they are seeing/what they think is most important. (probably need to give each feature an additional feature/key value pair like header: true/false)
  // To build out new header: true/false section, copy and paste into ai, and have it explicitly return the structure with all the previous data, and all the new data too (default: if tracked is 1, put it in header, 0 is in expandable. User can change it later)
  // Desc might be incomplete
  // Check comments of the tracked to see for exceptions that need to be made for individual features or classes

  // arcane trickster, eldritch knight, and maybe others might need their own spell tables or some sort of other customization
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
      ancestralGuardian: {
        features: [
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
      },
      // RAW, only dwarves can be battlerager
      battleRager: {
        features: [
          {
            id: "battle_rager_armor",
            name: "Battle Rager Armor",
            desc: "You gain the ability to use spiked armor as a weapon. While wearing spiked armor, you can use a bonus action to make a melee weapon attack with your armor spikes. On a hit, the target takes 1d4 piercing damage. You also deal 3 piercing damage to a creature that grapples you or is grappled by you.",
            level: 3,
            tracked: false,
          },
          {
            id: "reckless_abandon",
            name: "Reckless Abandon",
            desc: "When you use Reckless Attack while raging, you gain temporary hit points equal to your Constitution modifier. They vanish if your rage ends.",
            level: 6,
            tracked: false,
          },
          {
            id: "battle_rager_charge",
            name: "Battle Rager Charge",
            desc: "You can take the Dash action as a bonus action while raging.",
            level: 10,
            tracked: false,
          },
          {
            id: "spiked_retribution",
            name: "Spiked Retribution",
            desc: "When a creature within 5 feet of you hits you with a melee attack, it takes 3 piercing damage if you are raging, wearing spiked armor, and not incapacitated.",
            level: 14,
            tracked: false,
          },
        ],
      },
      beast: {
        features: [
          {
            id: "form_of_the_beast",
            name: "Form of the Beast",
            desc: "When you enter your rage, you can transform, manifesting a natural weapon. Choose one: Bite (1d8 piercing and regain hit points equal to your proficiency bonus once per turn), Claws (1d6 slashing; if you attack with claws, you can make one additional claw attack as part of the same Attack action), or Tail (1d8 piercing and you can use your reaction to impose disadvantage on an attack roll against you).",
            level: 3,
            tracked: false,
          },
          {
            id: "bestial_soul",
            name: "Bestial Soul",
            desc: "Your natural weapons count as magical for overcoming resistance and immunity to nonmagical attacks. You can also adapt to your environment: climb speed equal to your walking speed, breathe underwater and gain a swim speed, or jump distance increases by a number of feet equal to your Strength modifier.",
            level: 6,
            tracked: false,
          },
          {
            id: "infectious_fury",
            name: "Infectious Fury",
            desc: "When you hit a creature with your natural weapons while raging, it must succeed on a Wisdom saving throw or suffer one of the following effects (your choice): 2d12 psychic damage, or must use its reaction to attack another creature you designate. This ability can be used a number of times equal to your proficiency bonus per long rest.",
            level: 10,
            tracked: true, //prof bonus, regain on LR
          },
          {
            id: "call_the_hunt",
            name: "Call the Hunt",
            desc: "When you enter your rage, you can choose up to 10 creatures within 30 feet. Each creature gains a bonus to attack rolls and saving throws equal to your proficiency bonus for 1 minute. You gain temporary hit points equal to 5 times the number of creatures you chose. Once used, you can't use this feature again until you finish a long rest.",
            level: 14,
            tracked: true, //equal to prof bonus regain on LR
          },
        ],
      },
      berserker: {
        features: [
          {
            id: "frenzy",
            name: "Frenzy",
            desc: "When you rage, you can enter a frenzy. If you do, you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.",
            level: 3,
            tracked: false,
          },
          {
            id: "mindless_rage",
            name: "Mindless Rage",
            desc: "You can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.",
            level: 6,
            tracked: false,
          },
          {
            id: "intimidating_presence",
            name: "Intimidating Presence",
            desc: "You can use your action to frighten a creature within 30 feet that you can see. The target must succeed on a Wisdom saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or be frightened of you for 1 minute. The creature can repeat the save at the end of each of its turns. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 10,
            tracked: true, // once every 24 hrs
          },
          {
            id: "retaliation",
            name: "Retaliation",
            desc: "When you take damage from a creature within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.",
            level: 14,
            tracked: false,
          },
        ],
      },
      stormHerald: {
        features: [
          {
            id: "storm_aura",
            name: "Storm Aura",
            desc: "When you rage, you emanate a stormy, magical aura. Choose one of three effects: Desert (burning heat), Sea (lightning strikes), or Tundra (chilling cold). The aura extends 10 feet from you and activates each turn while raging, applying its effect based on the environment chosen. You can change the environment when you level up in this class.",
            level: 3,
            tracked: false,
          },
          {
            id: "storm_soul",
            name: "Storm Soul",
            desc: "Your connection to your chosen storm grants benefits: resistance to fire (Desert), lightning (Sea), or cold (Tundra) damage, plus additional effects. Desert: You don't suffer extreme heat; Sea: You can breathe underwater and swim at your walking speed; Tundra: You don't suffer extreme cold.",
            level: 6,
            tracked: false,
          },
          {
            id: "shielding_storm",
            name: "Shielding Storm",
            desc: "Each creature of your choice gains the damage resistance from your Storm Soul aura while in your aura's effect.",
            level: 10,
            tracked: false,
          },
          {
            id: "raging_storm",
            name: "Raging Storm",
            desc: "Your storm intensifies and gains a powerful reaction effect: Desert: A creature takes fire damage when it hits you; Sea: You force a creature to make a Strength save or be knocked prone; Tundra: Its speed is reduced by 0 until the start of your next turn.",
            level: 14,
            tracked: false,
          },
        ],
      },
      totemWarrior: {
        features: [
          {
            id: "spirit_seeker",
            name: "Spirit Seeker",
            desc: "You gain the ability to cast Beast Sense and Speak with Animals as rituals, reflecting your attunement to nature's spirits.",
            level: 3,
            tracked: false,
          },
          {
            id: "totem_spirit",
            name: "Totem Spirit",
            desc: "Choose a totem animal. Options include Bear (resistance to all damage except psychic while raging), Eagle (disadvantage on opportunity attacks against you, and Dash as a bonus action), and Wolf (allies gain advantage on melee attack rolls against creatures within 5 feet of you).",
            level: 3,
            tracked: false,
          },
          {
            id: "aspect_of_the_beast",
            name: "Aspect of the Beast",
            desc: "Choose a totem animal. Options include Bear (carry capacity doubles and advantage on Strength checks for pushing, pulling, lifting), Eagle (see up to 1 mile away clearly and no disadvantage on long-range perception), or Wolf (track creatures at fast pace and move stealthily while traveling).",
            level: 6,
            tracked: false,
          },
          {
            id: "spirit_walker",
            name: "Spirit Walker",
            desc: "You can cast Commune with Nature as a ritual. When you do so, a spirit of your totem animal appears to you to convey the information you seek.",
            level: 10,
            tracked: false,
          },
          {
            id: "totemic_attunement",
            name: "Totemic Attunement",
            desc: "Choose a totem animal. Options include Bear (creatures within 5 feet have disadvantage on attack rolls against others), Eagle (fly at half speed while raging if not wearing heavy armor), and Wolf (knock a creature prone as a bonus action if you hit it).",
            level: 14,
            tracked: false,
          },
        ],
      },
      wildMagic: {
        features: [
          {
            id: "magic_surges",
            name: "Magic Surges",
            desc: "Starting when you choose this path at 3rd level, your innate magic erupts in unpredictable ways. Whenever you rage, roll on the Wild Magic table to determine the magical effect produced.",
            level: 3,
            tracked: true, //prof bonus, regain on LR
          },
          {
            id: "bolstering_magic",
            name: "Bolstering Magic",
            desc: "At 6th level, you can harness your wild magic to bolster yourself or a companion. As an action, you touch a creature and roll a d3. The creature gains one of the following effects: (1) Add the rolled number to any attack roll or ability check made in the next minute, or (2) Regain a spell slot equal to the rolled number. You can use this action a number of times equal to your proficiency bonus, and you regain all uses after a long rest.",
            level: 6,
            tracked: true, //prof bonus, regain on LR
          },
          {
            id: "unstable_backlash",
            name: "Unstable Backlash",
            desc: "At 10th level, when you take damage while raging, you can use your reaction to roll on the Wild Magic table and immediately produce the effect. This replaces the current Wild Magic effect if one is active.",
            level: 10,
            tracked: false,
          },
          {
            id: "controlled_surge",
            name: "Controlled Surge",
            desc: "At 14th level, whenever you roll on the Wild Magic table, you can roll twice and choose which result to use.",
            level: 14,
            tracked: false,
          },
        ],
      },
      zealot: {
        features: [
          {
            id: "divine_fury",
            name: "Divine Fury",
            desc: "Starting when you choose this path at 3rd level, you can channel divine fury into your weapon strikes. While you're raging, the first creature you hit on each of your turns takes extra damage equal to 1d6 + half your barbarian level. The extra damage is necrotic or radiant (your choice when you gain this feature).",
            level: 3,
            tracked: false,
          },
          {
            id: "warrior_of_the_gods",
            name: "Warrior of the Gods",
            desc: "At 3rd level, your soul is marked for endless battle. If a spell such as raise dead has the sole effect of restoring you to life (but not undeath), the caster doesn't need material components to cast the spell on you.",
            level: 3,
            tracked: false,
          },
          {
            id: "fanatical_focus",
            name: "Fanatical Focus",
            desc: "Starting at 6th level, you can reroll a saving throw that you fail while raging. You must use the new roll. You can use this ability once per rage.",
            level: 6,
            tracked: true, // 1/Rage
          },
          {
            id: "zealous_presence",
            name: "Zealous Presence",
            desc: "At 10th level, you can channel divine power to inspire zealotry in your allies. As a bonus action, you unleash a battle cry infused with divine energy. Up to ten creatures of your choice within 60 feet that can hear you gain advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 10,
            tracked: true, // 1/ LR
          },
          {
            id: "rage_beyond_death",
            name: "Rage Beyond Death",
            desc: "Beginning at 14th level, the divine power that fuels your rage allows you to shrug off fatal blows. While you're raging, having 0 hit points doesn't knock you unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage while at 0 hit points. However, if you would die due to failing death saving throws, you don't die until your rage ends.",
            level: 14,
            tracked: false,
          },
        ],
      },
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
        tracked: false,
      },
      {
        id: "font_of_inspiration",
        name: "Font of Inspiration",
        desc: "Beginning at 5th level, you regain all your expended uses of Bardic Inspiration when you finish a short or long rest.",
        level: 5,
        tracked: false,
      },
      {
        id: "countercharm",
        name: "Countercharm",
        desc: "At 6th level, you gain the ability to use music or oration to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet who can hear you gain advantage on saving throws against being frightened or charmed.",
        level: 6,
        tracked: false,
      },
      {
        id: "magical_secrets",
        name: "Magical Secrets",
        desc: "At 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.",
        level: 10,
        tracked: false,
        // **FEATURE NEEDED: spell list needs to account for this feature to add more spells**
      },
      {
        id: "superior_inspiration",
        name: "Superior Inspiration",
        desc: "At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.",
        level: 20,
        tracked: false,
      },
    ],
    subclasses: {
      creation: {
        features: [
          {
            id: "mote_of_potential",
            name: "Mote of Potential",
            desc: "Whenever you give a creature a Bardic Inspiration die, you can create a Tiny mote of potential that orbits the creature. The mote provides an additional effect based on how the Bardic Inspiration die is used: an ability check (adds a bonus equal to the die roll), an attack roll (deals additional damage to the target equal to the die roll), or a saving throw (grants temporary hit points equal to the die roll + your Charisma modifier).",
            level: 3,
            tracked: false,
          },
          {
            id: "performance_of_creation",
            name: "Performance of Creation",
            desc: "As an action, you can create a nonmagical item of your choice in an unoccupied space within 10 feet of you. The item must be on a surface or in a liquid that can support it. The gold piece value of the item can’t exceed 20 × your Bard level. The item lasts for a number of hours equal to your proficiency bonus or until you use this feature again.",
            level: 3,
            tracked: true, //1/LR, then you can use a 2nd lvl spell to use again
          },
          {
            id: "animating_performance",
            name: "Animating Performance",
            desc: "As an action, you can animate one Large or smaller nonmagical item within 30 feet of you. The animated item is friendly to you and your companions and obeys your commands. It uses the Dancing Item stat block and remains animated for 1 hour or until it is reduced to 0 hit points.",
            level: 6,
            tracked: true, // 1/LR then u can use a 3rd level spell to use again
          },
          {
            id: "creative_crescendo",
            name: "Creative Crescendo",
            desc: "When you use your Performance of Creation, you can create more than one item at once. The number of items equals your Charisma modifier (minimum of one). If you create an item that exceeds the combined gold piece value limit of your Bard level × 20, it lasts for 10 minutes instead of your proficiency bonus in hours.",
            level: 14,
            tracked: false,
          },
        ],
      },
      eloquence: {
        features: [
          {
            id: "silver_tongue",
            name: "Silver Tongue",
            desc: "You become a master at saying the right thing at the right time. When you make a Charisma (Persuasion) or Charisma (Deception) check, you can treat a d20 roll of 9 or lower as a 10.",
            level: 3,
            tracked: false,
          },
          {
            id: "unsettling_words",
            name: "Unsettling Words",
            desc: "As a bonus action, you can expend a use of Bardic Inspiration and choose a creature within 60 feet. The creature subtracts the Bardic Inspiration die from the next saving throw it makes before the start of your next turn.",
            level: 3,
            tracked: false,
          },
          {
            id: "unfailing_inspiration",
            name: "Unfailing Inspiration",
            desc: "Your inspiring words are so persuasive that they always work. If a creature adds one of your Bardic Inspiration dice to its ability check, attack roll, or saving throw and the roll fails, the creature retains the Bardic Inspiration die.",
            level: 6,
            tracked: false,
          },
          {
            id: "universal_speech",
            name: "Universal Speech",
            desc: "You gain the ability to make your speech intelligible to all. As an action, choose up to a number of creatures equal to your Charisma modifier within 60 feet. For 1 hour, they can magically understand you, regardless of the language you speak.",
            level: 6,
            tracked: true, // 1/LR
          },
          {
            id: "infectious_inspiration",
            name: "Infectious Inspiration",
            desc: "When you successfully inspire someone, the power of your eloquence can now spread to others. When a creature within 60 feet adds your Bardic Inspiration die to its roll and succeeds, you can use your reaction to give Bardic Inspiration to another creature without expending a use of the feature.",
            level: 14,
            tracked: true, // cha mod (min 1) regain on LR
          },
        ],
      },
      glamour: {
        features: [
          {
            id: "mantle_of_inspiration",
            name: "Mantle of Inspiration",
            desc: "At 3rd level, as a bonus action, you can expend one use of your Bardic Inspiration to grant yourself a wondrous appearance. When you do so, choose a number of creatures you can see and that can see you within 60 feet of you, up to a number equal to your Charisma modifier (minimum of one). Each creature gains 5 temporary hit points. When a creature gains these hit points, it can immediately use its reaction to move up to its speed without provoking opportunity attacks. The temporary hit points increase to 8 at 5th level, 11 at 10th level, and 14 at 15th level.",
            level: 3,
            tracked: false,
          },
          {
            id: "enthralling_performance",
            name: "Enthralling Performance",
            desc: "Starting at 3rd level, you can use your action to perform for at least 1 minute. At the end of the performance, choose a number of humanoids within 60 feet of you who watched and listened to all of it, up to a number equal to your Charisma modifier (minimum of one). Each target must succeed on a Wisdom saving throw against your spell save DC or be charmed by you for 1 hour. While charmed, the target idolizes you, speaks glowingly of you to anyone who talks to it, and hinders anyone who opposes you. The effect ends early if it takes damage, you attack it, or it witnesses you attacking or damaging its allies.",
            level: 3,
            tracked: true,  // 1/SR
          },
          {
            id: "mantle_of_majesty",
            name: "Mantle of Majesty",
            desc: "At 6th level, you gain the ability to cloak yourself in fey magic that makes others want to serve you. As a bonus action, you cast *command*, without expending a spell slot, and you take on an appearance of unearthly beauty for 1 minute or until your concentration ends (as if concentrating on a spell). During this time, you can use the *command* spell as a bonus action on each of your turns, without expending a spell slot.",
            level: 6,
            tracked: true, // 1/LR
          },
          {
            id: "unbreakable_majesty",
            name: "Unbreakable Majesty",
            desc: "At 14th level, your appearance permanently gains an otherworldly aspect that makes you look more lovely and fierce. In addition, as a bonus action, you can assume a majestic presence for 1 minute or until you are incapacitated. For the duration, whenever any creature tries to attack you or force you to make a saving throw, it must first make a Charisma saving throw against your spell save DC. On a failed save, it must choose a different target or the attack or spell automatically misses. On a successful save, it is immune to this effect for 24 hours.",
            level: 14,
            tracked: true, // 1/SR
          },
        ],
      },
      lore: {
        features: [
          {
            id: "cutting_words",
            name: "Cutting Words",
            desc: "Also at 3rd level, you learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature you can see within 60 feet of you makes an attack roll, ability check, or damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature's roll. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage.",
            level: 3,
            tracked: false,
          },
          {
            id: "additional_magical_secrets",
            name: "Additional Magical Secrets",
            desc: "At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don’t count against the number of bard spells you know.",
            level: 6,
            tracked: false, //Add 2 spells, don't count agains the spells you know as a bard
          },
          {
            id: "peerless_skill",
            name: "Peerless Skill",
            desc: "Starting at 14th level, when you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check but before the DM determines whether you succeed or fail.",
            level: 14,
            tracked: false,
          },
        ],
      },
      spirits: {
        features: [
          {
            id: "guiding_whispers",
            name: "Guiding Whispers",
            desc: "At 3rd level, you gain the ability to reach out to spirits and guide others. You learn the Guidance cantrip, which doesn’t count against the number of bard cantrips you know. Its range becomes 60 feet when you cast it.",
            level: 3,
            tracked: false, //Adds guidance to cantrip--60 ft
          },
          {
            id: "spiritual_focus",
            name: "Spiritual Focus",
            desc: "Also at 3rd level, you can use an object such as a candle, crystal ball, skull, or similar token as a spellcasting focus. When you cast a bard spell that deals damage or restores hit points through the focus, roll a d6, and you gain a bonus to one damage or healing roll of the spell equal to the number rolled.",
            level: 3,
            tracked: false,
          },
          {
            id: "tales_from_beyond",
            name: "Tales from Beyond",
            desc: "At 3rd level, you learn to weave spirits’ tales into your magic. As a bonus action, you can expend one use of Bardic Inspiration to roll on the Tales from Beyond table, using your Bardic Inspiration die to determine the result. You retain the tale in mind until you bestow its effects or finish a short or long rest. You can use this feature a number of times equal to your proficiency bonus per long rest.",
            level: 3,
            tracked: false,
          },
          {
            id: "spirit_session",
            name: "Spirit Session",
            desc: "At 6th level, you can conduct an hour-long ritual channeling spirits to gain supernatural knowledge. With at least one other creature, you perform the ritual using your Spiritual Focus. At the end of the ritual, you temporarily learn one spell of your choice from any class. The spell you choose must be of a level equal to the number of creatures that conducted the ritual (up to a maximum level equal to your proficiency bonus). The spell counts as a bard spell for you but doesn't count against the number of bard spells you know. Once you perform the ritual, you can't do so again until you finish a long rest.",
            level: 6,
            tracked: true,
          },
          {
            id: "mystical_connection",
            name: "Mystical Connection",
            desc: "At 14th level, your connection to spirits deepens. Whenever you use Tales from Beyond, you can roll twice on the table and choose which of the two effects to use. If you roll the same number on both dice, you can choose both effects. If both effects target creatures, you can choose the same creature or different ones.",
            level: 14,
            tracked: false,
          },
        ],     
      }, 
      swords: {
        features: [
          {
            id: "fighting_style",
            name: "Fighting Style",
            desc: "At 3rd level, you adopt a fighting style as your specialty. Choose one of the following options: Dueling or Two-Weapon Fighting. You can't take the same Fighting Style option more than once, even if you later get to choose again.",
            level: 3,
            tracked: false,
          },
          {
            id: "blade_flourish",
            name: "Blade Flourish",
            desc: "At 3rd level, you learn to perform impressive flourishes with your weapons. Whenever you take the Attack action on your turn, your walking speed increases by 10 feet until the end of the turn. If a weapon attack you make as part of this action hits a creature, you can use one of the following Blade Flourish options: Defensive Flourish, Slashing Flourish, or Mobile Flourish.",
            level: 3,
            tracked: false,
          },
          {
            id: "extra_attack",
            name: "Extra Attack",
            desc: "Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
            level: 6,
            tracked: false,
          },
          {
            id: "masters_flourish",
            name: "Master's Flourish",
            desc: "At 14th level, whenever you use a Blade Flourish option, you can roll a d6 and use it instead of expending a Bardic Inspiration die.",
            level: 14,
            tracked: false,
          },
        ],
      },
      valor: {
        features: [
          {
            id: "combat_inspiration",
            name: "Combat Inspiration",
            desc: "At 3rd level, you gain the ability to inspire others in battle. A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.",
            level: 3,
            tracked: false,
          },
          {
            id: "extra_attack",
            name: "Extra Attack",
            desc: "Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
            level: 6,
            tracked: false,
          },
          {
            id: "battle_magic",
            name: "Battle Magic",
            desc: "At 14th level, you have mastered the art of weaving spellcasting and weapon use into a single harmonious act. When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.",
            level: 14,
            tracked: false,
          },
        ],      
      },
      whispers: {
        features: [
          {
            id: "psychic_blades",
            name: "Psychic Blades",
            desc: "When you join the College of Whispers at 3rd level, you can weave your words with psychic energy to deal harm. When you hit a creature with a weapon attack, you can expend one use of your Bardic Inspiration to deal an extra 2d6 psychic damage to that target. You can do so only once per turn. The psychic damage increases when you reach certain levels in this class: to 3d6 at 5th level, 5d6 at 10th level, and 8d6 at 15th level.",
            level: 3,
            tracked: false,
          },
          {
            id: "words_of_terror",
            name: "Words of Terror",
            desc: "At 3rd level, you learn to infuse innocent-seeming words with an insidious magic that can inspire terror. If you speak to a humanoid alone for at least 1 minute, you can attempt to seed paranoia in its mind. At the end of the conversation, the target must succeed on a Wisdom saving throw against your spell save DC or be frightened of you or another creature of your choice for 1 hour. If the target succeeds, it has no hint that you tried to frighten it. The target must have an Intelligence of 4 or higher. Once you use this feature, you can’t use it again until you finish a short or long rest.",
            level: 3,
            tracked: true, // 1/ SR
          },
          {
            id: "mantle_of_whispers",
            name: "Mantle of Whispers",
            desc: "At 6th level, you gain the ability to adopt a humanoid’s persona. When a humanoid dies within 30 feet of you, you can magically capture its shadow using your reaction. You retain this shadow until you use it or you finish a long rest. You can use the shadow as an action. When you do so, it vanishes, magically transforming into a disguise that appears on you. You now look like the dead person but healthy and alive. This disguise lasts for 1 hour or until you end it as a bonus action. While you’re in the disguise, you gain access to all information that the humanoid would freely share with a casual acquaintance. Information is enough to pass as the person by drawing on its memories. Another creature can see through this disguise by succeeding on a Wisdom (Insight) check contested by your Charisma (Deception) check. Once you capture a shadow, you can’t capture another until you finish a short or long rest.",
            level: 6,
            tracked: true, // 1/ SR
          },
          {
            id: "shadow_lore",
            name: "Shadow Lore",
            desc: "At 14th level, you gain the ability to weave dark magic into your words and tap into a creature’s deepest fears. As an action, you magically whisper a phrase that only one creature of your choice within 30 feet of you can hear. The target must make a Wisdom saving throw against your spell save DC. It automatically succeeds if it doesn’t share a language with you or if it can’t hear you. On a failed save, the target is charmed by you for the next 8 hours or until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. While charmed in this way, the creature obeys your commands for fear that you will reveal its darkest secrets. It won’t risk its life for you or fight for you unless it was already inclined to do so. Once you use this feature, you can’t use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/ LR
          },
        ],
      }
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
        tracked: false, // Tracks undead CR threshold
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
      // domain spells always prepared and not counted against your total
      arcana: {
        features: [
          {
            id: "arcane_initiate",
            name: "Arcane Initiate",
            desc: "At 1st level, you gain proficiency in the Arcana skill, and you gain two cantrips of your choice from the wizard spell list. For you, these cantrips count as cleric cantrips.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_arcane_abjuration",
            name: "Channel Divinity: Arcane Abjuration",
            desc: "Starting at 2nd level, you can use your Channel Divinity to turn away otherworldly creatures. As an action, you present your holy symbol and each celestial, elemental, fey, or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage. A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly end its move in a space within 30 feet of you. It also can't take reactions. For its action, it can only use the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action. At 5th level, when you use Arcane Abjuration, you can target celestials, elementals, fey, and fiends of CR 1 or lower. This CR increases as you gain cleric levels.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "spell_breaker",
            name: "Spell Breaker",
            desc: "Starting at 6th level, when you restore hit points to an ally with a spell of 1st level or higher, you can also end one spell of your choice on that creature. The spell must be of a level equal to or lower than the level of the spell slot you used to cast the healing spell.",
            level: 6,
            tracked: false,
          },
          {
            id: "potent_spellcasting",
            name: "Potent Spellcasting",
            desc: "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
            level: 8,
            tracked: false,
          },
          {
            id: "arcane_mastery",
            name: "Arcane Mastery",
            desc: "At 17th level, you choose four spells from the wizard spell list, one from each of the following levels: 6th, 7th, 8th, and 9th. You add them to your list of domain spells. Like your other domain spells, they are always prepared and count as cleric spells for you.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["detect_magic", "magic_missile"] },
          { level: 3, spells: ["magic_weapon", "nystul's_magic_aura"] },
          { level: 5, spells: ["dispel_magic", "magic_circle"] },
          { level: 7, spells: ["arcane_eye", "leomund's_secret_chest"] },
          { level: 9, spells: ["planar_binding", "teleportation_circle"] },
        ],
      },
      grave: {
        features: [
          {
            id: "circle_of_mortality",
            name: "Circle of Mortality",
            desc: "At 1st level, your ability to manipulate the line between life and death grants you additional benefits: When you would normally roll one or more dice to restore hit points with a spell to a creature at 0 hit points, you instead use the highest number possible for each die. In addition, you learn the spare the dying cantrip, which doesn't count against the number of cleric cantrips you know. For you, it has a range of 30 feet, and you can cast it as a bonus action.",
            level: 1,
            tracked: false,
          },
          {
            id: "eyes_of_the_grave",
            name: "Eyes of the Grave",
            desc: "At 1st level, you gain the ability to occasionally sense the presence of the undead, whose existence is an insult to the natural cycle of life. As an action, you can open your awareness to magically detect undead. Until the end of your next turn, you know the location of any undead within 60 feet of you that isn't behind total cover and that isn't protected from divination magic. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // Per long rest
          },
          {
            id: "channel_divinity_path_to_the_grave",
            name: "Channel Divinity: Path to the Grave",
            desc: "Starting at 2nd level, you can use your Channel Divinity to mark another creature's life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack's damage, and then the curse ends.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "sentinel_at_death's_door",
            name: "Sentinel at Death's Door",
            desc: "At 6th level, you gain the ability to impede death's progress. As a reaction when you or a creature you can see within 30 feet of you suffers a critical hit, you can turn that hit into a normal hit. Any effects triggered by a critical hit are canceled. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true, // Per long rest
          },
          {
            id: "potent_spellcasting",
            name: "Potent Spellcasting",
            desc: "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
            level: 8,
            tracked: false,
          },
          {
            id: "keeper_of_souls",
            name: "Keeper of Souls",
            desc: "At 17th level, you can seize a trace of vitality from a parting soul and use it to heal the living. When an enemy you can see dies within 60 feet of you, you or one creature of your choice that is within 60 feet of you regains hit points equal to the enemy's number of Hit Dice. You can use this feature only if you aren't incapacitated. Once you use it, you can't use it again until the start of your next turn.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["bane", "false_life"] },
          { level: 3, spells: ["gentle_repose", "ray_of_enfeeblement"] },
          { level: 5, spells: ["revivify", "vampiric_touch"] },
          { level: 7, spells: ["blight", "death_ward"] },
          { level: 9, spells: ["antilife_shell", "raise_dead"] },
        ],
      },
      knowledge: {
        features: [
          {
            id: "channel_divinity_knowledge_of_the_ages",
            name: "Channel Divinity: Knowledge of the Ages",
            desc: "Starting at 2nd level, you can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "channel_divinity_read_thoughts",
            name: "Channel Divinity: Read Thoughts",
            desc: "At 6th level, you can use your Channel Divinity to read a creature's thoughts. You can then use your access to the creature's mind to command it. As an action, choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature succeeds on the save, you can't use this feature on it again until you finish a long rest. If the creature fails its save, you can read its surface thoughts (those foremost in its mind, reflecting its current emotions and what it is actively thinking about) when it is within 60 feet of you. This effect lasts for 1 minute. During that time, you can use your action to end this effect and cast the suggestion spell on the creature without expending a spell slot. The target automatically fails its saving throw against the spell.",
            level: 6,
            tracked: false, // Channel Divinity use
          },
          {
            id: "potent_spellcasting",
            name: "Potent Spellcasting",
            desc: "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
            level: 8,
            tracked: false,
          },
          {
            id: "visions_of_the_past",
            name: "Visions of the Past",
            desc: "Starting at 17th level, you can call up visions of the past that relate to an object you hold or your immediate surroundings. You can spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell. Once you use this feature, you can't use it again until you finish a short or long rest.",
            level: 17,
            tracked: true, // 1/SR or LR
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["command", "identify"] },
          { level: 3, spells: ["augury", "suggestion"] },
          { level: 5, spells: ["nondetection", "speak_with_dead"] },
          { level: 7, spells: ["arcane_eye", "confusion"] },
          { level: 9, spells: ["legend_lore", "scrying"] },
        ],
      },
      life: {
        features: [
          {
            id: "disciple_of_life",
            name: "Disciple of Life",
            desc: "Also starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_preserve_life",
            name: "Channel Divinity: Preserve Life",
            desc: "Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can’t use this feature on an undead or a construct.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "blessed_healer",
            name: "Blessed Healer",
            desc: "Beginning at 6th level, the healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell's level.",
            level: 6,
            tracked: false,
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "supreme_healing",
            name: "Supreme Healing",
            desc: "Starting at 17th level, when you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["bless", "cure_wounds"] },
          { level: 3, spells: ["lesser_restoration", "spiritual_weapon"] },
          { level: 5, spells: ["beacon_of_hope", "revivify"] },
          { level: 7, spells: ["death_ward", "guardian_of_faith"] },
          { level: 9, spells: ["mass_cure_wounds", "raise_dead"] },
        ],
      },
      light: {
        features: [
          {
            id: "bonus_cantrip",
            name: "Bonus Cantrip",
            desc: "When you choose this domain at 1st level, you gain the light cantrip if you don't already know it.",
            level: 1,
            tracked: false,
          },
          {
            id: "warding_flare",
            name: "Warding Flare",
            desc: "Also at 1st level, you can interpose divine light between yourself and an attacking enemy. When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. An attacker that can't be blinded is immune to this feature. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // Uses per Long Rest
          },
          {
            id: "channel_divinity_radiance_of_the_dawn",
            name: "Channel Divinity: Radiance of the Dawn",
            desc: "Starting at 2nd level, you can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes. As an action, you present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one. A creature that has total cover from you is not affected.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "improved_flare",
            name: "Improved Flare",
            desc: "Starting at 6th level, you can use your Warding Flare feature to protect other creatures. When a creature you can see within 30 feet of you is attacked, you can use your reaction to impose disadvantage on the attack roll. You must use this feature before knowing whether the attack hits or misses.",
            level: 6,
            tracked: false, // Same pool as Warding Flare
          },
          {
            id: "potent_spellcasting",
            name: "Potent Spellcasting",
            desc: "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
            level: 8,
            tracked: false,
          },
          {
            id: "corona_of_light",
            name: "Corona of Light",
            desc: "Starting at 17th level, you can use your action to activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["burning_hands", "faerie_fire"] },
          { level: 3, spells: ["flaming_sphere", "scorching_ray"] },
          { level: 5, spells: ["daylight", "fireball"] },
          { level: 7, spells: ["guardian_of_faith", "wall_of_fire"] },
          { level: 9, spells: ["flame_strike", "scrying"] },
        ],
      },
      nature: {
        features: [
          {
            id: "acolyte_of_nature",
            name: "Acolyte of Nature",
            desc: "At 1st level, you learn one druid cantrip of your choice. You also gain proficiency in one of the following skills of your choice: Animal Handling, Nature, or Survival.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_charm_animals_and_plants",
            name: "Channel Divinity: Charm Animals and Plants",
            desc: "Starting at 2nd level, you can use your Channel Divinity to charm animals and plants. As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage. While it is charmed by you, it is friendly to you and other creatures you designate.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "dampen_elements",
            name: "Dampen Elements",
            desc: "Starting at 6th level, when you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice). When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "master_of_nature",
            name: "Master of Nature",
            desc: "At 17th level, you gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can use a bonus action to verbally command what each of those creatures will do on its next turn.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["animal_friendship", "speak_with_animals"] },
          { level: 3, spells: ["barkskin", "spike_growth"] },
          { level: 5, spells: ["plant_growth", "wind_wall"] },
          { level: 7, spells: ["dominate_beast", "grasping_vine"] },
          { level: 9, spells: ["insect_plague", "tree_stride"] },
        ],
      },
      order: {
        features: [
          {
            id: "voice_of_authority",
            name: "Voice of Authority",
            desc: "Starting at 1st level, you can invoke the power of law to embolden an ally to attack. If you cast a spell with a spell slot of 1st level or higher and target an ally with the spell, that ally can use their reaction immediately after the spell to make one weapon attack against a creature of your choice that you can see.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_order_demand",
            name: "Channel Divinity: Order's Demand",
            desc: "Starting at 2nd level, you can use your Channel Divinity to compel creatures to follow your commands. As an action, you present your holy symbol, and each creature of your choice that can see or hear you within 30 feet of you must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn or until the charmed creature takes damage. You can also cause any of the charmed creatures to drop what they are holding when they fail the saving throw.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "embodiment_of_law",
            name: "Embodiment of the Law",
            desc: "At 6th level, you become extraordinarily adept at channeling magical energy to compel others. If you cast a spell of the enchantment school using a spell slot of 1st level or higher, you can change the casting time to 1 bonus action for this casting, provided the spell’s casting time is normally 1 action.",
            level: 6,
            tracked: true,  //wis mod (min 1)
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 psychic damage. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "order_s_wrath",
            name: "Order's Wrath",
            desc: "Starting at 17th level, enemies you designate for divine punishment wilt under the weight of the law. If you deal your Divine Strike damage to a creature on your turn, you can curse the creature until the start of your next turn. The next time one of your allies hits the cursed creature with an attack, the target also takes 2d8 psychic damage, and the curse ends.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["command", "heroism"] },
          { level: 3, spells: ["hold_person", "zone_of_truth"] },
          { level: 5, spells: ["mass_healing_word", "slow"] },
          { level: 7, spells: ["compulsion", "locate_creature"] },
          { level: 9, spells: ["commune", "dominate_person"] },
        ],
      },
      peace: {
        features: [
          {
            id: "emboldening_bond",
            name: "Emboldening Bond",
            desc: "Starting at 1st level, you can forge an empowering bond among people who are at peace with one another. As an action, choose a number of willing creatures equal to your proficiency bonus within 30 feet of you. You create a magical bond among them for 10 minutes or until you use this feature again. While bonded, they can add 1d4 to an attack roll, ability check, or saving throw once per turn. They must be within 30 feet of each other to gain this benefit.",
            level: 1,
            tracked: true, // prof bonus, regain on LR
          },
          {
            id: "channel_divinity_balm_of_peace",
            name: "Channel Divinity: Balm of Peace",
            desc: "Starting at 2nd level, you can use your Channel Divinity to soothe wounds. As an action, you move up to your speed without provoking opportunity attacks. When you move within 5 feet of any other creature during this action, you can restore a number of hit points to that creature equal to 2d6 + your Wisdom modifier (minimum of 1 hit point). A creature can receive this healing only once whenever you take this action.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "protective_bond",
            name: "Protective Bond",
            desc: "Starting at 6th level, the bond you forge between allies becomes a protective shield. When a creature bonded by your Emboldening Bond feature is about to take damage, a second bonded creature within 30 feet can use its reaction to teleport to an unoccupied space within 5 feet of the first creature. The second creature takes all the damage instead.",
            level: 6,
            tracked: false,
          },
          {
            id: "potent_spellcasting",
            name: "Potent Spellcasting",
            desc: "Starting at 8th level, you add your Wisdom modifier to the damage you deal with any cleric cantrip.",
            level: 8,
            tracked: false,
          },
          {
            id: "expansive_bond",
            name: "Expansive Bond",
            desc: "Starting at 17th level, the benefits of your Emboldening Bond and Protective Bond features increase. The range of your Emboldening Bond feature and Protective Bond reaction increases to 60 feet.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["heroism", "sanctuary"] },
          { level: 3, spells: ["aid", "warding_bond"] },
          { level: 5, spells: ["beacon_of_hope", "sending"] },
          { level: 7, spells: ["aura_of_purity", "guardian_of_faith"] },
          { level: 9, spells: ["greater_restoration", "rary_s_telepathic_bond"] },
        ],
      },
      tempest: {
        features: [
          {
            id: "wrath_of_the_storm",
            name: "Wrath of the Storm",
            desc: "Also at 1st level, you can thunderously rebuke attackers. When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed save, or half as much damage on a successful one. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // wis mod Uses per LR
          },
          {
            id: "channel_divinity_destructive_wrath",
            name: "Channel Divinity: Destructive Wrath",
            desc: "Starting at 2nd level, you can use your Channel Divinity to wield the power of the storm with unchecked ferocity. When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage instead of rolling.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "thunderous_strike",
            name: "Thunderous Strike",
            desc: "At 6th level, when you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.",
            level: 6,
            tracked: false,
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 thunder damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "stormborn",
            name: "Stormborn",
            desc: "At 17th level, you have a flying speed equal to your walking speed whenever you are not underground or indoors.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["fog_cloud", "thunderwave"] },
          { level: 3, spells: ["gust_of_wind", "shatter"] },
          { level: 5, spells: ["call_lightning", "sleet_storm"] },
          { level: 7, spells: ["control_water", "ice_storm"] },
          { level: 9, spells: ["destructive_wave", "insect_plague"] },
        ],
      },
      trickery: {
        features: [
          {
            id: "blessing_of_the_trickster",
            name: "Blessing of the Trickster",
            desc: "Starting when you choose this domain at 1st level, you can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks. This blessing lasts for 1 hour or until you use this feature again.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_invoke_duplicity",
            name: "Channel Divinity: Invoke Duplicity",
            desc: "Starting at 2nd level, you can use your Channel Divinity to create a perfect illusion of yourself. As an action, you create an illusory duplicate of yourself that lasts for 1 minute. The duplicate appears in an unoccupied space you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see. You can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "channel_divinity_cloak_of_shadows",
            name: "Channel Divinity: Cloak of Shadows",
            desc: "Starting at 6th level, you can use your Channel Divinity to vanish. As an action, you become invisible until the end of your next turn. You become visible if you attack or cast a spell.",
            level: 6,
            tracked: false, // Channel Divinity use
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with poison. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 poison damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "improved_duplicity",
            name: "Improved Duplicity",
            desc: "At 17th level, your Invoke Duplicity creates up to four duplicates of yourself, instead of one. As a bonus action on your turn, you can move any number of them up to 30 feet to a space you can see. You can cast spells as though you were in any of the duplicates’ spaces, but you must use your own senses.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["charm_person", "disguise_self"] },
          { level: 3, spells: ["mirror_image", "pass_without_trace"] },
          { level: 5, spells: ["blink", "dispel_magic"] },
          { level: 7, spells: ["dimension_door", "polymorph"] },
          { level: 9, spells: ["dominate_person", "modify_memory"] },
        ],
      },
      twilight: {
        features: [
          {
            id: "eyes_of_night",
            name: "Eyes of Night",
            desc: "Starting at 1st level, you can see through the deepest gloom. You have darkvision out to a range of 300 feet. You can see in dim light as if it were bright light, and in darkness as if it were dim light. As an action, you can share this darkvision with willing creatures within 10 feet of you, up to a number of creatures equal to your proficiency bonus. The shared darkvision lasts for 1 hour. Once you use this action, you can’t do so again until you finish a long rest, unless you expend a spell slot of 1st level or higher to use it again.",
            level: 1,
            tracked: true, // 1/LR, also spend a spell slot 
          },
          {
            id: "vigilant_blessing",
            name: "Vigilant Blessing",
            desc: "Starting at 1st level, the night has taught you to be vigilant. As a bonus action, you give one creature you touch (including possibly yourself) advantage on the next initiative roll the creature makes. This benefit ends immediately after the roll or if you use this feature again.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_twilight_sanctuary",
            name: "Channel Divinity: Twilight Sanctuary",
            desc: "At 2nd level, you can use your Channel Divinity to refresh your allies with soothing twilight. As an action, you present your holy symbol, and a sphere of twilight emanates from you. The sphere is centered on you, has a 30-foot radius, and is filled with dim light. The sphere moves with you and lasts for 1 minute or until you are incapacitated or die. Whenever a creature (including you) ends its turn in the sphere, you can grant that creature one of these benefits: (1) You grant it temporary hit points equal to 1d6 plus your cleric level. (2) You end one effect on it causing it to be charmed or frightened.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "steps_of_night",
            name: "Steps of Night",
            desc: "Starting at 6th level, you can draw on the mystical power of night to rise into the air. As a bonus action when you are in dim light or darkness, you can magically give yourself a flying speed equal to your walking speed for 1 minute. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true, // Uses = Proficiency Bonus, regain on LR
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with radiant energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "twilight_shroud",
            name: "Twilight Shroud",
            desc: "Starting at 17th level, the twilight that you summon offers a protective embrace. You and your allies have half cover while in the sphere created by your Twilight Sanctuary.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["faerie_fire", "sleep"] },
          { level: 3, spells: ["moonbeam", "see_invisibility"] },
          { level: 5, spells: ["aura_of_vitality", "leomunds_tiny_hut"] },
          { level: 7, spells: ["aura_of_life", "greater_invisibility"] },
          { level: 9, spells: ["circle_of_power", "mislead"] },
        ],
      },
      war: {
        features: [
          {
            id: "war_priest",
            name: "War Priest",
            desc: "At 1st level, your god delivers bolts of inspiration to you while you are engaged in battle. When you use the Attack action, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // Uses = Wisdom Modifier / LR
          },
          {
            id: "channel_divinity_guided_strike",
            name: "Channel Divinity: Guided Strike",
            desc: "Starting at 2nd level, you can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "channel_divinity_war_gods_blessing",
            name: "Channel Divinity: War God's Blessing",
            desc: "Starting at 6th level, when a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity.",
            level: 6,
            tracked: false, // Channel Divinity use
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "avatar_of_battle",
            name: "Avatar of Battle",
            desc: "At 17th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["divine_favor", "shield_of_faith"] },
          { level: 3, spells: ["magic_weapon", "spiritual_weapon"] },
          { level: 5, spells: ["crusaders_mantle", "spirit_guardians"] },
          { level: 7, spells: ["freedom_of_movement", "stoneskin"] },
          { level: 9, spells: ["flame_strike", "hold_monster"] },
        ],
      },
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
        tracked: false, 
      },
      {
        id: "archdruid",
        name: "Archdruid",
        desc: "At 20th level, you can use your Wild Shape an unlimited number of times. Additionally, you ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren’t consumed by a spell.",
        level: 20,
        tracked: false, 
      },
    ],
    subclasses: {
      dreams: {
        features: [
          {
            id: "balm_of_the_summer_court",
            name: "Balm of the Summer Court",
            desc: "At 2nd level, you become imbued with the blessings of the Summer Court. You gain a pool of fey energy represented by a number of d6s equal to your druid level. As a bonus action, you can choose an ally you can see within 120 feet of you and spend a number of those dice equal to half your druid level or less. Roll the spent dice and add them together. The target regains a number of hit points equal to the total, and the target also gains 1 temporary hit point per die spent. You regain all expended dice when you finish a long rest.",
            level: 2,
            tracked: true, // Uses = Druid Level
          },
          {
            id: "hearth_of_moonlight_and_shadow",
            name: "Hearth of Moonlight and Shadow",
            desc: "At 6th level, home can be wherever you are. During a short or long rest, you can invoke the shadowy power of the gloaming court to help guard your respite. At the start of the rest, you touch a point in space, and an invisible, 30-foot-radius sphere of magic appears, centered on that point. Total cover blocks the sphere. While within the sphere, you and your allies gain a +5 bonus to Dexterity (Stealth) checks and Wisdom (Perception) checks, and any light from open flames in the sphere isn’t visible outside it. The sphere vanishes at the end of the rest or when you leave the sphere.",
            level: 6,
            tracked: false,
          },
          {
            id: "hidden_paths",
            name: "Hidden Paths",
            desc: "Starting at 10th level, you can use the hidden, magical pathways that some fey use to traverse space in the blink of an eye. As a bonus action, you can teleport up to 60 feet to an unoccupied space you can see. Alternatively, you can use your action to teleport one willing creature you touch up to 30 feet to an unoccupied space you can see. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 10,
            tracked: true, // Uses = Wisdom Modifier
          },
          {
            id: "walker_in_dreams",
            name: "Walker in Dreams",
            desc: "At 14th level, the magic of the Feywild grants you the ability to travel mentally or physically through dreamlands. When you finish a short rest, you can cast one of the following spells without expending a spell slot or material components: dream, scrying, or teleportation circle. This use of teleportation circle is special: rather than opening a portal to a permanent teleportation circle, it opens a portal to the last location where you finished a long rest on your current plane of existence. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/LR
          },
        ],
      },
      land: {
        features: [
          {
            id: "bonus_cantrip",
            name: "Bonus Cantrip",
            desc: "When you choose this circle at 2nd level, you learn one additional druid cantrip of your choice.",
            level: 2,
            tracked: false, 
          },
          {
            id: "natural_recovery",
            name: "Natural Recovery",
            desc: "Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 2,
            tracked: true, // 1/LR
          },
          {
            id: "land_circle_spells",
            name: "Land Circle Spells",
            desc: "Your mystical connection to the land infuses you with the ability to cast certain spells. You gain access to a specific set of spells based on the land type you choose at 3rd level.",
            level: 3,
            tracked: false,
          },
          {
            id: "land_strides",
            name: "Land's Stride",
            desc: "Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard. In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.",
            level: 6,
            tracked: false,
          },
          {
            id: "natures_ward",
            name: "Nature's Ward",
            desc: "When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.",
            level: 10,
            tracked: false,
          },
          {
            id: "natures_sanctuary",
            name: "Nature's Sanctuary",
            desc: "When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours. The creature is aware of this effect before it makes its attack against you.",
            level: 14,
            tracked: false,
          },
        ],
      },
      moon: {
        features: [
          {
            id: "combat_wild_shape",
            name: "Combat Wild Shape",
            desc: "When you choose this circle at 2nd level, you gain the ability to use Wild Shape on your turn as a bonus action, rather than as an action. Additionally, while you are transformed by Wild Shape, you can use a bonus action to expend one spell slot to regain 1d8 hit points per level of the spell slot expended.",
            level: 2,
            tracked: false,
          },
          {
            id: "circle_forms",
            name: "Circle Forms",
            desc: "The rites of your circle grant you the ability to transform into more dangerous animal forms. Starting at 2nd level, you can use your Wild Shape to transform into a beast with a challenge rating as high as 1. Starting at 6th level, you can transform into a beast with a challenge rating equal to your druid level divided by 3 (rounded down).",
            level: 2,
            tracked: false,
          },
          {
            id: "primal_strike",
            name: "Primal Strike",
            desc: "Starting at 6th level, your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "elemental_wild_shape",
            name: "Elemental Wild Shape",
            desc: "At 10th level, you can expend two uses of Wild Shape at the same time to transform into an air elemental, earth elemental, fire elemental, or water elemental.",
            level: 10,
            tracked: false,
          },
          {
            id: "thousand_forms",
            name: "Thousand Forms",
            desc: "By 14th level, you have learned to use magic to alter your physical form in more subtle ways. You can cast the alter self spell at will.",
            level: 14,
            tracked: false,
          },
        ],
      },
      shepherd: {
        features: [
          {
            id: "speech_of_the_woods",
            name: "Speech of the Woods",
            desc: "At 2nd level, you gain the ability to converse with beasts and many fey. You learn to speak, read, and write Sylvan. In addition, beasts can understand your speech, and you gain the ability to decipher their noises and motions. Most beasts lack the intelligence to convey or understand sophisticated concepts, but a friendly beast could relay what it has seen or heard in the recent past. This ability doesn't grant you friendship with beasts, though you can combine this ability with gifts to curry favor with them as you would with any nonplayer character.",
            level: 2,
            tracked: false,
          },
          {
            id: "spirit_totem",
            name: "Spirit Totem",
            desc: "Starting at 2nd level, you can call forth nature spirits to influence the world around you. As a bonus action, you can magically summon an incorporeal spirit to a point you can see within 60 feet of you. The spirit creates an aura in a 30-foot radius around that point. It lasts for 1 minute or until you’re incapacitated. The effect of the spirit depends on the type of spirit you summon from the options below. Once you use this feature, you can’t use it again until you finish a short or long rest.\n\n**Bear Spirit**: You and your allies who are in the aura when the spirit appears gain temporary hit points equal to 5 + your druid level. In addition, you and your allies have advantage on Strength checks and Strength saving throws while in the aura.\n\n**Hawk Spirit**: When a creature makes an attack roll against a target in the spirit's aura, you can use your reaction to grant advantage on the attack roll. In addition, you and your allies have advantage on Wisdom (Perception) checks while in the aura.\n\n**Unicorn Spirit**: You and your allies gain advantage on all ability checks made to detect creatures in the aura. In addition, if you cast a spell using a spell slot that restores hit points to any creature inside or outside the aura, each creature of your choice in the aura also regains hit points equal to your druid level.",
            level: 2,
            tracked: true, // 1/SR
          },
          {
            id: "mighty_summoner",
            name: "Mighty Summoner",
            desc: "At 6th level, beasts and fey that you conjure are more resilient than normal. Any beast or fey summoned or created by a spell that you cast gains the following benefits:\n\n- The creature appears with more hit points than normal: 2 extra hit points per Hit Die it has.\n- The damage from its natural weapons is considered magical for the purpose of overcoming immunity and resistance to nonmagical attacks and damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "guardian_spirit",
            name: "Guardian Spirit",
            desc: "Beginning at 10th level, your Spirit Totem safeguards the beasts and fey that you call forth with your magic. When a beast or fey that you summoned or created with a spell ends its turn in your Spirit Totem aura, that creature regains a number of hit points equal to half your druid level.",
            level: 10,
            tracked: false,
          },
          {
            id: "faithful_summons",
            name: "Faithful Summons",
            desc: "Starting at 14th level, the nature spirits you commune with protect you when you are at your most defenseless. If you are reduced to 0 hit points or are incapacitated against your will, you can immediately gain the benefits of *conjure animals* as if it were cast using a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. The conjured beasts appear within 20 feet of you. If they receive no commands from you, they protect you from harm and attack your foes. The spell lasts for 1 hour, requiring no concentration, or until you dismiss it (no action required). Once you use this feature, you can’t use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/LR
          },
        ],
      },
      spores: {
        features: [
          {
            id: "circle_spells",
            name: "Circle Spells",
            desc: "Your symbiotic link to fungi and your ability to tap into the cycle of life and death grants you access to certain spells. At 3rd, 5th, 7th, and 9th levels, you gain access to the spells listed below. Once you gain access to one of these spells, you always have it prepared, and it doesn’t count against the number of spells you can prepare each day.",
            level: 2,
            tracked: false,
          },
          {
            id: "halo_of_spores",
            name: "Halo of Spores",
            desc: "Starting at 2nd level, you are surrounded by invisible, necrotic spores that are harmless until you unleash them on a creature nearby. When a creature you can see moves into a space within 10 feet of you or starts its turn there, you can use your reaction to deal 1d4 necrotic damage to that creature unless it succeeds on a Constitution saving throw against your spell save DC. The necrotic damage increases to 1d6 at 6th level, 1d8 at 10th level, and 1d10 at 14th level.",
            level: 2,
            tracked: false,
          },
          {
            id: "symbiotic_entity",
            name: "Symbiotic Entity",
            desc: "Also at 2nd level, you can use your Wild Shape to awaken the spores that infuse you with power, rather than transforming into a beast. When you use your Wild Shape in this way, you gain 4 temporary hit points for each level you have in this class. While this feature is active, you gain the following benefits:\n\n- When you deal damage with your Halo of Spores, roll the damage die a second time and add it to the total.\n- Your melee weapon attacks deal an extra 1d6 necrotic damage to any target they hit.\n\nThese benefits last for 10 minutes or until you lose all these temporary hit points or use your Wild Shape again.",
            level: 2,
            tracked: false,
          },
          {
            id: "fungal_infestation",
            name: "Fungal Infestation",
            desc: "At 6th level, your spores gain the ability to infest a corpse and animate it. If a beast or humanoid that is Small or Medium dies within 10 feet of you, you can use your reaction to animate it, causing it to stand up immediately with 1 hit point. The creature uses the zombie stat block in the Monster Manual. It remains animate for 1 hour, after which time it collapses and dies.\n\nIn combat, the zombie's turn comes immediately after yours, and it obeys your mental commands. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true, // Wisdom Modifier/LR (min 1)
          },
          {
            id: "spreading_spores",
            name: "Spreading Spores",
            desc: "At 10th level, you gain the ability to seed an area with deadly spores. As a bonus action while your Symbiotic Entity feature is active, you can hurl spores up to 30 feet away, where they swirl in a 10-foot cube for 1 minute. The spores disappear early if you use this feature again, if you dismiss them as a bonus action, or if your Symbiotic Entity feature ends.\n\nWhenever a creature moves into the cube or starts its turn there, that creature takes your Halo of Spores damage, unless it succeeds on a Constitution saving throw against your spell save DC. A creature can take this damage no more than once per turn.",
            level: 10,
            tracked: false,
          },
          {
            id: "fungal_body",
            name: "Fungal Body",
            desc: "At 14th level, the fungal spores in your body alter you: you can't be blinded, deafened, frightened, or poisoned, and any critical hit against you counts as a normal hit instead, unless you are incapacitated.",
            level: 14,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["chill_touch", "detect_poison_and_disease"]},
          { level: 5, spells: ["blindness_deafness", "gentle_repose"]},
          {level: 7, spells: ["animate_dead", "gaseous_form"]},
          {level: 9,spells: ["cloudkill", "contagion"] },
        ],
      },
      star: {
        features: [
          {
            id: "star_map",
            name: "Star Map",
            desc: "At 2nd level, you create a star map, an object that serves as your focus for starry magic. The map can take various forms (such as a scroll, stone, or crystal). While holding the map, you gain the following benefits:\n\n- You know the *guidance* cantrip.\n- You have the *guiding bolt* spell prepared. It doesn't count against the number of spells you can prepare.\n- You can cast *guiding bolt* without expending a spell slot. You can do so a number of times equal to your proficiency bonus, regaining all uses after a long rest.\n\nIf you lose your star map, you can perform a 1-hour ritual to create a replacement during a short or long rest. This ritual destroys the previous map.",
            level: 2,
            tracked: false, //guiding bolt is equal to prof bonus
          },
          {
            id: "starry_form",
            name: "Starry Form",
            desc: "At 2nd level, you gain the ability to harness constellations' power. As a bonus action, you can expend a use of your Wild Shape to take on a starry form, rather than transforming into a beast. While in your starry form, you retain your game statistics but appear as if you are made of starlight, and your joints glow like stars. This form lasts for 10 minutes or until you end it as a bonus action.\n\nWhen you activate this form, choose a constellation you embody, which gives benefits:\n\n- **Archer:** When you activate this form and as a bonus action on subsequent turns, you can make a ranged spell attack, hurling a luminous arrow that deals 1d8 + your Wisdom modifier radiant damage.\n- **Chalice:** Whenever you cast a spell that restores hit points, you or another creature within 30 feet regains additional hit points equal to 1d8 + your Wisdom modifier.\n- **Dragon:** You have advantage on Intelligence and Wisdom checks and can concentrate on spells while maintaining your Wild Shape.",
            level: 2,
            tracked: false,
          },
          {
            id: "cosmic_omen",
            name: "Cosmic Omen",
            desc: "Starting at 6th level, you learn to channel omens from the stars to influence your surroundings. When you finish a long rest, roll a die and choose one of two modes: Weal or Woe.\n\n- **Weal (Even):** When a creature within 30 feet of you makes an attack roll, saving throw, or ability check, you can use your reaction to add 1d6 to the roll.\n- **Woe (Odd):** When a creature within 30 feet of you makes an attack roll, saving throw, or ability check, you can use your reaction to subtract 1d6 from the roll.\n\nYou can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true, // Proficiency Bonus/LR
          },
          {
            id: "twinkling_constellations",
            name: "Twinkling Constellations",
            desc: "At 10th level, the constellations of your Starry Form improve:\n\n- **Archer:** The radiant damage increases to 2d8.\n- **Chalice:** The healing increases to 2d8.\n- **Dragon:** You gain a flying speed of 20 feet while in this form.\n\nAdditionally, you can change your constellation at the start of each turn.",
            level: 10,
            tracked: false,
          },
          {
            id: "full_of_stars",
            name: "Full of Stars",
            desc: "At 14th level, your Starry Form becomes permanent. While in your Starry Form, you become partially incorporeal, granting you resistance to bludgeoning, piercing, and slashing damage.",
            level: 14,
            tracked: false,
          },
        ],
      },
      wildfire: {
        features: [
          {
            id: "summon_wildfire_spirit",
            name: "Summon Wildfire Spirit",
            desc: "At 2nd level, you can summon a wildfire spirit as an action, using a use of your Wild Shape feature. The spirit appears in an unoccupied space of your choice within 30 feet of you. The spirit is friendly to you and your companions and obeys your commands. See its game statistics in the Wildfire Spirit stat block. When you summon the spirit, choose a space within 10 feet of it. Creatures of your choice within that space must succeed on a Dexterity saving throw against your spell save DC or take 2d6 fire damage.\n\nThe spirit remains for 1 hour, until it is reduced to 0 hit points, or until you use this feature to summon the spirit again.",
            level: 2,
            tracked: false,
          },
          {
            id: "enhanced_bond",
            name: "Enhanced Bond",
            desc: "Beginning at 6th level, your bond with your wildfire spirit enhances your destructive and restorative spells. Whenever you cast a spell that deals fire damage or restores hit points while your wildfire spirit is summoned, roll a d8, and you gain a bonus equal to the number rolled to one damage or healing roll of the spell. In addition, when you cast a spell with a range other than self, the spell can originate from you or your wildfire spirit.",
            level: 6,
            tracked: false,
          },
          {
            id: "cauterizing_flames",
            name: "Cauterizing Flames",
            desc: "Starting at 10th level, when a Small or larger creature dies within 30 feet of you or your wildfire spirit, a harmless spectral flame springs up in the dead creature’s space and flickers there for 1 minute. When a creature you can see enters that space, you can use your reaction to extinguish the spectral flame and either heal the creature or deal fire damage to it. The healing or damage equals 2d10 + your Wisdom modifier.",
            level: 10,
            tracked: true, // prof bonus, Reaction, regain on LR
          },
          {
            id: "blazing_revival",
            name: "Blazing Revival",
            desc: "At 14th level, the bond with your wildfire spirit can save you from death. If you are reduced to 0 hit points and thereby fall unconscious, you can cause your wildfire spirit to drop to 0 hit points instead. You then regain half your hit points and immediately rise to your feet. Once you use this feature, you can’t use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["burning_hands", "cure_wounds"] },
          { level: 5, spells: ["flaming_sphere", "scorching_ray"] },
          { level: 7, spells: ["plant_growth", "revivify"] },
          { level: 9, spells: ["aura_of_life", "fire_shield"] },
          { level: 11, spells: ["flame_strike", "mass_cure_wounds"] },
        ],
      },
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
        tracked: false, 
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
        tracked: false, 
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
      arcaneArcher: {
        features: [
          {
            id: "arcane_shot",
            name: "Arcane Shot",
            desc: "At 3rd level, you learn to unleash special magical effects with some of your shots. When you gain this feature, you learn two Arcane Shot options of your choice. Once per turn when you fire an arrow as part of the Attack action, you can apply one of your Arcane Shot options to that arrow. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a short or long rest.",
            level: 3,
            tracked: true, // 2/SR
          },
          {
            id: "magic_arrow",
            name: "Magic Arrow",
            desc: "At 7th level, you gain the ability to infuse arrows with magic. Whenever you fire a nonmagical arrow, it counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
            level: 7,
            tracked: false,
          },
          {
            id: "arcane_archer_lore",
            name: "Arcane Archer Lore",
            desc: "At 3rd level, you learn magical theory or some of the secrets of nature, typical for practitioners of this elven martial tradition. You choose to gain proficiency in either the Arcana or Nature skill, and you learn the prestidigitation or druidcraft cantrip.",
            level: 3,
            tracked: false,
          },
          {
            id: "curving_shot",
            name: "Curving Shot",
            desc: "At 7th level, you learn how to redirect a missed shot. When you make an attack roll with a magic arrow and miss, you can use a bonus action to reroll the attack roll against a different target within 60 feet of the original target.",
            level: 7,
            tracked: false,
          },
          {
            id: "ever_ready_shot",
            name: "Ever-Ready Shot",
            desc: "Starting at 15th level, your magical archery is available whenever battle starts. If you roll initiative and have no uses of Arcane Shot remaining, you regain one use.",
            level: 15,
            tracked: false,
          },
        ],
      },
      banneret: {
        features: [
          {
            id: "rallying_cry",
            name: "Rallying Cry",
            desc: "When you choose this archetype at 3rd level, you learn to inspire your allies with your actions. When you use your Second Wind feature, you can choose up to three creatures within 60 feet of you that are allied with you. Each one regains hit points equal to your fighter level, provided that the creature can see or hear you.",
            level: 3,
            tracked: false,
          },
          {
            id: "inspiring_surge",
            name: "Inspiring Surge",
            desc: "Starting at 10th level, when you use your Action Surge feature, you can choose one creature within 60 feet of you that is allied with you. That creature can use its reaction to make one melee or ranged weapon attack. Starting at 18th level, you can choose two allies within 60 feet of you, rather than one.",
            level: 10,
            tracked: false,
          },
          {
            id: "bulwark",
            name: "Bulwark",
            desc: "Beginning at 15th level, you can extend the benefit of your Indomitable feature to an ally. When you decide to use Indomitable to reroll an Intelligence, Wisdom, or Charisma saving throw and you aren't incapacitated, you can choose one ally within 60 feet of you who also failed their saving throw against the same effect. If that creature can see or hear you, it can reroll its saving throw and must use the new roll.",
            level: 15,
            tracked: false,
          },
        ],
      },
      battleMaster: {
        features: [
          {
            id: "combat_superiority",
            name: "Combat Superiority",
            desc: "At 3rd level, you learn maneuvers that are fueled by special dice called superiority dice. You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all expended superiority dice when you finish a short or long rest.",
            level: 3,
            tracked: true, // 4/SR initially, +1 at 7 and 15
          },
          {
            id: "know_your_enemy",
            name: "Know Your Enemy",
            desc: "Starting at 7th level, if you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own. DM determines details.",
            level: 7,
            tracked: false,
          },
          {
            id: "improved_combat_superiority",
            name: "Improved Combat Superiority",
            desc: "At 10th level, your superiority dice turn into d10s. At 18th level, they turn into d12s.",
            level: 10,
            tracked: false,
          },
          {
            id: "relentless",
            name: "Relentless",
            desc: "Starting at 15th level, when you roll initiative and have no superiority dice remaining, you regain one superiority die.",
            level: 15,
            tracked: false,
          },
        ],
      },
      cavalier: {
        features: [
          {
            id: "unwavering_mark",
            name: "Unwavering Mark",
            desc: "Starting at 3rd level, when you hit a creature with a melee weapon attack, you can mark the creature until the end of your next turn. While it is within 5 feet of you, it has disadvantage on attack rolls against targets other than you. The mark ends early if you are incapacitated or die or if someone else marks the creature. You can use this feature a number of times equal to your Strength modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true, // Str mod/LR
          },
          {
            id: "born_to_saddle",
            name: "Born to Saddle",
            desc: "At 3rd level, you have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you're not incapacitated.",
            level: 3,
            tracked: false,
          },
          {
            id: "warding_maneuver",
            name: "Warding Maneuver",
            desc: "At 7th level, if a creature you can see within 5 feet of you is hit by an attack, you can use your reaction to grant it a bonus to its AC against that attack, potentially causing the attack to miss. The bonus equals 1d8 + your proficiency bonus. You can use this feature a number of times equal to your Constitution modifier, and you regain all expended uses when you finish a long rest.",
            level: 7,
            tracked: true, // Con mod/LR
          },
          {
            id: "hold_the_line",
            name: "Hold the Line",
            desc: "At 10th level, creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach. If you hit a creature with an opportunity attack, the creature’s speed becomes 0 for the rest of the turn.",
            level: 10,
            tracked: false,
          },
          {
            id: "ferocious_charger",
            name: "Ferocious Charger",
            desc: "At 15th level, you gain the ability to make an opponent fall prone when you hit them with a melee attack after moving at least 10 feet straight toward them. They must succeed on a Strength saving throw or fall prone. You can use this feature once per turn.",
            level: 15,
            tracked: false,
          },
          {
            id: "vigilant_defender",
            name: "Vigilant Defender",
            desc: "Starting at 18th level, you respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature’s turn, except your turn. You can use this special reaction only to make an opportunity attack, and you can’t use it on the same turn that you take your normal reaction.",
            level: 18,
            tracked: false,
          },
        ],
      },
      
      champion: {
        features: [
          {
            id: "improved_critical",
            name: "Improved Critical",
            desc: "Starting at 3rd level, your weapon attacks score a critical hit on a roll of 19 or 20.",
            level: 3,
            tracked: false,
          },
          {
            id: "remarkable_athlete",
            name: "Remarkable Athlete",
            desc: "Starting at 7th level, you can add half your proficiency bonus (round up) to any Strength, Dexterity, or Constitution check you make that doesn’t already use your proficiency bonus. Additionally, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.",
            level: 7,
            tracked: false,
          },
          {
            id: "additional_fighting_style",
            name: "Additional Fighting Style",
            desc: "At 10th level, you can choose a second option from the Fighting Style class feature.",
            level: 10,
            tracked: false, // additional fighting style (needs to manually be put in? maybe in here, but user can choose to toggle hidden or expandable)
          },
          {
            id: "superior_critical",
            name: "Superior Critical",
            desc: "Starting at 15th level, your weapon attacks score a critical hit on a roll of 18-20.",
            level: 15,
            tracked: false,
          },
          {
            id: "survivor",
            name: "Survivor",
            desc: "At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half your hit points left. You don’t gain this benefit if you have 0 hit points.",
            level: 18,
            tracked: false,
          },
        ],
      },
      echoKnight: {
        features: [
          {
            id: "manifest_echo",
            name: "Manifest Echo",
            desc: "At 3rd level, you can use a bonus action to magically manifest an echo of yourself in an unoccupied space you can see within 15 feet. This echo is a magical, translucent, gray image of you that lasts until it is destroyed, until you dismiss it as a bonus action, until you manifest another echo, or until you're incapacitated. You can use the echo for various abilities.",
            level: 3,
            tracked: false,
          },
          {
            id: "unleash_incarnation",
            name: "Unleash Incarnation",
            desc: "At 3rd level, you can heighten your echo's fury. Whenever you take the Attack action, you can make one additional melee attack from the echo's position. You can use this feature a number of times equal to your Constitution modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true, // Con mod/LR
          },
          {
            id: "echo_avatar",
            name: "Echo Avatar",
            desc: "Starting at 7th level, you can temporarily transfer your consciousness to your echo. As an action, you can see through your echo's eyes and hear through its ears. During this time, you are deafened and blinded to your own surroundings. You can sustain this effect for up to 10 minutes, and you can end it at any time (no action required).",
            level: 7,
            tracked: false,
          },
          {
            id: "shadow_martyr",
            name: "Shadow Martyr",
            desc: "At 10th level, you can make your echo throw itself in front of an attack directed at another creature. As a reaction, when a creature you can see within 30 feet of you is hit by an attack roll, you can teleport your echo to an unoccupied space within 5 feet of the creature and the attack hits your echo instead. You can use this feature once per short or long rest.",
            level: 10,
            tracked: true, // 1/SR
          },
          {
            id: "reclaim_potential",
            name: "Reclaim Potential",
            desc: "Starting at 15th level, you can absorb the energy of your echo's destruction. When your echo is destroyed by taking damage, you can gain temporary hit points equal to 2d6 + your Constitution modifier, provided you don't already have temporary hit points. You can use this feature a number of times equal to your Constitution modifier, and you regain all expended uses when you finish a long rest.",
            level: 15,
            tracked: true, // Con mod/LR
          },
          {
            id: "legion_of_ones",
            name: "Legion of One",
            desc: "At 18th level, you can manifest two echoes simultaneously. Whenever you take the Attack action, you can make one additional melee attack from each echo's position. Additionally, when both echoes are present, you can use a bonus action to teleport to either echo's space.",
            level: 18,
            tracked: false,
          },
        ],
      },
      eldritchKnight: {
        features: [
        // *****has own spellcasting rules and Table!! needs to be added to Spelltables?? ****FEATURE NEEDED****
          {
            id: "weapon_bond",
            name: "Weapon Bond",
            desc: "At 3rd level, you learn a ritual that creates a magical bond between yourself and one weapon. Once bonded, you can't be disarmed unless you're incapacitated. You can summon this weapon to your hand as a bonus action.",
            level: 3,
            tracked: false,
          },
          {
            id: "war_magic",
            name: "War Magic",
            desc: "Beginning at 7th level, when you use your action to cast a cantrip, you can make one weapon attack as a bonus action.",
            level: 7,
            tracked: false,
          },
          {
            id: "eldritch_strike",
            name: "Eldritch Strike",
            desc: "At 10th level, you learn how to make your weapon strikes undercut a creature's resistance to your spells. When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.",
            level: 10,
            tracked: false,
          },
          {
            id: "arcane_charge",
            name: "Arcane Charge",
            desc: "At 15th level, you gain the ability to teleport up to 30 feet to an unoccupied space you can see when you use your Action Surge. You can teleport before or after the additional action.",
            level: 15,
            tracked: false,
          },
          {
            id: "improved_war_magic",
            name: "Improved War Magic",
            desc: "Starting at 18th level, when you use your action to cast a spell, you can make one weapon attack as a bonus action.",
            level: 18,
            tracked: false,
          },
        ],
      },
      psiWarrior: {
        features: [
          {
            id: "psionic_power",
            name: "Psionic Power",
            desc: "Starting at 3rd level, you harbor psionic energy within yourself. Your access to this energy is represented by a number of psionic energy dice, which are d6s. Your subclass features use your psionic energy dice. You have a number of dice equal to twice your proficiency bonus. You regain all expended dice when you finish a long rest.",
            level: 3,
            tracked: true, // PBx2/LR
          },
          // protective field, psionic strike and telekentic movement are 3 options within psionic power feature. Should they be listed here as separate??
          {
            id: "protective_field",
            name: "Protective Field",
            desc: "Starting at 3rd level, when you or another creature you can see within 30 feet of you takes damage, you can use your reaction to expend a psionic energy die and reduce the damage taken by the number rolled + your Intelligence modifier.",
            level: 3,
            tracked: false,
          },
          {
            id: "psionic_strike",
            name: "Psionic Strike",
            desc: "At 3rd level, you can propel your weapons with psionic force. Once on each of your turns when you hit a target with a weapon attack, you can expend one psionic energy die, dealing extra force damage equal to the number rolled.",
            level: 3,
            tracked: false,
          },
          {
            id: "telekinetic_adept",
            name: "Telekinetic Adept",
            desc: "At 7th level, you gain new ways to use your psionic power. You can move objects or creatures with your mind and use an action to force a Strength saving throw (DC = 8 + PB + Int mod) to move a creature 30 feet in any direction.",
            level: 7,
            tracked: false,
          },
          {
            id: "guarded_mind",
            name: "Guarded Mind",
            desc: "Starting at 10th level, the psionic energy flowing through you has bolstered your mind. You have resistance to psychic damage. Moreover, if you start your turn charmed or frightened, you can expend a Psionic Energy die and end every effect on yourself subjecting you to those conditions.",
            level: 10,
            tracked: false,
          },
          {
            id: "bulwark_of_force",
            name: "Bulwark of Force",
            desc: "At 10th level, you can create a shield of telekinetic force around yourself and allies. As a bonus action, you can choose up to three creatures you can see within 30 feet. Each creature gains a +2 bonus to AC until the start of your next turn. You can use this feature a number of times equal to your Intelligence modifier (minimum of once) per long rest.",
            level: 10,
            tracked: true, // Int mod/LR
          },
          {
            id: "telekinetic_master",
            name: "Telekinetic Master",
            desc: "At 15th level, you can cast telekinesis without expending a spell slot. You can cast it again after finishing a long rest or by expending two psionic energy dice.",
            level: 15,
            tracked: true, // Special
          },
        ],
      },
      runeKnight: {
        features: [
          {
            id: "giant_might",
            name: "Giant's Might",
            desc: "At 3rd level, you can imbue yourself with the might of giants. As a bonus action, you can gain the following benefits for 1 minute:\n- If you are smaller than Large, you become Large, along with anything you are wearing. If there isn’t enough room for you to become Large, your size doesn’t change.\n- You have advantage on Strength checks and Strength saving throws.\n- Once on each of your turns, one of your attacks with a weapon or unarmed strike can deal an extra 1d8 damage to a target on a hit.\nYou can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true, // Uses = Prof bonus / LR
          },
          {
            id: "rune_carver",
            name: "Rune Carver",
            desc: "Starting at 3rd level, you can enhance your gear with magic runes. Choose two runes from the list of available runes. Whenever you finish a long rest, you can inscribe each rune onto one object you touch. To be eligible, an object must be a weapon, a suit of armor, a shield, a piece of jewelry, or something else you can wear or hold in a hand. Your rune remains on an object until you finish a long rest, and an object can bear only one of your runes at a time.",
            level: 3,
            tracked: true, // 1/LR
          },
          {
            id: "runic_shield",
            name: "Runic Shield",
            desc: "At 7th level, you learn how to use your runes to protect others. When another creature you can see within 60 feet of you is hit by an attack roll, you can use your reaction to force the attacker to reroll the d20 and use the new roll. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 7,
            tracked: true, // Uses = Prof bonus / LR
          },
          {
            id: "great_stature",
            name: "Great Stature",
            desc: "At 10th level, the magic of your runes permanently alters you. When you gain this feature, roll 3d4. You grow a number of inches in height equal to the roll. Moreover, the extra damage you deal with your Giant’s Might feature increases to 1d10.",
            level: 10,
            tracked: false,
          },
          {
            id: "master_of_runes",
            name: "Master of Runes",
            desc: "Starting at 15th level, you can invoke each rune you know twice, rather than once, and you regain all expended uses when you finish a short or long rest.",
            level: 15,
            tracked: false,
          },
          {
            id: "runic_juggernaut",
            name: "Runic Juggernaut",
            desc: "At 18th level, you learn how to amplify your runes. Your size increases to Huge. Moreover, the extra damage you deal with your Giant’s Might feature increases to 1d12.",
            level: 18,
            tracked: false,
          },
        ],
      },
      samurai: {
        features: [
          {
            id: "fighting_spirit",
            name: "Fighting Spirit",
            desc: "Starting at 3rd level, as a bonus action, you can give yourself advantage on weapon attack rolls until the end of the current turn. When you do so, you also gain 5 temporary hit points. The number of temporary hit points increases to 10 at 10th level and 15 at 15th level. You can use this feature three times, and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true, // Uses = 3 / LR
          },
          {
            id: "elegant_courtier",
            name: "Elegant Courtier",
            desc: "Starting at 7th level, your discipline and attention to detail allow you to excel in social situations. Whenever you make a Persuasion check, you gain a bonus to the check equal to your Wisdom modifier. You also gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
            level: 7,
            tracked: false,
          },
          {
            id: "tireless_spirit",
            name: "Tireless Spirit",
            desc: "Starting at 10th level, when you roll initiative and have no uses of Fighting Spirit remaining, you regain one use.",
            level: 10,
            tracked: false,
          },
          {
            id: "rapid_strike",
            name: "Rapid Strike",
            desc: "Starting at 15th level, you can trade precision for speed. If you take the Attack action on your turn and have advantage on an attack roll against one of the targets, you can forgo that advantage for that roll to make an additional weapon attack against that target, as part of the same action.",
            level: 15,
            tracked: false,
          },
          {
            id: "strength_before_death",
            name: "Strength Before Death",
            desc: "Starting at 18th level, your fighting spirit can delay the grasp of death. If you take damage that reduces you to 0 hit points and doesn’t kill you outright, you can use your reaction to delay falling unconscious, and you can immediately take an extra turn, interrupting the current turn. While you have 0 hit points during that extra turn, taking damage causes death saving throw failures as normal. Once the extra turn ends, you fall unconscious if you still have 0 hit points. Once you use this feature, you can’t use it again until you finish a long rest.",
            level: 18,
            tracked: true, // 1 / LR
          },
        ],
      },
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
        tracked: false,
      },
      {
        id: "ki",
        name: "Ki",
        desc: "Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points equal to your monk level. You can spend these points to fuel various ki features.",
        level: 2,
        tracked: false, // Tracks ki points
      },
      {
        id: "deflect_missiles",
        name: "Deflect Missiles",
        desc: "You can use your reaction to deflect or catch a missile when you are hit by a ranged weapon attack. When you do so, the damage you take is reduced by 1d10 + your Dexterity modifier + your monk level.",
        level: 3,
        tracked: false,
      },
      {
        id: "slow_fall",
        name: "Slow Fall",
        desc: "Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.",
        level: 4,
        tracked: false,
      },
      {
        id: "extra_attack",
        name: "Extra Attack",
        desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
        level: 5,
        tracked: false,
      },
      {
        id: "stunning_strike",
        name: "Stunning Strike",
        desc: "Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.",
        level: 5,
        tracked: false,
      },
      {
        id: "ki_empowered_strikes",
        name: "Ki-Empowered Strikes",
        desc: "Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
        level: 6,
        tracked: false,
      },
      {
        id: "evasion",
        name: "Evasion",
        desc: "At 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        level: 7,
        tracked: false,
      },
      {
        id: "stillness_of_mind",
        name: "Stillness of Mind",
        desc: "Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.",
        level: 7,
        tracked: false,
      },
      {
        id: "diamond_soul",
        name: "Diamond Soul",
        desc: "Beginning at 14th level, you gain proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.",
        level: 14,
        tracked: false,
      },
      {
        id: "empty_body",
        name: "Empty Body",
        desc: "Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.",
        level: 18,
        tracked: false,
      },
      {
        id: "perfect_self",
        name: "Perfect Self",
        desc: "At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.",
        level: 20,
        tracked: false,
      },
    ],
    subclasses: {
      mercy: {
        features: [
        {
          id: "hands_of_healing",
          name: "Hands of Healing",
          desc: "At 3rd level, as an action, you can spend 1 ki point to touch a creature and restore a number of hit points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use Flurry of Blows, you can replace one of the unarmed strikes with the use of this feature without spending the ki point for the healing.",
          level: 3,
          tracked: false,
        },
        {
          id: "hands_of_harm",
          name: "Hands of Harm",
          desc: "Also at 3rd level, when you hit a creature with an unarmed strike, you can spend 1 ki point to deal extra necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier. You can use this feature only once per turn.",
          level: 3,
          tracked: false,
        },
        {
          id: "physician_s_touch",
          name: "Physician's Touch",
          desc: "Starting at 6th level, you can administer even greater cures with a touch. When you use Hands of Healing on a creature, you can also end one disease or one of the following conditions affecting the creature: blinded, deafened, paralyzed, poisoned, or stunned. When you use Hands of Harm on a creature, you can subject that creature to the poisoned condition until the end of your next turn.",
          level: 6,
          tracked: false,
        },
        {
          id: "flurry_of_healing_and_harm",
          name: "Flurry of Healing and Harm",
          desc: "Starting at 11th level, when you use Flurry of Blows, you can now make up to three unarmed strikes as part of the action, rather than two.",
          level: 11,
          tracked: false,
        },
        {
          id: "hand_of_ultimate_mercy",
          name: "Hand of Ultimate Mercy",
          desc: "At 17th level, as an action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 ki points to return the creature to life, provided that its soul is willing and able to rejoin its body. If it returns to life, it regains a number of hit points equal to 4d10 + your Wisdom modifier. This feature can’t return to life a creature that has died of old age, nor can it restore any missing body parts.",
          level: 17,
          tracked: true, // 1/LR
        },
      ],
    },
    ascendentDragon: {
      features: [
          {
            id: "draconic_disciple",
            name: "Draconic Disciple",
            desc: "At 3rd level, you can channel draconic power to magnify your presence and imbue your unarmed strikes with the essence of a dragon’s breath. You gain the following benefits:\n\n- **Draconic Presence:** If you fail a Charisma (Intimidation) or Charisma (Persuasion) check, you can use your reaction to reroll the check, as you tap into the mighty presence of dragons. Once this feature turns a failure into a success, you can’t use it again until you finish a long rest.\n- **Draconic Strike:** When you damage a target with an unarmed strike, you can change the damage type to acid, cold, fire, lightning, or poison.\n- **Tongue of Dragons:** You learn to speak, read, and write Draconic or one other language of your choice.",
            level: 3,
            tracked: true, // Draconic Presence: 1 / LR
        },
        {
            id: "breath_of_the_dragon",
            name: "Breath of the Dragon",
            desc: "At 3rd level, you can channel destructive waves of energy, like those created by the dragons you emulate. When you take the Attack action on your turn, you can replace one of the attacks with an exhalation of draconic energy in either a 20-foot cone or a 30-foot line that is 5 feet wide (your choice). Choose a damage type: acid, cold, fire, lightning, or poison. Each creature in that area must make a Dexterity saving throw against your ki save DC, taking damage of the chosen type equal to two rolls of your Martial Arts die on a failed save, or half as much damage on a successful one.\n\nAt 11th level, the damage of this feature increases to three rolls of your Martial Arts die.\n\nYou can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest. While you have no uses available, you can spend 2 ki points to use this feature again.",
            level: 3,
            tracked: true, // Uses = Prof Bonus / LR or 2 Ki Points
        },
        {
          id: "wings_unfurled",
          name: "Wings Unfurled",
          desc: "At 6th level, when you use your Step of the Wind, you can unfurl spectral draconic wings for a short duration. While the wings exist, you have a flying speed equal to your walking speed. The wings last until the end of your current turn. You can use this feature a number of times equal to your proficiency bonus and regain all expended uses when you finish a long rest.",
          level: 6,
          tracked: true, // Uses = Prof Bonus / LR
        },
        {
          id: "aspect_of_the_wyrm",
          name: "Aspect of the Wyrm",
          desc: "At 11th level, as a bonus action, you can exude an aura of draconic power that radiates 10 feet from you for 1 minute. Choose acid, cold, fire, lightning, or poison damage. When you activate this aura, and as a bonus action on subsequent turns while it lasts, you can grant creatures of your choice within the aura resistance to that damage type. In addition, when a creature of your choice starts its turn within the aura, it takes damage equal to one roll of your Martial Arts die of the chosen type. Once you use this feature, you can’t use it again until you finish a long rest.",
          level: 11,
          tracked: true, // 1 / LR
        },
        {
          id: "ascendant_aspect",
          name: "Ascendant Aspect",
          desc: "At 17th level, you can fully embody the power of dragons. You gain the following benefits:\n- Augment Breath: When you use your Breath of the Dragon, you can spend 1 ki point to augment its damage, increasing it to three rolls of your Martial Arts die.\n- Explosive Fury: When you activate your Aspect of the Wyrm, draconic fury explodes from you. Each creature of your choice within 10 feet of you must succeed on a Dexterity saving throw or take damage equal to your Martial Arts die of the type chosen for the aura.",
          level: 17,
          tracked: false,
        },
      ],
    },
    astralSelf: {
      features: [
        {
          id: "arms_of_the_astral_self",
          name: "Arms of the Astral Self",
          desc: "At 3rd level, as a bonus action, you can spend 1 ki point to summon the arms of your astral self. When you do so, each creature of your choice that you can see within 10 feet of you must succeed on a Dexterity saving throw or take force damage equal to two rolls of your Martial Arts die. For 10 minutes, these spectral arms hover near your shoulders or surround your arms (your choice). While the spectral arms are present, you gain the following benefits:\n- You can use your Wisdom modifier in place of your Strength modifier when making Strength checks and Strength saving throws.\n- You can use the spectral arms to make unarmed strikes. When you make an unarmed strike with the arms on your turn, your reach increases by 5 feet.\n- The unarmed strikes you make with the arms use your Wisdom modifier for the attack and damage rolls, and their damage type is force.",
          level: 3,
          tracked: false, // 1 Ki Point / Activation
        },
        {
          id: "visage_of_the_astral_self",
          name: "Visage of the Astral Self",
          desc: "At 6th level, as a bonus action, you can spend 1 ki point to summon the visage of your astral self. The visage covers your face like a helmet or mask (your choice) for 10 minutes. While the visage is present, you gain the following benefits:\n- Astral Sight: You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.\n- Wisdom of the Spirit: You have advantage on Wisdom (Insight) and Charisma (Intimidation) checks.\n- Word of the Spirit: You can speak or read any language and be understood by any creature that can understand a language.",
          level: 6,
          tracked: false, // 1 Ki Point / Activation
        },
        {
          id: "body_of_the_astral_self",
          name: "Body of the Astral Self",
          desc: "Starting at 11th level, when you have both your Arms and Visage of the Astral Self summoned, you can cause the body of your astral self to appear (no action required). The spectral body covers your torso and connects to the arms and visage. While the body is present, you gain the following benefits:\n- Deflect Energy: When you take acid, cold, fire, force, lightning, or thunder damage, you can use your reaction to deflect it. When you do so, the damage you take is reduced by 1d10 + your Wisdom modifier.\n- Empowered Arms: Once on each of your turns when you hit a target with the Arms of the Astral Self, you can deal extra damage to the target equal to your Martial Arts die.",
          level: 11,
          tracked: false,
        },
        {
          id: "awakening_of_the_astral_self",
          name: "Awakening of the Astral Self",
          desc: "At 17th level, your connection to your astral self is complete, allowing you to unleash its full potential. While you have your Astral Self summoned, you gain the following benefits:\n- Armor of the Spirit: You gain a +2 bonus to AC.\n- Astral Barrage: Whenever you use the Extra Attack feature to attack twice, you can instead attack three times, provided the attacks are made with your Arms of the Astral Self.",
          level: 17,
          tracked: false,
        },
      ],
    },
    
    drunkenMaster: {
      features: [
        {
          id: "drunken_technique",
          name: "Drunken Technique",
          desc: "At 3rd level, you learn how to twist and turn quickly as part of your Flurry of Blows. Whenever you use Flurry of Blows, you gain the benefit of the Disengage action, and your walking speed increases by 10 feet until the end of the current turn.",
          level: 3,
          tracked: false,
        },
        {
          id: "tipsy_sway",
          name: "Tipsy Sway",
          desc: "Starting at 6th level, you can move in sudden, swaying ways. You gain the following benefits:\n- Leap to Your Feet: When you're prone, you can stand up by spending 5 feet of movement, rather than half your speed.\n- Redirect Attack: When a creature misses you with a melee attack roll, you can spend 1 ki point as a reaction to cause that attack to hit one creature of your choice, other than the attacker, that you can see within 5 feet of you.",
          level: 6,
          tracked: false, // Redirect Attack: 1 Ki Point / Use
        },
        {
          id: "drunkard_s_luck",
          name: "Drunkard’s Luck",
          desc: "Starting at 11th level, you can call on your ki to nullify disadvantage on an ability check, attack roll, or saving throw. When you make a roll with disadvantage, you can spend 2 ki points to roll normally instead.",
          level: 11,
          tracked: false, // 2 Ki Points / Use
        },
        {
          id: "intoxicated_frenzy",
          name: "Intoxicated Frenzy",
          desc: "At 17th level, you gain the ability to make an overwhelming number of attacks against a group of enemies. When you use your Flurry of Blows, you can make up to three additional unarmed strikes with it (up to a total of five unarmed strikes), provided that each Flurry of Blows attack targets a different creature this turn.",
          level: 17,
          tracked: false,
        },
      ],
      
      fourElements: [
        {
          id: "discipline_of_the_elements",
          name: "Discipline of the Elements",
          desc: "At 3rd level, you learn magical disciplines that harness the power of the elements. You gain access to elemental disciplines, which allow you to cast certain spells. To cast one of these spells, you must spend ki points equal to the spell's level. You choose one discipline at 3rd level and can learn additional disciplines as you level up. Each time you gain a level in this class, you can replace a discipline you know with another available to you.",
          level: 3,
          tracked: true, // Ki Points / Spell Level+1; additional disciplines at 6th, 11, and 17
        },
      ],
    },
    kensei: {
      features: [
        {
          id: "path_of_the_kensei",
          name: "Path of the Kensei",
          desc: "At 3rd level, your special martial arts training leads you to master the use of certain weapons. This path also includes instruction in the deft strokes of calligraphy or painting. You gain the following benefits:\n\n- **Kensei Weapons**: Choose two types of weapons to be your kensei weapons. A melee weapon must be simple or martial that lacks the heavy and special properties. You can use Dexterity instead of Strength for attack and damage rolls and treat them as monk weapons.\n\n- **Agile Parry**: If you make an unarmed strike as part of the Attack action and hold a kensei weapon, you gain a +2 bonus to AC until the start of your next turn.\n\n- **Kensei's Shot**: As a bonus action, you can deal an extra 1d4 damage of your weapon's type with a ranged weapon attack until the end of the turn.\n\n- **Way of the Brush**: You gain proficiency with your choice of calligrapher's supplies or painter's supplies.",
          level: 3,
          tracked: false,
        },
        {
          id: "one_with_the_blade",
          name: "One with the Blade",
          desc: "At 6th level, you gain the following benefits:\n\n- **Magic Kensei Weapons**: Your kensei weapons count as magical for overcoming resistance and immunity to nonmagical attacks and damage.\n\n- **Deft Strike**: When you hit a target with a kensei weapon, you can spend 1 ki point to deal extra damage equal to your Martial Arts die.",
          level: 6,
          tracked: false, // ki point expenditure
        },
        {
          id: "sharpen_the_blade",
          name: "Sharpen the Blade",
          desc: "At 11th level, as a bonus action, you can expend up to 3 ki points to grant a weapon you are holding a bonus to attack and damage rolls. The bonus equals the number of ki points you spent, and it lasts for 1 minute. This feature has no effect on a magic weapon that already has a bonus to attack and damage rolls.",
          level: 11,
          tracked: false, // ki point expenditure
        },
        {
          id: "unerring_accuracy",
          name: "Unerring Accuracy",
          desc: "At 17th level, if you miss with an attack roll using a monk weapon on your turn, you can reroll it. You can use this feature only once on each of your turns.",
          level: 17,
          tracked: false,
        },
      ],
    },
    longDeath: {
      features: [
        {
          id: "touch_of_death",
          name: "Touch of Death",
          desc: "Starting when you choose this tradition at 3rd level, your touch can channel the energy of death into a creature. When you reduce a creature within 5 feet of you to 0 hit points, you gain temporary hit points equal to your Wisdom modifier + your monk level (minimum of 1).",
          level: 3,
          tracked: false,
        },
        {
          id: "hour_of_reaping",
          name: "Hour of Reaping",
          desc: "At 6th level, you gain the ability to terrify those around you. As an action, you force each creature of your choice within 30 feet of you to make a Wisdom saving throw or be frightened of you until the end of your next turn.",
          level: 6,
          tracked: false, // no stated usage limit
        },
        {
          id: "mastery_of_death",
          name: "Mastery of Death",
          desc: "Starting at 11th level, when you are reduced to 0 hit points, you can expend 1 ki point to have 1 hit point instead.",
          level: 11,
          tracked: false, // ki point expenditure
        },
        {
          id: "touch_of_the_long_death",
          name: "Touch of the Long Death",
          desc: "At 17th level, as an action, you can touch a creature and expend 1 to 10 ki points. The target must make a Constitution saving throw, taking 2d10 necrotic damage per ki point spent on a failed save, or half as much damage on a successful one.",
          level: 17,
          tracked: false, // ki point expenditure
        },
      ]
    },
    openHand: {
      features: [
        {
          id: "open_hand_technique",
          name: "Open Hand Technique",
          desc: "Starting at 3rd level, whenever you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects:\n\n- It must succeed on a Dexterity saving throw or be knocked prone.\n- It must make a Strength saving throw or be pushed 15 feet away from you.\n- It can't take reactions until the end of your next turn.",
          level: 3,
          tracked: false, // ki point expenditure for Flurry of Blows
        },
        {
          id: "wholeness_of_body",
          name: "Wholeness of Body",
          desc: "At 6th level, you gain the ability to heal yourself. As an action, you can regain hit points equal to three times your monk level. Once you use this feature, you can’t use it again until you finish a long rest.",
          level: 6,
          tracked: false, // 1/LR
        },
        {
          id: "tranquility",
          name: "Tranquility",
          desc: "At 11th level, you can enter a special meditation that surrounds you with an aura of peace. At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest. The spell can end early if you attack or cast a spell that affects an enemy.",
          level: 11,
          tracked: false,
        },
        {
          id: "quivering_palm",
          name: "Quivering Palm",
          desc: "At 17th level, you gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these vibrations, which last for a number of days equal to your monk level. You can then use an action to end the vibrations, forcing the target to make a Constitution saving throw. On a failed save, the creature is reduced to 0 hit points. On a successful save, the creature takes 10d10 necrotic damage. You can only have one creature affected by this at a time.",
          level: 17,
          tracked: false, // ki point expenditure
        },
      ],
    },
    shadow: {
      features: [
        {
          id: "shadow_arts",
          name: "Shadow Arts",
          desc: "Starting when you choose this tradition at 3rd level, you can use your ki to duplicate the effects of certain spells. As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components. Additionally, you gain the minor illusion cantrip if you don’t already know it.",
          level: 3,
          tracked: false, // ki point expenditure
        },
        {
          id: "shadow_step",
          name: "Shadow Step",
          desc: "At 6th level, you gain the ability to step from one shadow into another. When you are in dim light or darkness, as a bonus action, you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of your turn.",
          level: 6,
          tracked: false,
        },
        {
          id: "cloak_of_shadows",
          name: "Cloak of Shadows",
          desc: "By 11th level, you have learned to become one with the shadows. When you are in an area of dim light or darkness, you can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or are in an area of bright light.",
          level: 11,
          tracked: false,
        },
        {
          id: "opportunist",
          name: "Opportunist",
          desc: "At 17th level, you can exploit a creature's momentary distraction when it is hit by an attack. Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature.",
          level: 17,
          tracked: false,
        },
      ],
    },
    sunSoul: {
      features:[
        {
          id: "radiant_sun_bolt",
          name: "Radiant Sun Bolt",
          desc: "Starting when you choose this tradition at 3rd level, you can hurl searing bolts of magical radiance. You gain a ranged spell attack with a range of 30 feet that deals radiant damage equal to your Martial Arts die. When you take the Attack action, you can replace any of the attacks with this special attack. Additionally, you can spend 1 ki point to make two Radiant Sun Bolt attacks as a bonus action.",
          level: 3,
          tracked: false, // ki point expenditure
        },
        {
          id: "searing_arc_strike",
          name: "Searing Arc Strike",
          desc: "At 6th level, immediately after you take the Attack action on your turn, you can spend 2 ki points to cast the burning hands spell as a bonus action. You can spend additional ki points to cast burning hands at a higher level, increasing the spell’s level by 1 for each additional ki point you spend. The maximum number of ki points you can spend on the spell equals half your monk level.",
          level: 6,
          tracked: false, // ki point expenditure
        },
        {
          id: "searing_sunburst",
          name: "Searing Sunburst",
          desc: "At 11th level, as an action, you can create an orb of light that erupts into a devastating explosion. You can hurl the orb at a point you choose within 150 feet, and each creature in a 20-foot radius must make a Constitution saving throw or take radiant damage equal to 2d6 + your Wisdom modifier. You can spend 1 ki point to deal additional radiant damage equal to your Martial Arts die.",
          level: 11,
          tracked: false, // ki point expenditure
        },
        {
          id: "sun_shield",
          name: "Sun Shield",
          desc: "At 17th level, you become wreathed in a luminous aura. You shed bright light in a 30-foot radius and dim light for an additional 30 feet. Whenever a creature hits you with a melee attack, it takes radiant damage equal to 5 + your Wisdom modifier.",
          level: 17,
          tracked: false,
        },
      ],
    },// add Features{[ ]} to the subclasses to stay consistent with format
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
        tracked: false, // **NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**
      },
      {
        id: "divine_smite",
        name: "Divine Smite",
        desc: "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8.",
        level: 2,
        tracked: false, //Use spell slots to cast
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
        tracked: false,
      },
      {
        id: "aura_of_protection",
        name: "Aura of Protection",
        desc: "Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.",
        level: 6,
        tracked: false,
      },
      {
        id: "aura_of_courage",
        name: "Aura of Courage",
        desc: "Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.",
        level: 10,
        tracked: false,
      },
      {
        id: "improved_divine_smite",
        name: "Improved Divine Smite",
        desc: "By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.",
        level: 11,
        tracked: false,
      },
      {
        id: "cleansing_touch",
        name: "Cleansing Touch",
        desc: "Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.",
        level: 14,
        tracked: false,
      },
    ],
    subclasses: {
      ancients: {
        features: [
          {
            id: "channel_divinity_natures_wrath",
            name: "Channel Divinity: Nature's Wrath",
            desc: "You can use your Channel Divinity to invoke primeval forces to ensnare a foe. As an action, you can cause spectral vines to spring up and reach for a creature within 10 feet of you that you can see. The creature must succeed on a Strength or Dexterity saving throw (its choice) or be restrained. While restrained by the vines, the creature repeats the saving throw at the end of each of its turns, ending the effect on itself on a success.",
            level: 3,
            tracked: false
          },
          {
            id: "aura_of_warding",
            name: "Aura of Warding",
            desc: "Beginning at 7th level, you and friendly creatures within 10 feet of you have resistance to damage from spells. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "undying_sentinel",
            name: "Undying Sentinel",
            desc: "At 15th level, when you are reduced to 0 hit points and not killed outright, you can choose to drop to 1 hit point instead. Once you use this feature, you can't use it again until you finish a long rest. Additionally, you suffer none of the drawbacks of old age, and you can't be aged magically.",
            level: 15,
            tracked: true, // 1/LR
          },
          {
            id: "elder_champion",
            name: "Elder Champion",
            desc: "At 20th level, you can assume the form of an ancient force of nature using your action. For 1 minute, you gain the following benefits:\n- At the start of each of your turns, regain 10 hit points.\n- Spells you cast that have a casting time of 1 action instead have a casting time of 1 bonus action.\n- Enemies within 10 feet of you have disadvantage on saving throws against your paladin spells and Channel Divinity options.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["ensnaring_strike", "speak_with_animals"] },
          { level: 5, spells: ["misty_step", "moonbeam"] },
          { level: 9, spells: ["plant_growth", "protection_from_energy"] },
          { level: 13, spells: ["ice_storm", "stoneskin"] },
          { level: 17, spells: ["commune_with_nature", "tree_stride"] },
        ],
      },
      conquest: {
        features: [
          {
            id: "channel_divinity_conquering_presence",
            name: "Channel Divinity: Conquering Presence",
            desc: "You can use your Channel Divinity to exude a terrifying presence. As an action, you force each creature of your choice that you can see within 30 feet of you to make a Wisdom saving throw. On a failed save, a creature becomes frightened of you for 1 minute. A frightened creature can repeat this saving throw at the end of each of its turns, ending the effect on itself on a success.",
            level: 3,
            tracked: false
          },
          {
            id: "channel_divinity_guided_strike",
            name: "Channel Divinity: Guided Strike",
            desc: "You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.",
            level: 3,
            tracked: false
          },
          {
            id: "aura_of_conquest",
            name: "Aura of Conquest",
            desc: "Starting at 7th level, you emanate a menacing aura while you're not incapacitated. The aura extends 10 feet from you in every direction, but not through total cover.\n- If a creature is frightened of you, its speed is reduced to 0 while in the aura, and it takes psychic damage equal to half your paladin level if it starts its turn there.\nAt 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "scornful_rebuke",
            name: "Scornful Rebuke",
            desc: "Starting at 15th level, when a creature hits you with an attack, it takes psychic damage equal to your Charisma modifier (minimum of 1).",
            level: 15,
            tracked: false,
          },
          {
            id: "invincible_conqueror",
            name: "Invincible Conqueror",
            desc: "At 20th level, you can use your action to harness extraordinary martial power for 1 minute, gaining the following benefits:\n- Attack rolls against you have disadvantage.\n- Your weapon attacks score a critical hit on a roll of 19 or 20.\n- You make an additional attack when you take the Attack action on your turn.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["armor_of_agathys", "command"] },
          { level: 5, spells: ["hold_person", "spiritual_weapon"] },
          { level: 9, spells: ["bestow_curse", "fear"] },
          { level: 13, spells: ["dominate_beast", "stoneskin"] },
          { level: 17, spells: ["cloudkill", "dominate_person"] },
        ],
      },
      crown: {
        features: [
          {
            id: "channel_divinity_champions_challenge",
            name: "Channel Divinity: Champion's Challenge",
            desc: "You can use your Channel Divinity to issue a challenge that compels other creatures to do battle with you. As an action, you force each creature of your choice within 30 feet of you to make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.",
            level: 3,
            tracked: false
          },
          {
            id: "channel_divinity_turn_the_tide",
            name: "Channel Divinity: Turn the Tide",
            desc: "You can use your Channel Divinity to bolster injured creatures with your holy power. As a bonus action, you grant temporary hit points to each creature of your choice within 30 feet of you. Each creature regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half its hit points.",
            level: 3,
            tracked: false
          },
          {
            id: "divine_allegiance",
            name: "Divine Allegiance",
            desc: "Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically take that damage, instead of the creature taking it. This damage bypasses any resistance or immunity you have.",
            level: 7,
            tracked: false,
          },
          {
            id: "unyielding_saint",
            name: "Unyielding Saint",
            desc: "Starting at 15th level, your devotion to protecting the innocent strengthens your resolve. You have advantage on saving throws to avoid being paralyzed or stunned.",
            level: 15,
            tracked: false,
          },
          {
            id: "exalted_champion",
            name: "Exalted Champion",
            desc: "At 20th level, you can use your action to become an avatar of peace and resolve. For 1 minute, you gain the following benefits:\n- You have resistance to all damage dealt by other creatures.\n- Your allies within 30 feet of you have advantage on saving throws against being frightened or charmed.\n- Whenever a creature hits you with a melee attack, it takes radiant damage equal to your Charisma modifier.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["command", "compelled_duel"] },
          { level: 5, spells: ["warding_bond", "zone_of_truth"] },
          { level: 9, spells: ["aura_of_vitality", "spirit_guardians"] },
          { level: 13, spells: ["banishment", "guardian_of_faith"] },
          { level: 17, spells: ["circle_of_power", "geas"] },
        ],
      },
      devotion: {
        features: [
          {
            id: "channel_divinity_sacred_weapon",
            name: "Channel Divinity: Sacred Weapon",
            desc: "You can use your Channel Divinity to imbue one weapon that you are holding with positive energy. As an action, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light for an additional 20 feet. This effect lasts for 1 minute. If the weapon is not already magical, it becomes magical for the duration. This effect ends early if you drop the weapon or fall unconscious.",
            level: 3,
            tracked: false
          },
          {
            id: "channel_divinity_turn_the_unholy",
            name: "Channel Divinity: Turn the Unholy",
            desc: "You can use your Channel Divinity to utter ancient words that are painful for fiends and undead to hear. As an action, you present your holy symbol and speak a prayer censuring fiends and undead. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
            level: 3,
            tracked: false
          },
          {
            id: "aura_of_devotion",
            name: "Aura of Devotion",
            desc: "Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "purity_of_spirit",
            name: "Purity of Spirit",
            desc: "Beginning at 15th level, you are always under the effects of a protection from evil and good spell.",
            level: 15,
            tracked: false,
          },
          {
            id: "holy_nimbus",
            name: "Holy Nimbus",
            desc: "At 20th level, as an action, you can emanate an aura of sunlight for 1 minute. The aura is a 30-foot radius of bright light and dim light for an additional 30 feet. Whenever an enemy starts its turn in the bright light, it takes 10 radiant damage. Additionally, allies in the light have advantage on saving throws against spells cast by fiends or undead. Once you use this feature, you can’t use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["protection_from_evil_and_good", "sanctuary"] },
          { level: 5, spells: ["lesser_restoration", "zone_of_truth"] },
          { level: 9, spells: ["beacon_of_hope", "dispel_magic"] },
          { level: 13, spells: ["freedom_of_movement", "guardian_of_faith"] },
          { level: 17, spells: ["commune", "flame_strike"] },
        ],
      },
      glory: {
        features: [
          {
            id: "channel_divinity_peerless_athlete",
            name: "Channel Divinity: Peerless Athlete",
            desc: "You can use your Channel Divinity to augment your athleticism with divine favor. As a bonus action, you gain advantage on Strength (Athletics) and Dexterity (Acrobatics) checks for the next 10 minutes. During this time, you can also carry, push, drag, and lift twice as much weight as normal, and the distance of your long and high jumps increases by 10 feet.",
            level: 3,
            tracked: false
          },
          {
            id: "aura_of_alacrity",
            name: "Aura of Alacrity",
            desc: "Starting at 7th level, you emanate an aura while you aren't incapacitated. Your walking speed increases by 10 feet, and your allies within 10 feet of you also gain this benefit. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "glorious_defense",
            name: "Glorious Defense",
            desc: "Starting at 15th level, when a creature within 10 feet of you makes an attack roll against you or another creature, you can use your reaction to add your Charisma modifier to the target's AC. If the attack still hits, you can make one weapon attack against the attacker as part of this reaction.\nYou can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 15,
            tracked: true, // Cha mod/LR
          },
          {
            id: "living_legend",
            name: "Living Legend",
            desc: "At 20th level, as a bonus action, you can empower yourself with an otherworldly presence for 1 minute. For the duration:\n- You have advantage on all Charisma checks.\n- Once per turn, when you miss with an attack roll, you can make the roll again.\n- If you fail a saving throw, you can use your reaction to reroll it.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["guiding_bolt", "heroism"] },
          { level: 5, spells: ["enhance_ability", "magic_weapon"] },
          { level: 9, spells: ["haste", "protection_from_energy"] },
          { level: 13, spells: ["compulsion", "freedom_of_movement"] },
          { level: 17, spells: ["commune", "flame_strike"] },
        ],
      },
      redemption: {
        features: [
          {
            id: "channel_divinity_emissary_of_peace",
            name: "Channel Divinity: Emissary of Peace",
            desc: "You can use your Channel Divinity to augment your presence with divine power. As a bonus action, you grant yourself a +5 bonus to Charisma (Persuasion) checks for the next 10 minutes.",
            level: 3,
            tracked: false,
          },
          {
            id: "channel_divinity_rebuke_the_violent",
            name: "Channel Divinity: Rebuke the Violent",
            desc: "You can use your Channel Divinity to rebuke those who use violence. Immediately after an attacker within 30 feet of you deals damage with an attack against a creature other than you, you can use your reaction to force the attacker to make a Wisdom saving throw. On a failed save, the attacker takes radiant damage equal to the damage it just dealt. On a successful save, it takes half as much damage.",
            level: 3,
            tracked: false,
          },
          {
            id: "aura_of_the_guardian",
            name: "Aura of the Guardian",
            desc: "Starting at 7th level, you can shield your allies from harm at the cost of your own health. When a creature within 10 feet of you takes damage, you can use your reaction to magically take that damage, instead of that creature taking it. This damage bypasses any resistance or immunity you have. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "protective_spirit",
            name: "Protective Spirit",
            desc: "Starting at 15th level, a holy presence mends your wounds in battle. If you end your turn with fewer than half of your hit points remaining and you aren’t incapacitated, you regain hit points equal to 1d6 + your Charisma modifier.",
            level: 15,
            tracked: false,
          },
          {
            id: "emissary_of_redemption",
            name: "Emissary of Redemption",
            desc: "At 20th level, you become an avatar of peace, gaining the following benefits for 1 minute:\n- You have resistance to all damage dealt by other creatures.\n- Whenever a creature damages you, it takes radiant damage equal to half the amount it dealt to you.\nIf you attack a creature, force it to make a saving throw, or deal damage to it, this benefit ends. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["sanctuary", "sleep"] },
          { level: 5, spells: ["calm_emotions", "hold_person"] },
          { level: 9, spells: ["counterspell", "hypnotic_pattern"] },
          { level: 13, spells: ["otilukes_resilient_sphere", "banishment"] },
          { level: 17, spells: ["hold_monster", "wall_of_force"] },
        ],
      },
      vengeance: {
        features: [
          {
            id: "channel_divinity_abjure_enemy",
            name: "Channel Divinity: Abjure Enemy",
            desc: "As an action, you can present your holy symbol and speak a prayer of denunciation, using your Channel Divinity. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw unless it is immune to being frightened. Fiends and undead have disadvantage on this saving throw. On a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature's speed is 0 and it can't benefit from any bonus to its speed. On a successful save, the creature's speed is halved for 1 minute or until the creature takes any damage.",
            level: 3,
            tracked: false,
          },
          {
            id: "channel_divinity_vow_of_enmity",
            name: "Channel Divinity: Vow of Enmity",
            desc: "As a bonus action, you can use your Channel Divinity to utter a vow of enmity against a creature you can see within 10 feet of you, gaining advantage on attack rolls against the creature for 1 minute or until it drops to 0 hit points or falls unconscious.",
            level: 3,
            tracked: false,
          },
          {
            id: "relentless_avenger",
            name: "Relentless Avenger",
            desc: "Starting at 7th level, when you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn’t provoke opportunity attacks.",
            level: 7,
            tracked: false,
          },
          {
            id: "soul_of_vengeance",
            name: "Soul of Vengeance",
            desc: "Starting at 15th level, when a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature if it is within range.",
            level: 15,
            tracked: false,
          },
          {
            id: "avenging_angel",
            name: "Avenging Angel",
            desc: "At 20th level, as an action, you can assume the form of an angelic avenger for 1 hour. You gain the following benefits:\n- Wings sprout from your back, granting you a flying speed of 60 feet.\n- You emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there during combat, it must succeed on a Wisdom saving throw or become frightened of you for 1 minute. Once a creature succeeds on this saving throw, it is immune to the aura for 24 hours.\nOnce you use this feature, you can’t use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["bane", "hunter's_mark"] },
          { level: 5, spells: ["hold_person", "misty_step"] },
          { level: 9, spells: ["haste", "protection_from_energy"] },
          { level: 13, spells: ["banishment", "dimension_door"] },
          { level: 17, spells: ["hold_monster", "scrying"] },
        ],
      },
      watchers: {
        features: [
          {
            id: "channel_divinity_watchers_will",
            name: "Channel Divinity: Watcher's Will",
            desc: "As an action, you can use your Channel Divinity to invest your presence with divine power. For 1 minute, you and your allies within 30 feet of you have advantage on Intelligence, Wisdom, and Charisma saving throws.",
            level: 3,
            tracked: false,
          },
          {
            id: "channel_divinity_abjure_the_extraplanar",
            name: "Channel Divinity: Abjure the Extraplanar",
            desc: "As an action, you can present your holy symbol and use your Channel Divinity to castigate unworldly beings. Each aberration, celestial, elemental, fey, or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
            level: 3,
            tracked: false,
          },
          {
            id: "aura_of_the_sentinel",
            name: "Aura of the Sentinel",
            desc: "Starting at 7th level, you and your allies within 10 feet of you gain a bonus to initiative rolls equal to your Charisma modifier. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "vigilant_rebuke",
            name: "Vigilant Rebuke",
            desc: "Starting at 15th level, when you or a creature within 10 feet of you succeeds on an Intelligence, Wisdom, or Charisma saving throw, you can use your reaction to deal 2d8 + your Charisma modifier force damage to the creature that forced the saving throw.",
            level: 15,
            tracked: false,
          },
          {
            id: "mortal_bulwark",
            name: "Mortal Bulwark",
            desc: "At 20th level, as an action, you manifest an otherworldly presence for 1 minute, gaining the following benefits:\n- True sight out to 120 feet.\n- Advantage on attack rolls against fiends, aberrations, and undead.\n- You can use your reaction when you hit a creature with an attack to force it to make a Charisma saving throw. On a failure, the creature is banished to its native plane.\nOnce you use this feature, you can’t use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["alarm", "detect_magic"] },
          { level: 5, spells: ["moonbeam", "see_invisibility"] },
          { level: 9, spells: ["counterspell", "nondetection"] },
          { level: 13, spells: ["aura_of_purity", "banishment"] },
          { level: 17, spells: ["hold_monster", "scrying"] },
        ],
      },
      oathbreaker: {
        features: [
          {
            id: "aura_of_hate",
            name: "Aura of Hate",
            desc: "Starting at 7th level, you and friendly creatures within 10 feet of you deal an additional amount of necrotic damage equal to your Charisma modifier when you hit with melee weapon attacks. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "supernatural_resistance",
            name: "Supernatural Resistance",
            desc: "Starting at 15th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
            level: 15,
            tracked: false,
          },
          {
            id: "dread_lord",
            name: "Dread Lord",
            desc: "At 20th level, as an action, you can channel the power of darkness to become a Dread Lord for 1 minute. You gain the following benefits:\n- Hostile creatures within 30 feet of you have disadvantage on saving throws against your spells and Channel Divinity options.\n- Whenever a creature that is frightened by you starts its turn in this aura, it takes 4d10 psychic damage.\n- You can use your action to make an attack against each creature of your choice within 30 feet.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["hellish_rebuke", "inflict_wounds"] },
          { level: 5, spells: ["crown_of_madness", "darkness"] },
          { level: 9, spells: ["animate_dead", "bestow_curse"] },
          { level: 13, spells: ["blight", "confusion"] },
          { level: 17, spells: ["contagion", "dominate_person"] },
        ]
      },
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
        tracked: false, // **NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**
      },
      {
        id: "extra_attack",
        name: "Extra Attack",
        desc: "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
        level: 5,
        tracked: false,
      },
      {
        id: "land_stride",
        name: "Land's Stride",
        desc: "Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through plants without being slowed by them and without taking damage from them if they are toxic or hazardous.",
        level: 8,
        tracked: false,
      },
      {
        id: "vanish",
        name: "Vanish",
        desc: "Starting at 14th level, you can use the Hide action as a bonus action on your turn.",
        level: 14,
        tracked: false,
      },
      {
        id: "feral_senses",
        name: "Feral Senses",
        desc: "At 18th level, you gain preternatural senses that help you fight creatures you can't see.",
        level: 18,
        tracked: false,
      },
      {
        id: "foe_slayer",
        name: "Foe Slayer",
        desc: "At 20th level, you become an unparalleled hunter of your enemies.",
        level: 20,
        tracked: false,
      },
    ],
    subclasses: {
      beastMaster:{ 
        features: [
          {
            id: "ranger_companion",
            name: "Ranger's Companion",
            desc: "At 3rd level, you gain a beast companion that accompanies you on your adventures. The companion obeys your commands, and its statistics are determined by a creature of CR 1/4 or lower from the game's bestiary. It takes its turn on your initiative, and you determine its actions. If it dies, you can revive it or replace it with another creature after 8 hours of work and the expenditure of 25 gp.",
            level: 3,
            tracked: false,
          },
          {
            id: "exceptional_training",
            name: "Exceptional Training",
            desc: "Starting at 7th level, your beast companion’s attacks count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. In addition, you can use a bonus action to command it to take the Dash, Disengage, or Help action on its turn.",
            level: 7,
            tracked: false,
          },
          {
            id: "bestial_fury",
            name: "Bestial Fury",
            desc: "Beginning at 11th level, your beast companion can make two attacks when it takes the Attack action.",
            level: 11,
            tracked: false,
          },
          {
            id: "share_spells",
            name: "Share Spells",
            desc: "At 15th level, when you cast a spell targeting yourself, you can also affect your beast companion with the spell if the companion is within 30 feet of you.",
            level: 15,
            tracked: false,
          },
        ],
    },
      
      drakewarden: {
        features: [
          {
            id: "draconic_gift",
            name: "Draconic Gift", 
            des: "At 3rd level, the bond you share with your drake creates a connection to dragonkind, granting you understanding and empowering your presence. You gain the following benefits: Thaumaturgy. You learn the Thaumaturgy cantrip, which is a ranger spell for you.Tongue of Dragons. You learn to speak, read, and write Draconic or one other language of your choice.",
            level: 3,
            tracked: false
          },
          {
            id: "drake_companion",
            name: "Drake Companion",
            desc: "At 3rd level, you gain a drake companion. The drake is friendly to you and obeys your commands. It has its own stat block and shares your initiative, acting immediately after your turn. The drake can serve as a mount and has the ability to exhale a 15-foot cone of elemental energy.",
            level: 3,
            tracked: false,
          },
          {
            id: "bond_of_fang_and_scale",
            name: "Bond of Fang and Scale",
            desc: "Starting at 7th level, your drake grows wings, gaining a flying speed of 40 feet if it isn’t wearing heavy armor. Additionally, the drake can now use its reaction to reduce damage dealt to another creature within 5 feet by its proficiency bonus.",
            level: 7,
            tracked: false,
          },
          {
            id: "drake's_breath",
            name: "Drake's Breath",
            desc: "At 11th level, as an action, you can expend a spell slot to have your drake exhale a 30-foot cone of elemental energy. The damage increases with the spell slot level used.",
            level: 11,
            tracked: true, // Uses spell slots
          },
          {
            id: "perfected_bond",
            name: "Perfected Bond",
            desc: "At 15th level, your bond to your drake reaches its peak. The drake gains a bonus to damage rolls equal to your proficiency bonus, and when it uses Drake's Breath, you and your drake both gain resistance to the type of damage it deals for 1 minute.",
            level: 15,
            tracked: false,
          },
        ],
      },
      
      feyWanderer: {
        features: [
          {
            id: "dreadful_strikes",
            name: "Dreadful Strikes",
            desc: "At 3rd level, your attacks carry a psychic resonance. Once per turn, when you hit a creature with a weapon attack, you can deal an additional 1d4 psychic damage. This damage increases at higher levels.",
            level: 3,
            tracked: false,
          },
          {
            id: "otherworldly_glamour",
            name: "Otherworldly Glamour",
            desc: "Starting at 3rd level, you gain proficiency in one Charisma skill of your choice, and you add your Wisdom modifier to Charisma checks.",
            level: 3,
            tracked: false,
          },
          {
            id: "beguiling_twist",
            name: "Beguiling Twist",
            desc: "At 7th level, you gain the ability to twist fey magic. When a creature within 120 feet succeeds on a saving throw against being charmed or frightened, you can use your reaction to force a different creature to make a Wisdom saving throw against your spell save DC or be charmed or frightened for 1 minute.",
            level: 7,
            tracked: false, // Reaction
          },
          {
            id: "fey_reinforcements",
            name: "Fey Reinforcements",
            desc: "At 11th level, the royal courts of the Feywild have blessed you with the assistance of fey beings: you know the spell Summon Fey. It doesn't count against the number of ranger spells you know, and you can cast it without a material component. You can also cast it once without using a spell slot, and you regain the ability to do so when you finish a long rest. Whenever you start casting the spell, you can modify it so that it doesn't require concentration. If you do so, the spell's duration becomes 1 minute for that casting.",
            level: 11,
            tracked: true, // 1/LR
          },
          {
            id: "misty_wanderer",
            name: "Misty Wanderer",
            desc: "When you reach 15th level, you can slip in and out of the Feywild to move in a blink of an eye: you can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest. In addition, whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of you. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space.",
            level: 15,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["charm_person"] },
          { level: 5, spells: ["misty_step"] },
          { level: 9, spells: ["dispel_magic"] },
          { level: 13, spells: ["dimension_door"] },
          { level: 17, spells: ["mislead"]}
        ],
      },
      
      gloomStalker: {
        features: [
          {
            id: "dread_ambusher",
            name: "Dread Ambusher",
            desc: "At 3rd level, you gain the ability to act swiftly in combat. When you take the Attack action on the first turn of combat, you can make one additional weapon attack. Additionally, your walking speed increases by 10 feet, which lasts until the end of your turn.",
            level: 3,
            tracked: false,
          },
          {
            id: "umbral_sight",
            name: "Umbral Sight",
            desc: "You gain darkvision out to 60 feet, or an additional 30 feet if you already have darkvision. You are also invisible to creatures that rely on darkvision to see you in darkness.",
            level: 3,
            tracked: false,
          },
          {
            id: "iron_mind",
            name: "Iron Mind",
            desc: "At 7th level, you gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
            level: 7,
            tracked: false,
          },
          {
            id: "stalker's_flurry",
            name: "Stalker's Flurry",
            desc: "At 11th level, when you miss with a weapon attack, you can make another weapon attack as part of the same action.",
            level: 11,
            tracked: false,
          },
          {
            id: "shadowy_dodge",
            name: "Shadowy Dodge",
            desc: "At 15th level, when a creature you can see attacks you, you can use your reaction to impose disadvantage on the attack roll.",
            level: 15,
            tracked: true, // Reaction
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["disguise_self"] },
          { level: 5, spells: ["rope_trick"] },
          { level: 9, spells: ["fear"] },
          { level: 13, spells: ["greater_invisibility"] },
          { level: 17, spells: ["seeming"] },
        ],
      },
      horizonWalker: {
        features: [
          {
            id: "detect_portals",
            name: "Detect Portals",
            desc: "At 3rd level, you gain the ability to magically sense the presence of a planar portal. As an action, you detect the distance and direction to the closest planar portal within 1 mile. You can use this feature a number of times equal to your Wisdom modifier, regaining all uses after a long rest.",
            level: 3,
            tracked: true, // 1/SR
          },
          {
            id: "planar_warrior",
            name: "Planar Warrior",
            desc: "At 3rd level, you learn to channel your attacks with planar energy. As a bonus action, choose one creature you can see within 30 feet of you. Until the end of this turn, your attacks deal force damage instead of their normal damage type and deal an extra 1d8 force damage. At 11th level, the extra damage increases to 2d8.",
            level: 3,
            tracked: false,
          },
          {
            id: "ethereal_step",
            name: "Ethereal Step",
            desc: "At 7th level, you can step into the Ethereal Plane. As a bonus action, you can cast the *etherealness* spell without expending a spell slot, but the spell ends at the end of your current turn. Once you use this feature, you can't use it again until you finish a short or long rest.",
            level: 7,
            tracked: true, // 1/SR or LR
          },
          {
            id: "distant_strike",
            name: "Distant Strike",
            desc: "At 11th level, when you take the Attack action, you can teleport up to 10 feet before each attack to an unoccupied space you can see. If you attack at least two different creatures with the action, you can make one additional attack against a third creature.",
            level: 11,
            tracked: false,
          },
          {
            id: "spectral_defense",
            name: "Spectral Defense",
            desc: "At 15th level, your ability to move between planes grants you protection. When you take damage from an attack, you can use your reaction to give yourself resistance to all of that attack's damage on this turn.",
            level: 15,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["protection_from_evil_and_good"] },
          { level: 5, spells: ["misty_step"] },
          { level: 9, spells: ["haste"] },
          { level: 13, spells: ["banishment"] },
          { level: 17, spells: ["teleportation_circle"] },
        ],
      },
      
      hunter: {
        features: [
          {
            id: "hunter's_prey",
            name: "Hunter's Prey",
            desc: "At 3rd level, you gain one of the following features of your choice: *Colossus Slayer*, *Giant Killer*, or *Horde Breaker.*",
            level: 3,
            tracked: false,
          },
          {
            id: "defensive_tactics",
            name: "Defensive Tactics",
            desc: "At 7th level, you gain one of the following features of your choice: *Escape the Horde*, *Multiattack Defense*, or *Steel Will.*",
            level: 7,
            tracked: false,
          },
          {
            id: "multiattack",
            name: "Multiattack",
            desc: "At 11th level, you gain one of the following features of your choice: *Volley* or *Whirlwind Attack.*",
            level: 11,
            tracked: false,
          },
          {
            id: "superior_hunter's_defense",
            name: "Superior Hunter's Defense",
            desc: "At 15th level, you gain one of the following features of your choice: *Evasion*, *Stand Against the Tide*, or *Uncanny Dodge.*",
            level: 15,
            tracked: false,
          },
        ],
      },
      
      monsterSlayer: {
        features: [
          {
            id: "hunter's_sense",
            name: "Hunter's Sense",
            desc: "At 3rd level, you gain the ability to peer at a creature and discern its weaknesses. As an action, you can choose one creature you can see within 60 feet of you. You immediately learn whether it has any damage immunities, resistances, or vulnerabilities and what they are. You can use this feature a number of times equal to your Wisdom modifier, regaining all uses after a long rest.",
            level: 3,
            tracked: true, // wis mod/LR
          },
          {
            id: "slayer's_prey",
            name: "Slayer's Prey",
            desc: "Starting at 3rd level, you can designate one creature you can see within 60 feet of you as your prey. The first time each turn that you hit the target with a weapon attack, it takes an extra 1d6 damage. This effect lasts until you finish a short or long rest.",
            level: 3,
            tracked: false,
          },
          {
            id: "supernatural_defense",
            name: "Supernatural Defense",
            desc: "At 7th level, you gain extra resilience against your prey's attacks. You gain a bonus to saving throws and checks against the target of your Slayer's Prey equal to 1d6.",
            level: 7,
            tracked: false,
          },
          {
            id: "magic_user's_nemesis",
            name: "Magic User's Nemesis",
            desc: "At 11th level, you can use your reaction to force a creature within 60 feet of you to make a Wisdom saving throw whenever it casts a spell. On a failed save, the creature’s spell fails and is wasted. Once you use this feature, you can’t use it again until you finish a short or long rest.",
            level: 11,
            tracked: true, // 1/SR or LR
          },
          {
            id: "slayer's_counter",
            name: "Slayer's Counter",
            desc: "At 15th level, if the target of your Slayer's Prey forces you to make a saving throw, you can use your reaction to make one weapon attack against the target. You make this attack immediately before rolling the saving throw. If your attack hits, your save automatically succeeds.",
            level: 15,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["protection_from_evil_and_good"] },
          { level: 5, spells: ["zone_of_truth"] },
          { level: 9, spells: ["magic_circle"] },
          { level: 13, spells: ["banishment"] },
          { level: 17, spells: ["hold_monster"] },
        ],
      },
      
      swarmKeeper: {
        features: [
          {
            id: "gathered_swarms",
            name: "Gathered Swarm",
            desc: "At 3rd level, a swarm of nature spirits assists you in battle. When you hit a creature with an attack, you can cause the swarm to attack them, move them 15 feet, or move yourself 5 feet.",
            level: 3,
            tracked: false,
          },
          {
            id: "writhing_tide",
            name: "Writhing Tide",
            desc: "At 7th level, you can command your swarm to lift you in the air. As a bonus action, you gain a flying speed of 10 feet for 1 minute. Once you use this feature, you can’t use it again until you finish a long rest, unless you expend a spell slot of 3rd level or higher to use it again.",
            level: 7,
            tracked: true, // 1/LR or spell slot
          },
          {
            id: "scuttling_surge",
            name: "Scuttling Surge",
            desc: "At 11th level, your swarm grants you improved mobility. You gain a climbing speed equal to your walking speed and can move through nonmagical terrain as though it were difficult terrain.",
            level: 11,
            tracked: false,
          },
          {
            id: "swarming_disaster",
            name: "Swarming Disaster",
            desc: "At 15th level, your swarm becomes more potent. When you deal damage with your swarm, you can increase the damage by 1d10.",
            level: 15,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["faerie_fire", "mage_hand"] },
          { level: 5, spells: ["web"] },
          { level: 9, spells: ["gaseous_form"] },
          { level: 13, spells: ["arcane_eye"] },
          { level: 17, spells: ["insect_plague"] },
        ],
      },
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
        tracked: false,
      },
      {
        id: "cunning_action",
        name: "Cunning Action",
        desc: "You can take a bonus action on each of your turns to Dash, Disengage, or Hide.",
        level: 2,
        tracked: false,
      },
      {
        id: "uncanny_dodge",
        name: "Uncanny Dodge",
        desc: "When an attacker you can see hits you with an attack, you can use your reaction to halve the attack's damage.",
        level: 5,
        tracked: false,
      },
      {
        id: "evasion",
        name: "Evasion",
        desc: "When subjected to an effect that allows a Dexterity saving throw for half damage, you instead take no damage if you succeed.",
        level: 7,
        tracked: false,
      },
      {
        id: "blindsense",
        name: "Blindsense",
        desc: "If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.",
        level: 14,
        tracked: false,
      },
      {
        id: "slippery_mind",
        name: "Slippery Mind",
        desc: "You gain proficiency in Wisdom saving throws.",
        level: 15,
        tracked: false,
      },
      {
        id: "elusive",
        name: "Elusive",
        desc: "No attack roll has advantage against you while you aren’t incapacitated.",
        level: 18,
        tracked: false,
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
      arcaneTrickster: {
        features: [
          {
            id: "spellcasting",
            name: "Spellcasting",
            desc: "At 3rd level, you gain the ability to cast spells from the wizard spell list. You can cast and prepare spells as described in the Arcane Trickster Spellcasting feature. Intelligence is your spellcasting ability for these spells.",
            level: 3,
            tracked: false, //do they have their own spellList on the spellsTable? 
          },
          {
            id: "mage_hand_legerdemain",
            name: "Mage Hand Legerdemain",
            desc: "At 3rd level, you can use your Mage Hand to perform additional tasks, including picking locks and disarming traps at range. You can make the hand invisible, and you can use it to perform actions that require Sleight of Hand checks.",
            level: 3,
            tracked: false,
          },
          {
            id: "magical_ambush",
            name: "Magical Ambush",
            desc: "Starting at 9th level, if you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell this turn.",
            level: 9,
            tracked: false,
          },
          {
            id: "versatile_trickster",
            name: "Versatile Trickster",
            desc: "At 13th level, you can use your Mage Hand to distract a target, granting you advantage on attack rolls against it until the end of your turn.",
            level: 13,
            tracked: false,
          },
          {
            id: "spell_thief",
            name: "Spell Thief",
            desc: "At 17th level, when a creature casts a spell targeting you or within 30 feet of you, you can use your reaction to force the creature to make a saving throw against your spell save DC. On a failed save, you negate the spell's effect, and you learn the spell until you cast it or finish a long rest.",
            level: 17,
            tracked: true, // 1/LR
          },
        ],
        subclassSpells: [],
      },

      assassin: {
        features: [
          {
            id: "bonus_proficiencies",
            name: "Bonus Proficiencies",
            desc: "At 3rd level, you gain proficiency with the Disguise Kit and the Poisoner’s Kit.",
            level: 3,
            tracked: false,
          },
          {
            id: "assassinate",
            name: "Assassinate",
            desc: "Starting at 3rd level, you have advantage on attack rolls against any creature that hasn’t taken a turn in combat yet. In addition, any hit you score against a surprised creature is a critical hit.",
            level: 3,
            tracked: false,
          },
          {
            id: "infiltration_expertise",
            name: "Infiltration Expertise",
            desc: "At 9th level, you gain the ability to create false identities. This includes crafting physical documents and creating believable backstories.",
            level: 9,
            tracked: false,
          },
          {
            id: "impostor",
            name: "Impostor",
            desc: "At 13th level, you can unerringly mimic another person's speech, writing, and behavior after observing them for at least 3 hours. Your ruse lasts until you deliberately end it or your behavior is called into question.",
            level: 13,
            tracked: false,
          },
          {
            id: "death_strike",
            name: "Death Strike",
            desc: "Starting at 17th level, you can double the damage of an attack if you surprise the target and they fail a Constitution saving throw against your DC.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      inquisitive: {
        features: [
          {
            id: "ear_for_deceit",
            name: "Ear for Deceit",
            desc: "Starting at 3rd level, whenever you make an Insight check to determine whether a creature is lying, treat a roll of 7 or lower on the d20 as an 8.",
            level: 3,
            tracked: false,
          },
          {
            id: "eye_for_detail",
            name: "Eye for Detail",
            desc: "At 3rd level, you can use a bonus action to make a Perception check to spot a hidden creature or object, or an Investigation check to uncover or decipher clues.",
            level: 3,
            tracked: false,
          },
          {
            id: "insightful_fighting",
            name: "Insightful Fighting",
            desc: "At 3rd level, as a bonus action, you can target a creature you can see within 30 feet and make an Insight check contested by its Deception check. On a success, you can use Sneak Attack against it even if you don’t have advantage, for up to 1 minute or until you use this feature on a different target.",
            level: 3,
            tracked: false,
          },
          {
            id: "steady_eye",
            name: "Steady Eye",
            desc: "Starting at 9th level, you have advantage on Perception and Investigation checks if you move no more than half your speed on the same turn.",
            level: 9,
            tracked: false,
          },
          {
            id: "unerring_eye",
            name: "Unerring Eye",
            desc: "At 13th level, as an action, you can sense the presence of illusions, shapechangers, or other forms of magic designed to deceive within 30 feet. You can use this feature a number of times equal to your Wisdom modifier, regaining all uses after a long rest.",
            level: 13,
            tracked: true, // Wis mod/LR
          },
          {
            id: "eye_for_weakness",
            name: "Eye for Weakness",
            desc: "At 17th level, you can deal an extra 3d6 damage to your Sneak Attack when using Insightful Fighting against a target.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      mastermind: {
        features: [
          {
            id: "master_of_intrigue",
            name: "Master of Intrigue",
            desc: "Starting at 3rd level, you gain proficiency in the Disguise Kit, forgery kit, and two gaming sets. You can mimic speech and accents you have heard for at least 1 minute.",
            level: 3,
            tracked: false,
          },
          {
            id: "master_of_tactics",
            name: "Master of Tactics",
            desc: "At 3rd level, you can use the Help action as a bonus action. When you use the Help action to aid an ally in attacking a creature, the target of that attack can be within 30 feet of you, rather than 5 feet, if the target can see or hear you.",
            level: 3,
            tracked: false,
          },
          {
            id: "insightful_manipulator",
            name: "Insightful Manipulator",
            desc: "At 9th level, if you spend at least 1 minute observing or conversing with another creature, you can learn certain information about its capabilities, including Intelligence, Wisdom, Charisma scores, or class levels, compared to your own.",
            level: 9,
            tracked: false,
          },
          {
            id: "misdirection",
            name: "Misdirection",
            desc: "Starting at 13th level, you can use your reaction to redirect an attack targeting you to another creature within 5 feet of you, provided the attack roll would hit the other creature.",
            level: 13,
            tracked: false,
          },
          {
            id: "soul_of_deceit",
            name: "Soul of Deceit",
            desc: "At 17th level, your thoughts can't be read unless you allow it, and you can present false thoughts. You are immune to being charmed, and magic that would determine if you're telling the truth indicates you are being truthful.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      phantom: {
        features: [
          {
            id: "whispers_of_the_dead",
            name: "Whispers of the Dead",
            desc: "At 3rd level, when you finish a short or long rest, you can choose one skill or tool proficiency that you lack and gain it as a ghostly presence shares its knowledge with you. This proficiency lasts until you choose this feature again.",
            level: 3,
            tracked: false,
          },
          {
            id: "wails_from_the_grave",
            name: "Wails from the Grave",
            desc: "At 3rd level, immediately after you deal Sneak Attack damage to a creature on your turn, you can target a second creature within 30 feet of the first. It takes half the number of Sneak Attack dice in necrotic damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true, // Uses = PB/LR
          },
          {
            id: "tokens_of_the_departed",
            name: "Tokens of the Departed",
            desc: "At 9th level, when a creature dies within 30 feet of you, you can create a Soul Trinket. You can use these trinkets to gain advantages like adding a d6 to ability checks or saving throws, or asking the trinket's spirit a question. You can have a number of trinkets equal to your proficiency bonus.",
            level: 9,
            tracked: true, // Uses = PB  **Maybe not reset on a LR?**
          },
          {
            id: "ghost_walk",
            name: "Ghost Walk",
            desc: "At 13th level, as a bonus action, you can assume a spectral form for 10 minutes. While in this form, you gain a flying speed of 10 feet, can move through objects, and have resistance to all damage except force damage. You can use this feature once per long rest unless you expend a Soul Trinket to use it again.",
            level: 13,
            tracked: true, // 1/LR or expend trinket
          },
          {
            id: "death's_friend",
            name: "Death's Friend",
            desc: "At 17th level, your association with death has become so close that you gain the following benefits: When you use your Wails from the Grave, you can now deal the necrotic damage to both the first and the second creature. At the end of a long rest, a soul trinket appears in your hand if you don't have any soul trinkets, as the spirits of the dead are drawn to you.",
            level: 17,
            tracked: true, // Expend trinket
          },
        ],
        subclassSpells: [],
      },
      
      scout: {
        features: [
          {
            id: "skirmisher",
            name: "Skirmisher",
            desc: "At 3rd level, you can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you, without provoking opportunity attacks.",
            level: 3,
            tracked: false,
          },
          {
            id: "survivalist",
            name: "Survivalist",
            desc: "At 3rd level, you gain expertise in the Nature and Survival skills, if you are proficient in them.",
            level: 3,
            tracked: false,
          },
          {
            id: "superior_mobility",
            name: "Superior Mobility",
            desc: "Starting at 9th level, your walking speed increases by 10 feet. If you have a climbing or swimming speed, it increases by 10 feet as well.",
            level: 9,
            tracked: false,
          },
          {
            id: "ambush_master",
            name: "Ambush Master",
            desc: "At 13th level, you excel in leading ambushes. You have advantage on initiative rolls. In addition, the first creature you hit during the first round of combat has disadvantage on attack rolls against targets other than you until the start of your next turn.",
            level: 13,
            tracked: false,
          },
          {
            id: "sudden_strike",
            name: "Sudden Strike",
            desc: "At 17th level, if you take the Attack action, you can make one additional weapon attack as a bonus action. This attack can benefit from your Sneak Attack, even if you've already used it this turn.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },
      
      soulknife: {
        features: [
          {
            id: "psionic_power",
            name: "Psionic Power",
            desc: "At 3rd level, you gain a pool of Psionic Energy dice (d6). You have a number of dice equal to twice your proficiency bonus. You can use these dice for various Psionic Power features, such as Psi-Bolstered Knack and Psychic Whispers.",
            level: 3,
            tracked: true, // Uses = PB x 2
          },
          {
            id: "psychic_blades",
            name: "Psychic Blades",
            desc: "At 3rd level, you can manifest blades of psychic energy. When you take the Attack action, you can use a Psychic Blade, dealing 1d6 psychic damage instead of your weapon's normal damage. If you have another blade in your other hand, it deals 1d4 damage.",
            level: 3,
            tracked: false,
          },
          {
            id: "soul_blades",
            name: "Soul Blades",
            desc: "At 9th level, your Psychic Blades improve. You can expend a Psionic Energy die to reroll an attack roll or to deal additional damage equal to the die rolled when you hit.",
            level: 9,
            tracked: false,
          },
          {
            id: "psychic_veil",
            name: "Psychic Veil",
            desc: "At 13th level, you can become invisible as an action for 1 hour or until you make an attack or force a creature to make a saving throw. You can use this feature once per long rest unless you expend a Psionic Energy die to use it again.",
            level: 13,
            tracked: true, // 1/LR or expend Psionic Energy die
          },
          {
            id: "rend_mind",
            name: "Rend Mind",
            desc: "At 17th level, when you hit a creature with your Psychic Blades, you can force it to make a Wisdom saving throw or be stunned until the end of your next turn. You can use this feature once per long rest unless you expend Psionic Energy dice to use it again.",
            level: 17,
            tracked: true, // 1/LR or expend Psionic Energy dice
          },
        ],
        subclassSpells: [],
      },
      
      swashbuckler: {
        features: [
          {
            id: "fancy_footwork",
            name: "Fancy Footwork",
            desc: "At 3rd level, during your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.",
            level: 3,
            tracked: false,
          },
          {
            id: "rakish_audacity",
            name: "Rakish Audacity",
            desc: "At 3rd level, you add your Charisma modifier to your initiative rolls. Additionally, you can use Sneak Attack without advantage if no other creatures are within 5 feet of your target.",
            level: 3,
            tracked: false,
          },
          {
            id: "panache",
            name: "Panache",
            desc: "At 9th level, you can make a Charisma (Persuasion) check contested by a creature's Insight. If you succeed, the creature is charmed by you or has disadvantage on attack rolls against targets other than you for 1 minute.",
            level: 9,
            tracked: false,
          },
          {
            id: "elegant_maneuver",
            name: "Elegant Maneuver",
            desc: "Starting at 13th level, you can use a bonus action to gain advantage on your next Acrobatics or Athletics check during the same turn.",
            level: 13,
            tracked: false,
          },
          {
            id: "master_duelist",
            name: "Master Duelist",
            desc: "At 17th level, if you miss with an attack, you can roll the attack again with advantage. You can use this feature once per short or long rest.",
            level: 17,
            tracked: true, // 1/SR
          },
        ],
        subclassSpells: [],
      },
      
      thief: {
        features: [
          {
            id: "fast_hands",
            name: "Fast Hands",
            desc: "Starting at 3rd level, you can use the Use an Object action as a bonus action. Additionally, you can use your thieves' tools to disarm traps or open locks as a bonus action.",
            level: 3,
            tracked: false,
          },
          {
            id: "second_story_work",
            name: "Second-Story Work",
            desc: "At 3rd level, climbing no longer costs you extra movement. Additionally, you can make running jumps farther than normal, adding your Dexterity modifier to the distance covered.",
            level: 3,
            tracked: false,
          },
          {
            id: "supreme_sneak",
            name: "Supreme Sneak",
            desc: "At 9th level, you have advantage on Stealth checks if you move no more than half your speed on the same turn.",
            level: 9,
            tracked: false,
          },
          {
            id: "use_magic_device",
            name: "Use Magic Device",
            desc: "At 13th level, you can ignore all class, race, and level requirements on the use of magical items.",
            level: 13,
            tracked: false,
          },
          {
            id: "thief's_reflexes",
            name: "Thief's Reflexes",
            desc: "At 17th level, you can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },
      

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
        tracked: false, // Comment: Refer to chart for sorcery points
      },
      {
        id: "metamagic",
        name: "Metamagic",
        desc: "You gain the ability to twist spells to suit your needs.",
        level: 3,
        tracked: false, // Maybe part of Char Creation user an choose metamagic if higher than lvl 3 (gain 1 more at 10 and 17 too)
      },
      {
        id: "sorcerous_restoration",
        name: "Sorcerous Restoration",
        desc: "You regain 4 expended sorcery points whenever you finish a short rest.",
        level: 20,
        tracked: false,
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
        tracked: false, //Should be part of Char Creation after lvl 2, and levelups. Refer to chart for number of invocations
      },
      {
        id: "pact_boon",
        name: "Pact Boon",
        desc: "At 3rd level, you gain a pact boon feature of your choice.",
        level: 3,
        tracked: false,
      },
      {
        id: "mystic_arcanum",
        name: "Mystic Arcanum",
        desc: "At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum. You can cast it once without expending a spell slot.",
        level: 11,
        tracked: false, // **NEEDS Spelllist to account for this--might already be in spellTable page?**
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
        tracked: false,
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
