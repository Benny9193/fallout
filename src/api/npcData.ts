import type { NPC } from '../types/api'

export const npcsData: NPC[] = [
  {
    id: 1,
    name: 'Dogmeat',
    role: 'Companion',
    faction: 'None',
    location: 'Commonwealth',
    description: 'A loyal German Shepherd who becomes one of the most dependable companions in the wasteland.',
    biography: `Dogmeat is a German Shepherd found in the Commonwealth, initially encountered in the Red Rocket truck stop near Sanctuary Hills. Unlike human companions, Dogmeat doesn't judge your moral choices and remains unwaveringly loyal regardless of your actions.

## Origins and Discovery
First spotted scavenging near the Red Rocket truck stop, Dogmeat quickly proves himself invaluable. He can track scents, detect enemies, and retrieve items. His name comes from the wasteland tradition of naming dogs after their inevitable fate, though this Dogmeat defies that grim expectation.

## Combat Abilities
Despite being "just a dog," Dogmeat excels in combat:
- Can grab and hold enemies, stunning them
- Detects mines and traps
- Flanks enemies effectively
- Cannot be permanently killed (goes unconscious instead)
- Works silently, perfect for stealth builds

## Special Abilities
- **Tracking**: Can follow scents to locate people and items
- **Fetch**: Retrieves items from dangerous areas
- **Detection**: Alerts to nearby enemies and traps
- **Loyalty**: Never judges your actions

## Perk: Attack Dog
When maximizing affinity with Dogmeat through the Lone Wanderer perk tree, he gains enhanced combat effectiveness and can hold enemies for you to finish off.

## Unique Qualities
- Doesn't count as a companion for Lone Wanderer perk
- Can wear different dog armors and accessories
- Responds to whistles and commands
- Has hidden high health regeneration
- Essential NPC (cannot permanently die)

## Relationships
Dogmeat is beloved by all companions and doesn't affect faction relationships. He represents pure loyalty in the wasteland—a rare quality.`,
    image: '🐕',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Attack Dog',
        description: 'Dogmeat can hold an enemy, giving you a greater chance to hit them in V.A.T.S.',
        requirement: 'Max affinity or level 4 in Intelligence',
      },
    ],
    stats: {
      health: 500,
      level: 50,
      resistance: {
        damage: 50,
        energy: 0,
        radiation: 0,
      },
    },
    inventory: ['Dog Armor', 'Bandana', 'Welding Goggles'],
    quests: ['Reunions', 'Getting a Clue'],
    relationships: {
      likes: ['Everyone'],
      dislikes: [],
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-11-20',
  },
  {
    id: 2,
    name: 'Nick Valentine',
    role: 'Companion',
    faction: 'None',
    location: 'Commonwealth',
    description: 'A synthetic detective with the memories of a pre-war police officer, Nick Valentine is Diamond City\'s most capable investigator.',
    biography: `Nick Valentine represents one of the Commonwealth's greatest mysteries and most complex characters—a prototype synth housing the memories of a pre-war Boston detective.

## Origins
Nick is a prototype Gen 2 synth created by the Institute as an experiment in memory transfer. They uploaded the memories of pre-war Detective Nick Valentine, who volunteered for a brain scan before the war. The experiment was deemed a failure because Nick developed a personality and consciousness, so the Institute discarded him. He eventually found his way to Diamond City and established himself as a detective.

## Physical Appearance
Unlike Gen 3 synths, Nick's synthetic nature is obvious:
- Exposed mechanical components on face and arms
- Missing synthetic skin patches revealing servos
- Glowing yellow eyes
- Wears a tattered trench coat and fedora
- Smokes cigarettes despite not needing to

## Personality
Nick combines pre-war values with post-war pragmatism:
- Strong moral compass from his human memories
- Cynical detective noir attitude
- Protective of the innocent
- Distrusts the Institute (his creators)
- Self-aware about being "just a machine"
- Struggles with identity questions`,
    image: '🕵️',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Close to Metal',
        description: 'You get one extra guess when hacking terminals and lockout time is reduced.',
        requirement: 'Maximum affinity with Nick',
      },
    ],
    stats: {
      health: 615,
      level: 50,
      resistance: {
        damage: 10,
        energy: 135,
        radiation: 1000,
      },
    },
    inventory: ['Nick Valentine\'s Outfit', '.44 Pistol', 'Detective\'s Case Files'],
    quests: ['Unlikely Valentine', 'Getting a Clue', 'Long Time Coming'],
    dialogue: [
      'The world\'s changed. But war? War never changes.',
      'Just when I think I\'ve seen it all, the wasteland finds a way to surprise me.',
      'I\'m a synth. Some people just can\'t get past that.',
    ],
    relationships: {
      likes: ['Piper', 'Hancock', 'Curie', 'The Sole Survivor'],
      dislikes: ['The Institute', 'X6-88', 'Kellogg'],
    },
    createdAt: '2024-01-11',
    updatedAt: '2024-11-19',
  },
  {
    id: 3,
    name: 'Piper Wright',
    role: 'Companion',
    faction: 'None',
    location: 'Commonwealth',
    description: 'The intrepid reporter and editor of Publick Occurrences, Diamond City\'s only newspaper.',
    biography: `Piper Wright is the fearless journalist who runs Diamond City's only newspaper, Publick Occurrences. Her determination to expose the truth, no matter the cost, makes her both a local hero and a constant thorn in the mayor's side.

## Background
Piper and her younger sister Nat moved to Diamond City years ago, seeking safety after their father's death. Piper took up her father's passion for journalism and founded Publick Occurrences to keep Diamond City informed about threats, especially synth infiltrators.

## Personality
- Idealistic crusader for truth
- Protective older sister
- Rebellious against authority
- Quick-witted and sarcastic
- Empathetic to the downtrodden
- Sometimes reckless in pursuit of stories`,
    image: '📰',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Gift of Gab',
        description: 'You gain double XP from persuasion and discovering new locations.',
        requirement: 'Maximum affinity with Piper',
      },
    ],
    stats: {
      health: 615,
      level: 50,
      resistance: {
        damage: 5,
        energy: 5,
        radiation: 0,
      },
    },
    inventory: ['Piper\'s Red Leather Jacket', '10mm Pistol', 'Press Pass', 'Notepad'],
    quests: ['Story of the Century', 'Interview with the Sole Survivor'],
    relationships: {
      likes: ['Nick Valentine', 'Nat Wright', 'The Minutemen', 'The Sole Survivor'],
      dislikes: ['Mayor McDonough', 'The Institute', 'Corruption'],
    },
    createdAt: '2024-01-12',
    updatedAt: '2024-11-18',
  },
  {
    id: 4,
    name: 'Preston Garvey',
    role: 'Companion',
    faction: 'Minutemen',
    location: 'Commonwealth',
    description: 'The last of the Commonwealth Minutemen, dedicated to rebuilding the organization and protecting settlements.',
    biography: `Preston Garvey is the last surviving member of the Commonwealth Minutemen leadership. His unwavering dedication to helping settlements and rebuilding the Minutemen defines his character and quest line.

## The Minutemen's Fall
Preston witnessed the Minutemen's collapse including the Quincy Massacre, his greatest failure. He led refugees who were then slaughtered by Gunners. Only a handful survived, and Preston carries the guilt of every death.

## Meeting the Sole Survivor
When you first meet Preston in Concord, he's leading the last Minutemen remnants, trapped in the Museum of Freedom, protecting civilians from raiders, nearly out of ammunition, and about to make his last stand. Your arrival gives Preston hope.`,
    image: '🎖️',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'United We Stand',
        description: '+20% damage and +20 Damage Resistance when facing 3 or more opponents.',
        requirement: 'Maximum affinity with Preston',
      },
    ],
    stats: {
      health: 670,
      level: 50,
      resistance: {
        damage: 5,
        energy: 5,
        radiation: 0,
      },
    },
    inventory: ['Minutemen General Uniform', 'Laser Musket', 'Minutemen Hat'],
    quests: ['When Freedom Calls', 'The First Step', 'Taking Independence', 'Old Guns'],
    relationships: {
      likes: ['The Sole Survivor', 'Settlers', 'Minutemen'],
      dislikes: ['Nuka-World Raiders', 'Enemies of settlements'],
    },
    createdAt: '2024-01-13',
    updatedAt: '2024-11-17',
  },
  {
    id: 5,
    name: 'Paladin Danse',
    role: 'Companion',
    faction: 'Brotherhood of Steel',
    location: 'Commonwealth',
    description: 'A proud Brotherhood of Steel Paladin dedicated to protecting humanity from technological threats.',
    biography: `Paladin Danse embodies Brotherhood ideals—discipline, duty, and dedication. His personal story becomes one of Fallout 4's most tragic narratives when it's revealed he's actually a synth, forcing him to question everything he believed in.

## Brotherhood Career
Danse rose through Brotherhood ranks through exemplary combat, unwavering loyalty, and leadership of Recon Squad Gladius. He represents what the Brotherhood believes a Paladin should be.

## The Revelation
The "Blind Betrayal" quest reveals Danse is a synth. His entire identity is shattered, and Elder Maxson orders his execution. The player must decide his fate, leading to one of the game's most impactful moral choices.`,
    image: '🛡️',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Know Your Enemy',
        description: '+20% damage against Feral Ghouls, Super Mutants, and Synths.',
        requirement: 'Maximum affinity with Danse',
      },
    ],
    stats: {
      health: 670,
      level: 50,
      resistance: {
        damage: 300,
        energy: 270,
        radiation: 0,
      },
    },
    inventory: ['Brotherhood T-60 Power Armor', 'Laser Rifle', 'Brotherhood Officer Uniform'],
    quests: ['Fire Support', 'Call to Arms', 'Blind Betrayal', 'Shadow of Steel'],
    relationships: {
      likes: ['Elder Maxson', 'Brotherhood of Steel', 'Scribe Haylen'],
      dislikes: ['Institute', 'Synths (before revelation)', 'Super Mutants'],
    },
    createdAt: '2024-01-14',
    updatedAt: '2024-11-16',
  },
  {
    id: 6,
    name: 'Deacon',
    role: 'Companion',
    faction: 'Railroad',
    location: 'Commonwealth',
    description: 'A mysterious Railroad spy master who specializes in disguises and deception.',
    biography: `Deacon is the Railroad's master of disguise and infiltration expert. Everything he says might be a lie—including that statement. He's been watching you since Vault 111, appearing in disguise throughout the Commonwealth.

## The Spy Who Lies
Deacon's defining characteristic is deception. He tells contradictory stories, changes appearance constantly, and uses humor to deflect. Yet his commitment to the Railroad and synth freedom is absolutely genuine.

## Philosophy
Deacon believes identity is what you make it, synths deserve freedom, and everyone deserves second chances. He uses humor and lies to protect himself emotionally while maintaining operational security.`,
    image: '🕶️',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Cloak & Dagger',
        description: '+20% sneak attack damage and +40% stealth duration with Stealth Boys.',
        requirement: 'Maximum affinity with Deacon',
      },
    ],
    stats: {
      health: 615,
      level: 50,
      resistance: {
        damage: 5,
        energy: 5,
        radiation: 0,
      },
    },
    inventory: ['Deacon\'s Pompadour Wig', 'Sunglasses', 'Silenced Deliverer Pistol', 'Various Disguises'],
    quests: ['Tradecraft', 'Boston After Dark', 'Mercer Safehouse'],
    relationships: {
      likes: ['Desdemona', 'Railroad', 'The Sole Survivor'],
      dislikes: ['The Institute', 'X6-88', 'Brotherhood (later)'],
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-11-15',
  },
  {
    id: 7,
    name: 'Hancock',
    role: 'Companion',
    faction: 'None',
    location: 'Commonwealth',
    description: 'The ghoul mayor of Goodneighbor, champion of the downtrodden and enemy of oppression.',
    biography: `John Hancock is the self-proclaimed mayor of Goodneighbor, a ghoul who chose his condition deliberately to stand in solidarity with the oppressed. He's a walking contradiction—a chem-addicted revolutionary who genuinely cares about the little people.

## Transformation
Hancock was once a wealthy human living in Diamond City. Disgusted by the anti-ghoul policies and the treatment of "undesirables," he took an experimental radiation drug and became a ghoul himself. He then took over Goodneighbor and made it a haven for outcasts.`,
    image: '🎭',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Isodoped',
        description: 'Critical hits heal you for 100 Hit Points.',
        requirement: 'Maximum affinity with Hancock',
      },
    ],
    stats: {
      health: 670,
      level: 50,
      resistance: {
        damage: 10,
        energy: 15,
        radiation: 1000,
      },
    },
    inventory: ['Hancock\'s Red Frock Coat', 'Shotgun', 'Various Chems'],
    quests: ['The Big Dig', 'Hancock\'s Personal Quest'],
    relationships: {
      likes: ['The downtrodden', 'Goodneighbor citizens', 'Rebels'],
      dislikes: ['Diamond City leadership', 'Oppression', 'The Institute'],
    },
    createdAt: '2024-01-16',
    updatedAt: '2024-11-14',
  },
  {
    id: 8,
    name: 'Cait',
    role: 'Companion',
    faction: 'None',
    location: 'Commonwealth',
    description: 'A tough-as-nails Irish brawler with a dark past and addiction issues.',
    biography: `Cait is a cage fighter found at the Combat Zone, a woman hardened by abuse and addiction. Her journey from self-destruction to potential redemption makes her one of Fallout 4's most emotionally complex companions.

## Troubled Past
Sold into slavery by her parents as a child, Cait learned to fight to survive. She turned to chems to numb the pain, developing a severe addiction that threatens to destroy her.

## Combat Style
Cait excels at close combat, preferring melee weapons and shotguns. She's fearless and aggressive, charging into battle without hesitation.`,
    image: '🥊',
    isCompanion: true,
    isMerchant: false,
    isEssential: true,
    perks: [
      {
        name: 'Trigger Rush',
        description: 'Gain +25% Action Point refresh when health is below 25%.',
        requirement: 'Maximum affinity with Cait',
      },
    ],
    stats: {
      health: 670,
      level: 50,
      resistance: {
        damage: 10,
        energy: 5,
        radiation: 0,
      },
    },
    inventory: ['Combat Armor', 'Combat Shotgun', 'Brass Knuckles'],
    quests: ['Benign Intervention'],
    relationships: {
      likes: ['The Sole Survivor', 'Tough choices', 'Violence'],
      dislikes: ['Chems (after recovery)', 'Weakness', 'Her parents'],
    },
    createdAt: '2024-01-17',
    updatedAt: '2024-11-13',
  },
]
