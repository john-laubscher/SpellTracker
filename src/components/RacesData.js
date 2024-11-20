export const Races = ["Dragonborn", "Dwarf", "Elf", "Gnome", "HalfElf", "HalfOrc", "Halfling", "Human", "Tiefling"];

// dot notation uses identifiers, but bracket notation doesn't--need bracket notation for key strings
// UA subclasses not included yet as of 6/20/23
export const Subraces = {
    Dragonborn: ['Chromatic', 'Draconblood', 'Ravenite', 'Metallic', 'Gem'],
    Dwarf: ['Hill', 'Mountain', 'Mark of Warding', 'Plane Shift: Kaladesh'],
    Elf: ['Dark Elf', 'High Elf', 'Wood Elf', 'Pallid Elf', 'Mark of Shadow', 'Astral Self', 'Bishtahar/Tirahar', 'Vahadar'],
    // Zendikar elves not included
    Gnome: ['Forest', 'Rock', 'Mark of Scribing'],
    'Half Elf': ['Mark of Detection', 'Mark of Storm', ],
    'Half Orc': ['No Subrace', 'Mark of Finding'],
    Halfling: ['Lightfoot', 'Stout', 'Ghostwise', 'Lotusden', 'Mark of Hospitality', 'Mark of Healing'],
    Human: ['No Subrace', 'Variant', 'Mark of Finding', 'Mark of Handling', 'Mark of Making', 'Mark of Passage', 'Mark of Sentinel', ],
    // Plane Shift Humans not included (but don't have spells)
    Tiefling: ['Bloodline of Asmodeus', 'Bloodline of Baalzebul', 'Bloodline of Dispater', 'Bloodline of Fierna', 'Bloodline of Glasya', 'Bloodline of Levistus', 'Bloodline of Mammon', 'Bloodline of Mephistopheles', 'Bloodline of Zariel', 'Variant Tiefling']
  }

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
              'fourth': ['greater-invisibility', 'hallucinatory terrain'],
              'fifth': ['mislead']
                // ADD TO SPELL LIST
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
