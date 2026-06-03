export const WARLOCK_INVOCATIONS_KNOWN_BY_LEVEL = {
  1: 0,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
  11: 5,
  12: 6,
  13: 6,
  14: 6,
  15: 7,
  16: 7,
  17: 7,
  18: 8,
  19: 8,
  20: 8,
};

export const WARLOCK_MYSTIC_ARCANUM_UNLOCKS = [
  { level: 11, spellLevel: 6 },
  { level: 13, spellLevel: 7 },
  { level: 15, spellLevel: 8 },
  { level: 17, spellLevel: 9 },
];

export const getWarlockInvocationAllowance = (warlockLevel) =>
  WARLOCK_INVOCATIONS_KNOWN_BY_LEVEL[Math.max(1, Math.min(20, Number(warlockLevel) || 1))] || 0;

export const getWarlockUnlockedArcanumLevels = (warlockLevel) =>
  WARLOCK_MYSTIC_ARCANUM_UNLOCKS.filter((entry) => Number(warlockLevel) >= entry.level).map((entry) => entry.spellLevel);

export const getWarlockMysticArcanumExpectedTotal = (warlockLevel) =>
  getWarlockUnlockedArcanumLevels(warlockLevel).length;

export const WARLOCK_PACT_BOONS = [
  {
    id: "blade",
    name: "Pact of the Blade",
    desc: [
      "Create a magical pact weapon in your hand and choose its melee weapon form each time.",
      "You are proficient with it, and it counts as magical for overcoming resistance and immunity.",
      "You can bind a magic weapon to this feature with a 1-hour ritual and dismiss or recall it afterward.",
    ],
  },
  {
    id: "chain",
    name: "Pact of the Chain",
    desc: [
      "Learn Find Familiar as a ritual without it counting against spells known.",
      "Your familiar can take one of the special forms: imp, pseudodragon, quasit, or sprite.",
      "When you take the Attack action, you can give up one attack so your familiar can attack with its reaction.",
    ],
  },
  {
    id: "tome",
    name: "Pact of the Tome",
    desc: [
      "Gain a Book of Shadows and choose three cantrips from any class list.",
      "Those cantrips count as warlock spells for you and do not count against cantrips known.",
      "If the book is lost, you can replace it with a 1-hour ceremony during a short or long rest.",
    ],
  },
  {
    id: "talisman",
    name: "Pact of the Talisman",
    desc: [
      "Receive a talisman that can help its wearer on failed ability checks.",
      "The wearer can add a d4 after failing the check, potentially turning it into a success.",
      "This benefit can be used a number of times equal to your proficiency bonus and refreshes on a long rest.",
    ],
  },
];

export const WARLOCK_ELDRITCH_INVOCATIONS = [
  {
    id: "agonizing_blast",
    name: "Agonizing Blast",
    prerequisite: "Eldritch Blast cantrip",
    desc: ["Add your Charisma modifier to the damage of each Eldritch Blast hit."],
  },
  {
    id: "armor_of_shadows",
    name: "Armor of Shadows",
    prerequisite: "",
    desc: ["Cast Mage Armor on yourself at will without spending a slot or components."],
  },
  {
    id: "ascendant_step",
    name: "Ascendant Step",
    prerequisite: "Warlock 9",
    desc: ["Cast Levitate on yourself at will without spending a slot or components."],
  },
  {
    id: "aspect_of_the_moon",
    name: "Aspect of the Moon",
    prerequisite: "Pact of the Tome",
    desc: ["You no longer need sleep, and you can spend a long rest doing light activity instead."],
  },
  {
    id: "beast_speech",
    name: "Beast Speech",
    prerequisite: "",
    desc: ["Cast Speak with Animals at will."],
  },
  {
    id: "beguiling_influence",
    name: "Beguiling Influence",
    prerequisite: "",
    desc: ["Gain proficiency in Deception and Persuasion."],
  },
  {
    id: "bewitching_whispers",
    name: "Bewitching Whispers",
    prerequisite: "Warlock 7",
    desc: ["Cast Compulsion once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "bond_of_the_talisman",
    name: "Bond of the Talisman",
    prerequisite: "Warlock 12, Pact of the Talisman",
    desc: ["You or your talisman's wearer can use an action to teleport to the other a number of times equal to your proficiency bonus per long rest."],
  },
  {
    id: "book_of_ancient_secrets",
    name: "Book of Ancient Secrets",
    prerequisite: "Pact of the Tome",
    desc: [
      "Add two 1st-level ritual spells from any class to your Book of Shadows.",
      "You can cast those rituals from the book and keep adding more ritual spells you find.",
    ],
  },
  {
    id: "chains_of_carceri",
    name: "Chains of Carceri",
    prerequisite: "Warlock 15, Pact of the Chain",
    desc: ["Cast Hold Monster at will against a celestial, fiend, or elemental, but not again on the same creature until a long rest."],
  },
  {
    id: "cloak_of_flies",
    name: "Cloak of Flies",
    prerequisite: "Warlock 5",
    desc: ["As a bonus action, surround yourself with a fly aura that boosts Intimidation, hampers other Charisma checks, and poisons nearby creatures; refresh on a short or long rest."],
  },
  {
    id: "devils_sight",
    name: "Devil's Sight",
    prerequisite: "",
    desc: ["See normally through magical and nonmagical darkness out to 120 feet."],
  },
  {
    id: "dreadful_word",
    name: "Dreadful Word",
    prerequisite: "Warlock 7",
    desc: ["Cast Confusion once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "eldritch_mind",
    name: "Eldritch Mind",
    prerequisite: "",
    desc: ["Gain advantage on Constitution saves made to maintain concentration."],
  },
  {
    id: "eldritch_sight",
    name: "Eldritch Sight",
    prerequisite: "",
    desc: ["Cast Detect Magic at will without components."],
  },
  {
    id: "eldritch_smite",
    name: "Eldritch Smite",
    prerequisite: "Warlock 5, Pact of the Blade",
    desc: ["Once per turn, spend a warlock slot on a pact-weapon hit to add force damage and knock the target prone if it is Huge or smaller."],
  },
  {
    id: "eldritch_spear",
    name: "Eldritch Spear",
    prerequisite: "Eldritch Blast cantrip",
    desc: ["Increase Eldritch Blast range to 300 feet."],
  },
  {
    id: "eyes_of_the_rune_keeper",
    name: "Eyes of the Rune Keeper",
    prerequisite: "",
    desc: ["Read all writing."],
  },
  {
    id: "far_scribe",
    name: "Far Scribe",
    prerequisite: "Warlock 5, Pact of the Tome",
    desc: ["Use your Book of Shadows to keep names and cast Sending without a slot to those creatures."],
  },
  {
    id: "fiendish_vigor",
    name: "Fiendish Vigor",
    prerequisite: "",
    desc: ["Cast False Life on yourself at will as a 1st-level spell."],
  },
  {
    id: "gaze_of_two_minds",
    name: "Gaze of Two Minds",
    prerequisite: "",
    desc: ["Touch a willing humanoid and perceive through its senses while sustaining the link with your action."],
  },
  {
    id: "ghostly_gaze",
    name: "Ghostly Gaze",
    prerequisite: "Warlock 7",
    desc: ["As an action, see through solid objects for 1 minute; refresh on a short or long rest."],
  },
  {
    id: "gift_of_the_depths",
    name: "Gift of the Depths",
    prerequisite: "Warlock 5",
    desc: ["Breathe underwater, gain a swim speed equal to your walking speed, and cast Water Breathing once per long rest without a slot."],
  },
  {
    id: "gift_of_the_ever_living_ones",
    name: "Gift of the Ever-Living Ones",
    prerequisite: "Pact of the Chain",
    desc: ["While your familiar is within 100 feet, any dice rolled to heal you count as their maximum value."],
  },
  {
    id: "gift_of_the_protectors",
    name: "Gift of the Protectors",
    prerequisite: "Warlock 9, Pact of the Tome",
    desc: ["Names written in your Book of Shadows can drop to 1 hit point instead of 0 once per long rest."],
  },
  {
    id: "grasp_of_hadar",
    name: "Grasp of Hadar",
    prerequisite: "Eldritch Blast cantrip",
    desc: ["Once on each of your turns, move an Eldritch Blast target 10 feet closer to you."],
  },
  {
    id: "improved_pact_weapon",
    name: "Improved Pact Weapon",
    prerequisite: "Pact of the Blade",
    desc: ["Your pact weapon becomes a spellcasting focus, gains +1 to attack and damage, and can be conjured as certain ranged weapons."],
  },
  {
    id: "investment_of_the_chain_master",
    name: "Investment of the Chain Master",
    prerequisite: "Pact of the Chain",
    desc: ["Enhance your familiar with new movement options, bonus-action attacks, magical attacks, and a save DC based on your spell save DC."],
  },
  {
    id: "lance_of_lethargy",
    name: "Lance of Lethargy",
    prerequisite: "Eldritch Blast cantrip",
    desc: ["Once on each of your turns, reduce an Eldritch Blast target's speed by 10 feet until your next turn."],
  },
  {
    id: "lifedrinker",
    name: "Lifedrinker",
    prerequisite: "Warlock 12, Pact of the Blade",
    desc: ["Your pact-weapon hits deal extra necrotic damage equal to your Charisma modifier, minimum 1."],
  },
  {
    id: "maddening_hex",
    name: "Maddening Hex",
    prerequisite: "Warlock 5",
    desc: ["As a bonus action, deal psychic damage equal to your Charisma modifier to a cursed target and nearby chosen creatures."],
  },
  {
    id: "mask_of_many_faces",
    name: "Mask of Many Faces",
    prerequisite: "",
    desc: ["Cast Disguise Self at will."],
  },
  {
    id: "master_of_myriad_forms",
    name: "Master of Myriad Forms",
    prerequisite: "Warlock 15",
    desc: ["Cast Alter Self at will."],
  },
  {
    id: "minions_of_chaos",
    name: "Minions of Chaos",
    prerequisite: "Warlock 9",
    desc: ["Cast Conjure Elemental once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "mire_the_mind",
    name: "Mire the Mind",
    prerequisite: "Warlock 5",
    desc: ["Cast Slow once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "misty_visions",
    name: "Misty Visions",
    prerequisite: "",
    desc: ["Cast Silent Image at will without material components."],
  },
  {
    id: "one_with_shadows",
    name: "One with Shadows",
    prerequisite: "Warlock 5",
    desc: ["While in dim light or darkness, use your action to become invisible until you move or take an action or reaction."],
  },
  {
    id: "otherworldly_leap",
    name: "Otherworldly Leap",
    prerequisite: "Warlock 9",
    desc: ["Cast Jump at will."],
  },
  {
    id: "protection_of_the_talisman",
    name: "Protection of the Talisman",
    prerequisite: "Warlock 7, Pact of the Talisman",
    desc: ["Your talisman's wearer can add a d4 to a failed saving throw a number of times equal to your proficiency bonus per long rest."],
  },
  {
    id: "rebuke_of_the_talisman",
    name: "Rebuke of the Talisman",
    prerequisite: "Pact of the Talisman",
    desc: ["When your talisman's wearer is hit, use your reaction to deal psychic damage equal to your proficiency bonus and push the attacker away."],
  },
  {
    id: "relentless_hex",
    name: "Relentless Hex",
    prerequisite: "Warlock 7, Hex spell or a warlock curse feature",
    desc: ["As a bonus action, teleport next to a creature cursed by your Hex spell or a warlock curse feature."],
  },
  {
    id: "repelling_blast",
    name: "Repelling Blast",
    prerequisite: "Eldritch Blast cantrip",
    desc: ["Push an Eldritch Blast target up to 10 feet away from you in a straight line."],
  },
  {
    id: "sculptor_of_flesh",
    name: "Sculptor of Flesh",
    prerequisite: "Warlock 7",
    desc: ["Cast Polymorph once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "shroud_of_shadow",
    name: "Shroud of Shadow",
    prerequisite: "Warlock 15",
    desc: ["Cast Invisibility at will without spending a spell slot."],
  },
  {
    id: "sign_of_ill_omen",
    name: "Sign of Ill Omen",
    prerequisite: "Warlock 5",
    desc: ["Cast Bestow Curse once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "thief_of_five_fates",
    name: "Thief of Five Fates",
    prerequisite: "",
    desc: ["Cast Bane once with a warlock spell slot, then refresh on a long rest."],
  },
  {
    id: "thirsting_blade",
    name: "Thirsting Blade",
    prerequisite: "Warlock 5, Pact of the Blade",
    desc: ["Attack twice with your pact weapon whenever you take the Attack action."],
  },
  {
    id: "tomb_of_levistus",
    name: "Tomb of Levistus",
    prerequisite: "Warlock 5",
    desc: ["When you take damage, use your reaction to entomb yourself in protective ice until the end of your next turn; refresh on a short or long rest."],
  },
  {
    id: "tricksters_escape",
    name: "Trickster's Escape",
    prerequisite: "Warlock 7",
    desc: ["Cast Freedom of Movement on yourself once without a slot, then refresh on a long rest."],
  },
  {
    id: "undying_servitude",
    name: "Undying Servitude",
    prerequisite: "Warlock 5",
    desc: ["Cast Animate Dead once without a spell slot, then refresh on a long rest."],
  },
  {
    id: "visions_of_distant_realms",
    name: "Visions of Distant Realms",
    prerequisite: "Warlock 15",
    desc: ["Cast Arcane Eye at will."],
  },
  {
    id: "voice_of_the_chain_master",
    name: "Voice of the Chain Master",
    prerequisite: "Pact of the Chain",
    desc: ["Speak through your familiar and perceive through its senses anywhere on the same plane."],
  },
  {
    id: "whispers_of_the_grave",
    name: "Whispers of the Grave",
    prerequisite: "Warlock 9",
    desc: ["Cast Speak with Dead at will."],
  },
  {
    id: "witch_sight",
    name: "Witch Sight",
    prerequisite: "Warlock 15",
    desc: ["See the true form of shapechangers and creatures hidden by illusion or transmutation within 30 feet."],
  },
];
