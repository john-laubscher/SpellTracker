import {
  WARLOCK_ELDRITCH_INVOCATIONS,
  WARLOCK_PACT_BOONS,
} from "./warlockOptionsData";
import { getGenieExpandedSpellOptions } from "../utils/genieData";

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
        usesByLevel: [
          { level: 1, uses: 2 },
          { level: 3, uses: 3 },
          { level: 6, uses: 4 },
          { level: 12, uses: 5 },
          { level: 17, uses: 6 },
          { level: 20, uses: "unlimited" },
        ],
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
        tracked: false,
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
        trackedMode: "stackingChecks",
        maxChecks: 10,
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
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
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
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "infectious_fury",
            name: "Infectious Fury",
            desc: "When you hit a creature with your natural weapons while raging, it must succeed on a Wisdom saving throw or suffer one of the following effects (your choice): 2d12 psychic damage, or must use its reaction to attack another creature you designate. This ability can be used a number of times equal to your proficiency bonus per long rest.",
            level: 10,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "call_the_hunt",
            name: "Call the Hunt",
            desc: "When you enter your rage, you can choose up to 10 creatures within 30 feet. Each creature gains a bonus to attack rolls and saving throws equal to your proficiency bonus for 1 minute. You gain temporary hit points equal to 5 times the number of creatures you chose. Once used, you can't use this feature again until you finish a long rest.",
            level: 14,
            tracked: true,
            uses: "pb",
            recharge: "lr",
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
            tracked: false,
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
      giant: {
        features: [
          {
            id: "giants_power",
            name: "GiantÃ¢â‚¬â„¢s Power",
            desc: "When you choose this path, you learn to speak, read, and write Giant or one other language of your choice if you already know Giant. Additionally, you learn a cantrip of your choice: either druidcraft or thaumaturgy. Wisdom is your spellcasting ability for this spell.",
            level: 3,
            tracked: false,
          },
          {
            id: "giants_havoc",
            name: "GiantÃ¢â‚¬â„¢s Havoc",
            desc: "Your rages pull strength from the primal might of giants, transforming you into a hulking force of destruction. While raging, you gain the following benefits:\n\nCrushing Throw. When you make a successful ranged attack with a thrown weapon using Strength, you can add your Rage Damage bonus to the attackÃ¢â‚¬â„¢s damage roll.\n\nGiant Stature. Your reach increases by 5 feet, and if you are smaller than Large, you become Large, along with anything you are wearing. If there isnÃ¢â‚¬â„¢t enough room for you to increase your size, your size doesnÃ¢â‚¬â„¢t change.",
            level: 3,
            tracked: false,
          },
          {
            id: "elemental_cleaver",
            name: "Elemental Cleaver",
            desc: "You infuse your weapons with elemental power while raging, changing damage type and empowering thrown weapon attacks.",
            level: 6,
            tracked: false,
          },
          {
            id: "mighty_impel",
            name: "Mighty Impel",
            desc: "You can move creatures and objects with the force of your giant power while raging, including throwing or repositioning them.",
            level: 10,
            tracked: false,
          },
          {
            id: "demiurgic_colossus",
            name: "Demiurgic Colossus",
            desc: "Your giant power peaks, granting a major size-and-power boost while raging and empowering your attacks.",
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
            name: "Wild Surge",
            desc: "Starting when you choose this path at 3rd level, your innate magic erupts in unpredictable ways. Whenever you rage, roll on the Wild Magic table to determine the magical effect produced.",
            level: 3,
            tracked: false,
          },
          {
            id: "magic_awareness",
            name: "Magic Awareness",
            desc: "As an action, you can open your awareness to the presence of concentrated magic. Until the end of your next turn, you know the location of any spell or magic item within 60 feet of you that isnÃ¢â‚¬â„¢t behind total cover. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 3,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "bolstering_magic",
            name: "Bolstering Magic",
            desc: "At 6th level, you can harness your wild magic to bolster yourself or a companion. As an action, you touch a creature and roll a d3. The creature gains one of the following effects: (1) Add the rolled number to any attack roll or ability check made in the next minute, or (2) Regain a spell slot equal to the rolled number. You can use this action a number of times equal to your proficiency bonus, and you regain all uses after a long rest.",
            level: 6,
            tracked: true,
            uses: "pb",
            recharge: "lr",
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
            tracked: true,
            uses: 1,
            recharge: "rage",
          },
          {
            id: "zealous_presence",
            name: "Zealous Presence",
            desc: "At 10th level, you can channel divine power to inspire zealotry in your allies. As a bonus action, you unleash a battle cry infused with divine energy. Up to ten creatures of your choice within 60 feet that can hear you gain advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 10,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
        desc: [
          "You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.",
          "Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.",
          "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.",
          "Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.",
        ],
        level: 1,
        tracked: true,
        uses: "cha_mod",
        recharge: "lr",
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
        desc: "Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.",
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
            desc: [
              "When you join the College of Creation at 3rd level, whenever you give a creature a Bardic Inspiration die, you can utter a note from the Song of Creation to create a Tiny mote of potential, which orbits within 5 feet of that creature. The mote is intangible and invulnerable, and it lasts until the Bardic Inspiration die is lost. The mote looks like a musical note, a star, a flower, or another symbol of art or life that you choose.",
              "When the creature uses the Bardic Inspiration die, the mote provides an additional effect based on whether the die benefits an ability check, an attack roll, or a saving throw, as detailed below:",
              "Ability Check. When the creature rolls the Bardic Inspiration die to add it to an ability check, the creature can roll the Bardic Inspiration die again and choose which roll to use, as the mote pops and emits colorful, harmless sparks for a moment.",
              "Attack Roll. Immediately after the creature rolls the Bardic Inspiration die to add it to an attack roll against a target, the mote thunderously shatters. The target and each creature of your choice that you can see within 5 feet of it must succeed on a Constitution saving throw against your spell save DC or take thunder damage equal to the number rolled on the Bardic Inspiration die.",
              "Saving Throw. Immediately after the creature rolls the Bardic Inspiration die and adds it to a saving throw, the mote vanishes with the sound of soft music, causing the creature to gain temporary hit points equal to the number rolled on the Bardic Inspiration die plus your Charisma modifier (minimum of 1 temporary hit point).",
            ],
            level: 3,
            tracked: false,
          },
                    {
            id: "performance_of_creation",
            name: "Performance of Creation",
            desc: [
              "Also at 3rd level, as an action, you can channel the magic of the Song of Creation to create one nonmagical item of your choice in an unoccupied space within 10 feet of you. The item must appear on a surface or in a liquid that can support it. The gp value of the item can't be more than 20 times your bard level, and the item must be Medium or smaller. The item glimmers softly, and a creature can faintly hear music when touching it. The created item disappears after a number of hours equal to your proficiency bonus. For examples of items you can create, see the equipment chapter of the Player's Handbook.",
              "Once you create an item with this feature, you can't do so again until you finish a long rest, unless you expend a spell slot of 2nd level or higher to use this feature again. You can have only one item created by this feature at a time; if you use this action and already have an item from this feature, the first one immediately vanishes.",
              "The size of the item you can create with this feature increases by one size category when you reach 6th level (Large) and 14th level (Huge).",
            ],
            level: 3,
            tracked: true,
            recharge: "lr",
            usesByLevel: [
              { level: 3, uses: 1 },
              { level: 14, uses: "cha_mod", minUses: 2 },
            ],
          },
                    {
            id: "animating_performance",
            name: "Animating Performance",
            desc: [
              "By 6th level, as an action, you can animate one Large or smaller nonmagical item within 30 feet of you that isnâ€™t being worn or carried. The animate item uses the Dancing Item stat block, which uses your proficiency bonus (PB), The item is friendly to you and your companions and obeys your commands. It lives for 1 hour, until it is reduced to 0 hit points, or until you die.",
              "In combat, the item shares your initiative count, but it takes its turn immediately after yours. It can move and use its reaction on its own, but the only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. That action can be one in its stat block or some other action. If you are incapacitated, the item can take any action of its choice, not just Dodge.",
              "When you use your Bardic Inspiration feature, you can command the item as part of the same bonus action you use for Bardic Inspiration.",
              "Once you animate an item with this feature, you can't do so again until you finish a long rest, unless you expend a spell slot of 3rd level or higher to use this feature again. You can have only one item animated by this feature at a time; if you use this action and already have a dancing item from this feature, the first one immediately becomes inanimate.",
            ],
            level: 6,
            tracked: true,
            recharge: "lr",
            uses: 1,
          },
                    {
            id: "creative_crescendo",
            name: "Creative Crescendo",
            desc: [
              "At 14th level, when you use your Performance of Creation feature, you can create more than one item at once. The number of items equals your Charisma modifier (minimum of two items). If you create an item that would exceed that number, you choose which of the previously created items disappears. Only one of these items can be of the maximum size you can create; the rest must be Small or Tiny.",
              "You are no longer limited by gp value when creating items with Performance of Creation.",
            ],
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
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            desc: "At 6th level, you learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but donÃ¢â‚¬â„¢t count against the number of bard spells you know.",
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
            desc: "At 3rd level, you gain the ability to reach out to spirits and guide others. You learn the Guidance cantrip, which doesnÃ¢â‚¬â„¢t count against the number of bard cantrips you know. Its range becomes 60 feet when you cast it.",
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
            desc: "At 3rd level, you learn to weave spiritsÃ¢â‚¬â„¢ tales into your magic. As a bonus action, you can expend one use of Bardic Inspiration to roll on the Tales from Beyond table, using your Bardic Inspiration die to determine the result. You retain the tale in mind until you bestow its effects or finish a short or long rest. You can use this feature a number of times equal to your proficiency bonus per long rest.",
            level: 3,
            tracked: false,
          },
          {
            id: "spirit_session",
            name: "Spirit Session",
            desc: "At 6th level, you can conduct an hour-long ritual channeling spirits to gain supernatural knowledge. With at least one other creature, you perform the ritual using your Spiritual Focus. At the end of the ritual, you temporarily learn one spell of your choice from any class. The spell you choose must be of a level you can cast, and it must be from the school of Divination or Necromancy. The chosen spell counts as a bard spell for you but doesn't count against the number of bard spells you know. Once you perform the ritual, you can't do so again until you finish a long rest.",
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
            desc: "At 3rd level, you learn to infuse innocent-seeming words with an insidious magic that can inspire terror. If you speak to a humanoid alone for at least 1 minute, you can attempt to seed paranoia in its mind. At the end of the conversation, the target must succeed on a Wisdom saving throw against your spell save DC or be frightened of you or another creature of your choice for 1 hour. If the target succeeds, it has no hint that you tried to frighten it. The target must have an Intelligence of 4 or higher. Once you use this feature, you canÃ¢â‚¬â„¢t use it again until you finish a short or long rest.",
            level: 3,
            tracked: true, // 1/ SR
          },
          {
            id: "mantle_of_whispers",
            name: "Mantle of Whispers",
            desc: "At 6th level, you gain the ability to adopt a humanoidÃ¢â‚¬â„¢s persona. When a humanoid dies within 30 feet of you, you can magically capture its shadow using your reaction. You retain this shadow until you use it or you finish a long rest. You can use the shadow as an action. When you do so, it vanishes, magically transforming into a disguise that appears on you. You now look like the dead person but healthy and alive. This disguise lasts for 1 hour or until you end it as a bonus action. While youÃ¢â‚¬â„¢re in the disguise, you gain access to all information that the humanoid would freely share with a casual acquaintance. Information is enough to pass as the person by drawing on its memories. Another creature can see through this disguise by succeeding on a Wisdom (Insight) check contested by your Charisma (Deception) check. Once you capture a shadow, you canÃ¢â‚¬â„¢t capture another until you finish a short or long rest.",
            level: 6,
            tracked: true, // 1/ SR
          },
          {
            id: "shadow_lore",
            name: "Shadow Lore",
            desc: "At 14th level, you gain the ability to weave dark magic into your words and tap into a creatureÃ¢â‚¬â„¢s deepest fears. As an action, you magically whisper a phrase that only one creature of your choice within 30 feet of you can hear. The target must make a Wisdom saving throw against your spell save DC. It automatically succeeds if it doesnÃ¢â‚¬â„¢t share a language with you or if it canÃ¢â‚¬â„¢t hear you. On a failed save, the target is charmed by you for the next 8 hours or until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. While charmed in this way, the creature obeys your commands for fear that you will reveal its darkest secrets. It wonÃ¢â‚¬â„¢t risk its life for you or fight for you unless it was already inclined to do so. Once you use this feature, you canÃ¢â‚¬â„¢t use it again until you finish a long rest.",
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
        desc: "At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects. You start with Turn Undead and an effect determined by your domain. When you use Channel Divinity, you choose which effect to create. You regain expended uses when you finish a short or long rest. If a Channel Divinity option requires a saving throw, the DC equals your cleric spell save DC.",
        level: 2,
        tracked: true,
        usesByLevel: [
          { level: 2, uses: 1 },
          { level: 6, uses: 2 },
          { level: 18, uses: 3 },
        ],
      },
      {
        id: "channel_divinity_turn_undead",
        name: "Channel Divinity: Turn Undead",
        desc: "As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet must make a Wisdom saving throw. On a failed save, it is turned for 1 minute or until it takes damage. A turned creature tries to move away from you and is limited in the actions it can take while turned.",
        level: 2,
        tracked: false,
        uses: 0, // Uses come from your Channel Divinity pool.
      },
      {
        id: "destroy_undead",
        name: "Destroy Undead",
        desc: "Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, it is instantly destroyed if its challenge rating is at or below a certain threshold based on your cleric level.",
        level: 5,
        tracked: false,
        uses: 0,
      },
      {
        id: "divine_intervention",
        name: "Divine Intervention",
        desc: "Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great. As an action, you describe the assistance you seek and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes (the DM determines the nature of the intervention). If your deity intervenes, you can't use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest. At 20th level, your call succeeds automatically.",
        level: 10,
        tracked: true,
        trackedMode: "divineInterventionCooldown",
        uses: 0,
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
      death: {
        features: [
          {
            id: "reaper",
            name: "Reaper",
            desc: "At 1st level, you learn one necromancy cantrip of your choice from any spell list. When you cast a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_touch_of_death",
            name: "Channel Divinity: Touch of Death",
            desc: "Starting at 2nd level, you can use Channel Divinity to destroy another creature's life force by touch. When you hit a creature with a melee attack, you can use Channel Divinity to deal extra necrotic damage to the target. The damage equals 5 + twice your cleric level.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "inescapable_destruction",
            name: "Inescapable Destruction",
            desc: "Starting at 6th level, your ability to channel negative energy becomes more potent. Necrotic damage dealt by your cleric spells and Channel Divinity options ignores resistance to necrotic damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with necrotic energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 necrotic damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "improved_reaper",
            name: "Improved Reaper",
            desc: "Starting at 17th level, when you cast a necromancy spell of 1st through 5th level that targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other. If the spell consumes its material components, you must provide them for each target.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["false-life", "ray-of-sickness"] },
          { level: 3, spells: ["blindness-deafness", "ray-of-enfeeblement"] },
          { level: 5, spells: ["animate-dead", "vampiric-touch"] },
          { level: 7, spells: ["blight", "death-ward"] },
          { level: 9, spells: ["antilife-shell", "cloudkill"] },
        ],
      },
      forge: {
        features: [
          {
            id: "blessing_of_the_forge",
            name: "Blessing of the Forge",
            desc: "At 1st level, you gain the ability to imbue magic into a weapon or armor. At the end of a long rest, you can touch one nonmagical object that is a suit of armor or a simple or martial weapon. Until the end of your next long rest or until you die, the object becomes a magic item, granting a +1 bonus to AC if it's armor or a +1 bonus to attack and damage rolls if it's a weapon. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 1,
            tracked: true,
            recharge: "longRest",
            uses: 1,
          },
          {
            id: "channel_divinity_artisans_blessing",
            name: "Channel Divinity: Artisan's Blessing",
            desc: "Starting at 2nd level, you can use your Channel Divinity to create simple items. You conduct an hour-long ritual that crafts a nonmagical item that must include some metal: a simple or martial weapon, a suit of armor, ten pieces of ammunition, a set of tools, or another metal object. The creation is completed at the end of the hour, coalescing in an unoccupied space of your choice on a surface within 5 feet of you. The item must be worth no more than 100 gp. As part of this ritual, you must lay out metal, which can include coins, with a value equal to the creation. The metal irretrievably coalesces and transforms into the creation at the ritual's end. The ritual can create a duplicate of a nonmagical item that contains metal, such as a key, if you possess the original during the ritual.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "soul_of_the_forge",
            name: "Soul of the Forge",
            desc: "Starting at 6th level, your mastery of the forge grants you special abilities. While wearing heavy armor, you gain a +1 bonus to AC, and you have resistance to fire damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "divine_strike",
            name: "Divine Strike",
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with the fire of the forge. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire damage to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "saint_of_forge_and_fire",
            name: "Saint of Forge and Fire",
            desc: "At 17th level, your blessed affinity with fire and metal becomes more powerful. You gain immunity to fire damage. While wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["identify", "searing-smite"] },
          { level: 3, spells: ["heat-metal", "magic-weapon"] },
          { level: 5, spells: ["elemental-weapon", "protection-from-energy"] },
          { level: 7, spells: ["fabricate", "wall-of-fire"] },
          { level: 9, spells: ["animate-objects", "creation"] },
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
            desc: "At 1st level, you gain the ability to occasionally sense the presence of the undead, whose existence is an insult to the natural cycle of life. As an action, you can open your awareness to magically detect undead. Until the end of your next turn, you know the location of any undead within 60 feet of you that isn't behind total cover and that isn't protected from divination magic. This sense doesn't tell you anything about a creature's capabilities or identity. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // Per long rest
            uses: "wis_mod",
            recharge: "lr",
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
            desc: "At 6th level, you gain the ability to impede deathâ€™s progress. As a reaction when you or an ally that you can see within 30 feet of you suffers a critical hit, you can turn that attack into a normal hit. Any effects triggered by a critical hit are canceled. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true, // Per long rest
            uses: "wis_mod",
            recharge: "lr",
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
            desc: "At 17th level, you can seize a trace of vitality from a parting soul and use it to heal the living. When an enemy you can see dies within 30 feet of you, you or one ally of your choice that is within 30 feet of you regains hit points equal to the enemyâ€™s number of Hit Dice. You can use this feature only if you aren't incapacitated. Once you use it, you can't do so again until the start of your next turn.",
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
            desc: [
              "Starting at 17th level, you can call up visions of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy glimpses of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell. Once you use this feature, you can't use it again until you finish a short or long rest.",
              "Object Reading. Holding an object as you meditate, you can see visions of the object's previous owner. After meditating for 1 minute, you learn how the owner acquired and lost the object, as well as the most recent significant event involving the object and that owner. If the object was owned by another creature in the recent past (within a number of days equal to your Wisdom score), you can spend 1 additional minute for each owner to learn the same information about that creature.",
              "Area Reading. As you meditate, you see visions of recent events in your immediate vicinity (a room, street, tunnel, clearing, or the like, up to a 50-foot cube), going back a number of days equal to your Wisdom score. For each minute you meditate, you learn about one significant event, beginning with the most recent. Significant events typically involve powerful emotions, such as battles and betrayals, marriages and murders, births and funerals.",
              "However, they might also include more mundane events that are nevertheless important in your current situation.",
            ],
            level: 17,
            tracked: true, // 1/SR or LR
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["command", "identify"] },
          { level: 3, spells: ["augury", "suggestion"] },
          { level: 5, spells: ["nondetection", "speak-with-dead"] },
          { level: 7, spells: ["arcane-eye", "confusion"] },
          { level: 9, spells: ["legend-lore", "scrying"] },
        ],
      },
      life: {
        features: [
          {
            id: "disciple_of_life",
            name: "Disciple of Life",
            desc: "Starting at 1st level, your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell's level.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_preserve_life",
            name: "Channel Divinity: Preserve Life",
            desc: "Starting at 2nd level, you can use your Channel Divinity to heal the badly injured. As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum. You can't use this feature on an undead or a construct.",
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
          { level: 1, spells: ["bless", "cure-wounds"] },
          { level: 3, spells: ["lesser-restoration", "spiritual-weapon"] },
          { level: 5, spells: ["beacon-of-hope", "revivify"] },
          { level: 7, spells: ["death-ward", "guardian-of-faith"] },
          { level: 9, spells: ["mass-cure-wounds", "raise-dead"] },
        ],
      },
      light: {
        features: [
          {
            id: "bonus_cantrip",
            name: "Bonus Cantrip",
            desc: "When you choose this domain at 1st level, you gain the Light cantrip if you don't already know it. This cantrip doesn't count against the number of cleric cantrips you know.",
            level: 1,
            tracked: false,
          },
          {
            id: "warding_flare",
            name: "Warding Flare",
            desc: "Also at 1st level, you can interpose divine light between yourself and an attacking enemy. When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. An attacker that can't be blinded is immune to this feature. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // Uses per Long Rest
            uses: "wis_mod",
            recharge: "lr",
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
            desc: "Starting at 6th level, you can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you.",
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
          { level: 1, spells: ["burning-hands", "faerie-fire"] },
          { level: 3, spells: ["flaming-sphere", "scorching-ray"] },
          { level: 5, spells: ["daylight", "fireball"] },
          { level: 7, spells: ["guardian-of-faith", "wall-of-fire"] },
          { level: 9, spells: ["flame-strike", "scrying"] },
        ],
      },
      nature: {
        features: [
          {
            id: "acolyte_of_nature",
            name: "Acolyte of Nature",
            desc: "At 1st level, you learn one cantrip of your choice from the druid spell list. This cantrip counts as a cleric cantrip for you, but it doesnâ€™t count against the number of cleric cantrips you know.",
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
            desc: "At 8th level, you gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice) to the target. When you reach 14th level, the extra damage increases to 2d8.",
            level: 8,
            tracked: false,
          },
          {
            id: "master_of_nature",
            name: "Master of Nature",
            desc: "At 17th level, you gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["animal-friendship", "speak-with-animals"] },
          { level: 3, spells: ["barkskin", "spike-growth"] },
          { level: 5, spells: ["plant-growth", "wind-wall"] },
          { level: 7, spells: ["dominate-beast", "grasping-vine"] },
          { level: 9, spells: ["insect-plague", "tree-stride"] },
        ],
      },
      order: {
        features: [
          {
            id: "voice_of_authority",
            name: "Voice of Authority",
            desc: "Starting at 1st level, when you cast a 1st-level-or-higher spell using a spell slot and it targets an ally, you can let one affected ally use its reaction immediately after the spell to make one weapon attack against a creature you can see. If the spell targets more than one ally, you choose which ally makes the attack.",
            level: 1,
            tracked: false,
          },
          {
            id: "channel_divinity_order_demand",
            name: "Channel Divinity: Order's Demand",
            desc: "Starting at 2nd level, you can use your Channel Divinity to project an intimidating presence. As an action, present your holy symbol; each creature of your choice within 30 feet that can see or hear you must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn (or until it takes damage). On a failed save, you can also cause it to drop what it is holding.",
            level: 2,
            tracked: false, // Channel Divinity use
          },
          {
            id: "embodiment_of_law",
            name: "Embodiment of the Law",
            desc: "At 6th level, when you cast a 1st-level-or-higher enchantment spell using a spell slot, you can change its casting time to 1 bonus action for that casting (as long as its normal casting time is 1 action). You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
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
            desc: "Starting at 17th level, when you deal your Divine Strike damage to a creature on your turn, you can curse it until the start of your next turn. The next time one of your allies hits the cursed creature with an attack, the target takes an extra 2d8 psychic damage and the curse ends (once per turn).",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["command", "heroism"] },
          { level: 3, spells: ["hold-person", "zone-of-truth"] },
          { level: 5, spells: ["mass-healing-word", "slow"] },
          { level: 7, spells: ["compulsion", "locate-creature"] },
          { level: 9, spells: ["commune", "dominate-person"] },
        ],
      },
      peace: {
        features: [
          {
            id: "emboldening_bond",
            name: "Emboldening Bond",
            desc: "Starting at 1st level, you can forge an empowering bond among people who are at peace with one another. As an action, choose a number of willing creatures within 30 feet of you (this can include yourself) equal to your proficiency bonus. You create a magical bond among them for 10 minutes or until you use this feature again. While any bonded creature is within 30 feet of another, the creature can roll a d4 and add it to an attack roll, an ability check, or a saving throw it makes. Each creature can add the d4 no more than once per turn.\nYou can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true, // prof bonus, regain on LR
            uses: "pb",
            recharge: "lr",
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
          { level: 3, spells: ["aid", "warding-bond"] },
          { level: 5, spells: ["beacon-of-hope", "sending"] },
          { level: 7, spells: ["aura-of-purity", "otilukes-resilient-sphere"] },
          { level: 9, spells: ["greater-restoration", "rarys-telepathic-bond"] },
        ],
      },
      tempest: {
        features: [
          {
            id: "wrath_of_the_storm",
            name: "Wrath of the Storm",
            desc: "Also at 1st level, you can thunderously rebuke attackers. When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one.\nYou can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
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
          { level: 1, spells: ["fog-cloud", "thunderwave"] },
          { level: 3, spells: ["gust-of-wind", "shatter"] },
          { level: 5, spells: ["call-lightning", "sleet-storm"] },
          { level: 7, spells: ["control-water", "ice-storm"] },
          { level: 9, spells: ["destructive-wave", "insect-plague"] },
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
            desc: "Starting at 2nd level, you can use your Channel Divinity to create an illusory duplicate of yourself.\nAs an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration (as if you were concentrating on a spell). The illusion appears in an unoccupied space that you can see within 30 feet of you. As a bonus action on your turn, you can move the illusion up to 30 feet to a space you can see, but it must remain within 120 feet of you.\nFor the duration, you can cast spells as though you were in the illusion's space, but you must use your own senses. Additionally, when both you and your illusion are within 5 feet of a creature that can see the illusion, you have advantage on attack rolls against that creature, given how distracting the illusion is to the target.",
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
            desc: "At 17th level, you can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 1, spells: ["charm-person", "disguise-self"] },
          { level: 3, spells: ["mirror-image", "pass-without-trace"] },
          { level: 5, spells: ["blink", "dispel-magic"] },
          { level: 7, spells: ["dimension-door", "polymorph"] },
          { level: 9, spells: ["dominate-person", "modify-memory"] },
        ],
      },
      twilight: {
        features: [
          {
            id: "eyes_of_night",
            name: "Eyes of Night",
            desc: "Starting at 1st level, you can see through the deepest gloom. You have darkvision out to a range of 300 feet. In that radius, you can see in dim light as if it were bright light and in darkness as if it were dim light.\nAs an action, you can magically share the darkvision of this feature with willing creatures you can see within 10 feet of you, up to a number of creatures equal to your Wisdom modifier (minimum of one creature). The shared darkvision lasts for 1 hour. Once you share it, you can't do so again until you finish a long rest, unless you expend a spell slot of any level to share it again.",
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            tracked: true,
            uses: "pb",
            recharge: "lr",
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
          { level: 1, spells: ["faerie-fire", "sleep"] },
          { level: 3, spells: ["moonbeam", "see-invisibility"] },
          { level: 5, spells: ["aura-of-vitality", "leomunds-tiny-hut"] },
          { level: 7, spells: ["aura-of-life", "greater-invisibility"] },
          { level: 9, spells: ["circle-of-power", "mislead"] },
        ],
      },
      war: {
        features: [
          {
            id: "war_priest",
            name: "War Priest",
            desc: "From 1st level, your god delivers bolts of inspiration to you while you are engaged in battle. When you use the Attack action, you can make one weapon attack as a bonus action.\n\nYou can use this feature a number of times equal to your Wisdom modifier (a minimum of once). You regain all expended uses when you finish a long rest.",
            level: 1,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
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
          { level: 1, spells: ["divine-favor", "shield-of-faith"] },
          { level: 3, spells: ["magic-weapon", "spiritual-weapon"] },
          { level: 5, spells: ["crusaders-mantle", "spirit-guardians"] },
          { level: 7, spells: ["freedom-of-movement", "stoneskin"] },
          { level: 9, spells: ["flame-strike", "hold-monster"] },
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
        desc: "Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice, and you regain expended uses when you finish a short or long rest. Your druid level determines what beasts you can transform into.",
        level: 2,
        tracked: true,
        uses: 2,
        recharge: "sr_or_lr",
      },
      {
        id: "timeless_body",
        name: "Timeless Body",
        desc: "Starting at 18th level, the primal magic you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.",
        level: 18,
        tracked: false,
      },
      {
        id: "beast_spells",
        name: "Beast Spells",
        desc: "Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren't able to provide material components.",
        level: 18,
        tracked: false,
      },
      {
        id: "archdruid",
        name: "Archdruid",
        desc: "At 20th level, you can use your Wild Shape an unlimited number of times. Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell (in both your normal shape and your beast shape).",
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
            desc: "At 2nd level, you gain a pool of fey energy represented by a number of d6s equal to your druid level. As a bonus action, you can choose an ally you can see within 120 feet and spend a number of dice equal to half your druid level or less; roll the spent dice to heal that ally, and the ally also gains 1 temporary hit point per die spent. You regain all expended dice when you finish a long rest.",
            level: 2,
            tracked: true, // Uses = Druid Level
            trackedMode: "dicePool",
            poolSize: "druid_level",
            die: "d6",
            spendLimit: "half_druid_level",
            recharge: "lr",
          },
          {
            id: "hearth_of_moonlight_and_shadow",
            name: "Hearth of Moonlight and Shadow",
            desc: "At 6th level, during a short or long rest you can create an invisible 30-foot-radius sphere that helps guard your respite. While within the sphere, you and your allies gain a +5 bonus to Dexterity (Stealth) and Wisdom (Perception) checks, and light from open flames in the sphere isn't visible outside it. The sphere vanishes at the end of the rest or when you leave it.",
            level: 6,
            tracked: false,
          },
          {
            id: "hidden_paths",
            name: "Hidden Paths",
            desc: "Starting at 10th level, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see; alternatively, as an action you can teleport one willing creature you touch up to 30 feet. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            level: 10,
            tracked: true, // Uses = Wisdom Modifier
            uses: "wis_mod",
            recharge: "lr",
          },
          {
            id: "walker_in_dreams",
            name: "Walker in Dreams",
            desc: "At 14th level, when you finish a short rest you can cast dream (with you as the messenger), scrying, or teleportation circle without expending a spell slot or requiring material components. This special teleportation circle can instead open a portal to the last location where you finished a long rest on your current plane. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/LR
            recharge: "lr",
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
	            recharge: "lr",
	          },
	          {
	            id: "land_circle_spells",
	            name: "Land Circle Spells",
	            desc: "Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day.",
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
            desc: "The rites of your circle grant you the ability to transform into more dangerous animal forms. Starting at 2nd level, you can use your Wild Shape to transform into a beast with a challenge rating as high as 1. You ignore the Max. CR column of the Beast Shapes table, but must abide by the other limitations there. Starting at 6th level, you can transform into a beast with a challenge rating as high as your druid level divided by 3, rounded down.",
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
            desc: "At 10th level, you can expend two uses of Wild Shape at the same time to transform into an air elemental, an earth elemental, a fire elemental, or a water elemental.",
            level: 10,
            tracked: false,
          },
          {
            id: "thousand_forms",
            name: "Thousand Forms",
            desc: "By 14th level, you have learned to use magic to alter your physical form in more subtle ways. You can cast the Alter Self spell at will.",
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
            desc: "At 2nd level, you can converse with beasts and many fey. You learn to speak, read, and write Sylvan. Beasts can understand your speech, and you can interpret their noises and motions (though most beasts canâ€™t convey complex ideas). This doesnâ€™t automatically make beasts friendly toward you.",
            level: 2,
            tracked: false,
          },
          {
            id: "spirit_totem",
            name: "Spirit Totem",
            desc: "Starting at 2nd level, you can summon an incorporeal nature spirit (bonus action) to a point you can see within 60 feet. It creates a 30-foot-radius aura and lasts 1 minute. The spirit is neither a creature nor an object, and you can move it up to 60 feet to a point you can see as a bonus action.\n\nChoose one aura when you summon it:\n\n- Bear Spirit: creatures of your choice in the aura when it appears gain temporary hit points equal to 5 + your druid level; you and your allies also have advantage on Strength checks and Strength saving throws while in the aura.\n- Hawk Spirit: when a creature makes an attack roll against a target in the aura, you can use your reaction to grant advantage on that roll; you and your allies also have advantage on Wisdom (Perception) checks while in the aura.\n- Unicorn Spirit: you and your allies have advantage on ability checks to detect creatures in the aura; when you cast a spell using a spell slot that restores hit points, each creature of your choice in the aura also regains hit points equal to your druid level.\n\nOnce you use this feature, you canâ€™t use it again until you finish a short or long rest.",
            level: 2,
            tracked: true, // 1/SR
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "mighty_summoner",
            name: "Mighty Summoner",
            desc: "At 6th level, beasts and fey you summon or create with your spells are tougher. They gain 2 extra hit points per Hit Die, and their natural weapon damage counts as magical for overcoming resistance and immunity.",
            level: 6,
            tracked: false,
          },
          {
            id: "guardian_spirit",
            name: "Guardian Spirit",
            desc: "Beginning at 10th level, your Spirit Totem protects beasts and fey you summoned or created. When one of those creatures ends its turn in your Spirit Totem aura, it regains hit points equal to half your druid level.",
            level: 10,
            tracked: false,
          },
          {
            id: "faithful_summons",
            name: "Faithful Summons",
            desc: "Starting at 14th level, if youâ€™re reduced to 0 hit points or incapacitated against your will, you immediately gain the benefits of Conjure Animals as if cast with a 9th-level spell slot (four CR 2 or lower beasts of your choice within 20 feet). The summons last 1 hour, require no concentration, and can be dismissed with no action.\n\nOnce you use this feature, you canâ€™t use it again until you finish a long rest.",
            level: 14,
            tracked: true, // 1/LR
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      spores: {
        features: [
          {
            id: "circle_spells",
            name: "Circle Spells",
            desc: "Your symbiotic link to fungi and your ability to tap into the cycle of life and death grants you access to certain spells. At 2nd level, you learn the Chill Touch cantrip.\n\nAt 3rd, 5th, 7th, and 9th level you gain access to the spells listed for that level in the Circle of Spores Spells table. Once you gain access to one of these spells, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.",
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
            desc: "At 6th level, your spores gain the ability to infest a corpse and animate it. If a beast or a humanoid that is Small or Medium dies within 10 feet of you, you can use your reaction to animate it, causing it to stand up immediately with 1 hit point. The creature uses the Zombie stat block in the Monster Manual. It remains animate for 1 hour, after which time it collapses and dies.\n\nIn combat, the zombie's turn comes immediately after yours. It obeys your mental commands, and the only action it can take is the Attack action, making one melee attack.\n\nYou can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
            level: 6,
            tracked: true, // Wisdom Modifier/LR (min 1)
            uses: "wis_mod",
            recharge: "lr",
          },
          {
            id: "spreading_spores",
            name: "Spreading Spores",
            desc: "At 10th level, you gain the ability to seed an area with deadly spores. As a bonus action while your Symbiotic Entity feature is active, you can hurl spores up to 30 feet away, where they swirl in a 10-foot cube for 1 minute. The spores disappear early if you use this feature again, if you dismiss them as a bonus action, or if your Symbiotic Entity feature is no longer active.\n\nWhenever a creature moves into the cube or starts its turn there, that creature takes your Halo of Spores damage, unless the creature succeeds on a Constitution saving throw against your spell save DC. A creature can take this damage no more than once per turn.\n\nWhile the cube of spores persists, you can't use your Halo of Spores reaction.",
            level: 10,
            tracked: false,
          },
          {
            id: "fungal_body",
            name: "Fungal Body",
            desc: "At 14th level, the fungal spores in your body alter you: you can't be blinded, deafened, frightened, or poisoned, and any critical hit against you counts as a normal hit instead, unless you're incapacitated.",
            level: 14,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 2, spells: ["chill-touch"] },
          { level: 3, spells: ["blindness-deafness", "gentle-repose"] },
          { level: 5, spells: ["animate-dead", "gaseous-form"] },
          { level: 7, spells: ["blight", "confusion"] },
          { level: 9, spells: ["cloudkill", "contagion"] },
        ],
      },
      star: {
        features: [
          {
            id: "star_map",
            name: "Star Map",
            desc: "At 2nd level, you've created a star chart as part of your heavenly studies. It is a Tiny object and can serve as a spellcasting focus for your druid spells. You determine its form by rolling on the Star Map table or by choosing one.\n\nWhile holding this map, you have these benefits:\n\n- You know the Guidance cantrip.\n- You have the Guiding Bolt spell prepared. It counts as a druid spell for you, and it doesn't count against the number of spells you can have prepared.\n- You can cast Guiding Bolt without expending a spell slot.\n\nIf you lose the map, you can perform a 1-hour ceremony to magically create a replacement. This ceremony can be performed during a short or long rest, and it destroys the previous map.",
            level: 2,
            tracked: false,
          },
          {
            id: "star_map_guiding_bolt",
            name: "Guiding Bolt (Star Map)",
            desc: "You can cast Guiding Bolt without expending a spell slot. You can do so a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 2,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "starry_form",
            name: "Starry Form",
            desc: "At 2nd level, you gain the ability to harness constellations' power to alter your form. As a bonus action, you can expend a use of your Wild Shape feature to take on a starry form, rather than transforming into a beast.\n\nWhile in your starry form, you retain your game statistics, but your body becomes luminous; your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), are incapacitated, die, or use this feature again.\n\nWhenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you certain benefits while in the form:\n\n- **Archer:** When you activate this form, and as a bonus action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of you. On a hit, the attack deals radiant damage equal to 1d8 + your Wisdom modifier.\n- **Chalice:** Whenever you cast a spell using a spell slot that restores hit points to a creature, you or another creature within 30 feet of you can regain hit points equal to 1d8 + your Wisdom modifier.\n- **Dragon:** When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain concentration on a spell, you can treat a roll of 9 or lower on the d20 as a 10.",
            level: 2,
            tracked: false,
          },
          {
            id: "cosmic_omen",
            name: "Cosmic Omen",
            desc: "When you reach 6th level, you learn to use your star map to divine the will of the cosmos. Whenever you finish a long rest, you can consult your Star Map for omens. When you do so, roll a die. Until you finish your next long rest, you gain access to a special reaction based on whether you rolled an even or an odd number on the die:\n\n- **Weal (even):** Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and add the number rolled to the total.\n- **Woe (odd):** Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and subtract the number rolled from the total.\n\nYou can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            level: 6,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "twinkling_constellations",
            name: "Twinkling Constellations",
            desc: "At 10th level, the constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a flying speed of 20 feet and can hover.\n\nMoreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.",
            level: 10,
            tracked: false,
          },
          {
            id: "full_of_stars",
            name: "Full of Stars",
            desc: "At 14th level, while in your Starry Form, you become partially incorporeal, giving you resistance to bludgeoning, piercing, and slashing damage.",
            level: 14,
            tracked: false,
          },
        ],
        subclassSpells: [{ level: 2, spells: ["guidance", "guiding-bolt"] }],
      },
      wildfire: {
        features: [
          {
            id: "circle_spells",
            name: "Circle Spells",
            desc: "Your connection to wildfire magic grants you a set of circle spells. You always have these spells prepared at the druid levels listed, and they don't count against the number of spells you can prepare each day.",
            level: 2,
            tracked: false,
          },
          {
            id: "summon_wildfire_spirit",
            name: "Summon Wildfire Spirit",
            desc: "At 2nd level, You can summon the primal spirit bound to your soul. As an action, you can expend one use of your Wild Shape feature to summon your wildfire spirit, rather than assuming a beast form.\n\nThe spirit appears in an unoccupied space of your choice that you can see within 30 feet of you. Each creature within 10 feet of the spirit (other than you) when it appears must succeed on a Dexterity saving throw against your spell save DC or take 2d6 fire damage.\n\nThe spirit is friendly to you and your companions and obeys your commands. See this creature's game statistics in the Wildfire Spirit stat block, which uses your proficiency bonus (PB) in several places. You determine the spirit's appearance. Some spirits take the form of a humanoid figure made of gnarled branches covered in flame, while others look like beasts wreathed in fire.\n\nIn combat, the spirit shares your initiative count, but it takes its turn immediately after yours. The only action it takes on its turn is the Dodge action, unless you take a bonus action on your turn to command it to take another action. That action can be one in its stat block or some other action. If you are incapacitated, the spirit can take any action of its choice, not just Dodge.\n\nThe spirit manifests for 1 hour, until it is reduced to 0 hit points, until you use this feature to summon the spirit again, or until you die.",
            level: 2,
            tracked: false,
          },
          {
            id: "enhanced_bond",
            name: "Enhanced Bond",
            desc: "At 6th level, the bond with your wildfire spirit enhances your destructive and restorative spells. Whenever you cast a spell that deals fire damage or restores hit points while your wildfire spirit is summoned, roll a d8, and you gain a bonus equal to the number rolled to one damage or healing roll of the spell.\n\nIn addition, when you cast a spell with a range other than self, the spell can originate from you or your wildfire spirit.",
            level: 6,
            tracked: false,
          },
          {
            id: "cauterizing_flames",
            name: "Cauterizing Flames",
            desc: "At 10th level, you gain the ability to turn death into magical flames that can heal or incinerate. When a Small or larger creature dies within 30 feet of you or your wildfire spirit, a harmless spectral flame springs forth in the dead creature's space and flickers there for 1 minute. When a creature you can see enters that space, you can use your reaction to extinguish the spectral flame there and either heal the creature or deal fire damage to it. The healing or damage equals 2d10 + your Wisdom modifier.",
            level: 10,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "blazing_revival",
            name: "Blazing Revival",
            desc: "At 14th level, the bond with your wildfire spirit can save you from death. If the spirit is within 120 feet of you when you are reduced to 0 hit points and thereby fall unconscious, you can cause the spirit to drop to 0 hit points. You then regain half your hit points and immediately rise to your feet.",
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        subclassSpells: [
          { level: 2, spells: ["burning-hands", "cure-wounds"] },
          { level: 3, spells: ["flaming-sphere", "scorching-ray"] },
          { level: 5, spells: ["plant-growth", "revivify"] },
          { level: 7, spells: ["aura-of-life", "fire-shield"] },
          { level: 9, spells: ["flame-strike", "mass-cure-wounds"] },
        ],
      },
    },
  },

  fighter: {
    hitDice: "D10",
    isSpellCaster: "nonCaster",
    spellcastingAbility: "nonCaster",
    fightingStyleOptions: [
      "Archery",
      "Blind Fighting",
      "Defense",
      "Dueling",
      "Great Weapon Fighting",
      "Interception",
      "Protection",
      "Superior Technique",
      "Thrown Weapon Fighting",
      "Two-Weapon Fighting",
      "Unarmed Fighting",
      "Close Quarters Shooter",
      "Mariner",
      "Tunnel Fighter",
    ],
    classFeatures: [
      {
        id: "fighting_style",
        name: "Fighting Style",
        desc: [
          "You adopt a particular style of fighting as your specialty. Choose one Fighting Style option.",
          "You can't take a Fighting Style option more than once, even if you later get to choose again.",
        ],
        level: 1,
        tracked: false, 
        // "**NEED FEATURE: maybe make fighting styles part of state, and have user choose one as part of char creation. Rendering will choose only 1, and we need some way to tooltip just the selected fighting Style(s).**"
      },
      {
        id: "second_wind",
        name: "Second Wind",
        desc: [
          "You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.",
          "Once you use this feature, you must finish a short or long rest before you can use it again.",
        ],
        level: 1,
        tracked: true,
        uses: 1,
        recharge: "sr_or_lr",
      },
      {
        id: "action_surge",
        name: "Action Surge",
        desc: [
          "Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.",
          "Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.",
        ],
        level: 2,
        tracked: true,
        usesByLevel: [
          { level: 2, uses: 1 },
          { level: 17, uses: 2 },
        ],
        recharge: "sr_or_lr",
      },
      {
        id: "extra_attack",
        name: "Extra Attack",
        desc: [
          "Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.",
          "The number of attacks increases to three when you reach 11th level in this class and to four when you reach 20th level in this class.",
        ],
        level: 5,
        tracked: false, 
      },
      {
        id: "indomitable",
        name: "Indomitable",
        desc: [
          "Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest.",
          "You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.",
        ],
        level: 9,
        tracked: true,
        usesByLevel: [
          { level: 9, uses: 1 },
          { level: 13, uses: 2 },
          { level: 17, uses: 3 },
        ],
        recharge: "lr",
      },
    ],
    subclasses: {
      battleMaster: {
        // Source (feature + maneuver text): https://dnd5e.wikidot.com/fighter:battle-master and https://dnd5e.wikidot.com/fighter:battle-master:maneuvers (CC BY-SA 3.0)
        features: [
          {
            id: "combat_superiority_maneuvers",
            name: "Combat Superiority (Maneuvers)",
            desc: [
              "You learn 3 maneuvers at 3rd level, and you learn 2 more at 7th, 10th, and 15th level.",
              "Some maneuvers require a saving throw: Maneuver save DC = 8 + your proficiency bonus + your Strength or Dexterity modifier (whichever is higher).",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "combat_superiority_dice",
            name: "Combat Superiority (Superiority Dice)",
            desc: [
              "At 3rd level, you gain superiority dice, which are d8s, and you use them to fuel maneuvers.",
              "You have 4 superiority dice. You regain all expended superiority dice when you finish a short or long rest.",
              "You gain 1 more superiority die at 7th level and 1 more at 15th level.",
              "Improved Combat Superiority: At 10th level your superiority dice become d10s; at 18th level they become d12s.",
            ],
            level: 3,
            tracked: true,
            trackedMode: "dicePool",
            trackedLevelSource: "fighter_level",
            allowExtraDicePool: true,
            poolSizeByLevel: [
              { level: 3, size: 4 },
              { level: 7, size: 5 },
              { level: 15, size: 6 },
            ],
            dieByLevel: [
              { level: 3, die: "d8" },
              { level: 10, die: "d10" },
              { level: 18, die: "d12" },
            ],
            recharge: "sr_or_lr",
          },
          {
            id: "know_your_enemy",
            name: "Know Your Enemy",
            desc: [
              "Starting at 7th level, if you spend at least 1 minute observing or interacting with another creature outside combat, you can learn information about its capabilities compared to your own.",
              "The DM tells you if the creature is your equal, superior, or inferior in regard to two characteristics of your choice: Strength, Dexterity, Constitution, Armor Class, current hit points, total class levels (if any), or Fighter class levels (if any).",
            ],
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
            desc: "Starting at 15th level, when you roll initiative and have no superiority dice remaining, you regain 1 superiority die.",
            level: 15,
            tracked: false,
          },
        ],
        maneuvers: [
          {
            id: "ambush",
            name: "Ambush",
            desc: "When you make a Dexterity (Stealth) check or an initiative roll, you can expend one superiority die and add the die to the roll, provided you aren't incapacitated.",
          },
          {
            id: "bait_and_switch",
            name: "Bait and Switch",
            desc: [
              "When you're within 5 feet of a creature on your turn, you can expend one superiority die and switch places with that creature, provided you spend at least 5 feet of movement and the creature is willing and isn't incapacitated. This movement doesn't provoke opportunity attacks.",
              "Roll the superiority die. Until the start of your next turn, you or the other creature (your choice) gains a bonus to AC equal to the number rolled.",
            ],
          },
          {
            id: "brace",
            name: "Brace",
            desc: "When a creature you can see moves into the reach you have with the melee weapon you're wielding, you can use your reaction to expend one superiority die and make one attack against the creature, using that weapon. If the attack hits, add the superiority die to the weapon's damage roll.",
          },
          {
            id: "commanders_strike",
            name: "Commander's Strike",
            desc: "When you take the Attack action on your turn, you can forgo one of your attacks and use a bonus action to direct one of your companions to strike. When you do so, choose a friendly creature who can see or hear you and expend one superiority die. That creature can immediately use its reaction to make one weapon attack, adding the superiority die to the attack's damage roll.",
          },
          {
            id: "commanding_presence",
            name: "Commanding Presence",
            desc: "When you make a Charisma (Intimidation), a Charisma (Performance), or a Charisma (Persuasion) check, you can expend one superiority die and add the superiority die to the ability check.",
          },
          {
            id: "disarming_attack",
            name: "Disarming Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to disarm the target, forcing it to drop one item of your choice that it's holding. You add the superiority die to the attack's damage roll, and the target must make a Strength saving throw. On a failed save, it drops the object you choose. The object lands at its feet.",
          },
          {
            id: "distracting_strike",
            name: "Distracting Strike",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to distract the creature, giving your allies an opening. You add the superiority die to the attack's damage roll. The next attack roll against the target by an attacker other than you has advantage if the attack is made before the start of your next turn.",
          },
          {
            id: "evasive_footwork",
            name: "Evasive Footwork",
            desc: "When you move, you can expend one superiority die, rolling the die and adding the number rolled to your AC until you stop moving.",
          },
          {
            id: "feinting_attack",
            name: "Feinting Attack",
            desc: "You can expend one superiority die and use a bonus action on your turn to feint, choosing one creature within 5 feet of you as your target. You have advantage on your next attack roll against that creature this turn. If that attack hits, add the superiority die to the attack's damage roll.",
          },
          {
            id: "goading_attack",
            name: "Goading Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to goad the target into attacking you. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, the target has disadvantage on all attack rolls against targets other than you until the end of your next turn.",
          },
          {
            id: "grappling_strike",
            name: "Grappling Strike",
            desc: "Immediately after you hit a creature with a melee attack on your turn, you can expend one superiority die and then try to grapple the target as a bonus action (see the Player's Handbook for rules on grappling). Add the superiority die to your Strength (Athletics) check.",
          },
          {
            id: "lunging_attack",
            name: "Lunging Attack",
            desc: "When you make a melee weapon attack on your turn, you can expend one superiority die to increase your reach for that attack by 5 feet. If you hit, you add the superiority die to the attack's damage roll.",
          },
          {
            id: "maneuvering_attack",
            name: "Maneuvering Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to maneuver one of your comrades into a more advantageous position. You add the superiority die to the attack's damage roll, and you choose a friendly creature who can see or hear you. That creature can use its reaction to move up to half its speed without provoking opportunity attacks from the target of your attack.",
          },
          {
            id: "menacing_attack",
            name: "Menacing Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to frighten the target. You add the superiority die to the attack's damage roll, and the target must make a Wisdom saving throw. On a failed save, it is frightened of you until the end of your next turn.",
          },
          {
            id: "parry",
            name: "Parry",
            desc: "When another creature damages you with a melee attack, you can use your reaction and expend one superiority die to reduce the damage by the number you roll on your superiority die + your Dexterity modifier.",
          },
          {
            id: "precision_attack",
            name: "Precision Attack",
            desc: "When you make a weapon attack roll against a creature, you can expend one superiority die to add it to the roll. You can use this maneuver before or after making the attack roll, but before any effects of the attack are applied.",
          },
          {
            id: "pushing_attack",
            name: "Pushing Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to drive the target back. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you push the target up to 15 feet away from you.",
          },
          {
            id: "quick_toss",
            name: "Quick Toss",
            desc: "As a bonus action, you can expend one superiority die and make a ranged attack with a weapon that has the thrown property. You can draw the weapon as part of making this attack. If you hit, add the superiority die to the weapon's damage roll.",
          },
          {
            id: "rally",
            name: "Rally",
            desc: "On your turn, you can use a bonus action and expend one superiority die to bolster the resolve of one of your companions. When you do so, choose a friendly creature who can see or hear you. That creature gains temporary hit points equal to the superiority die roll + your Charisma modifier.",
          },
          {
            id: "riposte",
            name: "Riposte",
            desc: "When a creature misses you with a melee attack, you can use your reaction and expend one superiority die to make a melee weapon attack against the creature. If you hit, you add the superiority die to the attack's damage roll.",
          },
          {
            id: "sweeping_attack",
            name: "Sweeping Attack",
            desc: "When you hit a creature with a melee weapon attack, you can expend one superiority die to attempt to damage another creature with the same attack. Choose another creature within 5 feet of the original target and within your reach. If the original attack roll would hit the second creature, it takes damage equal to the number you roll on your superiority die. The damage is of the same type dealt by the original attack.",
          },
          {
            id: "tactical_assessment",
            name: "Tactical Assessment",
            desc: "When you make an Intelligence (Investigation), an Intelligence (History), or a Wisdom (Insight) check, you can expend one superiority die and add the superiority die to the ability check.",
          },
          {
            id: "trip_attack",
            name: "Trip Attack",
            desc: "When you hit a creature with a weapon attack, you can expend one superiority die to attempt to knock the target down. You add the superiority die to the attack's damage roll, and if the target is Large or smaller, it must make a Strength saving throw. On a failed save, you knock the target prone.",
          },
        ],
      },
      arcaneArcher: {
        // Source (feature + option text): https://dnd5e.wikidot.com/fighter:arcane-archer (CC BY-SA 3.0)
        features: [
          {
            id: "arcane_shot",
            name: "Arcane Shot",
            desc: [
              "At 3rd level, you learn to unleash special magical effects with some of your shots. When you gain this feature, you learn two Arcane Shot options of your choice (see Arcane Shot Options).",
              "Once per turn when you fire an arrow from a shortbow or longbow as part of the Attack action, you can apply one of your Arcane Shot options to that arrow. You decide to use the option when the arrow hits, unless the option doesn't involve an attack roll.",
              "You have two uses of this ability, and you regain all expended uses of it when you finish a short or long rest.",
              "You gain an additional Arcane Shot option of your choice when you reach Fighter levels 7, 10, 15, and 18.",
            ],
            level: 3,
            tracked: true,
            uses: 2,
            recharge: "sr_or_lr",
            allowExtraUses: true,
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
            desc: "At 3rd level, you learn magical theory or some of the secrets of nature - typical for practitioners of this elven martial tradition. You choose to gain proficiency in either the Arcana or the Nature skill, and you choose to learn either the Prestidigitation or Druidcraft cantrip.",
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
        arcaneShotOptions: [
          {
            id: "banishing_arrow",
            name: "Banishing Arrow",
            school: "abjuration",
            desc: [
              "You use abjuration magic to try to temporarily banish your target to a harmless location in the Feywild.",
              "The creature hit by the arrow must also succeed on a Charisma saving throw or be banished. While banished in this way, its speed is 0, and it is incapacitated. At the end of its next turn, the target reappears in the space it vacated or in the nearest unoccupied space if that space is occupied.",
              "After you reach 18th level in this class, a target also takes 2d6 force damage when the arrow hits it.",
            ],
          },
          {
            id: "beguiling_arrow",
            name: "Beguiling Arrow",
            school: "enchantment",
            desc: [
              "Your enchantment magic causes this arrow to temporarily beguile its target.",
              "The creature hit by the arrow takes an extra 2d6 psychic damage, and choose one of your allies within 30 feet of the target. The target must succeed on a Wisdom saving throw, or it is charmed by the chosen ally until the start of your next turn. This effect ends early if the chosen ally attacks the charmed target, deals damage to it, or forces it to make a saving throw.",
              "The psychic damage increases to 4d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "bursting_arrow",
            name: "Bursting Arrow",
            school: "evocation",
            desc: [
              "You imbue your arrow with force energy drawn from the school of evocation. The arrow detonates after your attack.",
              "Immediately after the arrow hits the creature, the target and all other creatures within 10 feet of it take 2d6 force damage each.",
              "The force damage increases to 4d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "enfeebling_arrow",
            name: "Enfeebling Arrow",
            school: "necromancy",
            desc: [
              "You weave necromantic magic into your arrow. The creature hit by the arrow takes an extra 2d6 necrotic damage.",
              "The target must also succeed on a Constitution saving throw, or the damage dealt by its weapon attacks is halved until the start of your next turn.",
              "The necrotic damage increases to 4d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "grasping_arrow",
            name: "Grasping Arrow",
            school: "conjuration",
            desc: [
              "When this arrow strikes its target, conjuration magic creates grasping, poisonous brambles, which wrap around the target.",
              "The creature hit by the arrow takes an extra 2d6 poison damage, its speed is reduced by 10 feet, and it takes 2d6 slashing damage the first time on each turn it moves 1 foot or more without teleporting.",
              "The target or any creature that can reach it can use its action to remove the brambles with a successful Strength (Athletics) check against your Arcane Shot save DC. Otherwise, the brambles last for 1 minute or until you use this option again.",
              "The poison damage and slashing damage both increase to 4d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "piercing_arrow",
            name: "Piercing Arrow",
            school: "transmutation",
            desc: [
              "You use transmutation magic to give your arrow an ethereal quality. When you use this option, you don't make an attack roll for the attack.",
              "Instead, the arrow fires forward in a line, which is 1 foot wide and 30 feet long, before disappearing. The arrow passes harmlessly through objects, ignoring cover.",
              "Each creature in that line must make a Dexterity saving throw. On a failed save, a creature takes damage as if it were hit by the arrow, plus an extra 1d6 piercing damage. On a successful save, a target takes half as much damage.",
              "The piercing damage increases to 2d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "seeking_arrow",
            name: "Seeking Arrow",
            school: "divination",
            desc: [
              "Using divination magic, you grant your arrow the ability to seek out your target, allowing the arrow to curve and twist its path in search of its prey.",
              "When you use this option, you don't make an attack roll for the attack. Instead, choose one creature you have seen in the past minute. The arrow flies toward that creature, moving around corners if necessary and ignoring three-quarters cover and half cover.",
              "If the target is within the weapon's range and there is a path large enough for the arrow to travel to the target, the target must make a Dexterity saving throw. On a failed save, it takes damage as if it were hit by the arrow, plus an extra 1d6 force damage, and you learn the target's current location. On a successful save, the target takes half as much damage, and you don't learn its location.",
              "The force damage increases to 2d6 when you reach 18th level in this class.",
            ],
          },
          {
            id: "shadow_arrow",
            name: "Shadow Arrow",
            school: "illusion",
            desc: [
              "You weave illusion magic into your arrow, causing it to occlude your foe's vision with shadows.",
              "The creature hit by the arrow takes an extra 2d6 psychic damage, and it must succeed on a Wisdom saving throw or be unable to see anything farther than 5 feet away until the start of your next turn.",
              "The psychic damage increases to 4d6 when you reach 18th level in this class.",
            ],
          },
        ],
      },
      banneret: {
        features: [
          {
            id: "rallying_cry",
            name: "Rallying Cry",
            desc: [
              "When you choose this archetype at 3rd level, you learn how to inspire your allies to fight on past their injuries.",
              "When you use your Second Wind feature, you can choose up to three creatures within 60 feet of you that are allied with you. Each one regains hit points equal to your fighter level, provided that the creature can see or hear you.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "royal_envoy",
            name: "Royal Envoy",
            desc: [
              "Knights of high standing are expected to conduct themselves with grace.",
              "At 7th level, you gain proficiency in the Persuasion skill. If you are already proficient in it, you gain proficiency in one of the following skills of your choice: Animal Handling, Insight, Intimidation, or Performance.",
              "Your proficiency bonus is doubled for any ability check you make that uses Persuasion. You receive this benefit regardless of the skill proficiency you gain from this feature.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "inspiring_surge",
            name: "Inspiring Surge",
            desc: [
              "Starting at 10th level, when you use your Action Surge feature, you can choose one creature within 60 feet of you that is allied with you. That creature can make one melee or ranged weapon attack with its reaction, provided that it can see or hear you.",
              "Starting at 18th level, you can choose two allies within 60 feet of you, rather than one.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "bulwark",
            name: "Bulwark",
            desc: "Beginning at 15th level, you can extend the benefit of your Indomitable feature to an ally. When you decide to use Indomitable to reroll an Intelligence, a Wisdom, or a Charisma saving throw and you aren't incapacitated, you can choose one ally within 60 feet of you that also failed its saving throw against the same effect. If that creature can see or hear you, it can reroll its saving throw and must use the new roll.",
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
            desc: [
              "Starting at 3rd level, you can menace your foes, foiling their attacks and punishing them for harming others. When you hit a creature with a melee weapon attack, you can mark the creature until the end of your next turn. This effect ends early if you are incapacitated or you die, or if someone else marks the creature.",
              "While it is within 5 feet of you, a creature marked by you has disadvantage on any attack roll that doesn't target you.",
              "In addition, if a creature marked by you deals damage to anyone other than you, you can make a special melee weapon attack against the marked creature as a bonus action on your next turn. You have advantage on the attack roll, and if it hits, the attack's weapon deals extra damage to the target equal to half your fighter level.",
              "Regardless of the number of creatures you mark, you can make this special attack a number of times equal to your Strength modifier (a minimum of once), and you regain all expended uses of it when you finish a long rest.",
            ],
            level: 3,
            tracked: true, // Str mod/LR
            uses: "str_mod",
            minUses: 1,
            recharge: "lr",
          },
          {
            id: "born_to_saddle",
            name: "Born to Saddle",
            desc: [
              "Starting at 3rd level, your mastery as a rider becomes apparent. You have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you're not incapacitated.",
              "Finally, mounting or dismounting a creature costs you only 5 feet of movement, rather than half your speed.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "warding_maneuver",
            name: "Warding Maneuver",
            desc: [
              "At 7th level, you learn to fend off strikes directed at you, your mount, or other creatures nearby. If you or a creature you can see within 5 feet of you is hit by an attack, you can roll 1d8 as a reaction if you're wielding a melee weapon or a shield.",
              "Roll the die, and add the number rolled to the target's AC against that attack. If the attack still hits, the target has resistance against the attack's damage.",
              "You can use this feature a number of times equal to your Constitution modifier (a minimum of once), and you regain all expended uses of it when you finish a long rest.",
            ],
            level: 7,
            tracked: true, // Con mod/LR
            uses: "con_mod",
            minUses: 1,
            recharge: "lr",
          },
          {
            id: "hold_the_line",
            name: "Hold the Line",
            desc: "At 10th level, you become a master of locking down your enemies. Creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach, and if you hit a creature with an opportunity attack, the target's speed is reduced to 0 until the end of the current turn.",
            level: 10,
            tracked: false,
          },
          {
            id: "ferocious_charger",
            name: "Ferocious Charger",
            desc: "Starting at 15th level, you can run down your foes, whether you're mounted or not. If you move at least 10 feet in a straight line right before attacking a creature and you hit it with the attack, that target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + your Strength modifier) or be knocked prone. You can use this feature only once on each of your turns.",
            level: 15,
            tracked: false,
          },
          {
            id: "vigilant_defender",
            name: "Vigilant Defender",
            desc: "Starting at 18th level, you respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature's turn, except your turn. You can use this special reaction only to make an opportunity attack, and you can't use it on the same turn that you take your normal reaction.",
            level: 18,
            tracked: false,
          },
        ],
      },
      
      champion: {
        // Source (feature text): https://dnd5e.wikidot.com/fighter:champion (CC BY-SA 3.0)
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
            desc: [
              "Starting at 7th level, you can add half your proficiency bonus (rounded up) to any Strength, Dexterity, or Constitution check you make that doesn't already use your proficiency bonus.",
              "In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.",
            ],
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
            desc: "At 18th level, you attain the pinnacle of resilience in battle. At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half your hit points left. You don't gain this benefit if you have 0 hit points.",
            level: 18,
            tracked: false,
          },
        ],
      },
      echoKnight: {
        // Source (feature text): https://dnd5e.wikidot.com/fighter:echo-knight (CC BY-SA 3.0)
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
            uses: "con_mod",
            minUses: 1,
            recharge: "lr",
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
            tracked: true, // 1/SR or LR
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "reclaim_potential",
            name: "Reclaim Potential",
            desc: "Starting at 15th level, you can absorb the energy of your echo's destruction. When your echo is destroyed by taking damage, you can gain temporary hit points equal to 2d6 + your Constitution modifier, provided you don't already have temporary hit points. You can use this feature a number of times equal to your Constitution modifier, and you regain all expended uses when you finish a long rest.",
            level: 15,
            tracked: true, // Con mod/LR
            uses: "con_mod",
            minUses: 1,
            recharge: "lr",
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
        // Source (feature text + spellcasting table): https://dnd5e.wikidot.com/fighter:eldritch-knight (CC BY-SA 3.0)
        spellcasting: {
          startsAtLevel: 3,
          spellTableKey: "fighterEldritchKnight",
          spellListClassKey: "wizard",
          spellcastingAbility: "int",
        },
        features: [
          {
            id: "spellcasting",
            name: "Spellcasting",
            desc: [
              "When you reach 3rd level, you augment your martial prowess with the ability to cast spells.",
              "You learn two cantrips of your choice from the wizard spell list. You learn an additional wizard cantrip of your choice at 10th level.",
              "You know three 1st-level wizard spells of your choice, two of which you must choose from abjuration and evocation spells.",
              "Intelligence is your spellcasting ability for your wizard spells.",
            ],
            level: 3,
            tracked: false,
          },
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
            desc: [
              "At 3rd level, you harbor a wellspring of psionic energy within yourself. This energy is represented by your Psionic Energy dice.",
              "You have a number of Psionic Energy dice equal to your proficiency bonus. These dice are each a d6.",
              "Some of your powers expend the Psionic Energy die they use. You regain all your expended Psionic Energy dice when you finish a long rest.",
              "In addition, as a bonus action, you can regain one expended Psionic Energy die, but you can't do so again until you finish a short or long rest.",
              "When you reach certain levels in this class, the size of your Psionic Energy dice increases: at 5th level (d8), 11th level (d10), and 17th level (d12).",
            ],
            level: 3,
            tracked: true,
            trackedMode: "dicePool",
            trackedLevelSource: "fighter_level",
            poolSizeByLevel: [
              { level: 3, size: 2 },
              { level: 5, size: 3 },
              { level: 9, size: 4 },
              { level: 13, size: 5 },
              { level: 17, size: 6 },
            ],
            dieByLevel: [
              { level: 3, die: "d6" },
              { level: 5, die: "d8" },
              { level: 11, die: "d10" },
              { level: 17, die: "d12" },
            ],
            recharge: "lr",
          },
          {
            id: "protective_field",
            name: "Protective Field",
            desc: [
              "When you or another creature you can see within 30 feet of you takes damage, you can use your reaction to expend one Psionic Energy die, roll the die, and reduce the damage taken by the number rolled plus your Intelligence modifier (minimum reduction of 1).",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "psionic_strike",
            name: "Psionic Strike",
            desc: [
              "You can propel your weapons with psionic force. Once on each of your turns, immediately after you hit a target within 30 feet of you with an attack and deal damage to it with a weapon, you can expend one Psionic Energy die, rolling it and dealing force damage to the target equal to the number rolled plus your Intelligence modifier.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "telekinetic_movement",
            name: "Telekinetic Movement",
            desc: [
              "You can move an object or a creature with your mind. As an action, you target one loose object that is Large or smaller or one willing creature, other than yourself.",
              "If you can see the target and it is within 30 feet of you, you can move it up to 30 feet to an unoccupied space you can see. Alternatively, if it is a Tiny object, you can move it to or from your hand. Either way, you can move the target horizontally, vertically, or both.",
              "Once you take this action, you can't do so again until you finish a short or long rest, unless you expend a Psionic Energy die to take it again.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "telekinetic_adept",
            name: "Telekinetic Adept",
            desc: "By 7th level, you have mastered new ways to use your telekinetic abilities.",
            level: 7,
            tracked: false,
          },
          {
            id: "psi_powered_leap",
            name: "Psi-Powered Leap",
            desc: [
              "As a bonus action, you can propel your body with your mind. You gain a flying speed equal to twice your walking speed until the end of the current turn.",
              "Once you take this bonus action, you can't do so again until you finish a short or long rest, unless you expend a Psionic Energy die to take it again.",
            ],
            level: 7,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "telekinetic_thrust",
            name: "Telekinetic Thrust",
            desc: [
              "When you deal damage to a target with your Psionic Strike, you can force the target to make a Strength saving throw against a DC equal to 8 + your proficiency bonus + your Intelligence modifier.",
              "If the save fails, you can knock the target prone or move it up to 10 feet in any direction horizontally.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "guarded_mind",
            name: "Guarded Mind",
            desc: [
              "Starting at 10th level, the psionic energy flowing through you has bolstered your mind. You have resistance to psychic damage.",
              "Moreover, if you start your turn charmed or frightened, you can expend a Psionic Energy die and end every effect on yourself subjecting you to those conditions.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "bulwark_of_force",
            name: "Bulwark of Force",
            desc: [
              "At 15th level, you can shield yourself and others with telekinetic force. As a bonus action, you can choose creatures, which can include you, that you can see within 30 feet of you, up to a number of creatures equal to your Intelligence modifier (minimum of one creature).",
              "Each of the chosen creatures is protected by half cover for 1 minute or until you're incapacitated.",
            ],
            level: 15,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "telekinetic_master",
            name: "Telekinetic Master",
            desc: [
              "By 18th level, you can cast the Telekinesis spell, requiring no components, and your spellcasting ability for the spell is Intelligence.",
              "On each of your turns while you concentrate on the spell, including the turn when you cast it, you can make one attack with a weapon as a bonus action.",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      runeKnight: {
        // Source (feature + rune text): https://dnd5e.wikidot.com/fighter:rune-knight (CC BY-SA 3.0)
        features: [
          {
            id: "bonus_proficiencies",
            name: "Bonus Proficiencies",
            desc: [
              "When you choose this archetype at 3rd level, you gain proficiency with smithâ€™s tools, and you learn to speak, read, and write Giant.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "rune_carver",
            name: "Rune Carver",
            desc: [
              "Starting at 3rd level, you can use magic runes to enhance your gear. You learn two runes of your choice from among the runes described below, and each time you gain a level in this class, you can replace one rune you know with a different one from this feature.",
              "You learn one additional rune at Fighter levels 7, 10, and 15.",
              "Whenever you finish a long rest, you can touch a number of objects equal to the number of runes you know, and you inscribe a different rune onto each of the objects.",
              "To be eligible, an object must be a weapon, a suit of armor, a shield, a piece of jewelry, or something else you can wear or hold in a hand.",
              "Your rune remains on an object until you finish a long rest, and an object can bear only one of your runes at a time.",
              "Rune Magic save DC: 8 + proficiency bonus + Constitution modifier.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "giant_might",
            name: "Giant's Might",
            desc: [
              "At 3rd level, you have learned how to imbue yourself with the might of giants. As a bonus action, you magically gain the following benefits, which last for 1 minute:",
              "If you are smaller than Large, you become Large, along with anything you are wearing. If you lack the room to become Large, your size doesn't change.",
              "You have advantage on Strength checks and Strength saving throws.",
              "Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d6 damage to a target on a hit.",
              "You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.",
            ],
            level: 3,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "runic_shield",
            name: "Runic Shield",
            desc: [
              "At 7th level, you learn to invoke your rune magic to protect your allies. When another creature you can see within 60 feet of you is hit by an attack roll, you can use your reaction to force the attacker to reroll the d20 and use the new roll.",
              "You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "great_stature",
            name: "Great Stature",
            desc: [
              "By 10th level, the magic of your runes permanently alters you. When you gain this feature, roll 3d4. You grow a number of inches in height equal to the roll.",
              "Moreover, the extra damage you deal with your Giant's Might feature increases to 1d8.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "master_of_runes",
            name: "Master of Runes",
            desc: [
              "At 15th level, you can invoke each rune you know from your Rune Carver feature twice, rather than once, and you regain all expended uses when you finish a short or long rest.",
            ],
            level: 15,
            tracked: false,
          },
          {
            id: "runic_juggernaut",
            name: "Runic Juggernaut",
            desc: [
              "At 18th level, you learn how to amplify your rune-powered transformation. As a result, the extra damage you deal with the Giant's Might feature increases to 1d10.",
              "Moreover, when you use that feature, your size can increase to Huge, and while you are that size, your reach increases by 5 feet.",
            ],
            level: 18,
            tracked: false,
          },
        ],
        runes: [
          {
            id: "cloud",
            name: "Cloud Rune",
            levelRequirement: 3,
            desc: [
              "While wearing or carrying an object inscribed with this rune, you have advantage on Dexterity (Sleight of Hand) checks and Charisma (Deception) checks.",
              "In addition, when you or a creature you can see within 30 feet of you is hit by an attack roll, you can use your reaction to invoke the rune and choose a different creature within 30 feet of you, other than the attacker. The chosen creature becomes the target of the attack, using the same roll. This magic can transfer the attack's effects regardless of the attack's range.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
          {
            id: "fire",
            name: "Fire Rune",
            levelRequirement: 3,
            desc: [
              "While wearing or carrying an object inscribed with this rune, your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool.",
              "In addition, when you hit a creature with an attack using a weapon, you can invoke the rune to summon fiery shackles: the target takes an extra 2d6 fire damage, and it must succeed on a Strength saving throw or be restrained for 1 minute. While restrained by the shackles, the target takes 2d6 fire damage at the start of each of its turns. The target can repeat the saving throw at the end of each of its turns, banishing the shackles on a success.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
          {
            id: "frost",
            name: "Frost Rune",
            levelRequirement: 3,
            desc: [
              "While wearing or carrying an object inscribed with this rune, you have advantage on Wisdom (Animal Handling) checks and Charisma (Intimidation) checks.",
              "In addition, you can invoke the rune as a bonus action to increase your sturdiness. For 10 minutes, you gain a +2 bonus to all ability checks and saving throws that use Strength or Constitution.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
          {
            id: "stone",
            name: "Stone Rune",
            levelRequirement: 3,
            desc: [
              "While wearing or carrying an object inscribed with this rune, you have advantage on Wisdom (Insight) checks, and you have darkvision out to a range of 120 feet.",
              "In addition, when a creature you can see ends its turn within 30 feet of you, you can use your reaction to invoke the rune and force the creature to make a Wisdom saving throw. Unless the save succeeds, the creature is charmed by you for 1 minute. While charmed in this way, the creature has a speed of 0 and is incapacitated, descending into a dreamy stupor. The creature repeats the saving throw at the end of each of its turns, ending the effect on a success.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
          {
            id: "hill",
            name: "Hill Rune",
            levelRequirement: 7,
            desc: [
              "While wearing or carrying an object that bears this rune, you have advantage on saving throws against being poisoned, and you have resistance against poison damage.",
              "In addition, you can invoke the rune as a bonus action, gaining resistance to bludgeoning, piercing, and slashing damage for 1 minute.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
          {
            id: "storm",
            name: "Storm Rune",
            levelRequirement: 7,
            desc: [
              "While wearing or carrying an object inscribed with this rune, you have advantage on Intelligence (Arcana) checks, and you can't be surprised as long as you aren't incapacitated.",
              "In addition, you can invoke this rune as a bonus action to enter a prophetic state for 1 minute or until you're incapacitated. Until the state ends, when you or another creature you can see within 60 feet of you makes an attack roll, a saving throw, or an ability check, you can use your reaction to cause the roll to have advantage or disadvantage.",
              "Once you invoke this rune, you can't do so again until you finish a short or long rest.",
            ],
          },
        ],
      },
      samurai: {
        features: [
          {
            id: "fighting_spirit",
            name: "Fighting Spirit",
            desc: [
              "Starting at 3rd level, your intensity in battle can shield you and help you strike true. As a bonus action on your turn, you can give yourself advantage on all weapon attack rolls until the end of the current turn. When you do so, you also gain 5 temporary hit points. The number of hit points increases when you reach certain levels in this class, increasing to 10 at 10th level and 15 at 15th level.",
              "You can use this feature three times. You regain all expended uses of it when you finish a long rest.",
            ],
            level: 3,
            tracked: true,
            uses: 3,
            recharge: "lr",
          },
          {
            id: "elegant_courtier",
            name: "Elegant Courtier",
            desc: [
              "Starting at 7th level, your discipline and attention to detail allow you to excel in social situations. Whenever you make a Charisma (Persuasion) check, you gain a bonus to the check equal to your Wisdom modifier.",
              "Your self-control also causes you to gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
            ],
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
            desc: "Starting at 15th level, you learn to trade accuracy for swift strikes. If you take the Attack action on your turn and have advantage on an attack roll against one of the targets, you can forgo the advantage for that roll to make an additional weapon attack against that target, as part of the same action. You can do so no more than once per turn.",
            level: 15,
            tracked: false,
          },
          {
            id: "strength_before_death",
            name: "Strength Before Death",
            desc: [
              "Starting at 18th level, your fighting spirit can delay the grasp of death. If you take damage that reduces you to 0 hit points, you can use your reaction to delay falling unconscious, and you can immediately take an extra turn. While you have 0 hit points during that extra turn, taking damage causes death saving throw failures as normal, and three death saving throw failures can still kill you. When the extra turn ends, you fall unconscious if you still have 0 hit points.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
        id: "ki",
        name: "Ki",
        desc: [
          "Starting at 2nd level, your training allows you to harness the mystic energy of ki.",
          "You have a number of ki points equal to your monk level, and you can spend them to fuel various ki features.",
          "When you spend ki, it returns when you finish a short or long rest (with at least 30 minutes of meditation).",
        ],
        level: 2,
        tracked: true,
        trackedMode: "poolDropdown",
        poolMax: "character_level",
        recharge: "sr_or_lr",
      },
      {
        id: "deflect_missiles",
        name: "Deflect Missiles",
        desc: [
          "Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack.",
          "The damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.",
          "If you reduce the damage to 0, you can catch the missile (if it is small enough and you have a free hand). If you catch it, you can spend 1 ki point to make a ranged attack with it as part of the same reaction.",
        ],
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
        id: "ki_empowered_strikes",
        name: "Ki-Empowered Strikes",
        desc: "Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
        level: 6,
        tracked: false,
      },
      {
        id: "evasion",
        name: "Evasion",
        desc: "At 7th level, when you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
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
        id: "purity_of_body",
        name: "Purity of Body",
        desc: "At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.",
        level: 10,
        tracked: false,
      },
      {
        id: "diamond_soul",
        name: "Diamond Soul",
        desc: [
          "Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.",
          "Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.",
        ],
        level: 14,
        tracked: false,
      },
      {
        id: "timeless_body",
        name: "Timeless Body",
        desc: [
          "At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically.",
          "You can still die of old age, however. In addition, you no longer need food or water.",
        ],
        level: 15,
        tracked: false,
      },
      {
        id: "empty_body",
        name: "Empty Body",
        desc: [
          "Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.",
          "Additionally, you can spend 8 ki points to cast astral projection without needing material components. When you do so, you can't take any other creatures with you.",
        ],
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
      astralSelf: {
        // Source (feature text): https://dnd5e.wikidot.com/monk:astral-self (CC BY-SA 3.0)
        features: [
          {
            id: "arms_of_the_astral_self",
            name: "Arms of the Astral Self",
            desc: [
              "At 3rd level, your mastery of your ki allows you to summon a portion of your astral self.",
              "As a bonus action, you can spend 1 ki point to summon the arms of your astral self. When you do so, each creature of your choice that you can see within 10 feet of you must succeed on a Dexterity saving throw or take force damage equal to two rolls of your Martial Arts die.",
              "For 10 minutes, these spectral arms hover near your shoulders or surround your arms (your choice). You determine the arms' appearance, and they vanish early if you are incapacitated or die.",
              "While the spectral arms are present, you gain the following benefits:",
              "You can use your Wisdom modifier in place of your Strength modifier when making Strength checks and Strength saving throws.",
              "You can use the spectral arms to make unarmed strikes. When you make an unarmed strike with the arms on your turn, your reach for it is 5 feet greater than normal.",
              "The unarmed strikes you make with the arms can use your Wisdom modifier in place of your Strength or Dexterity modifier for the attack and damage rolls, and their damage type is force.",
            ],
            level: 3,
            tracked: true,
          },
          {
            id: "visage_of_the_astral_self",
            name: "Visage of the Astral Self",
            desc: [
              "When you reach 6th level, you can summon the visage of your astral self.",
              "As a bonus action, or as part of the bonus action you take to activate Arms of the Astral Self, you can spend 1 ki point to summon this visage for 10 minutes. It vanishes early if you are incapacitated or die.",
              "The spectral visage covers your face like a helmet or mask. You determine its appearance.",
              "While the spectral visage is present, you gain the following benefits:",
              "Astral Sight. You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.",
              "Wisdom of the Spirit. You have advantage on Wisdom (Insight) and Charisma (Intimidation) checks.",
              "Word of the Spirit. When you speak, you can direct your words to a creature of your choice that you can see within 60 feet of you, making it so only that creature can hear you. Alternatively, you can amplify your voice so that all creatures within 600 feet can hear you.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "body_of_the_astral_self",
            name: "Body of the Astral Self",
            desc: [
              "Starting at 11th level, when you have both your astral arms and visage summoned, you can cause the body of your astral self to appear (no action required).",
              "This spectral body covers your physical form like a suit of armor, connecting with the arms and visage. You determine its appearance.",
              "While the spectral body is present, you gain the following benefits:",
              "Deflect Energy. When you take acid, cold, fire, force, lightning, or thunder damage, you can use your reaction to deflect it. When you do so, the damage you take is reduced by 1d10 + your Wisdom modifier (minimum reduction of 1).",
              "Empowered Arms. Once on each of your turns when you hit a target with the Arms of the Astral Self, you can deal extra damage to the target equal to your Martial Arts die.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "awakened_astral_self",
            name: "Awakened Astral Self",
            desc: [
              "Starting at 17th level, your connection to your astral self is complete, allowing you to unleash its full potential.",
              "As a bonus action, you can spend 5 ki points to summon the arms, visage, and body of your astral self and awaken it for 10 minutes. This awakening ends early if you are incapacitated or die.",
              "While your astral self is awakened, you gain the following benefits:",
              "Armor of the Spirit. You gain a +2 bonus to Armor Class.",
              "Astral Barrage. Whenever you use the Extra Attack feature to attack twice, you can instead attack three times if all the attacks are made with your astral arms.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      ascendantDragon: {
        features: [
          {
            id: "draconic_disciple",
            name: "Draconic Disciple",
            desc: [
              "At 3rd level, you can channel draconic power to magnify your presence and imbue your unarmed strikes with the essence of a dragon's breath. You gain the following benefits:",
              "Draconic Presence. If you fail a Charisma (Intimidation) or Charisma (Persuasion) check, you can use your reaction to reroll the check, as you tap into the mighty presence of dragons. Once this feature turns a failure into a success, you can't use it again until you finish a long rest.",
              "Draconic Strike. When you damage a target with an unarmed strike, you can change the damage type to acid, cold, fire, lightning, or poison.",
              "Tongue of Dragons. You learn to speak, read, and write Draconic or one other language of your choice.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "breath_of_the_dragon",
            name: "Breath of the Dragon",
            desc: [
              "When you take the Attack action, you can replace one attack with a breath weapon (20-foot cone or 30-foot line, 5 feet wide).",
              "Creatures in the area make a Dexterity save vs your ki save DC; on a fail they take damage equal to two rolls of your Martial Arts die (half on a success).",
              "At monk level 11, the damage increases to three rolls of your Martial Arts die.",
              "Uses equal to your proficiency bonus; you regain all uses on a long rest. If you have no uses remaining, you can spend 2 ki to use it again.",
            ],
            level: 3,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "wings_unfurled",
            name: "Wings Unfurled",
            desc: [
              "When you use Step of the Wind, you can manifest spectral draconic wings until the end of your turn.",
              "While the wings last, you gain a flying speed equal to your walking speed.",
            ],
            level: 6,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "aspect_of_the_wyrm",
            name: "Aspect of the Wyrm",
            desc: [
              "At 11th level the power of your draconic spirit now radiates from you, warding your allies or inspiring fear in your enemies. As a bonus action, you can create an aura of draconic power that radiates 10 feet from you for 1 minute. For the duration, you gain one of the following effects of your choice:",
              "Frightful Presence. When you create this aura, and as a bonus action on subsequent turns, you can choose a creature within the aura. The target must succeed on a Wisdom saving throw against your ki save DC or become frightened of you for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a successful save.",
              "Resistance. Choose a damage type when you activate this aura: acid, cold, fire, lightning, or poison. You and your allies within the aura have resistance to that damage.",
              "Once you create this aura, you can't create it again until you finish a long rest, unless you expend 3 ki points to create it again.",
            ],
            level: 11,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "ascendant_aspect",
            name: "Ascendant Aspect",
            desc: [
              "Augment Breath. When you use your Breath of the Dragon, you can spend 1 ki point to augment its shape and power. The exhalation of draconic energy becomes either a 60-foot cone or a 90-foot line that is 5 feet wide (your choice), and each creature in that area takes damage equal to four rolls of your Martial Arts die on a failed save, or half as much damage on a successful one.",
              "Blindsight. You gain blindsight out to 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.",
              "Explosive Fury. When you activate your Aspect of the Wyrm, draconic fury explodes from you. Choose any number of creatures you can see in your aura. Each of those creatures must succeed on a Dexterity saving throw against your ki save DC or take 3d10 acid, cold, fire, lightning, or poison damage (your choice).",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:drunken-master (CC BY-SA 3.0)
      drunkenMaster: {
        features: [
          {
            id: "drunken_technique",
            name: "Drunken Technique",
            desc: [
              "At 3rd level, you learn how to twist and turn quickly as part of your Flurry of Blows.",
              "Whenever you use Flurry of Blows, you gain the benefit of the Disengage action,",
              "and your walking speed increases by 10 feet until the end of the current turn.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "tipsy_sway",
            name: "Tipsy Sway",
            desc: [
              "Starting at 6th level, you can move in sudden, swaying ways.",
              "You gain the following benefits.",
              "Leap to Your Feet. When you're prone, you can stand up by spending 5 feet of movement,",
              "rather than half your speed.",
              "Redirect Attack. When a creature misses you with a melee attack roll, you can spend 1 ki point",
              "as a reaction to cause that attack to hit one creature of your choice, other than the attacker,",
              "that you can see within 5 feet of you.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "drunkards_luck",
            name: "Drunkard's Luck",
            desc: [
              "Starting at 11th level, you always seem to get a lucky bounce at the right moment.",
              "When you make an ability check, an attack roll, or a saving throw and have disadvantage,",
              "you can spend 2 ki points to cancel the disadvantage for that roll.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "intoxicated_frenzy",
            name: "Intoxicated Frenzy",
            desc: [
              "At 17th level, you gain the ability to make an overwhelming number of attacks against a group of enemies.",
              "When you use your Flurry of Blows, you can make up to three additional attacks with it",
              "(up to a total of five Flurry of Blows attacks), provided that each Flurry of Blows attack",
              "targets a different creature this turn.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      // Source (feature + discipline text): https://dnd5e.wikidot.com/monk:four-elements (CC BY-SA 3.0)
      // Source (discipline list): https://dnd5e.wikidot.com/monk:four-elements:disciplines (CC BY-SA 3.0)
      fourElements: {
        features: [
          {
            id: "disciple_of_the_elements",
            name: "Disciple of the Elements",
            desc: [
              "At 3rd level, you learn elemental disciplines fueled by ki.",
              "You always know Elemental Attunement, plus one additional discipline of your choice.",
              "You learn one more discipline at Monk levels 6, 11, and 17.",
              "Whenever you learn a new discipline, you can replace one you already know with another discipline.",
              "Some disciplines let you cast spells. You use the spell's normal casting time/rules, but you don't need material components for these casts.",
            ],
            level: 3,
            tracked: false,
          },
        ],
        disciplines: [
          {
            id: "elemental_attunement",
            name: "Elemental Attunement",
            desc: [
              "Action: briefly manipulate elemental forces within 30 feet.",
              "Choose one effect: harmless sensory effect (air/earth/fire/water).",
              "Or instantly light/snuff a candle, torch, or small campfire.",
              "Or chill/warm up to 1 lb. of nonliving material for up to 1 hour.",
              "Or shape a 1-foot cube of earth, fire, water, or mist into a crude form for 1 minute.",
            ],
            costLabel: "0 ki",
            prerequisiteLevel: 3,
          },
          {
            id: "fangs_of_the_fire_snake",
            name: "Fangs of the Fire Snake",
            desc: [
              "When you take the Attack action, you can spend 1 ki to extend flame from your strikes for the rest of the turn.",
              "Your unarmed strike reach increases by 10 feet for that action and the rest of the turn.",
              "These hits deal fire damage instead of bludgeoning.",
              "When you hit, you can spend +1 ki to deal +1d10 fire damage.",
            ],
            costLabel: "1 ki (+1 ki on hit)",
            prerequisiteLevel: 3,
          },
          {
            id: "fist_of_unbroken_air",
            name: "Fist of Unbroken Air",
            desc: [
              "Action: spend 2 ki; choose a creature within 30 feet; it makes a Strength save.",
              "Fail: 3d10 bludgeoning damage, +1d10 per additional ki spent; push up to 20 feet and knock prone.",
              "Success: half damage; no push/prone.",
            ],
            costLabel: "2+ ki",
            prerequisiteLevel: 3,
          },
          {
            id: "water_whip",
            name: "Water Whip",
            desc: [
              "Action: spend 2 ki; choose a creature you can see within 30 feet; it makes a Dexterity save.",
              "Fail: 3d10 bludgeoning damage, +1d10 per additional ki spent; pull up to 25 feet or knock prone (your choice).",
              "Success: half damage; no pull/prone.",
            ],
            costLabel: "2+ ki",
            prerequisiteLevel: 3,
          },
          {
            id: "shape_the_flowing_river",
            name: "Shape the Flowing River",
            desc: [
              "Action: spend 1 ki; choose an area of ice or water (up to 30 feet on a side) within 120 feet.",
              "You can freeze/thaw the water and reshape ice however you like (raise/lower, trench, wall, pillar, etc.).",
              "The extent of changes can't exceed half the area's largest dimension, and you can't trap or harm creatures with the shaping.",
            ],
            costLabel: "1 ki",
            prerequisiteLevel: 3,
          },
          {
            id: "fist_of_four_thunders",
            name: "Fist of Four Thunders",
            desc: ["Spend 2 ki to cast Thunderwave."],
            costLabel: "2 ki",
            prerequisiteLevel: 3,
          },
          {
            id: "rush_of_the_gale_spirits",
            name: "Rush of the Gale Spirits",
            desc: ["Spend 2 ki to cast Gust of Wind."],
            costLabel: "2 ki",
            prerequisiteLevel: 3,
          },
          {
            id: "sweeping_cinder_strike",
            name: "Sweeping Cinder Strike",
            desc: [
              "Spend 2 ki to cast Burning Hands.",
              "At Monk level 5+, you can spend additional ki to cast it at a higher level (if your table uses the optional scaling rule from the tradition).",
            ],
            costLabel: "2+ ki",
            prerequisiteLevel: 3,
          },
          {
            id: "clench_of_the_north_wind",
            name: "Clench of the North Wind",
            desc: ["Spend 3 ki to cast Hold Person."],
            costLabel: "3 ki",
            prerequisiteLevel: 6,
          },
          {
            id: "gong_of_the_summit",
            name: "Gong of the Summit",
            desc: ["Spend 3 ki to cast Shatter."],
            costLabel: "3 ki",
            prerequisiteLevel: 6,
          },
          {
            id: "flames_of_the_phoenix",
            name: "Flames of the Phoenix",
            desc: ["Spend 4 ki to cast Fireball."],
            costLabel: "4 ki",
            prerequisiteLevel: 11,
          },
          {
            id: "mist_stance",
            name: "Mist Stance",
            desc: ["Spend 4 ki to cast Gaseous Form (self)."],
            costLabel: "4 ki",
            prerequisiteLevel: 11,
          },
          {
            id: "ride_the_wind",
            name: "Ride the Wind",
            desc: ["Spend 4 ki to cast Fly (self)."],
            costLabel: "4 ki",
            prerequisiteLevel: 11,
          },
          {
            id: "breath_of_winter",
            name: "Breath of Winter",
            desc: ["Spend 6 ki to cast Cone of Cold."],
            costLabel: "6 ki",
            prerequisiteLevel: 17,
          },
          {
            id: "eternal_mountain_defense",
            name: "Eternal Mountain Defense",
            desc: ["Spend 5 ki to cast Stoneskin (self)."],
            costLabel: "5 ki",
            prerequisiteLevel: 17,
          },
          {
            id: "river_of_hungry_flame",
            name: "River of Hungry Flame",
            desc: ["Spend 5 ki to cast Wall of Fire."],
            costLabel: "5 ki",
            prerequisiteLevel: 17,
          },
          {
            id: "wave_of_rolling_earth",
            name: "Wave of Rolling Earth",
            desc: ["Spend 6 ki to cast Wall of Stone."],
            costLabel: "6 ki",
            prerequisiteLevel: 17,
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:kensei (CC BY-SA 3.0)
      kensei: {
        features: [
          {
            id: "kensei_weapons",
            name: "Kensei Weapons",
            desc: [
              "Choose two types of weapons to be your kensei weapons: one melee and one ranged.",
              "Each must be a simple or martial weapon that lacks the heavy and special properties (longbow is also allowed).",
              "You gain proficiency with these weapons if you don't already have it.",
              "Weapons of the chosen types are monk weapons for you, and many tradition features work only with your kensei weapons.",
              "When you reach Monk levels 6, 11, and 17, you can choose another weapon type (melee or ranged) to be a kensei weapon, using the same criteria.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "agile_parry",
            name: "Agile Parry",
            desc: [
              "If you make an unarmed strike as part of the Attack action on your turn and are holding a kensei weapon, you can use it to defend yourself (melee weapon only).",
              "You gain a +2 bonus to AC until the start of your next turn while the weapon is in your hand and you aren't incapacitated.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "kenseis_shot",
            name: "Kensei's Shot",
            desc: [
              "As a bonus action, you make your ranged attacks with a kensei weapon more deadly.",
              "Until the end of the current turn, any target you hit with a ranged attack using a kensei weapon takes an extra 1d4 damage of the weapon's type.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "way_of_the_brush",
            name: "Way of the Brush",
            desc: ["You gain proficiency with your choice of calligrapher's supplies or painter's supplies."],
            level: 3,
            tracked: false,
          },
          {
            id: "magic_kensei_weapons",
            name: "Magic Kensei Weapons",
            desc: [
              "At 6th level, your attacks with your kensei weapons count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "deft_strike",
            name: "Deft Strike",
            desc: [
              "When you hit a target with a kensei weapon, you can spend 1 ki point to cause the weapon to deal extra damage equal to your Martial Arts die.",
              "You can use this feature only once on each of your turns.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "sharpen_the_blade",
            name: "Sharpen the Blade",
            desc: [
              "As a bonus action, you can expend up to 3 ki points to grant one kensei weapon you touch a bonus to attack and damage rolls.",
              "The bonus equals the number of ki points spent and lasts for 1 minute (or until you use this feature again).",
              "This has no effect on a magic weapon that already has a bonus to attack and damage rolls.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "unerring_accuracy",
            name: "Unerring Accuracy",
            desc: [
              "If you miss with an attack roll using a monk weapon on your turn, you can reroll it.",
              "You can use this feature only once on each of your turns.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:long-death (CC BY-SA 3.0)
      longDeath: {
        features: [
          {
            id: "touch_of_death",
            name: "Touch of Death",
            desc: "Starting when you choose this tradition at 3rd level, your study of death allows you to extract vitality from another creature as it nears its demise. When you reduce a creature within 5 feet of you to 0 hit points, you gain temporary hit points equal to your Wisdom modifier + your monk level (minimum of 1 temporary hit point).",
            level: 3,
            tracked: false,
          },
          {
            id: "hour_of_reaping",
            name: "Hour of Reaping",
            desc: "At 6th level, you gain the ability to unsettle or terrify those around you as an action, for your soul has been touched by the shadow of death. When you take this action, each creature within 30 feet of you that can see you must succeed on a Wisdom saving throw or be frightened of you until the end of your next turn.",
            level: 6,
            tracked: false,
          },
          {
            id: "mastery_of_death",
            name: "Mastery of Death",
            desc: "Beginning at 11th level, you use your familiarity with death to escape its grasp. When you are reduced to 0 hit points, you can expend 1 ki point (no action required) to have 1 hit point instead.",
            level: 11,
            tracked: false,
          },
          {
            id: "touch_of_the_long_death",
            name: "Touch of the Long Death",
            desc: "Starting at 17th level, your touch can channel the energy of death into a creature. As an action, you touch one creature within 5 feet of you, and you expend 1 to 10 ki points. The target must make a Constitution saving throw, and it takes 2d10 necrotic damage per ki point spent on a failed save, or half as much damage on a successful one.",
            level: 17,
            tracked: false,
          },
        ],
      },
      mercy: {
        features: [
          {
            id: "hands_of_healing",
            name: "Hands of Healing",
            desc: [
              "At 3rd level, your mystical touch can mend wounds.",
              "As an action, you can spend 1 ki point to touch a creature and restore a number of hit points equal to a roll of your Martial Arts die + your Wisdom modifier.",
              "When you use your Flurry of Blows, you can replace one of the unarmed strikes with a use of this feature without spending a ki point for the healing.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "hands_of_harm",
            name: "Hands of Harm",
            desc: [
              "At 3rd level, you use your ki to inflict wounds.",
              "When you hit a creature with an unarmed strike, you can spend 1 ki point to deal extra necrotic damage equal to one roll of your Martial Arts die + your Wisdom modifier.",
              "You can use this feature only once per turn.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "physicians_touch",
            name: "Physician's Touch",
            desc: [
              "Starting at 6th level, your healing and harming touches improve.",
              "When you use Hands of Healing on a creature, you can also end one disease or one of the following conditions affecting the creature: blinded, deafened, paralyzed, poisoned, or stunned.",
              "When you use Hands of Harm on a creature, you can subject that creature to the poisoned condition until the end of your next turn.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "flurry_of_healing_and_harm",
            name: "Flurry of Healing and Harm",
            desc: [
              "Starting at 11th level, when you use Flurry of Blows, you can replace each of the unarmed strikes with a use of your Hands of Healing, without spending ki points for the healing.",
              "In addition, when you make an unarmed strike with Flurry of Blows, you can use Hands of Harm with that strike without spending the ki point for Hands of Harm (still only once per turn).",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "hand_of_ultimate_mercy",
            name: "Hand of Ultimate Mercy",
            desc: [
              "By 17th level, you can touch the corpse of a creature that died within the past 24 hours and expend 5 ki points to return it to life.",
              "The creature regains hit points equal to 4d10 + your Wisdom modifier, and it revives with the following conditions removed (if present): blinded, deafened, paralyzed, poisoned, and stunned.",
            ],
            level: 17,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:open-hand (CC BY-SA 3.0)
      openHand: {
        features: [
          {
            id: "open_hand_technique",
            name: "Open Hand Technique",
            desc: [
              "Starting at 3rd level, you can manipulate an enemy's ki when you use Flurry of Blows.",
              "Whenever you hit a creature with one of the Flurry of Blows attacks, choose one effect: knock it prone (Dex save), push it up to 15 feet away (Str save), or prevent it from taking reactions until the end of your next turn.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "wholeness_of_body",
            name: "Wholeness of Body",
            desc: [
              "At 6th level, you can heal yourself as an action, regaining hit points equal to three times your monk level.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "tranquility",
            name: "Tranquility",
            desc: [
              "Beginning at 11th level, at the end of a long rest you gain the effect of Sanctuary until the start of your next long rest (it can end early as normal).",
              "The saving throw DC is 8 + your proficiency bonus + your Wisdom modifier.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "quivering_palm",
            name: "Quivering Palm",
            desc: [
              "At 17th level, when you hit a creature with an unarmed strike, you can spend 3 ki points to start subtle vibrations in the target.",
              "Before the vibrations expire (days equal to your monk level), you can use your action to end them if you're on the same plane. The target makes a Constitution save; on a failure it drops to 0 hit points, and on a success it takes 10d10 necrotic damage.",
              "Only one creature can be affected at a time; you can also end the vibrations harmlessly.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:shadow (CC BY-SA 3.0)
      shadow: {
        features: [
          {
            id: "shadow_arts",
            name: "Shadow Arts",
            desc: [
              "Starting when you choose this tradition at 3rd level, you can use your ki to duplicate the effects of certain spells.",
              "As an action, you can spend 2 ki points to cast darkness, darkvision, pass without trace, or silence, without providing material components.",
              "Additionally, you gain the minor illusion cantrip if you don't already know it.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "shadow_step",
            name: "Shadow Step",
            desc: [
              "At 6th level, you gain the ability to step from one shadow into another.",
              "When you are in dim light or darkness, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness.",
              "You then have advantage on the first melee attack you make before the end of the turn.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "cloak_of_shadows",
            name: "Cloak of Shadows",
            desc: [
              "By 11th level, you have learned to become one with the shadows.",
              "When you are in an area of dim light or darkness, you can use your action to become invisible.",
              "You remain invisible until you make an attack, cast a spell, or are in an area of bright light.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "opportunist",
            name: "Opportunist",
            desc: [
              "At 17th level, you can exploit a creature's momentary distraction when it is hit by an attack.",
              "Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
      // Source (feature text): https://dnd5e.wikidot.com/monk:sun-soul (CC BY-SA 3.0)
      sunSoul: {
        features: [
          {
            id: "radiant_sun_bolt",
            name: "Radiant Sun Bolt",
            desc: [
              "Starting when you choose this tradition at 3rd level, you can hurl searing bolts of magical radiance.",
              "You gain a new attack option that you can use with the Attack action. This special attack is a ranged spell attack with a range of 30 feet. You are proficient with it, and you add your Dexterity modifier to its attack and damage rolls. Its damage is radiant, and its damage die is a d4. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.",
              "When you take the Attack action on your turn and use this special attack as part of it, you can spend 1 ki point to make the special attack twice as a bonus action.",
              "When you gain the Extra Attack feature, this special attack can be used for any of the attacks you make as part of the Attack action.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "searing_arc_strike",
            name: "Searing Arc Strike",
            desc: [
              "At 6th level, you gain the ability to channel your ki into searing waves of energy. Immediately after you take the Attack action on your turn, you can spend 2 ki points to cast the Burning Hands spell as a bonus action.",
              "You can spend additional ki points to cast Burning Hands as a higher level spell. Each additional ki point you spend increases the spell's level by 1. The maximum number of ki points (2 plus any additional points) that you can spend on the spell equals half your monk level.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "searing_sunburst",
            name: "Searing Sunburst",
            desc: [
              "At 11th level, you gain the ability to create an orb of light that erupts into a devastating explosion. As an action, you magically create an orb and hurl it at a point you choose within 150 feet, where it erupts into a sphere of radiant light for a brief but deadly instant.",
              "Each creature in that 20-foot-radius sphere must succeed on a Constitution saving throw or take 2d6 radiant damage. A creature doesn't need to make the save if the creature is behind total cover that is opaque.",
              "You can increase the sphere's damage by spending ki points. Each point you spend, up to a maximum of 3, increases the damage by 2d6.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "sun_shield",
            name: "Sun Shield",
            desc: [
              "At 17th level, you become wreathed in a luminous, magical aura. You shed bright light in a 30-foot radius and dim light for an additional 30 feet. You can extinguish or restore the light as a bonus action.",
              "If a creature hits you with a melee attack while this light shines, you can use your reaction to deal radiant damage to the creature. The radiant damage equals 5 + your Wisdom modifier.",
            ],
            level: 17,
            tracked: false,
          },
        ],
      },
    },
  },  paladin: {
    hitDice: "D10",
    isSpellCaster: "halfCaster",
    spellcastingAbility: "cha",
    // Source (feature text + fighting style list): https://dnd5e.wikidot.com/paladin (CC BY-SA 3.0)
    fightingStyleOptions: [
      "Blind Fighting",
      "Defense",
      "Dueling",
      "Great Weapon Fighting",
      "Interception",
      "Protection",
      "Blessed Warrior",
      "Close Quarters Shooter",
      "Mariner",
      "Thrown Weapon Fighting",
      "Tunnel Fighter",
      "Unarmed Fighting",
    ],
    classFeatures: [
      {
        id: "divine_sense",
        name: "Divine Sense",
        desc: [
          "The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance).",
          "Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the Hallow spell.",
          "You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.",
        ],
        level: 1,
        tracked: true,
        uses: "1_plus_cha_mod",
        recharge: "lr",
      },
      {
        id: "lay_on_hands",
        name: "Lay on Hands",
        desc: [
          "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level x 5.",
          "As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.",
          "Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.",
          "This feature has no effect on undead and constructs.",
        ],
        level: 1,
        tracked: true,
        trackedMode: "poolInput",
        poolMax: "paladin_level_x5",
        recharge: "lr",
      },
      {
        id: "fighting_style",
        name: "Fighting Style",
        desc: [
          "Starting at 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options.",
          "You can't take a Fighting Style option more than once, even if you later get to choose again.",
        ],
        level: 2,
        tracked: false,
      },
      {
        id: "divine_smite",
        name: "Divine Smite",
        desc: [
          "Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage.",
          "The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.",
        ],
        level: 2,
        tracked: false, //Use spell slots to cast
      },
      {
        id: "channel_divinity",
        name: "Channel Divinity",
        desc: [
          "Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.",
          "When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.",
          "Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.",
        ],
        level: 3,
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
        desc: [
          "Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.",
          "You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.",
        ],
        level: 14,
        tracked: true,
        uses: "cha_mod",
        recharge: "lr",
      },
    ],
    subclasses: {
      ancients: {
        features: [
          {
            id: "channel_divinity_natures_wrath",
            name: "Channel Divinity: Nature's Wrath",
            desc: "You can use your Channel Divinity to invoke primeval forces to ensnare a foe. As an action, you can cause spectral vines to spring up and reach for a creature within 10 feet of you that you can see. The creature must succeed on a Strength or Dexterity saving throw (its choice) or be restrained. While restrained by the vines, the creature repeats the saving throw at the end of each of its turns. On a success, it frees itself and the vines vanish.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_turn_the_faithless",
            name: "Channel Divinity: Turn the Faithless",
            desc: [
              "You can use your Channel Divinity to utter ancient words that are painful for fey and fiends to hear. As an action, you present your holy symbol, and each fey or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
              "A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
              "If the creature's true form is concealed by an illusion, shapeshifting, or other effect, that form is revealed while it is turned.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
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
            uses: 1,
            recharge: "lr",
          },
          {
            id: "elder_champion",
            name: "Elder Champion",
            desc: "At 20th level, you can assume the form of an ancient force of nature using your action. For 1 minute, you gain the following benefits:\n- At the start of each of your turns, regain 10 hit points.\n- Whenever you cast a paladin spell that has a casting time of 1 action, you can cast it using a bonus action instead.\n- Enemy creatures within 10 feet of you have disadvantage on saving throws against your paladin spells and Channel Divinity options.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true, // 1/LR
            uses: 1,
            recharge: "lr",
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
            desc: "You can use your Channel Divinity to exude a terrifying presence. As an action, you force each creature of your choice that you can see within 30 feet of you to make a Wisdom saving throw. On a failed save, a creature becomes frightened of you for 1 minute. The frightened creature can repeat this saving throw at the end of each of its turns, ending the effect on itself on a success.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_guided_strike",
            name: "Channel Divinity: Guided Strike",
            desc: "You can use your Channel Divinity to strike with supernatural accuracy. When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "aura_of_conquest",
            name: "Aura of Conquest",
            desc: "Starting at 7th level, you constantly emanate a menacing aura while you're not incapacitated. The aura extends 10 feet from you in every direction, but not through total cover.\n\nIf a creature is frightened of you, its speed is reduced to 0 while in the aura, and that creature takes psychic damage equal to half your paladin level if it starts its turn there.\n\nAt 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "scornful_rebuke",
            name: "Scornful Rebuke",
            desc: "Starting at 15th level, those who dare to strike you are psychically punished for their audacity. Whenever a creature hits you with an attack, that creature takes psychic damage equal to your Charisma modifier (minimum of 1) if you're not incapacitated.",
            level: 15,
            tracked: false,
          },
          {
            id: "invincible_conqueror",
            name: "Invincible Conqueror",
            desc: "At 20th level, you gain the ability to harness extraordinary martial prowess. As an action, you can magically become an avatar of conquest, gaining the following benefits for 1 minute:\n- You have resistance to all damage.\n- When you take the Attack action on your turn, you can make one additional attack as part of that action.\n- Your melee weapon attacks score a critical hit on a roll of 19 or 20 on the d20.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            // Source: https://dnd5e.wikidot.com/paladin:crown (CC BY-SA 3.0)
            desc: "As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_turn_the_tide",
            name: "Channel Divinity: Turn the Tide",
            // Source: https://dnd5e.wikidot.com/paladin:crown (CC BY-SA 3.0)
            desc: "As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "divine_allegiance",
            name: "Divine Allegiance",
            // Source: https://dnd5e.wikidot.com/paladin:crown (CC BY-SA 3.0)
            desc: "Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.",
            level: 7,
            tracked: false,
          },
          {
            id: "unyielding_saint",
            name: "Unyielding Saint",
            // Source: https://dnd5e.wikidot.com/paladin:crown (CC BY-SA 3.0)
            desc: "Starting at 15th level, you have advantage on saving throws to avoid becoming paralyzed or stunned.",
            level: 15,
            tracked: false,
          },
          {
            id: "exalted_champion",
            name: "Exalted Champion",
            // Source: https://dnd5e.wikidot.com/paladin:crown (CC BY-SA 3.0)
            desc: "At 20th level, your presence on the field of battle is an inspiration to those dedicated to your cause. You can use your action to gain the following benefits for 1 hour:\n- You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.\n- Your allies have advantage on death saving throws while within 30 feet of you.\n- You have advantage on Wisdom saving throws, as do your allies within 30 feet of you.\nThis effect ends early if you are incapacitated or die. Once you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            // Source: https://dnd5e.wikidot.com/paladin:devotion (CC BY-SA 3.0)
            desc: [
              "As an action, you can imbue one weapon you are holding with positive energy, using your Channel Divinity.",
              "For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (minimum bonus of +1). The weapon emits bright light in a 20-foot radius and dim light for 20 feet beyond that. If the weapon isn't already magical, it becomes magical for the duration.",
              "You can end this effect on your turn as part of any other action. The effect also ends if you are no longer holding or carrying this weapon, or if you fall unconscious.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_turn_the_unholy",
            name: "Channel Divinity: Turn the Unholy",
            // Source: https://dnd5e.wikidot.com/paladin:devotion (CC BY-SA 3.0)
            desc: [
              "As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity.",
              "Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
              "A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
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
            // Source: https://dnd5e.wikidot.com/paladin:devotion (CC BY-SA 3.0)
            desc: [
              "At 20th level, as an action, you can emanate an aura of sunlight for 1 minute. Bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.",
              "Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. In addition, you have advantage on saving throws against spells cast by fiends or undead for the duration.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            // Source: https://dnd5e.wikidot.com/paladin:glory (CC BY-SA 3.0)
            desc: "As a bonus action, you can use your Channel Divinity to augment your athleticism. For the next 10 minutes, you have advantage on Strength (Athletics) and Dexterity (Acrobatics) checks; you can carry, push, drag, and lift twice as much weight as normal; and the distance of your long and high jumps increases by 10 feet (this extra distance costs movement as normal).",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_inspiring_smite",
            name: "Channel Divinity: Inspiring Smite",
            // Source: https://dnd5e.wikidot.com/paladin:glory (CC BY-SA 3.0)
            desc: "Immediately after you deal damage to a creature with your Divine Smite feature, you can use your Channel Divinity as a bonus action and distribute temporary hit points to creatures of your choice within 30 feet of you, which can include you. The total number of temporary hit points equals 2d8 + your level in this class, divided among the chosen creatures however you like.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "aura_of_alacrity",
            name: "Aura of Alacrity",
            // Source: https://dnd5e.wikidot.com/paladin:glory (CC BY-SA 3.0)
            desc: [
              "At 7th level, you emanate an aura that fills you and your companions with supernatural speed, allowing you to race across a battlefield in formation. Your walking speed increases by 10 feet. In addition, if you aren't incapacitated, the walking speed of any ally who starts their turn within 5 feet of you increases by 10 feet until the end of that turn.",
              "When you reach 18th level in this class, the range of the aura increases to 10 feet.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "glorious_defense",
            name: "Glorious Defense",
            // Source: https://dnd5e.wikidot.com/paladin:glory (CC BY-SA 3.0)
            desc: [
              "When you reach 15th level, you can turn defense into a sudden strike. When you or another creature you can see within 10 feet of you is hit by an attack roll, you can use your reaction to grant a bonus to the target's AC against that attack, potentially causing it to miss. The bonus equals your Charisma modifier (minimum of +1). If the attack misses, you can make one weapon attack against the attacker as part of this reaction, provided the attacker is within your weapon's range.",
              "You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
            ],
            level: 15,
            tracked: true,
            uses: "cha_mod",
            recharge: "lr",
          },
          {
            id: "living_legend",
            name: "Living Legend",
            // Source: https://dnd5e.wikidot.com/paladin:glory (CC BY-SA 3.0)
            desc: [
              "At 20th level, you can empower yourself with the legends — whether true or exaggerated — of your great deeds. As a bonus action, you gain the following benefits for 1 minute:",
              "- You are blessed with an otherworldly presence, gaining advantage on all Charisma checks.",
              "- Once on each of your turns when you make a weapon attack and miss, you can cause that attack to hit instead.",
              "- If you fail a saving throw, you can use your reaction to reroll it. You must use this new roll.",
              "Once you use this feature, you can’t use it again until you finish a long rest, unless you expend a 5th-level spell slot to use it again.",
            ],
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            // Source: https://dnd5e.wikidot.com/paladin:redemption (CC BY-SA 3.0)
            desc: "You can use your Channel Divinity to augment your presence with divine power. As a bonus action, you grant yourself a +5 bonus to Charisma (Persuasion) checks for the next 10 minutes.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_rebuke_the_violent",
            name: "Channel Divinity: Rebuke the Violent",
            // Source: https://dnd5e.wikidot.com/paladin:redemption (CC BY-SA 3.0)
            desc: "You can use your Channel Divinity to rebuke those who use violence. Immediately after an attacker within 30 feet of you deals damage with an attack against a creature other than you, you can use your reaction to force the attacker to make a Wisdom saving throw. On a failed save, the attacker takes radiant damage equal to the damage it just dealt. On a successful save, it takes half as much damage.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "aura_of_the_guardian",
            name: "Aura of the Guardian",
            // Source: https://dnd5e.wikidot.com/paladin:redemption (CC BY-SA 3.0)
            desc: "Starting at 7th level, you can shield your allies from harm at the cost of your own health. When a creature within 10 feet of you takes damage, you can use your reaction to magically take that damage, instead of that creature taking it. This feature doesn't transfer any other effects that might accompany the damage, and this damage can't be reduced in any way. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "protective_spirit",
            name: "Protective Spirit",
            // Source: https://dnd5e.wikidot.com/paladin:redemption (CC BY-SA 3.0)
            desc: "Starting at 15th level, a holy presence mends your wounds in combat. You regain hit points equal to 1d6 + half your paladin level if you end your turn in combat with fewer than half of your hit points remaining and you aren't incapacitated.",
            level: 15,
            tracked: false,
          },
          {
            id: "emissary_of_redemption",
            name: "Emissary of Redemption",
            // Source: https://dnd5e.wikidot.com/paladin:redemption (CC BY-SA 3.0)
            desc: "At 20th level, you become an avatar of peace, which gives you two benefits:\n- You have resistance to all damage dealt by other creatures (their attacks, spells, and other effects).\n- Whenever a creature hits you with an attack, it takes radiant damage equal to half the damage you take from the attack.\nIf you attack a creature, cast a spell on it, or deal damage to it by any means but this feature, neither benefit works against that creature until you finish a long rest.",
            level: 20,
            tracked: false,
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["sanctuary", "sleep"] },
          { level: 5, spells: ["calm_emotions", "hold_person"] },
          { level: 9, spells: ["counterspell", "hypnotic_pattern"] },
          { level: 13, spells: ["otilukes_resilient_sphere", "stoneskin"] },
          { level: 17, spells: ["hold_monster", "wall_of_force"] },
        ],
      },
      vengeance: {
        features: [
          {
            id: "channel_divinity_abjure_enemy",
            name: "Channel Divinity: Abjure Enemy",
            // Source: https://dnd5e.wikidot.com/paladin:vengeance (CC BY-SA 3.0)
            desc: "As an action, you can present your holy symbol and speak a prayer of denunciation, using your Channel Divinity. Choose one creature within 60 feet of you that you can see. That creature must make a Wisdom saving throw unless it is immune to being frightened. Fiends and undead have disadvantage on this saving throw. On a failed save, the creature is frightened for 1 minute or until it takes any damage. While frightened, the creature's speed is 0 and it can't benefit from any bonus to its speed. On a successful save, the creature's speed is halved for 1 minute or until the creature takes any damage.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_vow_of_enmity",
            name: "Channel Divinity: Vow of Enmity",
            // Source: https://dnd5e.wikidot.com/paladin:vengeance (CC BY-SA 3.0)
            desc: "As a bonus action, you can use your Channel Divinity to utter a vow of enmity against a creature you can see within 10 feet of you, gaining advantage on attack rolls against the creature for 1 minute or until it drops to 0 hit points or falls unconscious.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "relentless_avenger",
            // Source: https://dnd5e.wikidot.com/paladin:vengeance (CC BY-SA 3.0)
            name: "Relentless Avenger",
            desc: "By 7th level, your supernatural focus helps you close off a foe's retreat. When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack and as part of the same reaction. This movement doesn't provoke opportunity attacks.",
            level: 7,
            tracked: false,
          },
          {
            id: "soul_of_vengeance",
            // Source: https://dnd5e.wikidot.com/paladin:vengeance (CC BY-SA 3.0)
            name: "Soul of Vengeance",
            desc: "Starting at 15th level, when a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature if it is within range.",
            level: 15,
            tracked: false,
          },
          {
            id: "avenging_angel",
            // Source: https://dnd5e.wikidot.com/paladin:vengeance (CC BY-SA 3.0)
            name: "Avenging Angel",
            desc: "At 20th level, you can assume the form of an angelic avenger. Using your action, you undergo a transformation. For 1 hour, you gain the following benefits:\n- Wings sprout from your back and grant you a flying speed of 60 feet.\n- You emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there during a battle, the creature must succeed on a Wisdom saving throw or become frightened of you for 1 minute or until it takes any damage. Attack rolls against the frightened creature have advantage.\nOnce you use this feature, you can't use it again until you finish a long rest.",
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["bane", "hunters_mark"] },
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
            // Source: https://dnd5e.wikidot.com/paladin:watchers (CC BY-SA 3.0)
            desc: [
              "As an action, you can use your Channel Divinity to invest your presence with the warding power of your faith.",
              "You can choose a number of creatures you can see within 30 feet of you, up to a number equal to your Charisma modifier (minimum of one creature). For 1 minute, you and the chosen creatures have advantage on Intelligence, Wisdom, and Charisma saving throws.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_abjure_the_extraplanar",
            name: "Channel Divinity: Abjure the Extraplanar",
            // Source: https://dnd5e.wikidot.com/paladin:watchers (CC BY-SA 3.0)
            desc: [
              "As an action, you can present your holy symbol and use your Channel Divinity to castigate unworldly beings.",
              "Each aberration, celestial, elemental, fey, or fiend within 30 feet of you that can hear you must make a Wisdom saving throw. On a failed save, the creature is turned for 1 minute or until it takes damage.",
              "A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly end its move in a space within 30 feet of you. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can take the Dodge action.",
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "aura_of_the_sentinel",
            name: "Aura of the Sentinel",
            // Source: https://dnd5e.wikidot.com/paladin:watchers (CC BY-SA 3.0)
            desc: "At 7th level, you emit an aura of alertness while you aren't incapacitated. When you and any creatures of your choice within 10 feet of you roll initiative, you all gain a bonus to initiative equal to your proficiency bonus. At 18th level, the range of this aura increases to 30 feet.",
            level: 7,
            tracked: false,
          },
          {
            id: "vigilant_rebuke",
            name: "Vigilant Rebuke",
            // Source: https://dnd5e.wikidot.com/paladin:watchers (CC BY-SA 3.0)
            desc: "At 15th level, you've learned how to chastise anyone who dares wield beguilements against you and your wards. Whenever you or a creature you can see within 30 feet of you succeeds on an Intelligence, a Wisdom, or a Charisma saving throw, you can use your reaction to deal 2d8 + your Charisma modifier force damage to the creature that forced the saving throw.",
            level: 15,
            tracked: false,
          },
          {
            id: "mortal_bulwark",
            name: "Mortal Bulwark",
            // Source: https://dnd5e.wikidot.com/paladin:watchers (CC BY-SA 3.0)
            desc: [
              "At 20th level, as a bonus action, you manifest a spark of divine power in defense of the mortal realms. For 1 minute, you gain the following benefits:",
              "- You gain truesight with a range of 120 feet.",
              "- You have advantage on attack rolls against aberrations, celestials, elementals, fey, and fiends.",
              "- When you hit a creature with an attack roll and deal damage to it, you can also force it to make a Charisma saving throw against your spell save DC. On a failed save, the creature is magically banished to its native plane of existence if it's currently not there. On a successful save, the creature can't be banished by this feature for 24 hours.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
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
            id: "channel_divinity_control_undead",
            name: "Channel Divinity: Control Undead",
            // Source: https://dnd5e.wikidot.com/paladin:oathbreaker (CC BY-SA 3.0)
            desc: "As an action, you target one undead creature you can see within 30 feet of you. The target must make a Wisdom saving throw. On a failed save, the target must obey your commands for the next 24 hours, or until you use this Channel Divinity option again. An undead whose challenge rating is equal to or greater than your paladin level is immune to this effect.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "channel_divinity_dreadful_aspect",
            name: "Channel Divinity: Dreadful Aspect",
            // Source: https://dnd5e.wikidot.com/paladin:oathbreaker (CC BY-SA 3.0)
            desc: "As an action, you channel the darkest emotions and focus them into a burst of magical menace. Each creature of your choice within 30 feet of you must make a Wisdom saving throw if it can see you. On a failed save, the target is frightened of you for 1 minute. If a creature frightened by this effect ends its turn more than 30 feet away from you, it can attempt another Wisdom saving throw to end the effect on it.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
            sharedUsePoolKey: "channel_divinity",
          },
          {
            id: "aura_of_hate",
            name: "Aura of Hate",
            // Source: https://dnd5e.wikidot.com/paladin:oathbreaker (CC BY-SA 3.0)
            desc: [
              "Starting at 7th level you, as well any fiends and undead within 10 feet of you, gain a bonus to melee weapon damage rolls equal to your Charisma modifier (minimum of +1). A creature can benefit from this feature from only one paladin at a time.",
              "At 18th level, the range of this aura increases to 30 feet.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "supernatural_resistance",
            name: "Supernatural Resistance",
            // Source: https://dnd5e.wikidot.com/paladin:oathbreaker (CC BY-SA 3.0)
            desc: "Starting at 15th level, you gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
            level: 15,
            tracked: false,
          },
          {
            id: "dread_lord",
            name: "Dread Lord",
            // Source: https://dnd5e.wikidot.com/paladin:oathbreaker (CC BY-SA 3.0)
            desc: [
              "At 20th level, you can, as an action, surround yourself with an aura of gloom that lasts for 1 minute. The aura reduces any bright light in a 30-foot radius around you to dim light. Whenever an enemy that is frightened by you starts its turn in the aura, it takes 4d10 psychic damage. Additionally, you and any creatures of your choosing in the aura are draped in deeper shadow. Creatures that rely on sight have disadvantage on attack rolls against creatures draped in this shadow.",
              "While the aura lasts, you can use a bonus action on your turn to cause the shadows in the aura to attack one creature. Make a melee spell attack against the target. If the attack hits, the target takes necrotic damage equal to 3d10 + your Charisma modifier.",
              "After activating the aura, you can't do so again until you finish a long rest.",
            ],
            level: 20,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["hellish_rebuke", "inflict_wounds"] },
          { level: 5, spells: ["crown_of_madness", "darkness"] },
          { level: 9, spells: ["animate_dead", "bestow_curse"] },
          { level: 13, spells: ["blight", "confusion"] },
          { level: 17, spells: ["contagion", "dominate_person"] },
        ],
      },
    },
  },
  ranger: {
    hitDice: "D10",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "wis",
    // Source (feature text + fighting style list): https://dnd5e.wikidot.com/ranger (CC BY-SA 3.0)
    fightingStyleOptions: [
      "Archery",
      "Blind Fighting",
      "Defense",
      "Druidic Warrior",
      "Dueling",
      "Thrown Weapon Fighting",
      "Two-Weapon Fighting",
      "Close Quarters Shooter (UA)",
      "Interception (UA)",
      "Mariner (UA)",
      "Tunnel Fighter (UA)",
      "Unarmed Fighting (UA)",
    ],
    classFeatures: [
      {
        id: "favored_enemy",
        name: "Favored Enemy",
        desc: [
          "Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.",
          "Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.",
          "You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.",
          "When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.",
          "You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.",
        ],
        level: 1,
        tracked: false,
      },
      {
        id: "natural_explorer",
        name: "Natural Explorer",
        desc: [
          "Also at 1st level, you are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark.",
          "When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you’re proficient in.",
          "While traveling for an hour or more in your favored terrain, you gain the following benefits:",
          "• Difficult terrain doesn’t slow your group’s travel.",
          "• Your group can’t become lost except by magical means.",
          "• Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.",
          "• If you are traveling alone, you can move stealthily at a normal pace.",
          "• When you forage, you find twice as much food as you normally would.",
          "• While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.",
          "You choose additional favored terrain types at 6th and 10th level.",
        ],
        level: 1,
        tracked: false,
      },
      {
        id: "fighting_style",
        name: "Fighting Style",
        desc: [
          "At 2nd level, you adopt a particular style of fighting as your specialty. Choose one Fighting Style option.",
          "You can't take a Fighting Style option more than once, even if you later get to choose again.",
        ],
        level: 2,
        tracked: false,
      },
      {
        id: "primeval_awareness",
        name: "Primeval Awareness",
        desc:
          "Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn’t reveal the creatures’ location or number.",
        level: 3,
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
        id: "land_stride",
        name: "Land's Stride",
        desc: [
          "Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.",
          "In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the Entangle spell.",
        ],
        level: 8,
        tracked: false,
      },
      {
        id: "hide_in_plain_sight",
        name: "Hide in Plain Sight",
        desc: [
          "Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.",
          "Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.",
        ],
        level: 10,
        tracked: false,
      },
      {
        id: "vanish",
        name: "Vanish",
        desc: "Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.",
        level: 14,
        tracked: false,
      },
      {
        id: "feral_senses",
        name: "Feral Senses",
        desc: [
          "At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it.",
          "You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.",
        ],
        level: 18,
        tracked: false,
      },
      {
        id: "foe_slayer",
        name: "Foe Slayer",
        desc:
          "At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.",
        level: 20,
        tracked: false,
      },
    ],
    subclasses: {
      // Source (feature text): https://dnd5e.wikidot.com/ranger:beast-master (CC BY-SA 3.0)
      beastMaster: {
        features: [
          {
            id: "ranger_companion",
            name: "Ranger's Companion",
            desc: [
              "At 3rd level, you gain a beast companion that accompanies you on your adventures and is trained to fight alongside you. Choose a beast that is no larger than Medium and that has a challenge rating of 1/4 or lower (Player's Handbook Appendix D presents statistics for the hawk, mastiff, and panther as examples). Add your proficiency bonus to the beast's AC, attack rolls, and damage rolls, as well as to any saving throws and skills it is proficient in.",
              "Its hit point maximum equals its normal maximum or four times your ranger level, whichever is higher. Like any creature, the beast can spend Hit Dice during a short rest.",
              "The beast obeys your commands as best as it can. It takes its turn on your initiative. On your turn, you can verbally command the beast where to move (no action required by you). You can use your action to verbally command it to take the Attack, Dash, Disengage, or Help action. If you don't issue a command, the beast takes the Dodge action. Once you have the Extra Attack feature, you can make one weapon attack yourself when you command the beast to take the Attack action.",
              "While traveling through your favored terrain with only the beast, you can move stealthily at a normal pace.",
              "If you are incapacitated or absent, the beast acts on its own, focusing on protecting you and itself. The beast never requires your command to use its reaction, such as when making an opportunity attack.",
              "If the beast dies, you can obtain another one by spending 8 hours magically bonding with another beast that isn't hostile to you, either the same type of beast as before or a different one.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "exceptional_training",
            name: "Exceptional Training",
            desc: "Beginning at 7th level, on any of your turns when your beast companion doesn't attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn. In addition, the beast's attacks now count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.",
            level: 7,
            tracked: false,
          },
          {
            id: "bestial_fury",
            name: "Bestial Fury",
            desc: "Starting at 11th level, when you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action.",
            level: 11,
            tracked: false,
          },
          {
            id: "share_spells",
            name: "Share Spells",
            desc: "Beginning at 15th level, when you cast a spell targeting yourself, you can also affect your beast companion with the spell if the beast is within 30 feet of you.",
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
            desc: [
              "At 3rd level, the bond you share with your drake creates a connection to dragonkind, granting you understanding and empowering your presence.",
              "• Thaumaturgy. You learn the *thaumaturgy* cantrip, which is a ranger spell for you.",
              "• Tongue of Dragons. You learn to speak, read, and write Draconic or one other language of your choice.",
            ],
            level: 3,
            tracked: false
          },
          {
            id: "drake_companion",
            name: "Drake Companion",
            desc: [
              "At 3rd level, as an action, you can magically summon the drake that is bound to you. It appears in an unoccupied space of your choice within 30 feet of you.",
              "The drake is friendly to you and your companions, and it obeys your commands. In combat, it shares your initiative count, but it takes its turn immediately after yours.",
              "Once you summon the drake, you can’t do so again until you finish a long rest, unless you expend a spell slot of 1st level or higher to summon it.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "bond_of_fang_and_scale",
            name: "Bond of Fang and Scale",
            desc: [
              "At 7th level, when you summon your drake it grows wings on its back and gains a flying speed equal to its walking speed.",
              "In addition, while your drake is summoned you can use it as a mount (it grows to Medium size), the drake’s Bite deals extra damage based on its Draconic Essence, and you gain resistance to the drake’s chosen damage type.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "drake's_breath",
            name: "Drake's Breath",
            desc: [
              "At 11th level, as an action, you can exhale a 30-foot cone of damaging breath or cause your drake to exhale it. Each creature in the cone must make a Dexterity saving throw against your spell save DC, taking 8d6 damage on a failed save, or half as much damage on a successful one.",
              "The damage increases to 10d6 when you reach 15th level in this class.",
              "Once you use this feature, you can’t do so again until you finish a long rest.",
            ],
            level: 11,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "perfected_bond",
            name: "Perfected Bond (Reflexive Resistance)",
            desc: [
              "At 15th level, while your drake is summoned, when either you or the drake takes damage while you’re within 30 feet of each other, you can use your reaction to give yourself or the drake resistance to that instance of damage.",
              "Uses equal to your proficiency bonus; you regain all uses when you finish a long rest.",
            ],
            level: 15,
            tracked: true, // Reaction
            uses: "pb",
            recharge: "lr",
          },
        ],
      },
      
      feyWanderer: {
        features: [
          {
            id: "dreadful_strikes",
            name: "Dreadful Strikes",
            desc: [
              "At 3rd level, once per turn when you hit a creature with a weapon, you can deal an extra 1d4 psychic damage to the target.",
              "The extra damage increases to 1d6 when you reach 11th level in this class.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "fey_wanderer_magic",
            name: "Fey Wanderer Magic",
            desc: [
              "At 3rd level, you learn additional spells at certain ranger levels: Charm Person (3rd), Misty Step (5th), Dispel Magic (9th), Dimension Door (13th), and Mislead (17th).",
              "Each spell counts as a ranger spell for you and doesn't count against the number of ranger spells you know.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "beguiling_twist",
            name: "Beguiling Twist",
            desc: [
              "Beginning at 7th level, you have advantage on saving throws against being charmed or frightened.",
              "In addition, whenever you or a creature you can see within 120 feet of you succeeds on a saving throw against being charmed or frightened, you can use your reaction to force a different creature you can see within 120 feet of you to make a Wisdom saving throw against your spell save DC.",
              "On a failed save, the target is charmed or frightened by you (your choice) for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a successful save.",
            ],
            level: 7,
            tracked: false, // Reaction
          },
          {
            id: "fey_reinforcements",
            name: "Fey Reinforcements",
            desc: [
              "At 11th level, you learn the spell Summon Fey. It counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
              "You can cast Summon Fey without a material component. You can also cast it once without expending a spell slot, and you regain the ability to do so when you finish a long rest.",
              "Whenever you start casting Summon Fey, you can choose to make that casting not require concentration. If you do, the spell's duration becomes 1 minute for that casting.",
            ],
            level: 11,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "misty_wanderer",
            name: "Misty Wanderer",
            desc: [
              "At 15th level, you can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.",
              "In addition, whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of you. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space.",
            ],
            level: 15,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
          },
        ],
        subclassSpells: [
          { level: 3, spells: ["charm_person"] },
          { level: 5, spells: ["misty_step"] },
          { level: 9, spells: ["dispel_magic"] },
          { level: 11, spells: ["summon_fey"] },
          { level: 13, spells: ["dimension_door"] },
          { level: 17, spells: ["mislead"]},
        ],
      },
      
      gloomStalker: {
        features: [
          {
            id: "gloom_stalker_magic",
            name: "Gloom Stalker Magic",
            desc: [
              "Starting at 3rd level, you learn an additional spell when you reach certain levels in this class, as shown in the Gloom Stalker Spells table.",
              "The spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "dread_ambusher",
            name: "Dread Ambusher",
            desc: [
              "At 3rd level, you master the art of the ambush. You can give yourself a bonus to your initiative rolls equal to your Wisdom modifier.",
              "At the start of your first turn of each combat, your walking speed increases by 10 feet, which lasts until the end of that turn. If you take the Attack action on that turn, you can make one additional weapon attack as part of that action. If that attack hits, the target takes an extra 1d8 damage of the weapon's damage type.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "umbral_sight",
            name: "Umbral Sight",
            desc: [
              "At 3rd level, you gain darkvision out to a range of 60 feet. If you already have darkvision from your race, its range increases by 30 feet.",
              "You are also adept at evading creatures that rely on darkvision. While in darkness, you are invisible to any creature that relies on darkvision to see you in that darkness.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "iron_mind",
            name: "Iron Mind",
            desc: "By 7th level, you have honed your ability to resist the mind-altering powers of your prey. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).",
            level: 7,
            tracked: false,
          },
          {
            id: "stalker's_flurry",
            name: "Stalker's Flurry",
            desc: "At 11th level, you learn to attack with such unexpected speed that you can turn a miss into another strike. Once on each of your turns when you miss with a weapon attack, you can make another weapon attack as part of the same action.",
            level: 11,
            tracked: false,
          },
          {
            id: "shadowy_dodge",
            name: "Shadowy Dodge",
            desc: "Starting at 15th level, you can dodge in unforeseen ways, with wisps of supernatural shadow around you. Whenever a creature makes an attack roll against you and doesn't have advantage on the roll, you can use your reaction to impose disadvantage on it. You must use this feature before you know the outcome of the attack roll.",
            level: 15,
            tracked: false,
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
            id: "horizon_walker_magic",
            name: "Horizon Walker Magic",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "Starting at 3rd level, you learn an additional spell when you reach certain levels in this class, as shown in the Horizon Walker Spells table. The spell counts as a ranger spell for you, but it doesn’t count against the number of ranger spells you know.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "detect_portals",
            name: "Detect Portals",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "At 3rd level, you gain the ability to magically sense the presence of a planar portal. As an action, you detect the distance and direction to the closest planar portal within 1 mile of you.",
              "Once you use this feature, you can't use it again until you finish a short or long rest.",
              'See the "Planar Travel" section in chapter 2 of the Dungeon Master\'s Guide for examples of planar portals.',
            ],
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "planar_warrior",
            name: "Planar Warrior",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "At 3rd level, you learn to draw on the energy of the multiverse to augment your attacks.",
              "As a bonus action, choose one creature you can see within 30 feet of you. The next time you hit that creature on this turn with a weapon attack, all damage dealt by the attack becomes force damage, and the creature takes an extra 1d8 force damage from the attack. When you reach 11th level in this class, the extra damage increases to 2d8.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "ethereal_step",
            name: "Ethereal Step",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "At 7th level, you learn to step through the Ethereal Plane. As a bonus action on your turn, you can cast the [[spell:etherealness|Etherealness]] spell with this feature, without expending a spell slot, but the spell ends at the end of the current turn.",
              "Once you use this feature, you can’t use it again until you finish a short or long rest.",
            ],
            level: 7,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "distant_strike",
            name: "Distant Strike",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "At 11th level, you gain the ability to pass between the planes in a blink of an eye. When you use the Attack action, you can teleport up to 10 feet before each attack to an unoccupied space you can see.",
              "If you attack at least two different creatures with the action, you can make one additional attack with it against a third creature.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "spectral_defense",
            name: "Spectral Defense",
            // Source: https://dnd5e.wikidot.com/ranger:horizon-walker (CC BY-SA 3.0)
            desc: [
              "At 15th level, your ability to move between planes enables you to slip through the planar boundaries to lessen the harm done to you during battle. When you take damage from an attack, you can use your reaction to give yourself resistance to all of that attack's damage on this turn.",
            ],
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
            // Source: https://dnd5e.wikidot.com/ranger:hunter (CC BY-SA 3.0)
            desc: ["At 3rd level, you gain one of the following features of your choice."],
            untrackedChoiceOptions: [
              {
                id: "colossus_slayer",
                name: "Colossus Slayer",
                desc: [
                  "Your tenacity can wear down the most potent foes. When you hit a creature with a weapon attack, the creature takes an extra 1d8 damage if it’s below its hit point maximum. You can deal this extra damage only once per turn.",
                ],
              },
              {
                id: "giant_killer",
                name: "Giant Killer",
                desc: [
                  "When a Large or larger creature within 5 feet of you hits or misses you with an attack, you can use your reaction to attack that creature immediately after its attack, provided that you can see the creature.",
                ],
              },
              {
                id: "horde_breaker",
                name: "Horde Breaker",
                desc: [
                  "Once on each of your turns when you make a weapon attack, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target and within range of your weapon.",
                ],
              },
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "defensive_tactics",
            name: "Defensive Tactics",
            // Source: https://dnd5e.wikidot.com/ranger:hunter (CC BY-SA 3.0)
            desc: ["At 7th level, you gain one of the following features of your choice."],
            untrackedChoiceOptions: [
              {
                id: "escape_the_horde",
                name: "Escape the Horde",
                desc: ["Opportunity attacks against you are made with disadvantage."],
              },
              {
                id: "multiattack_defense",
                name: "Multiattack Defense",
                desc: [
                  "When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.",
                ],
              },
              {
                id: "steel_will",
                name: "Steel Will",
                desc: ["You have advantage on saving throws against being frightened."],
              },
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "multiattack",
            name: "Multiattack",
            // Source: https://dnd5e.wikidot.com/ranger:hunter (CC BY-SA 3.0)
            desc: ["At 11th level, you gain one of the following features of your choice."],
            untrackedChoiceOptions: [
              {
                id: "volley",
                name: "Volley",
                desc: [
                  "You can use your action to make a ranged attack against any number of creatures within 10 feet of a point you can see within your weapon’s range. You must have ammunition for each target, as normal, and you make a separate attack roll for each target.",
                ],
              },
              {
                id: "whirlwind_attack",
                name: "Whirlwind Attack",
                desc: [
                  "You can use your action to make melee attacks against any number of creatures within 5 feet of you, with a separate attack roll for each target.",
                ],
              },
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "superior_hunter's_defense",
            name: "Superior Hunter's Defense",
            // Source: https://dnd5e.wikidot.com/ranger:hunter (CC BY-SA 3.0)
            desc: ["At 15th level, you gain one of the following features of your choice."],
            untrackedChoiceOptions: [
              {
                id: "evasion",
                name: "Evasion",
                desc: [
                  "When you are subjected to an effect, such as a red dragon’s fiery breath or a lightning bolt spell, that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on a saving throw, and only half damage if you fail.",
                ],
              },
              {
                id: "stand_against_the_tide",
                name: "Stand Against the Tide",
                desc: [
                  "When a hostile creature misses you with a melee attack, you can use your reaction to force that creature to repeat the same attack against another creature (other than itself) of your choice.",
                ],
              },
              {
                id: "uncanny_dodge",
                name: "Uncanny Dodge",
                desc: [
                  "When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack’s damage against you.",
                ],
              },
            ],
            level: 15,
            tracked: false,
          },
        ],
      },
      
      monsterSlayer: {
        features: [
          {
            id: "monster_slayer_magic",
            name: "Monster Slayer Magic",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "Starting at 3rd level, you learn an additional spell when you reach certain levels in this class, as shown in the Monster Slayer Spells table.",
              "The spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "hunter's_sense",
            name: "Hunter's Sense",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "At 3rd level, you gain the ability to peer at a creature and magically discern how best to hurt it. As an action, choose one creature you can see within 60 feet of you.",
              "You immediately learn whether the creature has any damage immunities, resistances, or vulnerabilities and what they are. If the creature is hidden from divination magic, you sense that it has no damage immunities, resistances, or vulnerabilities.",
              "You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses of it when you finish a long rest.",
            ],
            level: 3,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
          },
          {
            id: "slayer's_prey",
            name: "Slayer's Prey",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "Starting at 3rd level, you can focus your ire on one foe, increasing the harm you inflict on it. As a bonus action, you designate one creature you can see within 60 feet of you as the target of this feature.",
              "The first time each turn that you hit that target with a weapon attack, it takes an extra 1d6 damage from the weapon.",
              "This benefit lasts until you finish a short or long rest. It ends early if you designate a different creature.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "supernatural_defense",
            name: "Supernatural Defense",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "At 7th level, you gain extra resilience against your prey's assaults on your mind and body.",
              "Whenever the target of your Slayer's Prey forces you to make a saving throw and whenever you make an ability check to escape that target's grapple, add 1d6 to your roll.",
            ],
            level: 7,
            tracked: false,
          },
          {
            id: "magic_user's_nemesis",
            name: "Magic User's Nemesis",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "At 11th level, you gain the ability to thwart someone else's magic. When you see a creature casting a spell or teleporting within 60 feet of you, you can use your reaction to try to magically foil it.",
              "The creature must succeed on a Wisdom saving throw against your spell save DC, or its spell or teleport fails and is wasted.",
              "Once you use this feature, you can't use it again until you finish a short or long rest.",
            ],
            level: 11,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "slayer's_counter",
            name: "Slayer's Counter",
            // Source: https://dnd5e.wikidot.com/ranger:monster-slayer (CC BY-SA 3.0)
            desc: [
              "At 15th level, you gain the ability to counterattack when your prey tries to sabotage you.",
              "If the target of your Slayer's Prey forces you to make a saving throw, you can use your reaction to make one weapon attack against the quarry. You make this attack immediately before making the saving throw.",
              "If the attack hits, your save automatically succeeds, in addition to the attack's normal effects.",
            ],
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
            id: "gathered_swarm",
            name: "Gathered Swarm",
            // Source: https://dnd5e.wikidot.com/ranger:swarmkeeper (CC BY-SA 3.0)
            desc: [
              "At 3rd level, a swarm of intangible nature spirits has bonded itself to you and can assist you in battle.",
              "While you’re alive, the swarm remains in your space, crawling on you or flying and skittering around you within your space.",
              "You determine its appearance, or you roll on the Swarm Appearance table.",
              "Once on each of your turns, you can cause the swarm to assist you in one of the following ways, immediately after you hit a creature with an attack:",
              "• The target takes 1d6 piercing damage from the swarm.",
              "• The target must succeed on a Strength saving throw against your spell save DC or be moved by the swarm up to 15 feet horizontally in a direction of your choice.",
              "• You are moved by the swarm 5 feet horizontally in a direction of your choice.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "swarmkeeper_magic",
            name: "Swarmkeeper Magic",
            // Source: https://dnd5e.wikidot.com/ranger:swarmkeeper (CC BY-SA 3.0)
            desc: [
              "Also at 3rd level, you learn the *mage hand* cantrip if you don't already know it. When you cast it, the hand takes the form of your swarming nature spirits.",
              "You also learn an additional spell of 1st level or higher when you reach certain levels in this class, as shown in the Swarmkeeper Spells table.",
              "Each spell counts as a ranger spell for you, but it doesn't count against the number of ranger spells you know.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "writhing_tide",
            name: "Writhing Tide",
            // Source: https://dnd5e.wikidot.com/ranger:swarmkeeper (CC BY-SA 3.0)
            desc: [
              "At 7th level, you can condense part of your swarm into a focused mass that lifts you up.",
              "As a bonus action, you gain a flying speed of 10 feet and can hover. This effect lasts for 1 minute or until you are incapacitated.",
              "You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            ],
            level: 7,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "mighty_swarm",
            name: "Mighty Swarm",
            // Source: https://dnd5e.wikidot.com/ranger:swarmkeeper (CC BY-SA 3.0)
            desc: [
              "At 11th level, your Gathered Swarm grows mightier in the following ways:",
              "• The damage of Gathered Swarm increases to 1d8.",
              "• If a creature fails its saving throw against being moved by Gathered Swarm, you can also cause the swarm to knock the creature prone.",
              "• When you are moved by Gathered Swarm, it gives you half cover until the start of your next turn.",
            ],
            level: 11,
            tracked: false,
          },
          {
            id: "swarming_dispersal",
            name: "Swarming Dispersal",
            // Source: https://dnd5e.wikidot.com/ranger:swarmkeeper (CC BY-SA 3.0)
            desc: [
              "At 15th level, you can use your reaction to disperse into your swarm, avoiding danger.",
              "When you take damage, you can use your reaction to give yourself resistance to that damage.",
              "You vanish into your swarm and then teleport to an unoccupied space that you can see within 30 feet of you, where you reappear with the swarm.",
              "You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            ],
            level: 15,
            tracked: true,
            uses: "pb",
            recharge: "lr",
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
        desc: [
          "Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.",
          "You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.",
          "The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.",
        ],
        level: 1,
        tracked: false,
      },
      {
        id: "cunning_action",
        name: "Cunning Action",
        desc: [
          "Starting at 2nd level, your quick thinking and agility allow you to move and act quickly.",
          "You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.",
        ],
        level: 2,
        tracked: false,
      },
      {
        id: "uncanny_dodge",
        name: "Uncanny Dodge",
        desc: [
          "Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.",
        ],
        level: 5,
        tracked: false,
      },
      {
        id: "evasion",
        name: "Evasion",
        desc: [
          "Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an Ice Storm spell.",
          "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.",
        ],
        level: 7,
        tracked: false,
      },
      {
        id: "blindsense",
        name: "Blindsense",
        desc: [
          "Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.",
        ],
        level: 14,
        tracked: false,
      },
      {
        id: "slippery_mind",
        name: "Slippery Mind",
        desc: ["By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws."],
        level: 15,
        tracked: false,
      },
      {
        id: "elusive",
        name: "Elusive",
        desc: [
          "Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you.",
          "No attack roll has advantage against you while you aren't incapacitated.",
        ],
        level: 18,
        tracked: false,
      },
      {
        id: "stroke_of_luck",
        name: "Stroke of Luck",
        desc: [
          "At 20th level, you have an uncanny knack for succeeding when you need to.",
          "If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.",
          "Once you use this feature, you can't use it again until you finish a short or long rest.",
        ],
        level: 20,
        tracked: true,
        uses: 1,
        recharge: "sr_or_lr",
      },
    ],
    subclasses: {
      arcaneTrickster: {
        // Source (feature text + spellcasting table): https://dnd5e.wikidot.com/rogue:arcane-trickster (CC BY-SA 3.0)
        name: "Arcane Trickster",
        spellcasting: {
          startsAtLevel: 3,
          spellTableKey: "rogueArcaneTrickster",
          spellListClassKey: "wizard",
          spellcastingAbility: "int",
        },
        features: [
          {
            id: "spellcasting",
            name: "Spellcasting",
            desc: [
              "When you reach 3rd level, you augment your martial prowess with the ability to cast spells.",
              "You learn three cantrips: Mage Hand and two other cantrips of your choice from the wizard spell list. You learn another wizard cantrip of your choice at 10th level.",
              "The Arcane Trickster Spellcasting table shows how many spell slots you have to cast your wizard spells of 1st level and higher. You regain all expended spell slots when you finish a long rest.",
              "You know three 1st-level wizard spells of your choice, two of which you must choose from enchantment and illusion spells on the wizard spell list.",
              "Intelligence is your spellcasting ability for your wizard spells.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "mage_hand_legerdemain",
            name: "Mage Hand Legerdemain",
            desc: [
              "Starting at 3rd level, when you cast Mage Hand, you can make the spectral hand invisible, and you can perform the following additional tasks with it:",
              "You can stow one object the hand is holding in a container worn or carried by another creature.",
              "You can retrieve an object in a container worn or carried by another creature.",
              "You can use thieves' tools to pick locks and disarm traps at range.",
              "You can perform one of these tasks without being noticed by a creature if you succeed on a Dexterity (Sleight of Hand) check contested by the creature's Wisdom (Perception) check.",
              "In addition, you can use the bonus action granted by your Cunning Action to control the hand.",
            ],
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
            desc: "At 13th level, you gain the ability to distract targets with your Mage Hand. As a bonus action on your turn, you can designate a creature within 5 feet of the spectral hand. Doing so gives you advantage on attack rolls against that creature until the end of the turn.",
            level: 13,
            tracked: false,
          },
          {
            id: "spell_thief",
            name: "Spell Thief",
            desc: [
              "At 17th level, you gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster.",
              "Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier. The DC equals your spell save DC.",
              "On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast (it doesn't need to be a wizard spell).",
              "For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can't cast that spell until the 8 hours have passed.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 17,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        subclassSpells: [],
      },

      assassin: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:assassin (CC BY-SA 3.0)
        name: "Assassin",
        features: [
          {
            id: "assassinate",
            name: "Assassinate",
            desc: [
              "Starting at 3rd level, you are at your deadliest when you get the drop on your enemies. You have advantage on attack rolls against any creature that hasn't taken a turn in the combat yet.",
              "In addition, any hit you score against a creature that is surprised is a critical hit.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "infiltration_expertise",
            name: "Infiltration Expertise",
            desc: [
              "Starting at 9th level, you can unfailingly create false identities for yourself. You must spend seven days and 25 gp to establish the history, profession, and affiliations for an identity. You can't establish an identity that belongs to someone else.",
              "For example, you might acquire appropriate clothing, letters of introduction, and official-looking certification to establish yourself as a member of a trading house from a remote city so you can insinuate yourself into the company of other wealthy merchants.",
              "Thereafter, if you adopt the new identity as a disguise, other creatures believe you to be that person until given an obvious reason not to.",
            ],
            level: 9,
            tracked: false,
          },
          {
            id: "impostor",
            name: "Impostor",
            desc: [
              "At 13th level, you gain the ability to unerringly mimic another person's speech, writing, and behavior. You must spend at least three hours studying these three components of the person's behavior, listening to speech, examining handwriting, and observing mannerisms.",
              "Your ruse is indiscernible to the casual observer. If a wary creature suspects something is amiss, you have advantage on any Charisma (Deception) check you make to avoid detection.",
            ],
            level: 13,
            tracked: false,
          },
          {
            id: "death_strike",
            name: "Death Strike",
            desc: [
              "Starting at 17th level, you become a master of instant death. When you attack and hit a creature that is surprised, it must make a Constitution saving throw (DC 8 + your Dexterity modifier + your proficiency bonus).",
              "On a failed save, double the damage of your attack against the creature.",
            ],
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      inquisitive: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:inquisitive (CC BY-SA 3.0)
        name: "Inquisitive",
        features: [
          {
            id: "ear_for_deceit",
            name: "Ear for Deceit",
            desc: "When you choose this archetype at 3rd level, whenever you make a Wisdom (Insight) check to determine whether a creature is lying, treat a roll of 7 or lower on the d20 as an 8.",
            level: 3,
            tracked: false,
          },
          {
            id: "eye_for_detail",
            name: "Eye for Detail",
            desc: "Starting at 3rd level, you can use a bonus action to make a Wisdom (Perception) check to spot a hidden creature or object, or an Intelligence (Investigation) check to uncover or decipher clues.",
            level: 3,
            tracked: false,
          },
          {
            id: "insightful_fighting",
            name: "Insightful Fighting",
            desc: [
              "At 3rd level, as a bonus action, you make a Wisdom (Insight) check against a creature you can see that isn't incapacitated, contested by the target's Charisma (Deception) check.",
              "On a success, you can use Sneak Attack against that target even if you don't have advantage on the attack roll (but not if you have disadvantage). This benefit lasts for 1 minute or until you successfully use this feature against a different target.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "steady_eye",
            name: "Steady Eye",
            desc: "At 9th level, you have advantage on any Wisdom (Perception) or Intelligence (Investigation) check if you move no more than half your speed on the same turn.",
            level: 9,
            tracked: false,
          },
          {
            id: "unerring_eye",
            name: "Unerring Eye",
            desc: [
              "At 13th level, as an action, you sense the presence of illusions, shapechangers not in their original form, and other magic designed to deceive the senses within 30 feet of you, provided you aren't blinded or deafened.",
              "You sense that something is attempting to trick you, but you gain no insight into what is hidden or into its true nature.",
            ],
            level: 13,
            tracked: true,
            uses: "wis_mod",
            recharge: "lr",
          },
          {
            id: "eye_for_weakness",
            name: "Eye for Weakness",
            desc: "At 17th level, while your Insightful Fighting applies to a creature, your Sneak Attack damage against that creature increases by 3d6.",
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      mastermind: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:mastermind (CC BY-SA 3.0)
        // Note: "Master of Intrigue" intentionally omitted per app requirements.
        name: "Mastermind",
        features: [
          {
            id: "master_of_tactics",
            name: "Master of Tactics",
            desc: [
              "Starting at 3rd level, you can take the Help action as a bonus action.",
              "When you Help an ally attack a creature, that creature can be up to 30 feet away (instead of 5 feet) as long as it can see or hear you.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "insightful_manipulator",
            name: "Insightful Manipulator",
            desc: [
              "Starting at 9th level, after you spend at least 1 minute observing or conversing with a creature outside combat, you can gauge some of its capabilities relative to yours.",
              "Pick two: Intelligence, Wisdom, Charisma, or (if any) its class levels. The DM tells you whether the creature is lower than, equal to, or higher than you for each chosen category.",
              "At the DM's discretion, you might also recognize something about the creature's history or a personality trait.",
            ],
            level: 9,
            tracked: false,
          },
          {
            id: "misdirection",
            name: "Misdirection",
            desc: [
              "Beginning at 13th level, you can deflect danger onto someone else in the right moment.",
              "When an attack targets you while a creature within 5 feet of you is providing cover against that attack, you can use your reaction to make the attack target that creature instead.",
            ],
            level: 13,
            tracked: false,
          },
          {
            id: "soul_of_deceit",
            name: "Soul of Deceit",
            desc: [
              "Starting at 17th level, your mind is closed to mind-reading unless you permit it.",
              "If a creature tries to read your thoughts, you can attempt to plant false ones with a Charisma (Deception) check opposed by its Wisdom (Insight) check.",
              "When magic tries to judge whether you're lying (or compels honesty), you can choose to register as truthful and you can't be forced to speak only the truth by magic.",
            ],
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },

      phantom: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:phantom (CC BY-SA 3.0)
        name: "Phantom",
        features: [
          // "Whispers of the Dead" intentionally omitted per app requirements.
          {
            id: "wails_from_the_grave",
            name: "Wails from the Grave",
            desc: [
              "At 3rd level, as you nudge someone closer to the grave, you can channel the power of death to harm someone else as well.",
              "Immediately after you deal your Sneak Attack damage to a creature on your turn, you can target a second creature that you can see within 30 feet of the first creature. Roll half the number of Sneak Attack dice for your level (round up), and the second creature takes necrotic damage equal to the roll's total, as wails of the dead sound around them for a moment.",
              "You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            ],
            level: 3,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "tokens_of_the_departed",
            name: "Tokens of the Departed",
            desc: [
              "At 9th level, when a life ends in your presence, you're able to snatch a token from the departing soul, a sliver of its life essence that takes physical form: as a reaction when a creature you can see dies within 30 feet of you, you can open your free hand and cause a Tiny trinket to appear there, a soul trinket.",
              "The DM determines the trinket's form or has you roll on the Trinkets table in the Player's Handbook to generate it.",
              "You can have a maximum number of soul trinkets equal to your proficiency bonus, and you can't create one while at your maximum.",
              "You can use soul trinkets in the following ways:",
              "• While a soul trinket is on your person, you have advantage on death saving throws and Constitution saving throws, for your vitality is enhanced by the life essence within the object.",
              "• When you deal Sneak Attack damage on your turn, you can destroy one of your soul trinkets that's on your person and then immediately use Wails from the Grave, without expending a use of that feature.",
              "• As an action, you can destroy one of your soul trinkets, no matter where it's located. When you do so, you can ask the spirit associated with the trinket one question. The spirit appears to you and answers in a language it knew in life. It's under no obligation to be truthful, and it answers as concisely as possible, eager to be free. The spirit knows only what it knew in life, as determined by the DM.",
            ],
            level: 9,
            tracked: true,
            uses: "pb",
          },
          {
            id: "ghost_walk",
            name: "Ghost Walk",
            desc: [
              "At 13th level, you can phase partially into the realm of the dead, becoming like a ghost. As a bonus action, you assume a spectral form.",
              "While in this form, you have a flying speed of 10 feet, you can hover, and attack rolls have disadvantage against you. You can also move through creatures and objects as if they were difficult terrain, but you take 1d10 force damage if you end your turn inside a creature or an object.",
              "You stay in this form for 10 minutes or until you end it as a bonus action. To use this feature again, you must finish a long rest or destroy one of your soul trinkets as part of the bonus action you use to activate Ghost Walk.",
            ],
            level: 13,
            tracked: true,
            uses: 1,
            recharge: "lr",
            rechargeBySpendingFeatureId: "tokens_of_the_departed",
          },
          {
            id: "death's_friend",
            name: "Death's Friend",
            desc: [
              "At 17th level, your association with death has become so close that you gain the following benefits:",
              "• When you use your Wails from the Grave, you can now deal the necrotic damage to both the first and the second creature.",
              "• At the end of a long rest, a soul trinket appears in your hand if you don't have any soul trinkets, as the spirits of the dead are drawn to you.",
            ],
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },
      
      scout: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:scout (CC BY-SA 3.0)
        name: "Scout",
        features: [
          {
            id: "skirmisher",
            name: "Skirmisher",
            desc: "Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.",
            level: 3,
            tracked: false,
          },
          {
            id: "superior_mobility",
            name: "Superior Mobility",
            desc: "At 9th level, your walking speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.",
            level: 9,
            tracked: false,
          },
          {
            id: "ambush_master",
            name: "Ambush Master",
            desc: [
              "Starting at 13th level, you excel at leading ambushes and acting first in a fight.",
              "You have advantage on initiative rolls. In addition, the first creature you hit during the first round of a combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.",
            ],
            level: 13,
            tracked: false,
          },
          {
            id: "sudden_strike",
            name: "Sudden Strike",
            desc: "Starting at 17th level, you can strike with deadly speed. If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.",
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
            desc: [
              "Starting at 3rd level, you harbor a wellspring of psionic energy within yourself. This energy is represented by your Psionic Energy dice, which are each a d6. You have a number of these dice equal to twice your proficiency bonus, and they fuel various psionic powers you have, which are detailed below.",
              "Some of your powers expend the Psionic Energy die they use, as specified in a power's description, and you can't use a power if it requires you to use a die when your dice are all expended. You regain all your expended Psionic Energy dice when you finish a long rest. In addition, as a bonus action, you can regain one expended Psionic Energy die, but you can't do so again until you finish a short or long rest.",
              "When you reach certain levels in this class, the size of your Psionic Energy dice increases: at 5th level (d8), 11th level (d10), and 17th level (d12).",
              "",
              "Psi-Bolstered Knack. When your nonpsionic training fails you, your psionic power can help: if you fail an ability check using a skill or tool with which you have proficiency, you can roll one Psionic Energy die and add the number rolled to the check, potentially turning failure into success. You expend the die only if the roll succeeds.",
              "",
              "Psychic Whispers. You can establish telepathic communication between yourself and others — perfect for quiet infiltration. As an action, choose one or more creatures you can see, up to a number of creatures equal to your proficiency bonus, and then roll one Psionic Energy die. For a number of hours equal to the number rolled, the chosen creatures can speak telepathically with you, and you can speak telepathically with them.",
              "To send or receive a message (no action required), you and the other creature must be within 1 mile of each other. A creature can't use this telepathy if it can't speak any languages, and a creature can end the telepathic connection at any time (no action required). You and the creature don't need to speak a common language to understand each other.",
              "The first time you use this power after each long rest, you don't expend the Psionic Energy die. All other times you use the power, you expend the die.",
            ],
            level: 3,
            tracked: true,
            trackedMode: "dicePool",
            poolSize: "pbx2",
            dieByLevel: [
              { level: 3, die: "d6" },
              { level: 5, die: "d8" },
              { level: 11, die: "d10" },
              { level: 17, die: "d12" },
            ],
            recharge: "lr",
          },
          {
            id: "psionic_recovery",
            name: "Psionic Recovery",
            desc: "As a bonus action, you can regain one expended Psionic Energy die, but you can't do so again until you finish a short or long rest.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "psionic_first_use",
            name: "First Use (Free)",
            desc: "After a long rest, your first use of a Psionic Energy die doesn't expend one.",
            level: 3,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "psychic_blades",
            name: "Psychic Blades",
            desc: [
              "Also at 3rd level, you can manifest your psionic power as shimmering blades of psychic energy. Whenever you take the Attack action, you can manifest a psychic blade from your free hand and make the attack with that blade. This magic blade is a simple melee weapon with the finesse and thrown properties. It has a normal range of 60 feet and no long range, and on a hit, it deals psychic damage equal to 1d6 plus the ability modifier you used for the attack roll.",
              "The blade vanishes immediately after it hits or misses its target, and it leaves no mark on its target if it deals damage.",
              "After you attack with the blade, you can make a melee or ranged weapon attack with a second psychic blade as a bonus action on the same turn, provided your other hand is free to create it. The damage die of this bonus attack is 1d4, instead of 1d6.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "soul_blades",
            name: "Soul Blades",
            desc: [
              "Starting at 9th level, your Psychic Blades are now an expression of your psi-suffused soul, giving you these powers that use your Psionic Energy dice:",
              "",
              "Homing Strikes. If you make an attack roll with your Psychic Blades and miss the target, you can roll one Psionic Energy die and add the number rolled to the attack roll. If this causes the attack to hit, you expend the Psionic Energy die.",
              "",
              "Psychic Teleportation. As a bonus action, you manifest one of your Psychic Blades, expend one Psionic Energy die and roll it, and throw the blade at an unoccupied space you can see, up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes.",
            ],
            level: 9,
            tracked: false,
          },
          {
            id: "psychic_veil",
            name: "Psychic Veil",
            desc: [
              "At 13th level, you can weave a veil of psychic static to mask yourself. As an action, you can magically become invisible, along with anything you are wearing or carrying, for 1 hour or until you dismiss this effect (no action required). This invisibility ends early immediately after you deal damage to a creature, or you force a creature to make a saving throw.",
              "Once you use this feature, you can't do so again until you finish a long rest, unless you expend a Psionic Energy die to use this feature again.",
            ],
            level: 13,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "rend_mind",
            name: "Rend Mind",
            desc: [
              "When you reach 17th level, you can sweep your Psychic Blade directly through a creature's mind. When you use your Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Dexterity modifier). If the save fails, the target is stunned for 1 minute. The stunned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
              "Once you use this feature, you can't do so again until you finish a long rest, unless you expend three Psionic Energy dice to use it again.",
            ],
            level: 17,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        subclassSpells: [],
      },
      
      swashbuckler: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:swashbuckler (CC BY-SA 3.0)
        name: "Swashbuckler",
        features: [
          {
            id: "fancy_footwork",
            name: "Fancy Footwork",
            desc: [
              "When you choose this archetype at 3rd level, you learn how to land a strike and then slip away without reprisal. During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "rakish_audacity",
            name: "Rakish Audacity",
            desc: [
              "Starting at 3rd level, your confidence propels you into battle. You can give yourself a bonus to your initiative rolls equal to your Charisma modifier.",
              "You also gain an additional way to use your Sneak Attack; you don't need advantage on the attack roll to use your Sneak Attack against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll. All the other rules for Sneak Attack still apply to you.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "panache",
            name: "Panache",
            desc: [
              "At 9th level, your charm becomes extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language.",
              "If you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a spell, or until you and the target are more than 60 feet apart.",
              "If you succeed on the check and the creature isn't hostile to you, it is charmed by you for 1 minute. While charmed, it regards you as a friendly acquaintance. This effect ends immediately if you or your companions do anything harmful to it.",
            ],
            level: 9,
            tracked: false,
          },
          {
            id: "elegant_maneuver",
            name: "Elegant Maneuver",
            desc: [
              "Starting at 13th level, you can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.",
            ],
            level: 13,
            tracked: false,
          },
          {
            id: "master_duelist",
            name: "Master Duelist",
            desc: [
              "Beginning at 17th level, your mastery of the blade lets you turn failure into success in combat. If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can't use this feature again until you finish a short or long rest.",
            ],
            level: 17,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
        subclassSpells: [],
      },
      
      thief: {
        // Source (feature text): https://dnd5e.wikidot.com/rogue:thief (CC BY-SA 3.0)
        name: "Thief",
        features: [
          {
            id: "fast_hands",
            name: "Fast Hands",
            desc: [
              "Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "second_story_work",
            name: "Second-Story Work",
            desc: [
              "When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement.",
              "In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.",
            ],
            level: 3,
            tracked: false,
          },
          {
            id: "supreme_sneak",
            name: "Supreme Sneak",
            desc: [
              "Starting at 9th level, you have advantage on a Dexterity (Stealth) check if you move no more than half your speed on the same turn.",
            ],
            level: 9,
            tracked: false,
          },
          {
            id: "use_magic_device",
            name: "Use Magic Device",
            desc: [
              "By 13th level, you have learned enough about the workings of magic that you can improvise the use of items even when they are not intended for you. You ignore all class, race, and level requirements on the use of magic items.",
            ],
            level: 13,
            tracked: false,
          },
          {
            id: "thief's_reflexes",
            name: "Thief's Reflexes",
            desc: [
              "When you reach 17th level, you have become adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10. You can't use this feature when you are surprised.",
            ],
            level: 17,
            tracked: false,
          },
        ],
        subclassSpells: [],
      },
    },
  },
  sorcerer: {
    hitDice: "D6",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "cha",
    classFeatures: [
      {
        id: "sorcery_points",
        name: "Sorcery Points",
        desc: [
          "You have sorcery points equal to your sorcerer level.",
          "You regain all spent sorcery points when you finish a long rest.",
        ],
        level: 1,
        tracked: true,
        trackedMode: "poolDropdown",
        poolMax: "sorcerer_level",
        recharge: "lr",
      },
      {
        id: "font_of_magic",
        name: "Font of Magic",
        desc: [
          "At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.",
          "Flexible Casting: You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points.",
          "Creating Spell Slots (bonus action): 1st (2 points), 2nd (3), 3rd (5), 4th (6), 5th (7). You can create spell slots no higher than 5th. Any spell slot you create with this feature vanishes when you finish a long rest.",
          "Converting a Spell Slot to Sorcery Points (bonus action): expend one spell slot and gain a number of sorcery points equal to the slot's level.",
        ],
        level: 2,
        tracked: false,
      },
      {
        id: "metamagic",
        name: "Metamagic",
        desc: [
          "At 3rd level, you gain the ability to twist your spells to suit your needs.",
          "You gain two Metamagic options of your choice. You gain another one at 10th and 17th level.",
          "You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.",
        ],
        level: 3,
        tracked: false,
      },
      {
        id: "sorcerous_restoration",
        name: "Sorcerous Restoration",
        desc: "At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.",
        level: 20,
        tracked: false,
      },
    ],
    metamagicOptions: [
      {
        id: "careful_spell",
        name: "Careful Spell",
        cost: 1,
        desc: [
          "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force.",
          "Spend 1 sorcery point and choose a number of those creatures up to your Charisma modifier (minimum of one creature). A chosen creature automatically succeeds on its saving throw against the spell.",
        ],
      },
      {
        id: "distant_spell",
        name: "Distant Spell",
        cost: 1,
        desc: [
          "When you cast a spell that has a range of 5 feet or greater, you can spend 1 sorcery point to double the range of the spell.",
          "When you cast a spell that has a range of touch, you can spend 1 sorcery point to make the range of the spell 30 feet.",
        ],
      },
      {
        id: "empowered_spell",
        name: "Empowered Spell",
        cost: 1,
        desc: [
          "When you roll damage for a spell, you can spend 1 sorcery point to reroll a number of the damage dice up to your Charisma modifier (minimum of one). You must use the new rolls.",
          "You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.",
        ],
      },
      {
        id: "extended_spell",
        name: "Extended Spell",
        cost: 1,
        desc: [
          "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 sorcery point to double its duration, to a maximum duration of 24 hours.",
        ],
      },
      {
        id: "heightened_spell",
        name: "Heightened Spell",
        cost: 3,
        desc: [
          "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 3 sorcery points to give one target of the spell disadvantage on its first saving throw made against the spell.",
        ],
      },
      {
        id: "quickened_spell",
        name: "Quickened Spell",
        cost: 2,
        desc: [
          "When you cast a spell that has a casting time of 1 action, you can spend 2 sorcery points to change the casting time to 1 bonus action for this casting.",
        ],
      },
      {
        id: "seeking_spell",
        name: "Seeking Spell",
        cost: 2,
        desc: [
          "If you make an attack roll for a spell and miss, you can spend 2 sorcery points to reroll the d20, and you must use the new roll.",
          "You can use Seeking Spell even if you have already used a different Metamagic option during the casting of the spell.",
        ],
      },
      {
        id: "subtle_spell",
        name: "Subtle Spell",
        cost: 1,
        desc: [
          "When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.",
        ],
      },
      {
        id: "transmuted_spell",
        name: "Transmuted Spell",
        cost: 1,
        desc: [
          "When you cast a spell that deals a type of damage from the following list, you can spend 1 sorcery point to change that damage type to one of the other listed types: acid, cold, fire, lightning, poison, thunder.",
        ],
      },
      {
        id: "twinned_spell",
        name: "Twinned Spell",
        cost: "spell_level",
        desc: [
          "When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of sorcery points equal to the spell's level to target a second creature in range with the same spell (1 sorcery point if the spell is a cantrip).",
          "To be eligible, a spell must be incapable of targeting more than one creature at the spell's current level.",
        ],
      },
    ],
    subclasses: {
      aberrantMind: {
        name: "Aberrant Mind",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "psionic_spells",
            name: "Psionic Spells",
            desc: [
              "Starting at 1st level, you learn additional spells when you reach certain levels in this class (see the Psionic Spells table).",
              "Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know.",
              "Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level.",
              "The new spell must be a divination or an enchantment spell from the sorcerer, warlock, or wizard spell list.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "telepathic_speech",
            name: "Telepathic Speech",
            desc: [
              "Starting at 1st level, you can form a telepathic connection between your mind and the mind of another.",
              "As a bonus action, choose one creature you can see within 30 feet of you. You and the chosen creature can speak telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile).",
              "To understand each other, you each must speak mentally in a language the other knows.",
              "The telepathic connection lasts for a number of minutes equal to your sorcerer level. It ends early if you are incapacitated or die or if you use this ability to form a connection with a different creature.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "psionic_sorcery",
            name: "Psionic Sorcery",
            desc: [
              "Beginning at 6th level, when you cast any spell of 1st level or higher from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of sorcery points equal to the spell's level.",
              "If you cast the spell using sorcery points, it requires no verbal or somatic components, and it requires no material components, unless they are consumed by the spell.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "psychic_defenses",
            name: "Psychic Defenses",
            desc: "At 6th level, you gain resistance to psychic damage, and you have advantage on saving throws against being charmed or frightened.",
            level: 6,
            tracked: false,
          },
          {
            id: "revelation_in_flesh",
            name: "Revelation in Flesh",
            desc: [
              "Beginning at 14th level, you can unleash the aberrant truth hidden within yourself. As a bonus action, you can spend 1 or more sorcery points to magically transform your body for 10 minutes.",
              "For each sorcery point you spend, you can gain one of the following benefits of your choice, the effects of which last until the transformation ends:",
              "• You can see any invisible creature within 60 feet of you, provided it isn't behind total cover.",
              "• You gain a flying speed equal to your walking speed and can hover.",
              "• You gain a swimming speed equal to twice your walking speed, and you can breathe underwater.",
              "• Your body becomes slimy and pliable: you can move through any space as narrow as 1 inch without squeezing, and you can spend 5 feet of movement to escape from nonmagical restraints or being grappled.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "warping_implosion",
            name: "Warping Implosion",
            desc: [
              "At 18th level, you can unleash your aberrant power as a space-warping anomaly.",
              "As an action, you can teleport to an unoccupied space you can see within 120 feet of you. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw against your spell save DC.",
              "On a failed save, a creature takes 3d10 force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage and isn't pulled.",
              "Once you use this feature, you can't do so again until you finish a long rest (unless you spend 5 sorcery points to use it again).",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      clockworkSoul: {
        name: "Clockwork Soul",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "clockwork_magic",
            name: "Clockwork Magic",
            desc: [
              "Starting at 1st level, you learn additional spells when you reach certain levels in this class (see the Clockwork Spells table).",
              "Each of these spells counts as a sorcerer spell for you, but it doesn't count against the number of sorcerer spells you know.",
              "Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level.",
              "The new spell must be an abjuration or a transmutation spell from the sorcerer, warlock, or wizard spell list.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "restore_balance",
            name: "Restore Balance",
            desc: [
              "Starting at 1st level, when a creature you can see within 60 feet of you is about to roll a d20 with advantage or disadvantage, you can use your reaction to prevent the roll from being affected by advantage and disadvantage.",
            ],
            level: 1,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "bastion_of_law",
            name: "Bastion of Law",
            desc: [
              "Starting at 6th level, as an action, you can expend 1 to 5 sorcery points to create a magical ward around yourself or another creature you can see within 30 feet of you.",
              "The ward lasts until you finish a long rest or until you use this feature again.",
              "The ward is represented by a number of d8s equal to the number of sorcery points spent. When the warded creature takes damage, it can expend any number of those dice, roll them, and reduce the damage by the total rolled.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "trance_of_order",
            name: "Trance of Order",
            desc: [
              "Starting at 14th level, as a bonus action, you can enter a trance for 1 minute.",
              "For the duration, attack rolls against you can't benefit from advantage, and whenever you make an attack roll, an ability check, or a saving throw, you can treat a roll of 9 or lower on the d20 as a 10.",
              "Once you use this bonus action, you can't use it again until you finish a long rest (unless you spend 5 sorcery points to use it again).",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "clockwork_cavalcade",
            name: "Clockwork Cavalcade",
            desc: [
              "Starting at 18th level, as an action, you summon spirits of order in a 30-foot cube originating from you.",
              "The spirits are intangible and invulnerable, and they create the following effects in the cube before vanishing: restore up to 100 hit points (divided as you choose), repair damaged objects, and end spells of 6th level or lower on creatures and objects of your choice.",
              "Once you use this action, you can't use it again until you finish a long rest (unless you spend 7 sorcery points to use it again).",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      draconicBloodline: {
        name: "Draconic Bloodline",
        source: "Player's Handbook",
        features: [
          {
            id: "dragon_ancestor",
            name: "Dragon Ancestor",
            desc: [
              "At 1st level, you choose one type of dragon as your ancestor. The damage type associated with each dragon is used by features you gain later.",
              "You can speak, read, and write Draconic.",
              "Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.",
            ],
            level: 1,
            tracked: false,
            untrackedChoiceOptions: [
              { id: "black", name: "Black", damageType: "Acid", desc: "Damage type: Acid." },
              { id: "blue", name: "Blue", damageType: "Lightning", desc: "Damage type: Lightning." },
              { id: "brass", name: "Brass", damageType: "Fire", desc: "Damage type: Fire." },
              { id: "bronze", name: "Bronze", damageType: "Lightning", desc: "Damage type: Lightning." },
              { id: "copper", name: "Copper", damageType: "Acid", desc: "Damage type: Acid." },
              { id: "gold", name: "Gold", damageType: "Fire", desc: "Damage type: Fire." },
              { id: "green", name: "Green", damageType: "Poison", desc: "Damage type: Poison." },
              { id: "red", name: "Red", damageType: "Fire", desc: "Damage type: Fire." },
              { id: "silver", name: "Silver", damageType: "Cold", desc: "Damage type: Cold." },
              { id: "white", name: "White", damageType: "Cold", desc: "Damage type: Cold." },
            ],
          },
          {
            id: "draconic_resilience",
            name: "Draconic Resilience",
            desc: [
              "As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. At 1st level, your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class.",
              "Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "elemental_affinity",
            name: "Elemental Affinity",
            desc: [
              "Starting at 6th level, when you cast a spell that deals damage of the type associated with your draconic ancestry, add your Charisma modifier to one damage roll of that spell.",
              "At the same time, you can spend 1 sorcery point to gain resistance to that damage type for 1 hour.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "dragon_wings",
            name: "Dragon Wings",
            desc: [
              "At 14th level, you gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed.",
              "You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action on your turn.",
              "You can't manifest your wings while wearing armor unless the armor is made to accommodate them, and clothing not made to accommodate your wings might be destroyed when you manifest them.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "draconic_presence",
            name: "Draconic Presence",
            desc: [
              "Beginning at 18th level, you can channel the dread presence of your dragon ancestor, causing those around you to become awestruck or frightened.",
              "As an action, you can spend 5 sorcery points to draw on this power and exude an aura of awe or fear (your choice) to a distance of 60 feet.",
              "For 1 minute or until you lose your concentration (as if you were casting a concentration spell), each hostile creature that starts its turn in this aura must succeed on a Wisdom saving throw or be charmed (if you chose awe) or frightened (if you chose fear) until the aura ends.",
              "A creature that succeeds on this saving throw is immune to your aura for 24 hours.",
            ],
            level: 18,
            tracked: false,
          },
        ],
      },
      divineSoul: {
        name: "Divine Soul",
        source: "Xanathar's Guide to Everything",
        features: [
          {
            id: "divine_magic",
            name: "Divine Magic",
            desc: [
              "Your link to the divine allows you to learn spells normally associated with the cleric class.",
              "When your Spellcasting feature lets you learn a sorcerer cantrip or a sorcerer spell of 1st level or higher, you can choose the new spell from the cleric spell list or the sorcerer spell list.",
              "You must otherwise obey all the restrictions for selecting the spell, and it becomes a sorcerer spell for you.",
              "In addition, choose an affinity for the source of your divine power: good, evil, law, chaos, or neutrality.",
              "You learn an additional spell based on that affinity: Good (Cure Wounds), Evil (Inflict Wounds), Law (Bless), Chaos (Bane), Neutrality (Protection from Evil and Good).",
              "This affinity spell is a sorcerer spell for you, but it doesn't count against your number of sorcerer spells known.",
              "If you later replace this spell, you must replace it with a spell from the cleric spell list.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "favored_by_the_gods",
            name: "Favored by the Gods",
            desc: [
              "Starting at 1st level, divine power guards your destiny.",
              "If you fail a saving throw or miss with an attack roll, you can roll 2d4 and add it to the total, possibly changing the outcome.",
              "Once you use this feature, you can't use it again until you finish a short or long rest.",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "empowered_healing",
            name: "Empowered Healing",
            desc: [
              "Starting at 6th level, the divine energy coursing through you can empower healing spells.",
              "Whenever you or an ally within 5 feet of you rolls dice to determine the number of hit points a spell restores, you can spend 1 sorcery point to reroll any number of those dice once, provided you aren't incapacitated.",
              "You can use this feature only once per turn.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "angelic_form",
            name: "Angelic Form",
            desc: [
              "Starting at 14th level, you can use a bonus action to manifest a pair of spectral wings from your back.",
              "While the wings are present, you have a flying speed of 30 feet.",
              "The wings last until you're incapacitated, you die, or you dismiss them as a bonus action.",
              "The affinity you chose for your Divine Magic feature determines the appearance of the spectral wings: eagle wings for good or law, bat wings for evil or chaos, and dragonfly wings for neutrality.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "unearthly_recovery",
            name: "Unearthly Recovery",
            desc: [
              "At 18th level, you gain the ability to overcome grievous injuries.",
              "As a bonus action when you have fewer than half of your hit points remaining, you can regain a number of hit points equal to half your hit point maximum.",
              "Once you use this feature, you can’t use it again until you finish a long rest.",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      lunarSorcery: {
        name: "Lunar Sorcery",
        features: [
          {
            id: "lunar_embodiment",
            name: "Lunar Embodiment",
            desc: [
              "You learn additional spells as you gain sorcerer levels (see Lunar Spells table in the app).",
              "These spells count as sorcerer spells for you and don’t count against spells known.",
              "Choose a lunar phase after each long rest: Full Moon, New Moon, or Crescent Moon.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "moon_fire",
            name: "Moon Fire",
            desc: [
              "You learn the Sacred Flame cantrip. It doesn’t count against cantrips known.",
              "When you cast it, you can target one creature as normal, or two creatures within range that are within 5 feet of each other.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "lunar_boons",
            name: "Lunar Boons",
            desc: [
              "Your Lunar Embodiment phase affects Metamagic (Full: Abjuration/Divination; New: Enchantment/Necromancy; Crescent: Illusion/Transmutation).",
              "When you use Metamagic on a spell of an associated school, reduce the sorcery points spent by 1 (min 0).",
              "You can do this a number of times equal to your proficiency bonus per long rest.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "waxing_and_waning",
            name: "Waxing and Waning",
            desc: [
              "As a bonus action, you can spend 1 sorcery point to change your current Lunar Embodiment phase.",
              "You can cast one 1st-level spell from each lunar phase once per long rest without expending a spell slot, provided your current phase matches that spell’s phase.",
            ],
            level: 6,
            tracked: true,
            trackedMode: "phaseCheckboxes",
            recharge: "lr",
          },
          {
            id: "lunar_empowerment",
            name: "Lunar Empowerment",
            desc: [
              "While you are in a Lunar Embodiment phase, you gain an additional benefit based on that phase.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "lunar_phenomenon",
            name: "Lunar Phenomenon",
            desc: [
              "As a bonus action, you can use a powerful effect based on your current lunar phase.",
              "Once you use a phase’s benefit, you can’t use that phase’s benefit again until a long rest (unless you spend 5 sorcery points).",
            ],
            level: 18,
            tracked: true,
            trackedMode: "phaseCheckboxes",
            recharge: "lr",
          },
        ],
      },
      shadowMagic: {
        name: "Shadow Magic",
        source: "Xanathar's Guide to Everything",
        features: [
          {
            id: "eyes_of_the_dark",
            name: "Eyes of the Dark",
            desc: [
              "You gain darkvision out to 120 feet.",
              "At sorcerer level 3, you learn Darkness as a bonus spell; it doesn't count against spells known.",
              "You can cast it using a spell slot, or by spending 2 sorcery points. When cast with sorcery points, you can see through your Darkness.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "strength_of_the_grave",
            name: "Strength of the Grave",
            desc: [
              "When damage would drop you to 0 hit points, you can attempt a Charisma save (DC 5 + damage taken) to drop to 1 hit point instead.",
              "This can't be used if the damage is radiant, or if it was a critical hit.",
              "Once it succeeds, it can't be used again until you finish a long rest.",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "hound_of_ill_omen",
            name: "Hound of Ill Omen",
            desc: [
              "As a bonus action, spend 3 sorcery points to summon a shadowy hound that relentlessly attacks a creature you can see within 120 feet.",
              "While the hound is within 5 feet of its target, the target has disadvantage on saving throws against your spells.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "shadow_walk",
            name: "Shadow Walk",
            desc: [
              "While in dim light or darkness, you can teleport up to 120 feet as a bonus action to an unoccupied space you can see that is also in dim light or darkness.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "umbral_form",
            name: "Umbral Form",
            desc: [
              "As a bonus action, spend 6 sorcery points to become shadowy for 1 minute.",
              "You gain resistance to all damage except force and radiant, and you can move through creatures and objects (taking 5 force damage if you end your turn inside an object).",
            ],
            level: 18,
            tracked: false,
          },
        ],
      },
      stormSorcery: {
        name: "Storm Sorcery",
        source: "Sword Coast Adventurer's Guide, Xanathar's Guide to Everything",
        features: [
          {
            id: "tempestuous_magic",
            name: "Tempestuous Magic",
            desc: [
              "Starting at 1st level, you can use a bonus action immediately before or after you cast a spell of 1st level or higher to ride a brief gust of wind.",
              "You fly up to 10 feet without provoking opportunity attacks.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "heart_of_the_storm",
            name: "Heart of the Storm",
            desc: [
              "At 6th level, you gain resistance to lightning and thunder damage.",
              "Whenever you start casting a spell of 1st level or higher that deals lightning or thunder damage, creatures of your choice that you can see within 10 feet take lightning or thunder damage (your choice each time) equal to half your sorcerer level.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "storm_guide",
            name: "Storm Guide",
            desc: [
              "At 6th level, you can subtly control the weather around you.",
              "If it's raining, you can use an action to stop rain in a 20-foot-radius sphere centered on you; end the effect as a bonus action.",
              "If it's windy, you can use a bonus action each round to choose the wind's direction in a 100-foot-radius sphere centered on you until the end of your next turn (this doesn't change wind speed).",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "storms_fury",
            name: "Storm's Fury",
            desc: [
              "Starting at 14th level, when you are hit by a melee attack, you can use your reaction to deal lightning damage to the attacker equal to your sorcerer level.",
              "The attacker must make a Strength saving throw against your spell save DC; on a failure, it is pushed up to 20 feet straight away from you.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "wind_soul",
            name: "Wind Soul",
            desc: [
              "At 18th level, you gain immunity to lightning and thunder damage.",
              "You also gain a magical flying speed of 60 feet.",
              "As an action, you can reduce your flying speed to 30 feet for 1 hour and choose a number of creatures within 30 feet equal to 3 + your Charisma modifier; those creatures gain a magical flying speed of 30 feet for 1 hour.",
              "Once you reduce your flying speed this way, you can't do so again until you finish a short or long rest.",
            ],
            level: 18,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
      },
      wildMagic: {
        name: "Wild Magic",
        source: "Player's Handbook",
        features: [
          {
            id: "wild_magic_surge",
            name: "Wild Magic Surge",
            desc: [
              "Starting at 1st level, your spellcasting can unleash surges of untamed magic.",
              "Once per turn, the DM can have you roll a d20 immediately after you cast a sorcerer spell of 1st level or higher. If you roll a 1, roll on the Wild Magic Surge table to create an effect.",
              "If the surge effect is a spell, it is too wild to be affected by Metamagic, and it doesn’t require concentration (if it normally would); the spell lasts its full duration.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "tides_of_chaos",
            name: "Tides of Chaos",
            desc: [
              "Starting at 1st level, you can gain advantage on one attack roll, ability check, or saving throw.",
              "After you use this feature, you must finish a long rest before you can use it again (unless your DM has you roll on the Wild Magic Surge table after you cast a sorcerer spell of 1st level or higher; you then regain the use of this feature).",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "bend_luck",
            name: "Bend Luck",
            desc: [
              "Starting at 6th level, when another creature you can see makes an attack roll, ability check, or saving throw, you can use your reaction and spend 2 sorcery points to roll 1d4.",
              "Apply the roll as a bonus or penalty (your choice) to that creature’s roll. You can do so after the creature rolls but before any effects occur.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "controlled_chaos",
            name: "Controlled Chaos",
            desc: [
              "At 14th level, whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "spell_bombardment",
            name: "Spell Bombardment",
            desc: [
              "Beginning at 18th level, when you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add that roll to the damage.",
              "You can use this feature only once per turn.",
            ],
            level: 18,
            tracked: false,
          },
        ],
      },
      Pyromancy: {
        name: "Pyromancy",
        source: "Plane Shift: Kaladesh",
        features: [
          {
            id: "heart_of_fire",
            name: "Heart of Fire",
            desc: [
              "At 1st level, whenever you start casting a spell of 1st level or higher that deals fire damage, fiery magic erupts from you.",
              "This eruption causes creatures of your choice that you can see within 10 feet of you to take fire damage equal to half your sorcerer level (minimum of 1).",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "fire_in_the_veins",
            name: "Fire in the Veins",
            desc: [
              "At 6th level, you gain resistance to fire damage.",
              "In addition, spells you cast ignore resistance to fire damage.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "pyromancers_fury",
            name: "Pyromancer's Fury",
            desc: [
              "Starting at 14th level, when you are hit by a melee attack, you can use your reaction to deal fire damage to the attacker.",
              "The damage equals your sorcerer level, and ignores resistance to fire damage.",
            ],
            level: 14,
            tracked: false,
          },
          {
            id: "fiery_soul",
            name: "Fiery Soul",
            desc: [
              "At 18th level, you gain immunity to fire damage.",
              "In addition, any spell or effect you create ignores resistance to fire damage and treats immunity to fire damage as resistance to fire damage.",
            ],
            level: 18,
            tracked: false,
          },
        ],
      },
    },
  },
  warlock: {
    hitDice: "D8",
    isSpellCaster: "refer to spellTables",
    spellcastingAbility: "cha",
    eldritchInvocations: WARLOCK_ELDRITCH_INVOCATIONS,
    pactBoons: WARLOCK_PACT_BOONS,
    classFeatures: [
      {
        id: "eldritch_invocations",
        name: "Eldritch Invocations",
        desc: [
          "At 2nd level, your occult studies grant you eldritch invocations of your choice.",
          "You learn additional invocations at certain warlock levels, and any level prerequisite uses your warlock level.",
          "Whenever you gain a warlock level, you can replace one invocation you know with another invocation you qualify for.",
        ],
        level: 2,
        tracked: false,
      },
      {
        id: "pact_boon",
        name: "Pact Boon",
        desc: [
          "At 3rd level, your patron grants you a pact boon.",
          "Choose the boon that best reflects the gift and bond your patron has given you.",
        ],
        level: 3,
        tracked: false,
      },
      {
        id: "mystic_arcanum",
        name: "Mystic Arcanum",
        desc: [
          "At 11th level, choose one 6th-level warlock spell as a mystic arcanum that you can cast once without spending a spell slot.",
          "You also gain one 7th-level arcanum at 13th level, one 8th-level arcanum at 15th level, and one 9th-level arcanum at 17th level.",
          "Each arcanum refreshes on a long rest.",
        ],
        level: 11,
        tracked: false,
      },
      {
        id: "eldritch_master",
        name: "Eldritch Master",
        desc: [
          "At 20th level, you can spend 1 minute entreating your patron to regain all expended Pact Magic spell slots.",
          "After you use this feature, you must finish a long rest before you can do so again.",
        ],
        level: 20,
        tracked: true,
        uses: 1,
        recharge: "lr",
      },
    ],
    subclasses: {
      archfey: {
        name: "The Archfey",
        source: "Player's Handbook",
        features: [
          {
            id: "fey_presence",
            name: "Fey Presence",
            desc: [
              "Starting at 1st level, your patron bestows upon you the ability to project the beguiling and fearsome presence of the fey.",
              "As an action, each creature in a 10-foot cube originating from you must make a Wisdom saving throw against your warlock spell save DC.",
              "On a failed save, creatures are charmed or frightened by you (your choice) until the end of your next turn.",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "misty_escape",
            name: "Misty Escape",
            desc: [
              "Starting at 6th level, when you take damage, you can use your reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see.",
              "You remain invisible until the start of your next turn or until you attack or cast a spell.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "beguiling_defenses",
            name: "Beguiling Defenses",
            desc: [
              "Beginning at 10th level, you are immune to being charmed.",
              "When another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "dark_delirium",
            name: "Dark Delirium",
            desc: [
              "Starting at 14th level, as an action, choose a creature you can see within 60 feet.",
              "On a failed Wisdom save against your warlock spell save DC, it is charmed or frightened by you (your choice) for 1 minute or until your concentration ends, and it perceives an illusory misty realm of your choosing.",
              "The effect ends early if the creature takes any damage.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["faerie-fire", "sleep"] },
          { spellLevel: 2, spells: ["calm-emotions", "phantasmal-force"] },
          { spellLevel: 3, spells: ["blink", "plant-growth"] },
          { spellLevel: 4, spells: ["dominate-beast", "greater-invisibility"] },
          { spellLevel: 5, spells: ["dominate-person", "seeming"] },
        ],
      },
      celestial: {
        name: "The Celestial",
        source: "Xanathar's Guide to Everything",
        features: [
          {
            id: "bonus_cantrips",
            name: "Bonus Cantrips",
            desc: [
              "At 1st level, your patron grants you Light and Sacred Flame.",
              "They count as warlock cantrips for you and do not count against your cantrips known.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "healing_light",
            name: "Healing Light",
            desc: [
              "At 1st level, you gain a pool of d6s that fuels your healing magic. The pool normally contains 1 + your warlock level dice.",
              "As a bonus action, you can heal one creature you can see within 60 feet by spending dice from the pool. The most dice you can spend at once equals your Charisma modifier, minimum one die.",
              "Roll the spent dice and restore that many hit points.",
              "You regain all expended dice when you finish a long rest.",
            ],
            level: 1,
            tracked: true,
            trackedMode: "dicePool",
            trackedLevelSource: "warlock_level",
            poolSize: "warlock_level_plus_one",
            die: "d6",
            recharge: "lr",
            allowPoolSizeOverride: true,
          },
          {
            id: "radiant_soul",
            name: "Radiant Soul",
            desc: [
              "Starting at 6th level, you gain resistance to radiant damage.",
              "When you cast a spell that deals radiant or fire damage, add your Charisma modifier to one damage roll of that spell against one of its targets.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "celestial_resistance",
            name: "Celestial Resistance",
            desc: [
              "Starting at 10th level, finishing a short or long rest grants you temporary hit points equal to your warlock level + your Charisma modifier.",
              "You can also choose up to five creatures you can see at the end of that rest, and each gains temporary hit points equal to half your warlock level + your Charisma modifier.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "searing_vengeance",
            name: "Searing Vengeance",
            desc: [
              "Starting at 14th level, when you would make a death saving throw at the start of your turn, you can instead surge back to your feet in radiant light.",
              "You regain hit points equal to half your hit point maximum, can stand up, and creatures of your choice within 30 feet take radiant damage and are blinded until the end of the current turn.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["cure-wounds", "guiding-bolt"] },
          { spellLevel: 2, spells: ["flaming-sphere", "lesser-restoration"] },
          { spellLevel: 3, spells: ["daylight", "revivify"] },
          { spellLevel: 4, spells: ["guardian-of-faith", "wall-of-fire"] },
          { spellLevel: 5, spells: ["flame-strike", "greater-restoration"] },
        ],
      },
      fathomless: {
        name: "The Fathomless",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "tentacle_of_the_deep",
            name: "Tentacle of the Deep",
            desc: [
              "At 1st level, you can magically summon a spectral tentacle that strikes at your foes. As a bonus action, create a 10-foot-long tentacle at a point you can see within 60 feet of you. The tentacle lasts for 1 minute or until you use this feature to create another one.",
              "When you create the tentacle, make a melee spell attack against one creature within 10 feet of it. On a hit, the target takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn. At warlock level 10, the damage becomes 2d8.",
              "As a bonus action on later turns, you can move the tentacle up to 30 feet and repeat the attack.",
            ],
            level: 1,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "gift_of_the_sea",
            name: "Gift of the Sea",
            desc: [
              "Also at 1st level, you gain a swimming speed of 40 feet, and you can breathe underwater.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "oceanic_soul",
            name: "Oceanic Soul",
            desc: [
              "At 6th level, you gain resistance to cold damage.",
              "When you are fully submerged, any creature that is also fully submerged can understand your speech, and you can understand theirs.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "guardian_coil",
            name: "Guardian Coil",
            desc: [
              "At 6th level, when you or a creature you can see takes damage while within 10 feet of your Tentacle of the Deep, you can use your reaction to reduce that damage by 1d8.",
              "At warlock level 10, the damage reduced by the tentacle increases to 2d8.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "grasping_tentacles",
            name: "Grasping Tentacles",
            desc: [
              "Starting at 10th level, you learn [[spell:evards-black-tentacles|Evard's Black Tentacles]]. It counts as a warlock spell for you, but it doesn't count against the number of spells you know.",
              "You can also cast it once without using a spell slot, and you regain that use when you finish a long rest.",
              "Whenever you cast it, you gain temporary hit points equal to your warlock level, and damage can't break your concentration on that spell.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "fathomless_plunge",
            name: "Fathomless Plunge",
            desc: [
              "At 14th level, as an action, you can teleport yourself and up to five willing creatures you can see within 30 feet of you.",
              "You all reappear up to 1 mile away in a body of water you've seen of pond size or larger, or within 30 feet of it, in unoccupied spaces within 30 feet of one another.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["create-or-destroy-water", "thunderwave"] },
          { spellLevel: 2, spells: ["gust-of-wind", "silence"] },
          { spellLevel: 3, spells: ["lightning-bolt", "sleet-storm"] },
          { spellLevel: 4, spells: ["control-water", "summon-elemental"] },
          { spellLevel: 5, spells: ["bigbys-hand", "cone-of-cold"] },
        ],
      },
      fiend: {
        // Source (feature text): https://dnd5e.wikidot.com/warlock:fiend (CC BY-SA 3.0)
        name: "The Fiend",
        source: "Player's Handbook",
        features: [
          {
            id: "dark_ones_blessing",
            name: "Dark One's Blessing",
            desc: [
              "Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "dark_ones_own_luck",
            name: "Dark One's Own Luck",
            desc: [
              "Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "fiendish_resilience",
            name: "Fiendish Resilience",
            desc: [
              "Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature.",
              "Damage from magical weapons or silver weapons ignores this resistance.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "hurl_through_hell",
            name: "Hurl Through Hell",
            desc: [
              "Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.",
              "At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["burning-hands", "command"] },
          { spellLevel: 2, spells: ["blindness-deafness", "scorching-ray"] },
          { spellLevel: 3, spells: ["fireball", "stinking-cloud"] },
          { spellLevel: 4, spells: ["fire-shield", "wall-of-fire"] },
          { spellLevel: 5, spells: ["flame-strike", "hallow"] },
        ],
      },
      genie: {
        name: "The Genie",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "genies_vessel",
            name: "Genie's Vessel",
            desc: [
              "At 1st level, your patron gifts you a magical vessel that grants you a measure of the genie's power.",
              "The vessel is a Tiny object that you can use as a spellcasting focus for your warlock spells.",
              "Typical vessels include an oil lamp, urn, ring with a compartment, stoppered bottle, hollow statuette, or ornate lantern.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "bottled_respite",
            name: "Bottled Respite",
            desc: [
              "While touching your vessel, you can use an action to magically vanish and enter it.",
              "You can remain inside for up to twice your proficiency bonus in hours, and can leave early as a bonus action.",
              "Once you enter the vessel, you can't enter again until you finish a long rest.",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "genies_wrath",
            name: "Genie's Wrath",
            desc: [
              "Once during each of your turns when you hit with an attack roll, you can deal extra damage equal to your proficiency bonus.",
              "The damage type is determined by your patron's kind.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "elemental_gift",
            name: "Elemental Gift",
            desc: [
              "At 6th level, you gain permanent resistance to a damage type determined by your patron's kind.",
              "You can also use a bonus action to give yourself a flying speed of 30 feet for 10 minutes, during which you can hover.",
              "You can activate that flying speed a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
            ],
            level: 6,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "sanctuary_vessel",
            name: "Sanctuary Vessel",
            desc: [
              "At 10th level, when you enter your Genie's Vessel via Bottled Respite, you can bring up to five willing creatures within 30 feet into the vessel with you.",
              "As a bonus action, you can eject any number of creatures from the vessel.",
              "Anyone who stays in the vessel for at least 10 minutes gains the benefit of finishing a short rest there, and creatures spending Hit Dice add your proficiency bonus to the hit points regained.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "limited_wish",
            name: "Limited Wish",
            desc: [
              "At 14th level, as an action, you can request the effect of one spell of 6th level or lower with a casting time of 1 action.",
              "The spell can come from any class spell list, requires no spell slot, and ignores material and other casting requirements.",
              "After you use this feature, click the die icon to roll the 1d4-long-rest recharge, then adjust the remaining days manually as needed.",
            ],
            level: 14,
            tracked: true,
            trackedMode: "rolledLongRestCooldown",
          },
        ],
        expandedSpellOptions: getGenieExpandedSpellOptions(""),
      },
      greatOldOne: {
        // Source (feature text): https://dnd5e.wikidot.com/warlock:great-old-one (CC BY-SA 3.0)
        name: "The Great Old One",
        source: "Player's Handbook",
        features: [
          {
            id: "awakened_mind",
            name: "Awakened Mind",
            desc: [
              "Starting at 1st level, your alien knowledge gives you the ability to touch the minds of other creatures.",
              "You can telepathically speak to any creature you can see within 30 feet of you.",
              "You don't need to share a language with the creature for it to understand your telepathic utterances, but the creature must be able to understand at least one language.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "entropic_ward",
            name: "Entropic Ward",
            desc: [
              "At 6th level, you learn to magically ward yourself against attack and to turn an enemy's failed strike into good luck for yourself.",
              "When a creature makes an attack roll against you, you can use your reaction to impose disadvantage on that roll.",
              "If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "thought_shield",
            name: "Thought Shield",
            desc: [
              "Starting at 10th level, your thoughts can't be read by telepathy or other means unless you allow it.",
              "You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "create_thrall",
            name: "Create Thrall",
            desc: [
              "At 14th level, you gain the ability to infect a humanoid's mind with the alien magic of your patron.",
              "You can use your action to touch an incapacitated humanoid. That creature is then charmed by you until a Remove Curse spell is cast on it, the charmed condition is removed from it, or you use this feature again.",
              "You can communicate telepathically with the charmed creature as long as the two of you are on the same plane of existence.",
            ],
            level: 14,
            tracked: false,
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["dissonant-whispers", "tashas-hideous-laughter"] },
          { spellLevel: 2, spells: ["detect-thoughts", "phantasmal-force"] },
          { spellLevel: 3, spells: ["clairvoyance", "sending"] },
          { spellLevel: 4, spells: ["dominate-beast", "evards-black-tentacles"] },
          { spellLevel: 5, spells: ["dominate-person", "telekinesis"] },
        ],
      },
      hexblade: {
        // Source (feature text): https://dnd5e.wikidot.com/warlock:hexblade (CC BY-SA 3.0)
        name: "The Hexblade",
        source: "Xanathar's Guide to Everything",
        features: [
          {
            id: "hexblades_curse",
            name: "Hexblade's Curse",
            desc: [
              "Starting at 1st level, you gain the ability to place a baleful curse on someone. As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. The curse ends early if the target dies, you die, or you are incapacitated.",
              "Until the curse ends, you gain the following benefits: you gain a bonus to damage rolls against the cursed target equal to your proficiency bonus; any attack roll you make against the cursed target is a critical hit on a roll of 19 or 20 on the d20; and if the cursed target dies, you regain hit points equal to your warlock level + your Charisma modifier (minimum of 1 hit point).",
              "Once you use this feature, you can't use it again until you finish a short or long rest.",
            ],
            level: 1,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "hex_warrior",
            name: "Hex Warrior",
            desc: [
              "At 1st level, you acquire the training necessary to effectively arm yourself for battle. You gain proficiency with medium armor, shields, and martial weapons.",
              "The influence of your patron also allows you to mystically channel your will through a particular weapon. Whenever you finish a long rest, you can touch one weapon that you are proficient with and that lacks the two-handed property. When you attack with that weapon, you can use your Charisma modifier, instead of Strength or Dexterity, for the attack and damage rolls.",
              "This benefit lasts until you finish a long rest. If you later gain the Pact of the Blade feature, this benefit extends to every pact weapon you conjure with that feature, no matter the weapon's type.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "accursed_specter",
            name: "Accursed Specter",
            desc: [
              "Starting at 6th level, you can curse the soul of a person you slay, temporarily binding it in your service. When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter, the statistics of which are in the Monster Manual.",
              "When the specter appears, it gains temporary hit points equal to half your warlock level. Roll initiative for the specter, which has its own turns. It obeys your verbal commands, and it gains a special bonus to its attack rolls equal to your Charisma modifier (minimum of +0).",
              "The specter remains in your service until the end of your next long rest, at which point it vanishes to the afterlife. Once you bind a specter with this feature, you can't use the feature again until you finish a long rest.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "armor_of_hexes",
            name: "Armor of Hexes",
            desc: [
              "At 10th level, your hex grows more powerful. If the target cursed by your Hexblade's Curse hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "master_of_hexes",
            name: "Master of Hexes",
            desc: [
              "Starting at 14th level, you can spread your Hexblade's Curse from a slain creature to another creature. When the creature cursed by your Hexblade's Curse dies, you can apply the curse to a different creature you can see within 30 feet of you, provided you aren't incapacitated.",
              "When you apply the curse in this way, you don't regain hit points from the death of the previously cursed creature.",
            ],
            level: 14,
            tracked: false,
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["shield", "wrathful-smite"] },
          { spellLevel: 2, spells: ["blur", "branding-smite"] },
          { spellLevel: 3, spells: ["blink", "elemental-weapon"] },
          { spellLevel: 4, spells: ["phantasmal-killer", "staggering-smite"] },
          { spellLevel: 5, spells: ["banishing-smite", "cone-of-cold"] },
        ],
      },
      undead: {
        // Source (feature text): https://dnd5e.wikidot.com/warlock:undead (CC BY-SA 3.0)
        name: "The Undead",
        source: "Van Richten's Guide to Ravenloft",
        features: [
          {
            id: "form_of_dread",
            name: "Form of Dread",
            desc: [
              "At 1st level, you can manifest an aspect of your patron's dreadful power as a bonus action, transforming for 1 minute.",
              "While transformed, you gain temporary hit points equal to 1d10 + your warlock level, you are immune to the frightened condition, and once during each of your turns when you hit a creature with an attack you can force it to make a Wisdom saving throw or be frightened of you until the end of your next turn.",
            ],
            level: 1,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "grave_touched",
            name: "Grave Touched",
            desc: [
              "At 6th level, you no longer need to eat, drink, or breathe.",
              "In addition, once during each of your turns when you hit a creature with an attack and roll damage against it, you can replace the damage type with necrotic damage.",
              "While you are using your Form of Dread, you can roll one additional damage die when determining the necrotic damage the target takes.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "necrotic_husk",
            name: "Necrotic Husk",
            desc: [
              "At 10th level, you gain resistance to necrotic damage, and while you are transformed using Form of Dread you instead become immune to necrotic damage.",
              "When you are reduced to 0 hit points, you can use your reaction to drop to 1 hit point instead and erupt with deathly energy. Each creature of your choice within 30 feet takes necrotic damage equal to 2d10 + your warlock level, and you then gain 1 level of exhaustion.",
              "After you use this feature, click the die icon to roll the 1d4-long-rest recharge, then adjust the remaining days manually as needed.",
            ],
            level: 10,
            tracked: true,
            trackedMode: "rolledLongRestCooldown",
          },
          {
            id: "spirit_projection",
            name: "Spirit Projection",
            desc: [
              "At 14th level, as an action, you can project your spirit from your body for up to 1 hour while concentrating as if on a spell. Your body is left unconscious in suspended animation.",
              "While projecting, your spirit mirrors your game statistics, any damage or effects that apply to either body affect the other, and when the projection ends your spirit returns to your body or your body teleports to your spirit's space.",
              "While projecting, you and your body gain resistance to bludgeoning, piercing, and slashing damage; your conjuration and necromancy spells need no verbal or somatic components or material components without a gold cost; you gain a flying speed equal to your walking speed and can hover; and while using Form of Dread, once during each of your turns when you deal necrotic damage to a creature, you regain hit points equal to half that damage dealt.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["bane", "false-life"] },
          { spellLevel: 2, spells: ["blindness-deafness", "phantasmal-force"] },
          { spellLevel: 3, spells: ["phantom-steed", "speak-with-dead"] },
          { spellLevel: 4, spells: ["death-ward", "greater-invisibility"] },
          { spellLevel: 5, spells: ["antilife-shell", "cloudkill"] },
        ],
      },
      undying: {
        // Source (feature text): https://dnd5e.wikidot.com/warlock:undying (CC BY-SA 3.0)
        name: "The Undying",
        source: "Sword Coast Adventurer's Guide",
        features: [
          {
            id: "among_the_dead",
            name: "Among the Dead",
            desc: [
              "Starting at 1st level, you learn Spare the Dying, which counts as a warlock cantrip for you. You also have advantage on saving throws against any disease.",
              "Additionally, undead have difficulty harming you. If an undead targets you directly with an attack or a harmful spell, that creature must make a Wisdom saving throw against your spell save DC.",
              "On a failed save, the creature must choose a new target or forfeit targeting someone instead of you. On a successful save, or if you target it with an attack or a harmful spell, that undead is immune to this effect for 24 hours.",
            ],
            level: 1,
            tracked: false,
          },
          {
            id: "defy_death",
            name: "Defy Death",
            desc: [
              "Starting at 6th level, you can regain hit points equal to 1d8 + your Constitution modifier (minimum of 1 hit point) when you succeed on a death saving throw or when you stabilize a creature with Spare the Dying.",
              "Once you use this feature, you can't use it again until you finish a long rest.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "undying_nature",
            name: "Undying Nature",
            desc: [
              "Beginning at 10th level, you can hold your breath indefinitely, and you don't require food, water, or sleep, although you still require rest to reduce exhaustion and still benefit from finishing short and long rests.",
              "In addition, you age at a slower rate. For every 10 years that pass, your body ages only 1 year, and you are immune to being magically aged.",
            ],
            level: 10,
            tracked: false,
          },
          {
            id: "indestructible_life",
            name: "Indestructible Life",
            desc: [
              "At 14th level, on your turn you can use a bonus action to regain hit points equal to 1d8 + your warlock level.",
              "Additionally, if you put a severed body part of yours back in place when you use this feature, the part reattaches.",
              "Once you use this feature, you can't use it again until you finish a short or long rest.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
        ],
        expandedSpellOptions: [
          { spellLevel: 1, spells: ["false-life", "ray-of-sickness"] },
          { spellLevel: 2, spells: ["blindness-deafness", "silence"] },
          { spellLevel: 3, spells: ["feign-death", "speak-with-dead"] },
          { spellLevel: 4, spells: ["aura-of-life", "death-ward"] },
          { spellLevel: 5, spells: ["contagion", "legend-lore"] },
        ],
      },
    },
  },

  wizard: {
    hitDice: "D6",
    isSpellCaster: "fullCaster",
    spellcastingAbility: "int",
    classFeatures: [
      {
        id: "spellbook",
        name: "Spellbook",
        desc: [
          "At 1st level, your spellbook contains six 1st-level wizard spells of your choice, and you record additional wizard spells in it as you find or learn them.",
          "Whenever you gain a wizard level, you can add two wizard spells to your spellbook for free.",
          "You prepare wizard spells from your spellbook each day, choosing a number of spells equal to your Intelligence modifier + your wizard level (minimum of one prepared spell).",
        ],
        level: 1,
        tracked: false,
      },
      {
        id: "arcane_recovery",
        name: "Arcane Recovery",
        desc: [
          "Once per day when you finish a short rest, you can recover expended spell slots.",
          "The recovered slots can have a combined level up to half your wizard level, rounded up, and none of them can be 6th level or higher.",
        ],
        level: 1,
        tracked: true,
        uses: 1,
        recharge: "lr",
      },
      {
        id: "cantrip_formulas",
        name: "Cantrip Formulas",
        desc: [
          "Optional feature from 3rd level.",
          "After a long rest, you can swap one wizard cantrip you know for another wizard cantrip by consulting formulas in your spellbook.",
        ],
        level: 3,
        tracked: false,
      },
      {
        id: "spell_mastery",
        name: "Spell Mastery",
        desc: [
          "At 18th level, choose one 1st-level and one 2nd-level wizard spell from your spellbook.",
          "While those spells are prepared, you can cast them at their lowest level without expending spell slots.",
        ],
        level: 18,
        tracked: false,
      },
      {
        id: "signature_spells",
        name: "Signature Spells",
        desc: [
          "At 20th level, choose two 3rd-level wizard spells in your spellbook as signature spells.",
          "They are always prepared, do not count against your prepared total, and each can be cast once at 3rd level without a spell slot before you rest.",
        ],
        level: 20,
        tracked: false,
      },
    ],
    subclasses: {
      abjuration: {
        name: "School of Abjuration",
        source: "Player's Handbook",
        features: [
          {
            id: "abjuration_savant",
            name: "Abjuration Savant",
            desc: "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an abjuration spell into your spellbook is halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "arcane_ward",
            name: "Arcane Ward",
            desc: [
              "Starting at 2nd level, when you cast an abjuration spell of 1st level or higher, you can create a magical ward on yourself that lasts until you finish a long rest.",
              "The ward has hit points equal to twice your wizard level + your Intelligence modifier. Whenever you take damage, the ward takes the damage instead, and if this reduces the ward to 0 hit points, you take any remaining damage.",
              "While the ward has 0 hit points, it can't absorb damage, but its magic remains. Whenever you cast an abjuration spell of 1st level or higher, the ward regains hit points equal to twice the spell's level.",
              "Once you create the ward, you can't create it again until you finish a long rest.",
            ],
            level: 2,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "projected_ward",
            name: "Projected Ward",
            desc: "Starting at 6th level, when a creature that you can see within 30 feet of you takes damage, you can use your reaction to cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 hit points, the warded creature takes any remaining damage.",
            level: 6,
            tracked: false,
          },
          {
            id: "improved_abjuration",
            name: "Improved Abjuration",
            desc: "Beginning at 10th level, when you cast an abjuration spell that requires you to make an ability check as part of casting it, you add your proficiency bonus to that ability check.",
            level: 10,
            tracked: false,
          },
          {
            id: "spell_resistance",
            name: "Spell Resistance",
            desc: [
              "Starting at 14th level, you have advantage on saving throws against spells.",
              "Furthermore, you have resistance against the damage of spells.",
            ],
            level: 14,
            tracked: false,
          },
        ],
      },
      bladesinging: {
        name: "Bladesinging",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "bladesong",
            name: "Bladesong",
            desc: [
              "As a bonus action, you can start the Bladesong for 1 minute while you aren't wearing medium or heavy armor or using a shield.",
              "It ends early if you are incapacitated, if you don medium or heavy armor or a shield, or if you use two hands to make an attack with a weapon. You can also dismiss it at any time with no action required.",
              "While active, you gain a bonus to AC equal to your Intelligence modifier, your walking speed increases by 10 feet, you have advantage on Dexterity (Acrobatics) checks, and you gain a bonus to concentration saves equal to your Intelligence modifier.",
            ],
            level: 2,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "bladesinger_extra_attack",
            name: "Extra Attack",
            desc: "When you take the Attack action on your turn, you can attack twice instead of once. You can cast one of your cantrips in place of one of those attacks.",
            level: 6,
            tracked: false,
          },
          {
            id: "song_of_defense",
            name: "Song of Defense",
            desc: "While your Bladesong is active, when you take damage you can use your reaction and expend a spell slot to reduce that damage by five times the spell slot's level.",
            level: 10,
            tracked: false,
          },
          {
            id: "song_of_victory",
            name: "Song of Victory",
            desc: "While your Bladesong is active, you add your Intelligence modifier to the damage of your melee weapon attacks.",
            level: 14,
            tracked: false,
          },
        ],
      },
      chronurgy: {
        name: "Chronurgy Magic",
        source: "Explorer's Guide to Wildemount",
        features: [
          {
            id: "chronal_shift",
            name: "Chronal Shift",
            desc: [
              "As a reaction, after you or a creature you can see within 30 feet of you makes an attack roll, an ability check, or a saving throw, you can force the creature to reroll.",
              "You make this decision after you see whether the roll succeeds or fails. The target must use the result of the second roll.",
            ],
            level: 2,
            tracked: true,
            uses: 2,
            recharge: "lr",
          },
          {
            id: "temporal_awareness",
            name: "Temporal Awareness",
            desc: "Add your Intelligence modifier to your initiative rolls.",
            level: 2,
            tracked: false,
          },
          {
            id: "momentary_stasis",
            name: "Momentary Stasis",
            desc: [
              "As an action, you can magically force a Large or smaller creature you can see within 60 feet of you to make a Constitution saving throw against your spell save DC.",
              "Unless the saving throw is a success, the creature is encased in a field of magical energy until the end of your next turn or until the creature takes any damage. While encased in this way, the creature is incapacitated and has a speed of 0.",
            ],
            level: 6,
            tracked: true,
            uses: "int_mod",
            minUses: 1,
            recharge: "lr",
          },
          {
            id: "arcane_abeyance",
            name: "Arcane Abeyance",
            desc: [
              "When you cast a spell using a spell slot of 4th level or lower, you can condense the spell's magic into a mote. The spell is frozen in time at the moment of casting and held within a gray bead for 1 hour.",
              "This bead is a Tiny object with AC 15 and 1 hit point, and it is immune to poison and psychic damage. When the duration ends, or if the bead is destroyed, it vanishes in a flash of light, and the spell is lost.",
              "A creature holding the bead can use its action to release the spell within, whereupon the bead disappears. The spell uses your spell attack bonus and save DC, and the spell treats the creature who released it as the caster for all other purposes.",
            ],
            level: 10,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "convergent_future",
            name: "Convergent Future",
            desc: [
              "As a reaction, when you or a creature you can see within 60 feet of you makes an attack roll, an ability check, or a saving throw, you can ignore the die roll and decide whether the number rolled is the minimum needed to succeed or one less than that number.",
              "When you use this feature, you gain one level of exhaustion. Only by finishing a long rest can you remove a level of exhaustion gained in this way.",
            ],
            level: 14,
            tracked: false,
          },
        ],
      },
      conjuration: {
        name: "School of Conjuration",
        source: "Player's Handbook",
        features: [
          {
            id: "conjuration_savant",
            name: "Conjuration Savant",
            desc: "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a Conjuration spell into your spellbook is halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "minor_conjuration",
            name: "Minor Conjuration",
            desc: [
              "Starting at 2nd level when you select this school, you can use your action to conjure up an inanimate object in your hand or on the ground in an unoccupied space that you can see within 10 feet of you.",
              "This object can be no larger than 3 feet on a side and weigh no more than 10 pounds, and its form must be that of a nonmagical object that you have seen. The object is visibly magical, radiating dim light out to 5 feet.",
              "The object disappears after 1 hour, when you use this feature again, or if it takes or deals any damage.",
            ],
            level: 2,
            tracked: false,
          },
          {
            id: "benign_transportation",
            name: "Benign Transportation",
            desc: [
              "Starting at 6th level, you can use your action to teleport up to 30 feet to an unoccupied space that you can see. Alternatively, you can choose a space within range that is occupied by a Small or Medium creature.",
              "If that creature is willing, you both teleport, swapping places.",
              "Once you use this feature, you can't use it again until you finish a long rest or you cast a conjuration spell of 1st level or higher.",
            ],
            level: 6,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "focused_conjuration",
            name: "Focused Conjuration",
            desc: "Beginning at 10th level, while you are concentrating on a conjuration spell, your concentration can't be broken as a result of taking damage.",
            level: 10,
            tracked: false,
          },
          {
            id: "durable_summons",
            name: "Durable Summons",
            desc: "Starting at 14th level, any creature that you summon or create with a conjuration spell has 30 temporary hit points.",
            level: 14,
            tracked: false,
          },
        ],
      },
      divination: {
        name: "School of Divination",
        source: "Player's Handbook",
        features: [
          {
            id: "divination_savant",
            name: "Divination Savant",
            desc: "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a divination spell into your spellbook are halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "portent",
            name: "Portent",
            desc: [
              "When you finish a long rest, roll two d20s and record the numbers rolled.",
              "You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these foretelling rolls before the roll is made. You can replace a roll this way only once per turn.",
              "Each foretelling roll can be used only once, and you lose any unused foretelling rolls when you finish a long rest.",
            ],
            level: 2,
            tracked: true,
            trackedMode: "portentRolls",
          },
          {
            id: "expert_divination",
            name: "Expert Divination",
            desc: "Beginning at 6th level, when you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the spell you cast and can't be higher than 5th level.",
            level: 6,
            tracked: false,
          },
          {
            id: "the_third_eye",
            name: "The Third Eye",
            desc: "As an action, gain one perception boon until you rest or become incapacitated: 60-foot darkvision, sight into the Ethereal Plane within 60 feet, the ability to read any language, or seeing invisible creatures and objects within 10 feet.",
            level: 10,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "greater_portent",
            name: "Greater Portent",
            desc: "Starting at 14th level, you roll three d20s for your Portent feature, rather than two.",
            level: 14,
            tracked: false,
          },
        ],
      },
      enchantment: {
        name: "School of Enchantment",
        source: "Player's Handbook",
        features: [
          {
            id: "enchantment_savant",
            name: "Enchantment Savant",
            desc: "Beginning when you select this school at 2nd level, the gold and time you must spend to copy an Enchantment spell into your spellbook is halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "hypnotic_gaze",
            name: "Hypnotic Gaze",
            desc: [
              "Starting at 2nd level when you choose this school, your soft words and enchanting gaze can magically enthrall another creature. As an action, choose one creature that you can see within 5 feet of you. If the target can see or hear you, it must succeed on a Wisdom saving throw against your wizard spell save DC or be charmed by you until the end of your next turn. The charmed creature's speed drops to 0, and the creature is incapacitated and visibly dazed.",
              "On subsequent turns, you can use your action to maintain this effect, extending its duration until the end of your next turn. However, the effect ends if you move more than 5 feet away from the creature, if the creature can neither see nor hear you, or if the creature takes damage.",
              "Once the effect ends, or if the creature succeeds on its initial saving throw against this effect, you can't use this feature on that creature again until you finish a long rest.",
            ],
            level: 2,
            tracked: false,
          },
          {
            id: "instinctive_charm",
            name: "Instinctive Charm",
            desc: [
              "Beginning at 6th level, when a creature you can see within 30 feet of you makes an attack roll against you, you can use your reaction to divert the attack, provided that another creature is within the attack's range. The attacker must make a Wisdom saving throw against your wizard spell save DC. On a failed save, the attacker must target the creature that is closest to it, not including you or itself. If multiple creatures are closest, the attacker chooses which one to target.",
              "On a successful save, you can't use this feature on the attacker again until you finish a long rest.",
              "You must choose to use this feature before knowing whether the attack hits or misses. Creatures that can't be charmed are immune to this effect.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "split_enchantment",
            name: "Split Enchantment",
            desc: "When you cast an enchantment spell of 1st level or higher that targets only one creature, you can have it target a second creature.",
            level: 10,
            tracked: false,
          },
          {
            id: "alter_memories",
            name: "Alter Memories",
            desc: [
              "At 14th level, you gain the ability to make a creature unaware of your magical influence on it. When you cast an enchantment spell to charm one or more creatures, you can alter one creature's understanding so that it remains unaware of being charmed.",
              "Additionally, once before the spell expires, you can use your action to try to make the chosen creature forget some of the time it spent charmed. The creature must succeed on an Intelligence saving throw against your wizard spell save DC or lose a number of hours of its memories equal to 1 + your Charisma modifier (minimum 1). You can make the creature forget less time, and the amount of time can't exceed the duration of your enchantment spell.",
            ],
            level: 14,
            tracked: false,
          },
        ],
      },
      evocation: {
        name: "School of Evocation",
        source: "Player's Handbook",
        features: [
          {
            id: "evocation_savant",
            name: "Evocation Savant",
            desc: "When you copy an evocation spell into your spellbook, the gold and time required are halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "sculpt_spells",
            name: "Sculpt Spells",
            desc: "When you cast an evocation spell that affects other creatures you can see, you can choose a number of them equal to 1 + the spell's level. Those creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.",
            level: 2,
            tracked: false,
          },
          {
            id: "potent_cantrip",
            name: "Potent Cantrip",
            desc: "When a creature succeeds on a saving throw against one of your damaging cantrips, it still takes half the cantrip's damage, though it suffers no additional effect from the cantrip.",
            level: 6,
            tracked: false,
          },
          {
            id: "empowered_evocation",
            name: "Empowered Evocation",
            desc: "Add your Intelligence modifier, minimum +1, to one damage roll of any wizard evocation spell you cast.",
            level: 10,
            tracked: false,
          },
          {
            id: "overchannel",
            name: "Overchannel",
            desc: [
              "When you cast a wizard spell of 1st through 5th level that deals damage, you can make that spell deal maximum damage.",
              "The first use between long rests has no drawback. Each additional use before your next long rest deals escalating necrotic damage to you per spell level, and that damage ignores resistance and immunity.",
            ],
            level: 14,
            tracked: true,
            trackedMode: "stackingChecks",
            stackingVariant: "overchannelDamage",
            maxChecks: 10,
            recharge: "lr",
          },
        ],
      },
      graviturgy: {
        name: "Graviturgy Magic",
        source: "Explorer's Guide to Wildemount",
        features: [
          {
            id: "adjust_density",
            name: "Adjust Density",
            desc: [
              "At 2nd level, as an action, you can magically alter the weight of one object or creature you can see within 30 feet of you. The target must be Large or smaller, and its weight is halved or doubled for up to 1 minute while you concentrate.",
              "If a creature's weight is halved, its speed increases by 10 feet, it can jump twice as far as normal, and it has disadvantage on Strength checks and Strength saving throws. If a creature's weight is doubled, its speed is reduced by 10 feet, and it has advantage on Strength checks and Strength saving throws.",
              "At 10th level, you can target an object or creature that is Huge or smaller.",
            ],
            level: 2,
            tracked: false,
          },
          {
            id: "gravity_well",
            name: "Gravity Well",
            desc: "At 6th level, whenever you cast a spell on a creature, you can move the target 5 feet to an unoccupied space of your choice if the target is willing to move, if the spell hits it with an attack, or if it fails a saving throw against the spell.",
            level: 6,
            tracked: false,
          },
          {
            id: "violent_attraction",
            name: "Violent Attraction",
            desc: [
              "At 10th level, when another creature you can see within 60 feet of you hits with a weapon attack, you can use your reaction to increase the attack's velocity, causing the attack's target to take an extra 1d10 damage of the weapon's type.",
              "Alternatively, if a creature within 60 feet of you takes damage from a fall, you can use your reaction to increase the fall's damage by 2d10.",
              "You can use this feature a number of times equal to your Intelligence modifier (minimum 1), and you regain all expended uses when you finish a long rest.",
            ],
            level: 10,
            tracked: true,
            uses: "int_mod",
            recharge: "lr",
          },
          {
            id: "event_horizon",
            name: "Event Horizon",
            desc: [
              "Starting at 14th level, as an action, you can magically emit a powerful field of gravitational energy that tugs at other creatures for up to 1 minute while you concentrate.",
              "Whenever a creature hostile to you starts its turn within 30 feet of you, it must make a Strength saving throw against your spell save DC. On a failed save, it takes 2d10 force damage, and its speed is reduced to 0 until the start of its next turn. On a successful save, it takes half as much damage, and every foot it moves that turn costs 2 extra feet of movement.",
              "Once you use this feature, you can't use it again until you finish a long rest, though the feature can also be fueled by expending a 3rd-level or higher spell slot.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      illusion: {
        name: "School of Illusion",
        source: "Player's Handbook",
        features: [
          {
            id: "illusion_savant",
            name: "Illusion Savant",
            desc: "Starting at 2nd level, the gold and time you spend to copy illusion spells into your spellbook are halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "improved_minor_illusion",
            name: "Improved Minor Illusion",
            desc: [
              "At 2nd level, you learn Minor Illusion, and it does not count against your cantrips known in this tracker.",
              "When you cast Minor Illusion, you can create both a sound and an image with the same casting.",
            ],
            level: 2,
            tracked: false,
          },
          {
            id: "malleable_illusions",
            name: "Malleable Illusions",
            desc: "Starting at 6th level, when you cast an illusion spell that lasts at least 1 minute, you can use your action to reshape it while you can still see it.",
            level: 6,
            tracked: false,
          },
          {
            id: "illusory_self",
            name: "Illusory Self",
            desc: "Beginning at 10th level, when a creature makes an attack roll against you, you can use your reaction to interpose an illusory duplicate of yourself so the attack misses.",
            level: 10,
            tracked: false,
          },
          {
            id: "event_horizon",
            name: "Event Horizon",
            desc: [
              "At 14th level, as an action, you emit a field of magical force for up to 1 minute while you concentrate.",
              "Hostile creatures that start their turn within 30 feet of you must make a Strength save against your wizard spell save DC, taking force damage and having their movement hindered on a failure.",
              "This tracker records one use and it refreshes on a long rest.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "illusory_reality",
            name: "Illusory Reality",
            desc: "Also at 14th level, when you cast an illusion spell of 1st level or higher, you can make one inanimate, nonmagical object in that illusion temporarily real for 1 minute.",
            level: 14,
            tracked: false,
          },
        ],
      },
      necromancy: {
        name: "School of Necromancy",
        source: "Player's Handbook",
        features: [
          {
            id: "necromancy_savant",
            name: "Necromancy Savant",
            desc: "Beginning when you select this school at 2nd level, the gold and time you must spend to copy a necromancy spell into your spellbook is halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "grim_harvest",
            name: "Grim Harvest",
            desc: "At 2nd level, when you kill one or more creatures with a spell of 1st level or higher, you regain hit points equal to twice the spell's level, or three times its level if the spell belongs to the School of Necromancy. You don't gain this benefit for killing constructs or undead.",
            level: 2,
            tracked: false,
          },
          {
            id: "undead_thralls",
            name: "Undead Thralls",
            desc: [
              "At 6th level, Animate Dead is added to your spellbook if it is not already there.",
              "When you cast Animate Dead, you can target one additional corpse or pile of bones, creating another zombie or skeleton as appropriate.",
              "Whenever you create an undead using a necromancy spell, its hit point maximum increases by an amount equal to your wizard level, and it adds your proficiency bonus to its weapon damage rolls.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "inured_to_undeath",
            name: "Inured to Undeath",
            desc: "Beginning at 10th level, you have resistance to necrotic damage, and your hit point maximum can't be reduced.",
            level: 10,
            tracked: false,
          },
          {
            id: "command_undead",
            name: "Command Undead",
            desc: [
              "Starting at 14th level, as an action, you can choose one undead you can see within 60 feet of you.",
              "It must make a Charisma saving throw against your wizard spell save DC. On a failure, it becomes friendly to you and obeys your commands until you use this feature again. If it succeeds, you can't use this feature on it again.",
              "Intelligent undead are harder to command: if it has Intelligence 8 or higher, it has advantage on the save, and if it has Intelligence 12 or higher, it can repeat the save at the end of every hour until it succeeds.",
            ],
            level: 14,
            tracked: false,
          },
        ],
      },
      scribes: {
        name: "Order of Scribes",
        source: "Tasha's Cauldron of Everything",
        features: [
          {
            id: "wizardly_quill",
            name: "Wizardly Quill",
            desc: [
              "At 2nd level, as a bonus action, you can magically create a Tiny quill in your free hand.",
              "The quill doesn't require ink. When you write with it, it produces ink in a color of your choice on the writing surface.",
              "The time you must spend to copy a spell into your spell book equals 2 minutes per spell level if you use the quill for the transcription.",
              "You can erase anything you write with the quill if you wave the feather over the text as a bonus action, provided the text is within 5 feet of you.",
              "This quill disappears if you create another one or if you die.",
            ],
            level: 2,
            tracked: false,
          },
          {
            id: "awakened_spellbook",
            name: "Awakened Spell Book (Fast Ritual)",
            desc: [
              "Using specially prepared inks and ancient incantations passed down by your wizardly order, you have awakened an arcane sentience within your spellbook.",
              "While you are holding the book, you can use it as a spellcasting focus for your wizard spells.",
              "When you cast a wizard spell with a spell slot, you can temporarily replace its damage type with a type that appears in another spell in your spellbook. The other spell must be of the same level as the spell slot you expend.",
              "When you cast a wizard spell as a ritual, you can use the spell's normal casting time rather than adding 10 minutes to it. Once you use this benefit, you can't do so again until you finish a long rest.",
              "If necessary, you can replace the book over the course of a short rest by using your Wizardly Quill to write arcane sigils in a blank book or a magic spellbook to which you're attuned. At the end of the rest, your spellbook's consciousness is summoned into the new book, which becomes your spellbook along with all its spells. If the previous book still existed, all the spells vanish from its pages.",
            ],
            level: 2,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
          {
            id: "manifest_mind",
            name: "Manifest Mind (Modified Casting)",
            desc: [
              "At 6th level, as a bonus action while your Awakened Spellbook is on your person, you can cause its mind to manifest as a Tiny spectral object in an unoccupied space you can see within 60 feet.",
              "The spectral mind is intangible, sheds dim light in a 10-foot radius, and can look like a ghostly tome, a cascade of text, or a scholar from the past.",
              "While manifested, the spectral mind can hear and see, has darkvision out to 60 feet, and can telepathically share with you what it sees and hears.",
              "Whenever you cast a wizard spell on your turn, you can cast it as if you were in the spectral mind's space instead of your own, using its senses. You can do so a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.",
              "As a bonus action, you can move the spectral mind up to 30 feet to an unoccupied space you or it can see. It can pass through creatures but not objects.",
              "The spectral mind stops manifesting if it is ever more than 300 feet away from you, if someone casts Dispel Magic on it, if the Awakened Spellbook is destroyed, if you die, or if you dismiss the mind as a bonus action.",
              "Once you conjure the mind, you can't do so again until you finish a long rest unless you expend a spell slot of any level to conjure it again.",
            ],
            level: 6,
            tracked: true,
            uses: "pb",
            recharge: "lr",
          },
          {
            id: "master_scriviner",
            name: "Master Scriviner",
            desc: [
              "At 10th level, whenever you finish a long rest, you can create one magic scroll by touching your Wizardly Quill to a blank piece of paper or parchment and causing one spell from your Awakened Spellbook to be copied onto the scroll. The spellbook must be within 5 feet of you when you make the scroll.",
              "The chosen spell must be of 1st or 2nd level and must have a casting time of 1 action. Once in the scroll, the spell counts as one level higher than normal.",
              "You can cast the spell from the scroll by reading it as an action. The scroll is unintelligible to anyone else, and the spell vanishes from the scroll when you cast it or when you finish your next long rest.",
              "You are also adept at crafting spell scrolls. The gold and time you must spend to make such a scroll are halved if you use your Wizardly Quill.",
            ],
            level: 10,
            tracked: true,
            uses: 0,
            recharge: "lr",
          },
          {
            id: "one_with_the_word",
            name: "One with the Word",
            desc: [
              "At 14th level, your connection to your Awakened Spellbook becomes so profound that your soul is entwined with it.",
              "While the book is on your person, you have advantage on Intelligence (Arcana) checks, as the spellbook helps you remember magical lore.",
              "If you take damage while your spellbook's mind is manifested, you can use your reaction to dismiss the spectral mind and prevent all of that damage to you.",
              "When you do, the spellbook temporarily loses spells of your choice that have a combined spell level equal to or higher than the rolled cost, and if there aren't enough spells in the book to cover it, you drop to 0 hit points.",
              "Until you finish 1d6 long rests, you are incapable of casting the lost spells, even from another spellbook or a scroll. After you finish the required number of rests, the spells reappear in the spellbook.",
              "Once you use this reaction, you can't do so again until you finish a long rest.",
            ],
            level: 14,
            tracked: true,
            uses: 1,
            recharge: "lr",
          },
        ],
      },
      transmutation: {
        name: "School of Transmutation",
        source: "Player's Handbook",
        features: [
          {
            id: "transmutation_savant",
            name: "Transmutation Savant",
            desc: "The gold and time you spend to copy transmutation spells into your spellbook are halved.",
            level: 2,
            tracked: false,
          },
          {
            id: "minor_alchemy",
            name: "Minor Alchemy",
            desc: "You can temporarily transform wood, stone, iron, copper, or silver into another one of those materials, affecting up to 1 cubic foot per 10 minutes of work. The change lasts for 1 hour or until you lose concentration.",
            level: 2,
            tracked: false,
          },
          {
            id: "transmuters_stone",
            name: "Transmuter's Stone",
            desc: [
              "After 8 hours of work, create a stone that grants one benefit to its bearer: darkvision, +10 speed while unencumbered, Constitution save proficiency, or resistance to acid, cold, fire, lightning, or thunder.",
              "Casting a transmutation spell of 1st level or higher lets you change the stone's effect while it is on your person.",
            ],
            level: 6,
            tracked: false,
          },
          {
            id: "shapechanger",
            name: "Shapechanger",
            desc: "Polymorph is added to your spellbook if needed, and you can cast it on yourself without a spell slot to become a beast of CR 1 or lower. This refreshes on a short or long rest.",
            level: 10,
            tracked: true,
            uses: 1,
            recharge: "sr_or_lr",
          },
          {
            id: "master_transmuter",
            name: "Master Transmuter",
            desc: "Destroy your transmuter's stone to fuel a major effect: transform a nonmagical object, fully heal and cure a touched creature, cast Raise Dead without a slot, or reduce a willing creature's apparent age.",
            level: 14,
            tracked: false,
          },
        ],
      },
      warMagic: {
        name: "War Magic",
        source: "Xanathar's Guide to Everything",
        features: [
          {
            id: "arcane_deflection",
            name: "Arcane Deflection",
            desc: "When you are hit by an attack or fail a saving throw, you can use your reaction to gain +2 AC against that attack or +4 to the failed save. Until the end of your next turn, you can cast only cantrips.",
            level: 2,
            tracked: false,
          },
          {
            id: "tactical_wit",
            name: "Tactical Wit",
            desc: "Add your Intelligence modifier to initiative rolls.",
            level: 2,
            tracked: false,
          },
          {
            id: "power_surge",
            name: "Power Surge",
            desc: "You store stolen magic as power surges, up to your Intelligence modifier. They refresh to one on a long rest, can be gained from ending spells with Counterspell or Dispel Magic, and can be spent to add extra force damage to your wizard spells.",
            level: 6,
            tracked: false,
          },
          {
            id: "durable_magic",
            name: "Durable Magic",
            desc: "While you maintain concentration on a spell, you gain +2 AC and +2 to all saving throws.",
            level: 10,
            tracked: false,
          },
          {
            id: "deflecting_shroud",
            name: "Deflecting Shroud",
            desc: "When you use Arcane Deflection, you can lash out with magic and deal force damage equal to half your wizard level to up to three creatures of your choice within 60 feet.",
            level: 14,
            tracked: false,
          },
        ],
      },
    },
  },
};

// Backward-compatible alias: older saves / code used "sorceror".
ClassesData.sorceror = ClassesData.sorcerer;

export default ClassesData;



