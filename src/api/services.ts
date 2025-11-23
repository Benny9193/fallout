import api from './axios'
import type { User, Post, Activity, Metric, PostsPage, CompendiumArticle, CompendiumCategory, Quest, NPC } from '../types/api'
import { PAGINATION } from '../constants/app'

// Re-export types for backward compatibility
export type { User, Post, Activity, Metric, PostsPage, CompendiumArticle, CompendiumCategory, Quest, NPC }

// API Services
export const userService = {
  // Get user profile
  getProfile: async (userId: number = 1): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`)
    return response.data
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  // Update user
  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data)
    return response.data
  },
}

export const postService = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  },

  // Get paginated posts for infinite scroll
  getPostsPage: async (page: number = 1, limit: number = PAGINATION.DEFAULT_PAGE_SIZE): Promise<PostsPage> => {
    // JSONPlaceholder has 100 posts total
    const start = (page - 1) * limit
    const response = await api.get<Post[]>('/posts', {
      params: {
        _start: start,
        _limit: limit,
      },
    })

    const posts = response.data
    const hasMore = posts.length === limit
    const nextPage = hasMore ? page + 1 : undefined

    return {
      posts,
      nextPage,
      hasMore,
    }
  },

  // Get posts by user
  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/posts?userId=${userId}`)
    return response.data
  },

  // Get single post
  getPost: async (postId: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${postId}`)
    return response.data
  },
}

export const dashboardService = {
  // Get dashboard metrics
  getMetrics: async (): Promise<Metric[]> => {
    // Since we're using JSONPlaceholder, we'll fetch users and posts and create metrics
    const [users, posts] = await Promise.all([
      userService.getUsers(),
      postService.getPosts(),
    ])

    return [
      { label: 'Total Users', value: users.length, change: '+12%', positive: true },
      { label: 'Total Posts', value: posts.length, change: '+8%', positive: true },
      { label: 'Active Sessions', value: '89', change: '+5%', positive: true },
      { label: 'Errors', value: '0', change: '-100%', positive: true },
    ]
  },

  // Get recent activity
  getActivity: async (): Promise<Activity[]> => {
    // Mock activity data (in a real app, this would come from an API)
    return [
      { id: 1, text: 'New user registered', time: '2 minutes ago' },
      { id: 2, text: 'Post created', time: '15 minutes ago' },
      { id: 3, text: 'Profile updated', time: '1 hour ago' },
      { id: 4, text: 'Settings changed', time: '2 hours ago' },
    ]
  },
}

export const compendiumService = {
  // Get all articles
  getArticles: async (): Promise<CompendiumArticle[]> => {
    // Fallout universe compendium articles
    return [
      {
        id: 1,
        title: 'Brotherhood of Steel: Techno-Religious Order',
        category: 'Factions',
        description: 'Comprehensive guide to the Brotherhood of Steel, their ideology, chapters, and impact across the wasteland.',
        content: `The Brotherhood of Steel stands as one of the most influential post-war factions, dedicated to preserving pre-war technology and preventing another nuclear catastrophe.

## Origins and Founding

Founded by Captain Roger Maxson in 2077 at Mariposa Military Base, the Brotherhood emerged from the ashes of the U.S. Army. After discovering horrific FEV experiments, Maxson led a mutiny and established a new order dedicated to preventing the misuse of dangerous technology. The name "Brotherhood of Steel" came from their oath to defend humanity, sworn while clad in stolen Power Armor.

## Core Philosophy and Beliefs

The Brotherhood follows the Codex, a quasi-religious text that outlines their mission: to collect, preserve, and control advanced technology. They believe humanity nearly destroyed itself through technological hubris and that only they possess the wisdom to safeguard dangerous knowledge. This techno-zealotry makes them both protectors and hoarders, often refusing to share technology with "outsiders."

## Major Chapters and Leadership

- **West Coast Brotherhood**: The original chapter based in Lost Hills bunker, led by the High Elder. Most conservative and isolationist faction.
- **East Coast Brotherhood**: Led by Elder Arthur Maxson in the Capital Wasteland and Commonwealth. More interventionist, willing to recruit outsiders and actively combat threats like super mutants and the Institute.
- **Midwest Brotherhood**: Featured in Fallout Tactics, more liberal in recruitment, accepting ghouls and even some super mutants.
- **Texas Brotherhood**: Small chapter mentioned in Fallout: Brotherhood of Steel.

## Rank Structure and Initiation

The Brotherhood maintains a strict military hierarchy: Initiates train for years before becoming Knights (soldiers), Scribes (scholars), or Paladins (elite warriors). Elder Maxson reformed this system, combining Knight and Paladin ranks. Promotion requires demonstrated loyalty, combat prowess, and technical expertise.

## Technology and Arsenal

Brotherhood forces wield devastating firepower: T-51, T-60, and X-01 Power Armor; Laser and Plasma weapons; Vertibirds for aerial dominance; Liberty Prime, a pre-war super weapon. Their technological superiority makes them formidable but also dangerously overconfident.

## Relations with Other Factions

The Brotherhood's xenophobic tendencies create enemies. They war with the Enclave over technology, view synths and super mutants as abominations requiring extermination, and clash with the NCR over resources. Railroad and Institute operations directly oppose Brotherhood doctrine. Some chapters, like Lyons' Brotherhood, prioritize humanitarian aid over doctrine, causing internal schisms.

## Key Locations

- **The Citadel**: East Coast headquarters in the Pentagon ruins
- **The Prydwen**: Massive airship serving as mobile command center
- **Lost Hills**: Original bunker in California
- **Hidden Valley**: Mojave chapter bunker

## Notable Members

Elder Arthur Maxson united the East Coast Brotherhood, combining Owen Lyons' militarism with Sarah Lyons' tactical brilliance. Paladin Danse, Sentinel Lyons, Head Scribe Rothchild, and Proctor Ingram represent the best of Brotherhood ideals. Veronica Santangelo questions outdated doctrines, representing internal reform movements.

## Strategic Importance

Control over the Brotherhood determines wasteland power dynamics. Their technological edge can turn any conflict, but rigid ideology limits adaptability. Players must decide: support their security through strength, or oppose their technological fascism?`,
        createdAt: '2024-01-15',
        updatedAt: '2024-11-20',
        readTime: 8,
        views: 1547,
      },
      {
        id: 2,
        title: 'Vault-Tec Vaults: Underground Experiments',
        category: 'Locations',
        description: 'Complete guide to Vault-Tec\'s underground shelters and the twisted social experiments conducted within.',
        content: `Vault-Tec's network of underground Vaults represents humanity's attempt at survival—and science's darkest experiments on unwitting subjects.

## The Vault Program History

Officially marketed as nuclear shelters for America's elite, Vault-Tec's true purpose was far more sinister. Under government contract, most Vaults served as social experiments to gather data for space colonization. Only a handful of "control" Vaults actually provided proper shelter. The rest subjected dwellers to psychological torture, genetic manipulation, and lethal conditions.

## Vault Design and Technology

Standard Vaults follow consistent architecture: massive blast doors (Vault-Tec signature gear logo), overseer quarters, atrium levels, living quarters, hydroponics, power generators, and water processing. The Vault suits (blue and yellow jumpsuits) include the dweller's Vault number. PipBoys serve as universal interfaces for Vault systems and personal data management.

## Notable Vaults and Their Experiments

## Vault 101 (Capital Wasteland)
Experiment: Never open. Test indefinite isolation effects on multiple generations. Overseer maintains absolute authority. The Lone Wanderer's escape destabilized this closed society.

## Vault 111 (Commonwealth)
Experiment: Cryogenic suspension. Only the Sole Survivor and their son Shaun (later Father) survived when life support failed. Became the Institute's primary subject retrieval site.

## Vault 13 (California)
Experiment: Extended isolation (200 years). Water chip failure forced the Vault Dweller into the wasteland, inadvertently creating the New California Republic's foundation.

## Vault 112 (Capital Wasteland)
Experiment: Virtual reality simulation. Dr. Braun trapped dwellers in "Tranquility Lane," torturing them for 200 years as their bodies withered in simulation pods.

## Vault 22 (Mojave)
Experiment: Botanical research. Mutated spore plants infected dwellers, transforming them into hostile spore carriers. Now overrun with deadly vegetation.

## Vault 87 (Capital Wasteland)
Experiment: FEV exposure. Military experiments created super mutants. Completely irradiated entrance; only accessible through Little Lamplight's Murder Pass.

## Vault 81 (Commonwealth)
Experiment: Disease research. Secret Vault 81 section tested experimental pathogens. Overseer rejected experiments; Vault functions as a genuine community.

## Vault 95 (Commonwealth)
Experiment: Addiction rehabilitation. After five years of successful recovery, Vault-Tec planted drugs to trigger mass relapse and observe psychological breakdown.

## Control Vaults

A few Vaults received no experimental variables: Vault 3, Vault 8 (Vault City), and Vault 76. These served as baselines for comparing experimental results. Ironically, most control Vaults succeeded while experimental Vaults collapsed.

## The Overseer Role

Overseers received special instructions via secret terminals. Many remained ignorant of true experiment nature. Some, discovering the truth, tried to protect dwellers. Others embraced their role as experiment administrators, becoming tyrants.

## Vault Technology Legacy

Vault-Tec's innovations—water purification, hydroponics, fusion power—revolutionized wasteland survival. Communities built on Vault ruins (Vault City, Megaton's bomb came from a Vault-Tec delivery) demonstrate their lasting impact. PipBoys remain the gold standard for personal computing.

## Finding Vaults

Vaults typically sit near pre-war population centers. Look for: large metal doors in cliff faces or bunkers, Vault-Tec promotional signs, abandoned Vault-Tec offices with maps, or radio beacons broadcasting emergency messages.

## Vault Survival Tips

Exploring Vaults requires preparation. Bring: radiation protection (many have reactor leaks), weapons (raiders, creatures, or defense systems), lockpicks (maintenance areas hide valuable tech), and healing items (medical experiments gone wrong create biohazards).`,
        createdAt: '2024-01-20',
        updatedAt: '2024-11-15',
        readTime: 9,
        views: 2134,
      },
      {
        id: 3,
        title: 'Power Armor: Mechanized Superiority',
        category: 'Weapons & Armor',
        description: 'Master guide to Power Armor models, modifications, fusion cores, and combat strategies.',
        content: `Power Armor represents the pinnacle of pre-war military technology—a fusion-powered exoskeleton that transforms any soldier into a one-person army.

## Power Armor History

Developed in 2067 to combat Chinese mechanized infantry during the Sino-American War, Power Armor revolutionized warfare. The T-45d series first deployed in 2067, followed by improved T-51b models. Post-war, the Enclave developed advanced X-01 series, while the Brotherhood created T-60 variants.

## Power Armor Models and Specifications

## T-45 Power Armor
The earliest production model, rushed into service during the Anchorage Reclamation. Less protective than later models but more common. Damage Resistance: 400-500. Energy Resistance: 400-500. Requires basic Power Armor training.

## T-51 Power Armor
The peak of pre-war engineering, these dominated the Anchorage Front Line. Superior protection and mobility. Damage Resistance: 500-600. Energy Resistance: 500-600. The Vim! Paint Job variant in Far Harbor provides unique bonuses.

## T-60 Power Armor
Brotherhood of Steel's post-war improvement on T-45 designs. Standard issue for East Coast Brotherhood. Damage Resistance: 600-700. Energy Resistance: 600-700. Elder Maxson's custom suit features unique paint.

## X-01 Power Armor
Enclave's advanced post-war development. Experimental pre-war prototype became the template for Enclave's signature armor. Damage Resistance: 800-900. Energy Resistance: 800-900. Rarest and most protective standard armor.

## Raider Power Armor
Scavenged frames with improvised plating. Minimal protection but reflects wasteland ingenuity. Various aesthetic modifications show different raider gang affiliations.

## Ultracite Power Armor
Brotherhood's latest development using ultracite ore from Appalachia. Enhanced energy resistance. Quest reward for completing "Belly of the Beast."

## Excavator Power Armor
Mining-focused design from Garrahan Mining. Increased carry capacity but reduced protection. Essential for collecting ore in Appalachia.

## Fusion Cores: Power Source

Power Armor runs on fusion cores, each providing limited operational time. Core drainage increases with: sprinting, using VATS, jetpack modifications, and heavy weapon fire. Find cores in: military installations, generator rooms, Ammo Peddlers, or by killing Sentry Bots.

## Power Armor Modifications

## Torso Mods
- Jetpack: Flight capability, high AP drain
- Kinetic Dynamo: Action Point regeneration
- Medic Pump: Automatic healing
- Stealth Boy: Cloaking field
- Motion-Assist Servos: Increased Strength

## Arm Mods
- Hydraulic Bracers: Improved unarmed damage
- Optimized Bracers: Reduced AP costs
- Recon Sensors: Enhanced VATS accuracy

## Leg Mods
- Calibrated Shocks: Increased carry weight
- Explosive Vent: Area damage on landing
- Optimized Servos: Reduced AP drain while moving

## Helmet Mods
- Targeting HUD: Highlight living targets
- VATS Matrix Overlay: Improved VATS accuracy
- Internal Database: Increased Intelligence

## Paint Jobs and Effects

Paint jobs provide both aesthetic customization and stat bonuses. Brotherhood of Steel paints increase different resistances. Hot Rod paints improve Agility. Military paints enhance various combat stats.

## Entering and Exiting

Enter Power Armor by approaching from behind and activating. Exit by holding the activation button. Keep a fusion core in inventory before entering. The frame remains yours once claimed, but individual armor pieces can fall off when damaged.

## Repairing Power Armor

Damaged pieces reduce protection. Repair at Power Armor stations using: steel, aluminum, circuitry, nuclear material, and plastic. Armorer perk reduces material costs and unlocks advanced modifications.

## Strategic Combat Use

Power Armor excels in: direct assaults on fortified positions, fighting large creatures (Deathclaws, Behemoths), extended firefights, and radiation zones. Less effective for: stealth operations, long-distance travel (core limitations), and underwater exploration (you sink).

## Storage and Collection

Store Power Armor frames at settlements. Build Power Armor stations for repairs and modifications. Many collectors maintain complete sets of each model with various paint jobs. Notable frames can be found at: military checkpoints, crashed Vertibirds, National Guard training yards, and secret bunkers.

## Power Armor Training

In earlier Fallout games, Power Armor required training. Fallout 4 removed this requirement, allowing anyone to use Power Armor (though effectively requires perks). Lore-wise, Brotherhood Squires train extensively before full qualification.`,
        createdAt: '2024-02-01',
        updatedAt: '2024-11-10',
        readTime: 10,
        views: 2856,
      },
      {
        id: 4,
        title: 'The Great War: Nuclear Apocalypse',
        category: 'Lore & History',
        description: 'Deep dive into the pre-war world, the Resource Wars, and the two-hour nuclear exchange that ended civilization.',
        content: `October 23, 2077, 9:47 AM EST: Air raid sirens wailed across America as Chinese nuclear missiles began their descent. Two hours later, human civilization ceased to exist.

## Pre-War America: A Nation in Decline

The 2070s America bore little resemblance to our reality. Hyper-capitalism, corporate dominance, and nationalist fervor defined culture. The Sino-American War, fought over the last petroleum reserves, militarized society. Corporations wielded government-level power: Vault-Tec, RobCo Industries, West-Tek, and General Atomics International controlled technology, defense, and infrastructure.

## The Resource Wars (2052-2077)

Global petroleum depletion triggered worldwide conflict. Europe and Middle East nations dissolved into warring states. The United Nations collapsed in 2052. America and China became the dominant superpowers, locked in an increasingly desperate struggle for resources.

## Key Pre-War Events

## 2051
European Union dissolves as member nations battle over remaining oil fields.

## 2052
United Nations officially dissolved. Resource Wars begin.

## 2053
New Plague ravages the United States. Government response heavy-handed and ineffective.

## 2059
Anchorage Front Line established. Chinese forces invade Alaska.

## 2066
Chinese forces invade Alaska for oil reserves.

## 2067
First T-45d Power Armor deployed at Anchorage. Food riots ravage major cities.

## 2069
Nationwide rationing begins. Protests escalate into violence.

## 2072
West-Tek develops FEV (Forced Evolutionary Virus) for military super-soldiers.

## 2074
Martial law declared in major cities. Military deployed domestically.

## 2076
Vault-Tec begins construction of underground Vaults. Public panic increases.

## October 23, 2077
Nuclear war begins at 9:47 AM.

## The Two-Hour War

No one knows who fired first—intelligence suggests Chinese submarines launched initial strikes, but conspiracy theories persist. Enclave's shadow government evacuated to oil rig. Vault-Tec sealed Vault doors. Most Americans had minutes of warning. Some reached Vaults or underground shelters. Most died instantly in nuclear fire or slowly from radiation poisoning.

Strategic targets included: Washington D.C. (direct hits), Las Vegas (Mr. House's defenses saved the Strip), Boston (Glowing Sea created by direct impact), Los Angeles (Boneyard created), New York (the crater), Philadelphia, Chicago, and all major military installations.

## Immediate Aftermath

The bombs killed millions instantly. Billions more died from radiation, starvation, disease, and violence in following weeks. The sky darkened with ash and radioactive particles. "Nuclear winter" caused temperature drops and crop failures. Civilization's survivors faced: collapsed infrastructure, contaminated water, irradiated food sources, and the breakdown of all social order.

## Mutations and Monsters

Radiation and FEV created the wasteland's nightmares. Humans became Ghouls (some maintaining sanity, others going feral). FEV exposure created Super Mutants. Animals mutated into deadly creatures: Radscorpions, Deathclaws (FEV-enhanced chameleons), Yao Guai (mutant bears), Mirelurks, Bloatflies, and Radroaches.

## The Enclave and Government Continuity

The shadow government—calling itself the Enclave—survived on an oil rig off California. They viewed themselves as the only "true" Americans, considering all radiation-exposed humans as mutants to be exterminated. Their genocidal plans ultimately failed when opposed by various wasteland factions.

## Regional Variations in Destruction

Different regions suffered varying devastation. The Mojave survived relatively intact thanks to Mr. House. West Virginia experienced less direct hits but faced worse plague and later Scorchbeast infestations. The Glowing Sea represents ground zero of a direct nuclear impact—still lethally radioactive 200 years later.

## The New World Order

From the ashes rose new societies: tribals, raiders, scavengers, merchants, and eventually organized factions like the NCR, Brotherhood of Steel, and Legion. Pre-war technology became valuable salvage. Knowledge was lost; survivors focused on immediate survival rather than preserving civilization's achievements.

## Cultural Impact

Pre-war culture influences wasteland society. Old World Blues—nostalgia for pre-war America—drives many factions. Music (from 1940s-1950s, the "retro-future" aesthetic) survives on holotapes. Nuka-Cola remains the drink of choice. Pre-war money serves as currency despite being worthless paper.

## Lessons Unlearned

Despite the apocalypse, factions repeat pre-war mistakes: the Enclave's fascism, the Institute's human experimentation, and the Brotherhood's technological hoarding. The wasteland demonstrates humanity's resilience but also its inability to escape destructive patterns.

## The Great War's Legacy

Two hundred years later, the Great War remains civilization's defining event. Survivors measure time as "before" and "after." The weapons that destroyed the world still threaten it—unexploded bombs, active nuclear silos, and the knowledge to repeat humanity's greatest mistake.`,
        createdAt: '2024-02-10',
        updatedAt: '2024-11-05',
        readTime: 11,
        views: 1823,
      },
      {
        id: 5,
        title: 'Wasteland Survival Guide: Essential Skills',
        category: 'Survival Guide',
        description: 'Comprehensive survival manual covering combat, radiation, crafting, settlements, and resource management.',
        content: `Surviving the wasteland requires more than just luck and a gun. This guide covers essential skills every wastelander must master.

## Radiation Management

Radiation remains the wasteland's silent killer. Understand radiation mechanics: RADs accumulate in your body, reducing maximum health. At 1000 RADs, you die. Manage radiation through:

- **RadAway**: Removes accumulated radiation. Found in first aid kits, hospitals, and bought from doctors.
- **Rad-X**: Temporarily increases radiation resistance. Take before entering hot zones.
- **Power Armor**: Provides excellent radiation protection with appropriate modifications.
- **Hazmat Suit**: Maximum radiation protection but no ballistic defense.
- **Lead Belly Perk**: Reduces radiation from food and water.

High radiation zones include: the Glowing Sea, nuclear waste sites, heavily bombed urban centers, and areas near unshielded reactors. Watch your Geiger counter readings and retreat before accumulating dangerous levels.

## Combat Strategies

## Against Human Enemies
Raiders, Gunners, and hostile settlers use cover and tactics. Counter with: flanking maneuvers, grenades to flush them out, and targeting weapons to disarm. High-level enemies wear power armor—target fusion cores to force them out.

## Against Creatures
- **Deathclaws**: Extreme danger. Cripple legs to reduce mobility. Use high-powered weapons. Keep distance.
- **Super Mutants**: Tough and aggressive. Headshots critical. Watch for suiciders carrying mini-nukes.
- **Mirelurks**: Target soft underbelly. Armored shell resists frontal attacks.
- **Radscorpions**: Burrow underground. Watch for dust clouds indicating emergence point.
- **Feral Ghouls**: Fast and numerous. Watch for glowing ones—they heal nearby ferals with radiation.
- **Robots**: Pulse weapons and explosives highly effective. Target combat inhibitors and thrusters.

## VATS System
Vault-Tec Assisted Targeting System slows time, letting you target specific body parts. Critical hits charge over time. Use VATS for: precision shots, targeting weak points, and assessing enemy numbers.

## Crafting and Modifications

## Weapon Modding
Improve weapons at workbenches. Modifications affect: damage, accuracy, range, magazine size, and special effects. Scrapper perk provides more components when breaking down weapons and armor.

## Armor Crafting
Layer armor over clothing for maximum protection. Ballistic weave (unlocked through Railroad) adds defense to clothing items. Mix armor types for balanced resistances.

## Chemistry Station
Create healing items, buffs, and explosives. Key recipes: Stimpaks (healing), Psycho (damage boost), Jet (slow time), and various grenades.

## Cooking Station
Cook food to remove radiation and add benefits. Grilled Radroach removes RADs, cooked meats provide better healing than raw.

## Settlement Building

Establish safe havens throughout the wasteland. Key components:

## Defense
Build turrets, guard posts, and walls. Defense rating should exceed food + water to prevent raids. Strategic placement covers all approaches.

## Resources
- **Food**: Plant crops (Mutfruit, Tatos, Corn). Assign settlers to farming.
- **Water**: Build pumps or purifiers. Purified water generates excess for sale.
- **Power**: Generators provide electricity. Connect with wire pylons.
- **Beds**: One per settler prevents happiness penalties.

## Happiness
Settlers need purpose. Assign jobs, build shops, add decorations, and create defenses. Happiness above 80 generates merchant caravans.

## Supply Lines
Connect settlements via provisioner routes. Share workshop inventory and building materials. Requires Local Leader perk.

## Resource Management

## Carrying Capacity
Strength determines how much you carry. Manage weight by: dropping unnecessary items, using companions as pack mules, storing items at settlements, and investing in Strong Back perk.

## Valuable Scrap
Prioritize collecting: adhesive (duct tape, wonderglue), screws (typewriters, desk fans), aluminum (cans, trays), copper (light bulbs, hot plates), and nuclear material (alarm clocks, board games).

## Bottle Caps Economy
Caps serve as standard currency. Earn caps through: selling excess purified water, completing quests, looting enemies, and finding hidden stashes. Water farming is most reliable income source.

## Gear Repair
In most Fallout games, weapons and armor degrade. Carry repair kits or duplicate weapons for field repairs. Jury Rigging perk allows repairing with similar item types.

## Companion Management

Companions provide combat support, carry capacity, and unique perks. Build relationship through conversation choices and actions. Maximum affinity unlocks special perks. Each companion excels in different roles:

- **Dogmeat**: Doesn't judge your actions, finds items, can't be killed
- **Piper**: Bonus XP from discovering locations and persuasion checks
- **Nick Valentine**: Excellent against Institute synths, hacking bonuses
- **Strong**: Melee powerhouse, carries heavy loads
- **Curie**: Healing support, radiation resistance bonuses
- **Paladin Danse**: Heavy weapons specialist, bonus damage to synths and Ferals

## Faction Relations

Balancing faction relationships determines quest availability and endings. Actions for one faction may antagonize others. Major decision points lock you into faction storylines. Save before major faction quests to preserve options.

## Skill Development

Invest perks strategically. Essential early perks: Gun Nut (weapon mods), Armorer (armor mods), Locksmith (access locked areas), Hacker (terminal access), and Scrapper (component gathering).

## Survival Tips

- Save frequently. The wasteland is unforgiving.
- Explore thoroughly. Valuable loot hides in unexpected places.
- Read terminals. Lore often hints at hidden treasures or safer routes.
- Stock Stimpaks. Healing items mean the difference between life and death.
- Choose battles wisely. Sometimes running is the best strategy.
- Join factions for resources and equipment access.
- Complete side quests. Rewards often exceed main story quest rewards.`,
        createdAt: '2024-03-01',
        updatedAt: '2024-11-18',
        readTime: 12,
        views: 3421,
      },
      {
        id: 6,
        title: 'New Vegas: The Jewel of the Mojave',
        category: 'Locations',
        description: 'Complete guide to New Vegas, the Strip, surrounding areas, and the Second Battle of Hoover Dam.',
        content: `New Vegas stands as the wasteland's greatest success story—a functioning pre-war city with electricity, running water, and a thriving economy built on gambling and vice.

## Mr. House's Vegas

Robert House, pre-war genius and RobCo Industries founder, predicted the Great War. He transformed himself into an immortal technocrat, his mind preserved in a life-support pod. His platinum chip defense system intercepted most missiles targeting Vegas. While the surrounding Mojave burned, Vegas survived.

For 200 years, House plotted his return. In 2274, he awakened his Securitron army, expelled tribals from the Strip, and established three casino tribes: the Omertas (Gomorrah), White Glove Society (Ultra-Luxe), and Chairmen (Tops). He rules Vegas from the Lucky 38 Casino, unseen but omnipresent through video screens and Securitrons.

## The Strip Layout

The Strip divides into three sections, separated by guarded gates requiring passport verification or 2000 caps credit check.

## Gomorrah Casino
Omerta family territory. Den of prostitution, drugs, and violence. Dangerous even by Strip standards. Cachino's conspiracy against family leadership offers quest opportunities.

## The Tops Casino
Benny's headquarters. Art Deco elegance hiding dangerous ambition. Site of the Courier's attempted murder and quest for revenge. The Presidential Suite contains high-value loot.

## Ultra-Luxe Casino
White Glove Society operates this sophisticated establishment. Former cannibals maintain elaborate facade of civilization. The gourmets' fine dining has dark secrets. Formal wear required for full access.

## Lucky 38 Casino
Mr. House's sealed fortress. No public access. Penthouse contains House's control center and his preserved body. The Courier gains access only through main quest progression.

## Vault 21 Hotel
Sarah Weintraub operates this converted Vault as a hotel. Most levels filled with concrete per House's orders. Pre-war Vault sections accessible. Represents House's control over Vegas history.

## Freeside

The slums outside the Strip proper. House's security ends at the gates. Kings gang maintains order. Major locations include:

- **King's School of Impersonation**: Elvis tribute gang headquarters
- **Old Mormon Fort**: Followers of the Apocalypse medical center
- **Atomic Wrangler**: Casino and bar, quest hub
- **Silver Rush**: Van Graff energy weapons shop, dangerous arms dealers
- **Mick and Ralph's**: General store with secret weapons room

## Outer Vegas

Beyond Freeside's walls, pre-war suburbs decay. Camp McCarran serves as NCR military headquarters. REPCONN test site contains ghoul-occupied rocket facility. Hidden Valley bunker houses Mojave Brotherhood of Steel chapter.

## Hoover Dam

The Dam provides Vegas with electricity and represents strategic control of the region. NCR occupies the Dam but faces constant Legion pressure. Its generators power New Vegas, making it the war's ultimate prize.

## Second Battle of Hoover Dam

Four factions vie for control: NCR seeks territorial expansion, Caesar's Legion wants to conquer Vegas, Mr. House desires independence, and Yes Man offers player-controlled independence. Your choices determine the Mojave's future.

## Faction Strategies

## NCR Victory
Support Colonel Moore, destroy House, defeat Legion. Vegas becomes NCR territory, losing independence but gaining military protection.

## Legion Victory
Support Caesar, destroy NCR, crucify enemies. Vegas becomes Legion staging ground for further conquest. House dies. Chaos follows.

## House Victory
Upgrade Securitrons, defend against NCR and Legion. Vegas remains independent under House's autocratic but stable rule. New Vegas thrives but remains under House's control.

## Independent Vegas
Eliminate House and factions. Yes Man's Securitrons secure Vegas. You control the Mojave. Most chaotic outcome with uncertain future.

## Surrounding Mojave

## Goodsprings
Starting town. Victor the Securitron and Doc Mitchell provide initial help. Choice between helping townspeople or Powder Gangers determines early reputation.

## Primm
Destroyed by escaped convicts. Choose between NCR occupation, reinstating Sheriff Meyers, or activating Primm Slim robot lawman.

## Nipton
Legion massacre site. Crucified NCR troops and Powder Gangers. First major exposure to Legion brutality.

## Novac
Sniper town built around pre-war motel. Investigate Caravan massacre. Boone and Manny provide companion and quest opportunities.

## Boulder City
NCR memorial site and Legion prisoner exchange location. Great Khan negotiations affect faction relations.

## Jacobstown
Super mutant refuge. Marcus leads peaceful mutant community. Doctor Henry researches Nightstalker mutations. Stealth suit experimentation available.

## Camp Golf and McCarran
NCR military bases. Quest hubs for NCR storyline. McCarran houses monorail to Strip and holding cells.

## The Fort
Caesar's Legion headquarters. Heavily guarded. Requires invitation or disguise for entry. Caesar's tent contains his court and praetorian guard.

## Hidden Valley
Brotherhood of Steel bunker. Lockdown in effect. Elder McNamara's cautious leadership contrasts with Head Paladin Hardin's aggressive stance.

## Strategic Resources

Control of New Vegas requires: Hoover Dam (power), HELIOS One (potential solar weapon), Camp McCarran (NCR supply hub), The Fort (Legion staging area), and Hidden Valley (Brotherhood technology).

## The Platinum Chip

This pre-war data storage device upgrades Securitrons to Mark II status, doubling combat effectiveness. Benny stole it to overthrow House. Recovering it determines who controls the most powerful army in the Mojave.

## Economic Power

Vegas generates enormous wealth through casinos. Controlling the Strip means controlling the Mojave's economy. The NCR needs Vegas tourism to justify their occupation. The Legion sees it as decadent corruption requiring purification. House views it as his city, his vision, his right.`,
        createdAt: '2024-03-15',
        updatedAt: '2024-11-01',
        readTime: 10,
        views: 2645,
      },
      {
        id: 7,
        title: 'Caesar\'s Legion: The Bull of the East',
        category: 'Factions',
        description: 'In-depth analysis of Caesar\'s Legion, their military tactics, philosophy, and brutal conquest of the wasteland.',
        content: `Caesar's Legion represents the antithesis of Old World values—a totalitarian military dictatorship built on slavery, brutal discipline, and the cult of personality surrounding Caesar himself.

## Origins: The Follower Who Became a God

Edward Sallow began as a Followers of the Apocalypse linguist studying tribal languages. In 2247, he and fellow Follower Bill Calhoun were captured by the Blackfoot tribe while conducting research. Rather than becoming slaves or sacrifices, Sallow taught the Blackfoots advanced military tactics, transforming them into a conquering force.

Sallow adopted the name Caesar (pronounced "Kai-zar" in Latin fashion) and modeled his empire after ancient Rome. He claimed the synthesis of Hegelian dialectics: the thesis (corrupt Old World democracy) met antithesis (wasteland tribalism), producing his synthesis (the Legion). This intellectual justification masks brutal autocracy.

## Legion Philosophy and Culture

Caesar's ideology centers on total warfare and absolute control. Key principles include:

- **Pax Romana**: Peace through total conquest and suppression of resistance
- **Total War**: No civilians; everyone serves the Legion or dies
- **Slavery**: Women enslaved for breeding, men enslaved for labor or conscripted
- **Rejection of Technology**: Limits technology to maintain control (officers use weapons, soldiers use machetes)
- **Cult of Personality**: Caesar as living god, infallible leader
- **Absolute Obedience**: Dissent equals death

The Legion absorbs conquered tribes, erasing their identities. Male children become Legion soldiers, trained from youth in total obedience. Women become slaves. Tribal histories vanish. Only Caesar's vision remains.

## Military Structure and Tactics

The Legion's military organization mirrors Roman legions.

## Rank Structure
- **Praetorian Guard**: Elite bodyguards protecting Caesar
- **Centurions**: Officers marked by distinctive helmets and red cloaks
- **Decanus**: Squad leaders commanding 8-10 soldiers
- **Veterans**: Experienced legionaries
- **Prime Legionaries**: Standard soldiers
- **Recruits**: New conscripts proving themselves
- **Frumentarii**: Intelligence and infiltration specialists

## Combat Doctrine
Legion forces excel in: melee combat, night raids, psychological warfare, crucifixion terror tactics, overwhelming numerical superiority, and fanatical aggression. They view guns as dishonorable (except for officers), preferring machetes, thermic lances, and throwing spears.

Weaknesses include: limited ranged capabilities, vulnerability to concentrated firepower, poor performance against fortified positions, and total dependence on Caesar's leadership.

## Territory and Expansion

The Legion controls 87 tribes across Arizona, New Mexico, Colorado, and Utah. Four states conquered through total war. Population estimated at hundreds of thousands, though exact numbers remain classified.

Controlled territory is remarkably safe for traders—Legion roads have zero crime. Of course, this "safety" exists because Caesar crucified all raiders and enslaved all resistors. Merchants praise Legion roads while ignoring the crucifixes lining them.

## The Mojave Campaign

The Mojave represents Caesar's greatest challenge. The First Battle of Hoover Dam (2277) ended in defeat when Chief Hanlon's tactical brilliance routed Legion forces. Caesar suffered his first major loss. Four years later, the Second Battle looms. Caesar stakes everything on conquering Vegas.

## Key Characters

## Caesar (Edward Sallow)
Brilliant, charismatic, dying. Brain tumor threatens his life and empire. Refuses Auto-Doc treatment, viewing it as weakness. Without Caesar, the Legion likely fragments into warring factions.

## Legate Lanius
"Monster of the East." Caesar's champion and field commander. Absolutely loyal, brutally effective. Even Legion soldiers fear him. If Caesar dies, Lanius becomes dictator—more brutal, less intelligent.

## Vulpes Inculta
Frumentarius leader. Orchestrated Nipton massacre. Master of psychological warfare and infiltration. Pragmatic and cunning, represents Legion's intelligence operations.

## Lucius
Praetorian Guard commander. Protects Caesar with fanatical devotion. Represents Legion's best warriors—loyal, skilled, completely indoctrinated.

## Legion Relations

The Legion makes enemies universally. NCR fights them directly. Brotherhood of Steel views them as barbaric. Followers of the Apocalypse consider them betrayers of humanitarian ideals. Caesar justified betraying the Followers by claiming their passive idealism was ineffective.

Only merchants tolerate the Legion for safe trade routes. Even they recognize the moral horror of dealing with slavers.

## Women in the Legion

The Legion's treatment of women represents its most horrific aspect. Women exist only for breeding and slavery. No female legionaries exist. No female voices matter. Caesar views this as "natural order," rejecting Old World "softness" regarding gender equality.

## The Legion's Future

Caesar's brain tumor threatens everything. Without him, competing centurions and Lanius will likely fight for control. The Legion lacks institutional stability—it's not a nation, but a cult of personality. Caesar's death means civil war.

If the Legion conquers Vegas, Caesar plans to establish a permanent capital, transforming from military dictatorship to empire. This transition requires Caesar's survival and radical reorganization.

## Moral Questions

The Legion forces players to confront difficult questions. Can brutal peace justify slavery and genocide? Does the stability of Legion roads excuse crucifixion? Is Caesar's intellectual sophistication redemptive or merely rationalization for atrocity?

Most players oppose the Legion. Some choose them for pragmatic reasons—Legion victory means one outcome, clear and absolute. Others find philosophical appeal in Caesar's critique of NCR corruption and wasteland weakness.

## Legion Ending Implications

A Legion victory means: Vegas enslaved, Mojave pacified through terror, NCR retreat, Brotherhood eliminated, Followers scattered, and preparation for further eastward conquest. Caesar's death before victory creates chaos. Lanius ruling means perpetual war. Courier intervention might moderate or accelerate these outcomes.

The Bull stampedes east. Whether it brings peace or death depends on perspective—and whether you're the enslaver or enslaved.`,
        createdAt: '2024-03-20',
        updatedAt: '2024-11-12',
        readTime: 10,
        views: 1967,
      },
      {
        id: 8,
        title: 'The Institute: Mankind Redefined',
        category: 'Factions',
        description: 'Complete analysis of the Commonwealth Institute, synth technology, and their vision for humanity\'s future.',
        content: `Beneath the ruins of MIT, the Institute represents humanity's scientific pinnacle—and perhaps its greatest moral failure. Their technological supremacy comes at the cost of their humanity.

## Origins: The Commonwealth Institute of Technology

When the bombs fell in 2077, MIT scientists retreated underground, sealing themselves away from the wasteland. They became the Institute, dedicated to preserving and advancing science. Isolated from surface struggles, they developed revolutionary technology: advanced robotics, molecular manipulation, teleportation, and ultimately, synthetic humans.

## Synth Technology Evolution

The Institute's defining achievement is synth creation—artificial humans indistinguishable from natural humans.

## Generation 1 Synths
Early models: crude metal skeletons with visible servos. Clearly mechanical. Primarily used for manual labor and basic security. Failed to fool anyone as human.

## Generation 2 Synths
Improved models: synthetic skin over metal frames. Still obvious as artificial. Better cognitive functions. Used throughout Institute for complex tasks. Most surface encounters are Gen 2s.

## Generation 3 Synths
Perfect replication: synthetic organs, DNA, memories, emotions. Completely indistinguishable from humans. Pass every test. Some don't know they're synths until their recall codes activate. This technology sparked the Commonwealth's greatest controversy.

## Synth Production Process
Synths grow in molecular relay chambers, printed atom by atom from DNA templates. Memories implant via neural programming. Coursers (elite synth enforcers) oversee security. Production controlled entirely by Robotics division.

## The Institute's Divisions

The Institute operates through specialized divisions, each pursuing research with minimal ethical oversight.

## Robotics
Synth design and production. Led by Dr. Alan Binet (Gen 3 supporter) or Dr. Madison Li (pragmatic scientist). Most controversial division. Debates whether Gen 3s have consciousness.

## BioScience
Genetic research and FEV experimentation. Created super mutants in Commonwealth through failed FEV research. Doctor Clayton Holdren leads this division. Their experiments terrorize the surface.

## Advanced Systems
Energy weapons, molecular relays, and teleportation technology. Most theoretically advanced division. Focuses on pure research rather than surface interaction.

## Facilities
Maintains Institute infrastructure. Manages power generation, life support, and expansion. Least glamorous but most essential division.

## Synth Retention Bureau
Hunts escaped synths. Justin Ayo leads this shadowy division. Deploys Coursers—enhanced synths with superior combat capabilities and recall codes to deactivate rogue units.

## The Railroad Conflict

The Railroad, an underground organization, liberates synths and helps them escape. They memory-wipe synths, provide new identities, and fight the Institute. This conflict defines Commonwealth politics.

The Institute views synths as property. The Railroad considers them sentient beings deserving freedom. The Brotherhood sees them as abominations requiring extermination. The player's choice determines the Commonwealth's future.

## Father (Director Shaun)

The Sole Survivor's son, kidnapped as an infant from Vault 111, became the Institute's director. Raised underground, Shaun embraced Institute philosophy completely. As Father, he leads with scientific detachment, viewing surface dwellers as primitives and synths as tools.

Shaun's cancer diagnosis motivates his final projects: evaluating surface humanity's worth, testing his parent, and ensuring the Institute's future. He orchestrates the Sole Survivor's release as an experiment—can someone from the Old World lead the Institute?

## The Institute's Surface Operations

The Institute secretly manipulates surface politics through synth infiltrators and direct intervention.

## University Point Massacre
The Institute wiped out this settlement to recover pre-war research data, killing all witnesses. Synths executed civilians systematically. No survivors.

## Broken Mask Incident (2229)
A malfunctioning Gen 3 synth went berserk in Diamond City, killing several people before being destroyed. This incident sparked Commonwealth-wide synth paranoia and hatred.

## CPG Massacre (2229)
The Institute sent a representative to Commonwealth Provisional Government peace talks, then massacred all delegates with a synth infiltrator. This destroyed any chance for regional government, leaving settlements vulnerable and divided.

## Super Mutant Creation
The Institute's FEV experiments created the Commonwealth's super mutant population. They released failed subjects to the surface rather than terminating them. Super mutants now terrorize the region.

## Kidnappings and Replacements
The Institute kidnaps surface dwellers, replacing them with synth duplicates. These infiltrators spy, sabotage, and manipulate. Citizens never know who's human. Paranoia corrodes communities.

## The Institute's Philosophy

Institute scientists view themselves as humanity's only hope. Surface dwellers are "primitives" contaminated by radiation. Only the Institute preserves pure human DNA and scientific knowledge. They have no obligation to help the surface—indeed, surface struggles don't concern them.

This elitism blinds them to their atrocities. They rationalize: kidnapping advances research, super mutant releases clear test subjects, synth replacements provide intelligence. Ethics committees don't exist. Only results matter.

## Technology and Capabilities

The Institute's technology far exceeds any faction's:

- **Molecular Relay**: Instantaneous teleportation
- **Gen 3 Synths**: Perfect artificial humans
- **Advanced Energy Weapons**: Superior to pre-war models
- **Biometric Locks**: Impenetrable security systems
- **Gorilla Warfare**: Synth gorillas as enforcers (yes, really)
- **Networking**: Synths link through Institute systems
- **Fabrication**: Molecular printing of complex objects

## Coursers: Elite Hunters

Coursers represent synth perfection: enhanced reflexes, combat programming, equipped with Institute weapons, and absolute loyalty. They hunt escaped synths relentlessly. Each Courser equals multiple soldiers. Their recall codes can deactivate any synth instantly.

## The Choice: Institute Victory

Siding with the Institute requires: destroying the Railroad, eliminating the Brotherhood, and securing surface stability. The Institute offers advanced technology, scientific progress, and their vision of humanity's future.

An Institute ending means: Commonwealth ruled from below, synth integration (or not), scientific advancement, but also continued kidnappings, ethical nightmares, and autocratic control. The Sole Survivor can reform or reinforce Institute ideology as new Director.

## Moral Implications

The Institute poses difficult questions: Are Gen 3 synths conscious? Do scientific goals justify atrocities? Can progress excuse murder? Should the Institute help the surface or remain isolated?

These questions lack easy answers. The Institute's actions are horrific. Their technology is miraculous. They could rebuild civilization—or enslave it. The Sole Survivor's choice shapes Commonwealth history.

## The Institute's Fate

Four endings exist: Institute destroys opposition, Railroad liberates synths and demolishes Institute, Brotherhood eliminates "abomination," or Minutemen destroy Institute tyranny. Each carries profound consequences for synths, scientists, and the Commonwealth's future.

Mankind redefined—but at what cost?`,
        createdAt: '2024-03-25',
        updatedAt: '2024-11-16',
        readTime: 11,
        views: 2108,
      },
      {
        id: 9,
        title: 'Main Quest Guide: The Road to Revenge',
        category: 'Quests & Missions',
        description: 'Complete walkthrough of Fallout 4\'s main storyline, from Vault 111 to the final confrontation with the Institute.',
        content: `The main quest of Fallout 4 tells a deeply personal story of loss, revenge, and difficult moral choices that shape the Commonwealth's future.

## Act I: Awakening

## Out of Time
The journey begins in pre-war Sanctuary Hills on October 23, 2077. After witnessing the nuclear apocalypse and being frozen for 210 years, you awaken to find your spouse murdered and your infant son kidnapped by a mysterious mercenary named Kellogg. This personal tragedy drives the entire narrative forward.

## War Never Changes
Emerging from Vault 111 into the Commonwealth wasteland, you return to your ruined neighborhood. Codsworth, your pre-war robot butler, provides crucial context: 210 years have passed. The quest introduces basic survival mechanics and directs you toward Concord to find help.

## When Freedom Calls
In Concord, you rescue Preston Garvey and the last remnants of the Minutemen from raiders. This quest introduces:
- Power Armor mechanics (T-45d suit on the roof)
- Heavy weapons (Minigun from crashed Vertibird)
- Large enemy combat (Deathclaw boss fight)
- Faction introduction (Minutemen)

Preston's group becomes the foundation for rebuilding the Minutemen and establishing settlements throughout the Commonwealth.

## Act II: The Investigation

## Unlikely Valentine
Following leads to Diamond City, you meet Nick Valentine, a synth detective. Despite being artificial, Nick proves instrumental in your search. His unique perspective as a synth who retained a human's memories makes him one of the most complex companions.

## Getting a Clue
With Nick's help, investigate Kellogg's abandoned house in Diamond City. Use Dogmeat to track Kellogg's scent across the Commonwealth to Fort Hagen. This quest showcases detective work and environmental storytelling.

## Reunions
The confrontation with Kellogg represents the first major story climax. Fort Hagen's fortifications require tactical combat against synths and automated defenses. In the command center, Kellogg reveals shocking truths:
- Shaun is alive but has aged decades
- The Institute has been watching you
- Your release from cryostasis was an experiment

The boss fight against Kellogg tests combat skills. His cybernetic enhancements, Stealth Boys, and synth backup make this one of the game's toughest early encounters. After killing him, retrieve his cybernetic brain augmenter—it becomes crucial later.

## Dangerous Minds
Take Kellogg's augmenter to Doctor Amari in Goodneighbor's Memory Den. Using advanced technology, you access Kellogg's memories, experiencing key moments from his life. This reveals:
- The Institute's teleportation technology
- Kellogg's role in kidnapping Shaun
- Your son's current status
- The Institute's location deep underground

## The Glowing Sea
Journey to the Commonwealth's most irradiated zone to find Virgil, an ex-Institute scientist. This quest requires:
- Power Armor with radiation protection
- Abundant RadAway and Rad-X
- Preparation for Deathclaws and Radscorpions

Virgil provides blueprints for the signal interceptor, the device needed to teleport into the Institute.

## Act III: Faction Choices

## The Molecular Level
This quest represents your first major faction choice. You can build the signal interceptor with:

**Minutemen**: Independent path, build at The Castle
**Brotherhood of Steel**: Military support, build on Prydwen
**Railroad**: Stealth approach, build at Railroad HQ

Each faction offers different resources and philosophical approaches. This decision influences later quests and available endings.

## Institutionalized
Teleporting into the Institute reveals advanced technology and pristine conditions contrasting the surface wasteland. The biggest shock: your son Shaun is now an elderly man, director of the Institute, known as "Father."

Shaun explains:
- You were frozen for different durations than you realized
- Infant Shaun was the perfect unradiated DNA source
- Adult Shaun became the Institute's leader
- He orchestrated your release as an experiment
- He wants you to join the Institute

This revelation forces impossible questions: Is this man still your son? Can you forgive the Institute's actions? Should you embrace or oppose their vision?

## Act IV: The Final Choice

After Institutionalized, the main quest branches based on faction loyalty:

## Brotherhood Ending: Tactical Thinking
Elder Maxson orders the Institute's complete destruction. Liberty Prime assaults the facility while you plant a nuclear device in the reactor. The Brotherhood sees synths as abominations and Institute technology as too dangerous to preserve. This ending represents technological fascism—safety through destruction.

## Railroad Ending: Underground Undercover
As a double agent, you sabotage the Institute from within, ultimately facilitating a Railroad assault that frees all synths before destroying synth production facilities. This ending prioritizes individual freedom over technological advancement.

## Institute Ending: Powering Up
Fully commit to the Institute, becoming its new director after Father's death. Destroy the Railroad and Brotherhood to secure the Institute's future. This ending represents technocratic elitism—believing only the Institute can guide humanity's future.

## Minutemen Ending: Nuclear Option
If alienated from other factions, the Minutemen assault the Institute. This represents the "people's choice"—Commonwealth settlers deciding their own fate without submitting to external powers.

## Major Themes

**Family vs. Ideology**: Is Shaun still your son despite his actions? Does family obligation transcend moral disagreement?

**Progress vs. Ethics**: Does scientific advancement justify human experimentation? Can the Institute be reformed or must it be destroyed?

**Freedom vs. Security**: Should synths have rights? Is the Brotherhood's protection worth their authoritarianism? Can the Railroad's idealism survive pragmatic reality?

**Humanity Redefined**: What makes someone human? Are synths people? Does the Institute's vision represent humanity's future or its corruption?

## Critical Quests

Several quests significantly impact the story:

**Blind Betrayal** (Brotherhood): Discovering Paladin Danse is a synth tests Brotherhood ideology
**Underground Undercover** (Railroad): Extended double-agent operation
**Mass Fusion** (Point of No Return): Choosing Institute locks out Brotherhood
**Airship Down** (Railroad): Destroying the Prydwen
**Ad Victoriam** (Brotherhood): Final Brotherhood assault

## Tips for Main Quest

**Before Choosing Sides:**
- Complete companion quests for all factions
- Max affinity with faction leaders
- Explore all faction questlines as far as possible
- Save before points of no return

**Combat Preparation:**
- Stock ammunition for preferred weapons
- Bring companions aligned with chosen faction
- Upgrade Power Armor for final assaults
- Prepare healing items and stimpaks

**Moral Considerations:**
- No choice is "correct"—all have consequences
- Consider long-term Commonwealth impacts
- Evaluate companion reactions
- Think beyond immediate quest rewards

**Multiple Playthroughs:**
Most players complete the main quest multiple times to experience all endings. Save before critical faction decisions to explore alternatives.

The main quest typically requires 20-30 hours depending on playstyle, with faction quests adding another 10-20 hours. The personal stakes—finding your son—combined with Commonwealth-wide consequences create Fallout 4's most compelling narrative.`,
        createdAt: '2024-04-01',
        updatedAt: '2024-11-22',
        readTime: 14,
        views: 2891,
      },
      {
        id: 10,
        title: 'Side Quest Masterpieces: Hidden Gems of the Wasteland',
        category: 'Quests & Missions',
        description: 'Guide to Fallout\'s most memorable side quests, from the Silver Shroud to the USS Constitution.',
        content: `While main quests drive the story, side quests provide Fallout's most creative, hilarious, and emotionally resonant moments. These optional adventures showcase the series' distinctive personality.

## The Silver Shroud (Fallout 4)

Kent Connolly, an obsessive fan of the pre-war Silver Shroud radio serial, recruits you to become the vigilante hero. This quest celebrates pulp fiction and noir aesthetics while providing practical rewards.

**Highlights:**
- Special "Speak as the Shroud" dialogue options
- Intimidating criminals with dramatic Shroud voice
- Silver Shroud costume with upgradeable stats
- Kent's enthusiastic reactions to your heroics
- Sinjin's supervillain confrontation

**Why It's Beloved:**
The quest fully commits to its absurd premise. Kent's genuine belief in the Silver Shroud, combined with your ability to roleplay the character through special dialogue, creates moments of pure joy. The costume remains viable throughout the game thanks to Kent's upgrades.

**Moral Stakes:**
Saving Kent from Sinjin requires quick combat decisions. His survival means continued costume upgrades—practical and emotional incentives align perfectly.

## The Last Voyage of the USS Constitution (Fallout 4)

A pre-war sailing ship, somehow lodged in a Boston building, crewed by Revolutionary War-programmed robots attempting to "sail" to the ocean using rocket engines. Yes, really.

**The Absurdity:**
- Captain Ironsides speaks in 18th-century naval terminology
- Robot crew maintains sailing protocols on a landlocked ship
- Rocket engines jury-rigged for "sailing"
- Naval battle against scavengers in downtown Boston
- Ship "successfully" flies 500 feet before crashing into another building

**Why It Works:**
The quest's success comes from complete sincerity. Ironsides never breaks character, treating his impossible mission with absolute seriousness. The crew celebrates their catastrophic crash as a victory because they moved closer to the ocean.

**Rewards:**
The Broadsider—a man-portable naval cannon firing cannonballs. Absurdly impractical. Absolutely hilarious.

## Beyond the Beef (Fallout: New Vegas)

Investigate a missing person case at the Ultra-Luxe casino, uncovering a conspiracy involving the White Glove Society's cannibalistic past.

**Investigation Layers:**
- Missing son of Brahmin baron
- White Glove Society's secret
- Mortimer's plan to revive cannibalism
- Multiple solution paths
- Speech, stealth, or violence approaches

**Complex Solutions:**
- Replace human meat with Brahmin
- Expose Mortimer to the Society
- Join the cannibals
- Rescue the victim violently
- Frame someone else

**Why It's Memorable:**
The quest respects player intelligence, providing multiple viable approaches with different consequences. No single "correct" solution exists—moral complexity reigns.

## Blood Ties (Fallout 3)

Investigate mysterious deaths in Arefu, discovering "The Family"—wastelanders who believe they're vampires and practice harm reduction for cannibalistic urges.

**The Family's Philosophy:**
Instead of eating people, they drink blood packs. Leader Vance created this system to help people with dangerous impulses control themselves. Ian West, who killed his family during his "awakening," learns to manage his urges.

**Moral Complexity:**
The Family isn't evil—they're people with a psychological condition finding ways to coexist peacefully. The peaceful resolution benefits everyone:
- The Family gains legitimate blood supply
- Arefu receives protection from raiders
- Ian finds acceptance and control
- Wasteland cooperation prevails

**Why It's Impactful:**
The quest avoids simple good/evil dichotomy. The Family represents harm reduction philosophy in the wasteland—not perfect, but better than the alternative.

## Come Fly With Me (Fallout: New Vegas)

Help ghouls repair pre-war rockets to reach their "promised land" while dealing with Nightkin (stealth-capable super mutants) who believe their Stealth Boy supply is hidden at the REPCONN facility.

**The Setup:**
- Jason Bright leads "Bright Brotherhood" ghouls
- Nightkin seek imaginary Stealth Boy shipment
- Pre-war rockets might actually work
- Harland trapped in basement
- Multiple faction negotiations possible

**Resolution Choices:**
- Help both ghouls and Nightkin peacefully
- Kill everyone
- Sabotage the rockets (cruel and hilarious)
- Redirect rockets to different destinations

**Memorable Moment:**
Watching the rockets actually launch, carrying ghouls toward their destiny, remains one of New Vegas's most surreal and touching moments.

## The Superhuman Gambit (Fallout 3)

Two wastelanders with mental health issues—the AntAgonizer and the Mechanist—fight in costumes they believe grant superpowers. Neither actually has powers. Both are dangerous because they control giant ants and robots, respectively.

**The Comedy:**
- Serious superhero/supervillain roleplay
- Neither recognizes the other's "true identity"
- Actual threat from their controlled creatures
- Option to become a supervillain yourself
- Can convince them to stop by revealing "secret identities"

**Solutions:**
- Kill both
- Kill one
- Convince them their costumes are powerless
- Take a costume and become a costumed hero/villain

**Tonal Mastery:**
The quest balances genuine danger with absurdist comedy, never mocking the characters while acknowledging the situation's ridiculousness.

## Those! (Fallout: New Vegas)

Investigate giant ants threatening a caravan route. Seems standard until you discover the truth: Doctor Borous from the Big MT created these ants. The quest connects to the Old World Blues DLC, revealing pre-war Think Tank experiments.

**Environmental Storytelling:**
- Ant eggs throughout the area
- Scientist notes revealing experiments
- Connection to larger lore
- Simple premise, complex background

## Wang Dang Atomic Tango (Fallout: New Vegas)

The Atomic Wrangler needs employees for their escort service. Find various specialists with specific... attributes. This quest showcases Fallout's mature humor and wastelander pragmatism.

**Recruitment Targets:**
- Ghoul cowboy with smooth talking
- Super mutant with surprising gentleness
- Robot with "fisto" programming
- Human with specific skills

**Why It's Noteworthy:**
The quest treats sex work pragmatically, neither glorifying nor condemning it. Recruits express agency in their choices, and the Atomic Wrangler operates professionally.

## The Power of the Atom (Fallout 3)

Megaton's founding tension: the unexploded atomic bomb in the town center. Either disarm it for the settlement's safety or detonate it for Tenpenny Tower's entertainment.

**The Stakes:**
- Entire town's survival
- Your karma permanently affected
- Unique rewards from each choice
- Visible consequences (Megaton crater)

**Detonation Consequences:**
If you detonate Megaton for Tenpenny and caps:
- Entire town dies (including potential companions)
- Massive karma loss
- Tenpenny Tower suite reward
- Megaton becomes permanent crater
- Many quests become unavailable

**Why It's Significant:**
Few video game choices have such visible, permanent consequences. The mushroom cloud serves as a constant reminder of your decision.

## Common Elements of Great Side Quests

**Moral Complexity**: Best quests avoid simple good/evil choices
**Humor**: Fallout's dark comedy shines in side content
**Player Agency**: Multiple solutions respect different playstyles
**Consequences**: Choices affect the world meaningfully
**Environmental Storytelling**: Locations tell stories through design
**Character Depth**: Even minor NPCs have motivations and personalities

## Rewards Beyond Loot

The best side quests provide:
- Unique weapons with personality
- Companions with depth
- Lore expanding world understanding
- Moral questions worth considering
- Stories worth retelling

Side quests transform Fallout from good games into masterpieces. They demonstrate that the wasteland, despite its horrors, contains humor, humanity, and hope. Between rescuing cats and launching ghouls into space, these quests define the Fallout experience.`,
        createdAt: '2024-04-05',
        updatedAt: '2024-11-21',
        readTime: 13,
        views: 2543,
      },
    ]
  },

  // Get article by ID
  getArticle: async (articleId: number): Promise<CompendiumArticle> => {
    const articles = await compendiumService.getArticles()
    const article = articles.find((a) => a.id === articleId)
    if (!article) {
      throw new Error(`Article with ID ${articleId} not found`)
    }
    return article
  },

  // Get articles by category
  getArticlesByCategory: async (category: string): Promise<CompendiumArticle[]> => {
    const articles = await compendiumService.getArticles()
    return articles.filter((a) => a.category === category)
  },

  // Get categories
  getCategories: async (): Promise<CompendiumCategory[]> => {
    const articles = await compendiumService.getArticles()
    const categoryMap = new Map<string, number>()

    articles.forEach((article) => {
      const count = categoryMap.get(article.category) || 0
      categoryMap.set(article.category, count + 1)
    })

    const categories: CompendiumCategory[] = [
      {
        id: 'factions',
        name: 'Factions',
        description: 'Major groups and their ideologies',
        count: categoryMap.get('Factions') || 0,
      },
      {
        id: 'locations',
        name: 'Locations',
        description: 'Vaults, cities, and landmarks',
        count: categoryMap.get('Locations') || 0,
      },
      {
        id: 'weapons-armor',
        name: 'Weapons & Armor',
        description: 'Equipment, mods, and gear',
        count: categoryMap.get('Weapons & Armor') || 0,
      },
      {
        id: 'lore-history',
        name: 'Lore & History',
        description: 'Pre-war and post-war events',
        count: categoryMap.get('Lore & History') || 0,
      },
      {
        id: 'survival-guide',
        name: 'Survival Guide',
        description: 'Combat, crafting, and survival tips',
        count: categoryMap.get('Survival Guide') || 0,
      },
      {
        id: 'quests-missions',
        name: 'Quests & Missions',
        description: 'Storylines and side missions',
        count: categoryMap.get('Quests & Missions') || 0,
      },
    ]

    return categories
  },

  // Search articles
  searchArticles: async (query: string): Promise<CompendiumArticle[]> => {
    const articles = await compendiumService.getArticles()
    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery),
    )
  },
}

export const characterService = {
  // Get all characters
  getCharacters: async (): Promise<Character[]> => {
    // Notable Fallout characters from across the series
    return [
      {
        id: 1,
        name: 'The Vault Dweller',
        faction: 'Vault 13',
        role: 'Protagonist',
        game: 'Fallout',
        description: 'The first protagonist of the Fallout series. Exiled from Vault 13 to find a replacement water chip, they ended up saving the wasteland from the Master\'s super mutant army and discovering the truth about the Forced Evolutionary Virus.',
        status: 'Unknown',
        type: 'Protagonist',
      },
      {
        id: 2,
        name: 'The Chosen One',
        faction: 'Arroyo',
        role: 'Protagonist',
        game: 'Fallout 2',
        description: 'Grandchild of the Vault Dweller, sent from Arroyo to find a G.E.C.K. and save their dying village. Defeated the Enclave and Frank Horrigan, preventing them from unleashing a modified FEV that would have killed all "mutated" humans.',
        status: 'Unknown',
        type: 'Protagonist',
      },
      {
        id: 3,
        name: 'The Lone Wanderer',
        faction: 'Vault 101',
        role: 'Protagonist',
        game: 'Fallout 3',
        description: 'Born in the wasteland but raised in Vault 101. Left the vault to find their father, James, and became instrumental in Project Purity, bringing clean water to the Capital Wasteland while fighting the Enclave.',
        status: 'Unknown',
        type: 'Protagonist',
      },
      {
        id: 4,
        name: 'The Courier',
        faction: 'Independent',
        role: 'Protagonist',
        game: 'Fallout: New Vegas',
        description: 'A courier shot in the head by Benny and left for dead. Survived and became the deciding factor in the Second Battle of Hoover Dam, determining the fate of the Mojave Wasteland and New Vegas.',
        status: 'Unknown',
        type: 'Protagonist',
      },
      {
        id: 5,
        name: 'The Sole Survivor',
        faction: 'Vault 111',
        role: 'Protagonist',
        game: 'Fallout 4',
        description: 'A pre-war survivor frozen in Vault 111 for 210 years. Emerged to find their spouse murdered and infant son kidnapped. Their search for Shaun led them to the Institute and forced them to choose the Commonwealth\'s future.',
        status: 'Alive',
        type: 'Protagonist',
      },
      {
        id: 6,
        name: 'Elder Arthur Maxson',
        faction: 'Brotherhood of Steel',
        role: 'Elder',
        game: 'Fallout 4',
        description: 'The youngest Elder in Brotherhood history. United the East Coast Brotherhood and led them to the Commonwealth aboard the Prydwen. Combines Lyon\'s humanitarian ideals with traditional Brotherhood doctrine, making him both respected and feared.',
        status: 'Alive',
        type: 'Faction Leader',
      },
      {
        id: 7,
        name: 'Caesar (Edward Sallow)',
        faction: 'Caesar\'s Legion',
        role: 'Founder and Dictator',
        game: 'Fallout: New Vegas',
        description: 'Former Follower of the Apocalypse who founded Caesar\'s Legion after being saved by the Blackfoot tribe. Created a brutal slave empire modeled on ancient Rome. Brilliant but dying from a brain tumor.',
        status: 'Unknown',
        type: 'Faction Leader',
      },
      {
        id: 8,
        name: 'Father (Shaun)',
        faction: 'The Institute',
        role: 'Director',
        game: 'Fallout 4',
        description: 'The Sole Survivor\'s son, kidnapped as an infant and raised in the Institute. Became Director and led the Institute\'s scientific pursuits. Dying of cancer, he orchestrated his parent\'s release to ensure the Institute\'s future.',
        status: 'Deceased',
        type: 'Faction Leader',
      },
      {
        id: 9,
        name: 'Paladin Danse',
        faction: 'Brotherhood of Steel',
        role: 'Paladin',
        game: 'Fallout 4',
        description: 'A devoted Brotherhood Paladin and commander of Recon Squad Gladius. His unwavering loyalty to the Brotherhood is tested when he discovers he is actually a synth, forcing him to confront his own identity and beliefs.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 10,
        name: 'Nick Valentine',
        faction: 'Independent',
        role: 'Private Detective',
        game: 'Fallout 4',
        description: 'A unique synth detective in Diamond City. A prototype Gen-2 synth with the memories of a pre-war detective. Cynical but kind-hearted, he helps solve cases across the Commonwealth despite facing discrimination.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 11,
        name: 'Preston Garvey',
        faction: 'Minutemen',
        role: 'Minuteman',
        game: 'Fallout 4',
        description: 'One of the last surviving Minutemen. After the Quincy Massacre, he struggled to rebuild the Minutemen. Deeply committed to helping settlements and protecting the innocent, though sometimes to an exhausting degree.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 12,
        name: 'Piper Wright',
        faction: 'Independent',
        role: 'Reporter',
        game: 'Fallout 4',
        description: 'Editor and publisher of Publick Occurrences in Diamond City. A tenacious investigative journalist determined to expose the truth about synths and corruption, even when it makes her unpopular with Diamond City\'s mayor.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 13,
        name: 'Dogmeat',
        faction: 'Independent',
        role: 'Loyal Companion',
        game: 'Fallout 4',
        description: 'A German Shepherd who becomes the Sole Survivor\'s faithful companion. Found near the Red Rocket truck stop. Brave, loyal, and helpful in tracking and combat. The goodest boy in the Commonwealth.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 14,
        name: 'Benny',
        faction: 'The Chairmen',
        role: 'Chairman',
        game: 'Fallout: New Vegas',
        description: 'Leader of the Chairmen and owner of The Tops casino. Shot the Courier in the head to steal the Platinum Chip. Smooth-talking and ambitious, he planned to use the chip to take control of New Vegas from Mr. House.',
        status: 'Unknown',
        type: 'Antagonist',
      },
      {
        id: 15,
        name: 'Mr. House',
        faction: 'Independent (New Vegas)',
        role: 'CEO and Ruler',
        game: 'Fallout: New Vegas',
        description: 'Pre-war businessman who preserved himself in a life-support chamber. Saved Las Vegas from nuclear destruction and transformed it into New Vegas. Cold, calculating, and determined to bring humanity back to its former glory through technology.',
        status: 'Alive',
        type: 'Faction Leader',
      },
      {
        id: 16,
        name: 'Veronica Santangelo',
        faction: 'Brotherhood of Steel',
        role: 'Scribe',
        game: 'Fallout: New Vegas',
        description: 'A Brotherhood of Steel Scribe who questions the Brotherhood\'s isolationist ways. Struggles between her loyalty to the Brotherhood and her belief that they need to change to survive. Former girlfriend of Christine Royce.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 17,
        name: 'Boone',
        faction: 'Independent (former NCR)',
        role: 'Sniper',
        game: 'Fallout: New Vegas',
        description: 'Former NCR First Recon sniper haunted by his past. Stationed in Novac, seeking revenge for his wife\'s kidnapping and enslavement by the Legion. One of the deadliest companions with his sniper rifle.',
        status: 'Alive',
        type: 'Companion',
      },
      {
        id: 18,
        name: 'The Master',
        faction: 'Unity',
        role: 'Founder',
        game: 'Fallout',
        description: 'Richard Grey, transformed by FEV into a nightmarish biomass. Believed super mutants were the next step in human evolution and sought to "unify" humanity through forced mutation. The first major antagonist of the Fallout series.',
        status: 'Deceased',
        type: 'Antagonist',
      },
      {
        id: 19,
        name: 'Colonel Autumn',
        faction: 'Enclave',
        role: 'Colonel',
        game: 'Fallout 3',
        description: 'Commander of Enclave forces in the Capital Wasteland. More pragmatic than President Eden, he wanted to use Project Purity to gain control over the wasteland rather than genocide. Conflicts with both the Lone Wanderer and Eden.',
        status: 'Unknown',
        type: 'Antagonist',
      },
      {
        id: 20,
        name: 'Three Dog',
        faction: 'Independent',
        role: 'Radio DJ',
        game: 'Fallout 3',
        description: 'Charismatic DJ of Galaxy News Radio. Broadcasts news, music, and commentary across the Capital Wasteland. His energetic personality and dedication to fighting the "Good Fight" made him a wasteland icon.',
        status: 'Alive',
        type: 'NPC',
      },
    ]
  },

  // Get character by ID
  getCharacter: async (id: number): Promise<Character | undefined> => {
    const characters = await characterService.getCharacters()
    return characters.find((char) => char.id === id)
  },

  // Get characters by type
  getCharactersByType: async (type: Character['type']): Promise<Character[]> => {
    const characters = await characterService.getCharacters()
    return characters.filter((char) => char.type === type)
  },

  // Search characters
  searchCharacters: async (query: string): Promise<Character[]> => {
    const characters = await characterService.getCharacters()
    const lowerQuery = query.toLowerCase()
    return characters.filter(
      (char) =>
        char.name.toLowerCase().includes(lowerQuery) ||
        char.faction.toLowerCase().includes(lowerQuery) ||
        char.description.toLowerCase().includes(lowerQuery) ||
        char.game.toLowerCase().includes(lowerQuery),
    )
  },
}

export const npcService = {
  // Get all NPCs
  getNPCs: async (): Promise<NPC[]> => {
    // Fallout universe NPCs
    return [
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
- Struggles with identity questions

## Detective Work
Operating from his agency in Diamond City, Nick takes cases no one else will:
- Missing persons
- Property crimes
- Investigation services
- Helps those who can't pay
- Keeps detailed case files

## Combat Style
Nick favors handguns and uses:
- His signature .44 revolver
- Good accuracy in V.A.T.S.
- Tactical combat positioning
- Hacking terminals during combat
- Synth resilience to some damage types

## Character Arc
Nick's personal quest "Long Time Coming" involves:
- Hunting Eddie Winter, a pre-war mobster turned ghoul
- Accessing memories of his human counterpart
- Confronting what it means to be himself
- Deciding if he's Nick Valentine or just a copy

## Perk: Close to Metal
At maximum affinity, Nick grants:
- Extra attempt when hacking terminals
- Lockout time reduced by 50%
- Perfect for tech-focused builds

## Relationships
**Approves:**
- Helping innocent people
- Sarcastic dialogue
- Synth-friendly choices
- Moral decisions
- Detective work

**Disapproves:**
- Cruelty and murder
- Selfish actions
- Anti-synth bigotry
- Working with the Institute
- Stealing from innocents

## Faction Views
- **Institute**: Despises them for creating and discarding him
- **Railroad**: Sympathetic to their cause
- **Brotherhood**: Concerned about their anti-synth doctrine
- **Minutemen**: Approves of helping settlements

## Unique Qualities
- Can hack terminals during conversations
- Immune to radiation
- Doesn't need stimpaks (robot repair kits instead)
- Cannot be romanced (professional relationship only)
- Essential NPC (cannot be killed)

## Impact
Nick challenges players' views on consciousness, identity, and what makes someone "real." His existence proves synths can be more than tools—they can be heroes.`,
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
        inventory: [
          'Nick Valentine\'s Outfit',
          '.44 Pistol',
          'Detective\'s Case Files',
        ],
        quests: [
          'Unlikely Valentine',
          'Getting a Clue',
          'Long Time Coming',
        ],
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
        description: 'The intrepid reporter and editor of Publick Occurrences, Diamond City\'s only newspaper. A fierce advocate for truth and justice.',
        biography: `Piper Wright is the fearless journalist who runs Diamond City's only newspaper, Publick Occurrences. Her determination to expose the truth, no matter the cost, makes her both a local hero and a constant thorn in the mayor's side.

## Background
Piper and her younger sister Nat moved to Diamond City years ago, seeking safety after their father's death. Piper took up her father's passion for journalism and founded Publick Occurrences to keep Diamond City informed about threats, especially synth infiltrators.

## Personality
- Idealistic crusader for truth
- Protective older sister
- Rebellious against authority
- Quick-witted and sarcastic
- Empathetic to the downtrodden
- Sometimes reckless in pursuit of stories

## Journalism Career
Piper's newspaper focuses on:
- Exposing synth infiltration
- Criticizing Mayor McDonough's policies
- Warning about Commonwealth dangers
- Celebrating everyday heroes
- Investigating corruption

Her stories have made powerful enemies, including:
- Mayor McDonough (tries to ban her paper)
- Institute sympathizers
- Corrupt Diamond City officials
- Various wasteland threats she's exposed

## Combat Style
Piper fights with:
- Pistols (her preferred weapon)
- Cover-based tactics
- Moderate health pool
- Moral support through dialogue
- Decent accuracy

## Sister Relationship
Piper's relationship with Nat is central to her character:
- Raised Nat after their parents died
- Taught Nat the newspaper business
- Fiercely protective
- Worries about endangering Nat with her journalism
- Nat helps run the paper when Piper's away

## Personal Quest: Story of the Century
Piper's quest involves:
- Helping her investigate a major story
- Making choices about truth vs. safety
- Understanding the cost of journalism
- Strengthening your relationship

## Romance
Piper can be romanced after reaching maximum affinity:
- Appreciates your heroism
- Values honesty and good deeds
- Opens up about her past
- Becomes a devoted partner

## Perk: Gift of Gab
Maximum affinity grants:
- Double XP for speech challenges and discovering locations
- Excellent for exploration-focused builds
- Encourages dialogue options

## Approves Of:
- Helping people selflessly
- Exposing corruption
- Sarcastic responses
- Generosity
- Pro-synth choices
- Standing up to bullies
- Railroad and Minutemen support

## Disapproves Of:
- Selfish actions
- Cruelty
- Institute loyalty
- Stealing from innocents
- Cowardice
- Letting injustice slide

## Writing Style
Piper's articles are:
- Sensational but truthful
- Emotionally charged
- Focused on human impact
- Critical of power structures
- Accessible to common folk

## Impact on Diamond City
Despite opposition, Piper's work:
- Kept citizens informed
- Prevented multiple crises
- Exposed synth infiltrators
- Held leadership accountable
- Gave voice to the powerless

## Unique Traits
- Signature red leather jacket and newsboy cap
- Calls the player "Blue" (affectionate nickname)
- Chain-smokes when stressed
- Excellent at persuasion
- Banned from Diamond City multiple times

Piper represents the importance of a free press in maintaining democracy, even in the post-apocalyptic wasteland. Her courage to speak truth to power, despite constant threats, makes her one of the Commonwealth's true heroes.`,
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
        inventory: [
          'Piper\'s Red Leather Jacket',
          '10mm Pistol',
          'Press Pass',
          'Notepad',
        ],
        quests: [
          'Story of the Century',
          'Interview with the Sole Survivor',
        ],
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
Preston witnessed the Minutemen's collapse:
- Internal corruption and infighting
- The Quincy Massacre (his greatest failure)
- Loss of most Minutemen forces
- Betrayal by Clint and his mercenaries
- Civilian casualties he couldn't prevent

The Quincy Massacre haunts Preston—he led refugees who were then slaughtered by Gunners. Only a handful survived, and Preston carries the guilt of every death.

## Meeting the Sole Survivor
When you first meet Preston in Concord:
- He's leading the last Minutemen remnants
- Trapped in the Museum of Freedom
- Protecting civilians from raiders
- Nearly out of ammunition
- About to make his last stand

Your arrival and assistance gives Preston hope that the Minutemen can be rebuilt.

## Rebuilding the Minutemen
Preston's quest involves:
- Reclaiming settlements
- Defending innocent people
- Establishing supply lines
- Recruiting new Minutemen
- Retaking The Castle
- Installing artillery
- Creating a Commonwealth-wide network

## Philosophy
Preston believes in:
- Protecting the innocent above all
- Community cooperation
- Democratic leadership
- Settlement self-sufficiency
- The Minutemen's motto: "At a minute's notice"

## Combat Role
Preston is effective in combat:
- Specializes in laser muskets
- Can use power armor
- Good with long-range weapons
- Solid health pool
- Reliable cover fire

## Leadership Style
As Minutemen leader, Preston:
- Defers to the player (makes you General)
- Provides intel on settlements in need
- Coordinates defense efforts
- Recruits new members
- Maintains morale

## Personal Quest: The First Step
Preston's quest arc involves:
- Rebuilding the Minutemen from scratch
- Retaking The Castle from Mirelurks
- Installing the radio transmitter
- Facing his Quincy demons

## Romance
Preston can be romanced after:
- Becoming Minutemen General
- Maximum affinity
- Helping multiple settlements
- Showing dedication to the cause

## Perk: United We Stand
Maximum affinity grants:
- +20% damage and +20 Damage Resistance when facing three or more opponents
- Encourages aggressive playstyle
- Useful in large battles

## Approves Of:
- Helping settlements
- Defending innocents
- Generous actions
- Building settlements
- Minutemen support
- Peaceful resolutions

## Disapproves Of:
- Refusing to help settlements
- Cruelty
- Selfish actions
- Ignoring civilians in danger
- Destroying the Minutemen

## The "Settlement" Meme
Preston has become infamous for:
- Constant settlement defense quests
- "Another settlement needs your help"
- Endless radiant quests
- Players both loving and finding him overwhelming

## Character Development
Over time, Preston:
- Regains confidence
- Overcomes guilt from Quincy
- Becomes true Minutemen leader
- Learns to trust again
- Finds hope in reconstruction

## Faction Relations
- **Minutemen**: Devoted leader
- **Railroad**: Generally supportive
- **Brotherhood**: Concerned about militarism
- **Institute**: Strongly opposes

## Legacy
Whether loved or memed, Preston represents:
- Hope in the wasteland
- Civilian protection
- Democratic ideals
- Community over individualism
- Redemption through service

Preston's character explores leadership burden, survivor's guilt, and the difficulty of maintaining idealism in a harsh world.`,
        image: '��️',
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
        inventory: [
          'Minutemen General Uniform',
          'Laser Musket',
          'Minutemen Hat',
        ],
        quests: [
          'When Freedom Calls',
          'The First Step',
          'Taking Independence',
          'Old Guns',
        ],
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
        description: 'A proud Brotherhood of Steel Paladin and leader of Recon Squad Gladius, dedicated to protecting humanity from technological threats.',
        biography: `Paladin Danse embodies Brotherhood ideals—discipline, duty, and dedication to protecting humanity from dangerous technology. His personal story becomes one of Fallout 4's most tragic and philosophically complex narratives.

## Brotherhood Career
Danse rose through Brotherhood ranks through:
- Exemplary combat record
- Unwavering loyalty to Brotherhood ideals
- Leadership of Recon Squad Gladius
- Successful Commonwealth reconnaissance
- Dedication to the Codex
- Mentorship of new recruits

He represents what the Brotherhood believes a Paladin should be: honorable, disciplined, and committed to the mission above all.

## Recon Squad Gladius
Danse leads a small team including:
- Scribe Haylen (tech specialist)
- Knight Rhys (combat specialist)
- Operating from Cambridge Police Station
- Reconnaissance and threat assessment
- Preparing for Brotherhood arrival

The squad is isolated and outnumbered but maintains Brotherhood standards despite difficult circumstances.

## Meeting the Player
First encounter at Cambridge Police Station:
- Fighting feral ghouls
- Defending the station
- Recruits capable fighters
- Introduces Brotherhood values
- Offers sponsorship to join

## Combat Prowess
Danse is one of the strongest companions:
- Always wears Power Armor
- Expert with heavy weapons
- High health and damage resistance
- Fearless in combat
- "Charge first, ask questions later" tactics
- Can be equipped with any power armor

## Personality
- Strictly disciplined
- By-the-book military mindset
- Initially cold and formal
- Slowly warms to trusted allies
- Deep sense of duty
- Questions are weakness (initially)
- Gradually shows humanity

## The Revelation
"Blind Betrayal" quest reveals devastating truth:
- Danse is a synth
- He didn't know his true nature
- His entire identity is questioned
- Brotherhood doctrine demands his execution
- Elder Maxson orders his death
- Player must decide his fate

## Identity Crisis
Learning he's a synth shatters Danse:
- Everything he believed was a lie
- His service means nothing (to some)
- He's the "abomination" he hunted
- Willing to accept execution
- Sees himself as a mistake
- Struggles with existence

## Player's Choice
Options for Danse's fate:
**Execute Him:**
- Follow Brotherhood orders
- Maintain doctrine purity
- Receive his power armor
- Lose companion permanently

**Spare Him:**
- Persuade Maxson (difficult)
- Danse lives in exile
- Can still be a companion
- Challenges Brotherhood ideology
- Danse forever grateful

## Post-Revelation
If spared, Danse:
- Lives at Listening Post Bravo
- No longer officially Brotherhood
- Questions everything he believed
- Develops more nuanced worldview
- Remains loyal to player
- Grows as a person

## Perk: Know Your Enemy
Maximum affinity grants:
- +20% damage against Feral Ghouls, Super Mutants, and Synths
- Excellent for Brotherhood playthrough
- Reflects his training

## Approves Of:
- Brotherhood loyalty
- Killing synths and super mutants
- Military discipline
- Selfless heroism
- Helping innocents
- Technology collection

## Disapproves Of:
- Institute cooperation
- Cowardice
- Insubordination
- Helping synths (before revelation)
- Criticizing the Brotherhood

## Romance
Danse can be romanced (male or female Sole Survivor):
- Requires high affinity
- Opens up emotionally
- Shows vulnerability
- Becomes devoted partner
- Especially poignant after revelation

## Philosophical Questions
Danse's story asks:
- What defines personhood?
- Do synthetic origins invalidate experiences?
- Can identity survive such revelation?
- Is loyalty meaningless if you're "artificial"?
- Should doctrine override compassion?

## Unique Traits
- One of few essential companions
- Only companion wearing power armor by default
- Voice becomes more emotional after revelation
- Can't be killed by player
- Complex character development

## Legacy
Danse represents:
- Cost of absolute ideology
- Identity and consciousness questions
- Loyalty vs. doctrine
- Humanity beyond biology
- Redemption possibilities

His story proves that who you are matters more than what you are—a synth who exemplified humanity more than many humans.`,
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
        inventory: [
          'Brotherhood of Steel T-60 Power Armor',
          'Laser Rifle',
          'Brotherhood Officer Uniform',
        ],
        quests: [
          'Fire Support',
          'Call to Arms',
          'Blind Betrayal',
          'Shadow of Steel',
        ],
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
        description: 'A mysterious Railroad spy master who specializes in disguises and deception. His past is shrouded in lies and half-truths.',
        biography: `Deacon is the Railroad's master of disguise, infiltration expert, and possibly the most enigmatic character in the Commonwealth. Everything he says might be a lie—including that statement.

## The Spy Who Lies
Deacon's defining characteristic is deception:
- Tells contradictory stories about his past
- Changes appearance constantly
- Multiple documented identities
- "Lying is like breathing"
- Uses humor to deflect
- Truth is a flexible concept

He's been watching you since Vault 111, appearing in disguise throughout the Commonwealth before you officially meet.

## Railroad Operations
Within the Railroad, Deacon serves as:
- Chief of intelligence operations
- Infiltration specialist
- Disguise expert
- Recruiter and evaluator
- Desdemona's most trusted agent
- Comic relief (intentional and not)

## Master of Disguise
Deacon's disguises include:
- Diamond City guard
- Bunker Hill caravan guard
- Drifter
- Various personas throughout Commonwealth
- Changes appearance frequently
- Uses wigs, facial hair, sunglasses

He believes identity is performance, and he's always performing.

## Past (Maybe)
Deacon's stories about his past include:
- Growing up in the Capital Wasteland
- Being a synth himself
- Having a ghoul wife killed by anti-synth bigots
- Former member of the University Point Deathclaws
- Pre-war government agent
- All of the above
- None of the above

The only confirmed truth: He deeply believes in the Railroad's cause.

## Combat Style
Despite the comedy, Deacon is effective:
- Specializes in stealth
- Excellent with silenced weapons
- High sneak bonus
- Uses cover effectively
- Quick wit under pressure
- Moderate health

## Railroad Loyalty
While he lies about everything, Deacon's commitment to the Railroad is genuine:
- Believes in synth freedom absolutely
- Will die for the cause
- Mourns fallen agents
- Takes the mission seriously
- Uses humor to cope with danger

## Personal Quest: Unknown
Deacon doesn't have a personal quest in the traditional sense. His character development happens through:
- Ambient dialogue
- Affinity conversations
- Reactions to player choices
- Gradually revealing truths
- Building trust slowly

## Perk: Cloak & Dagger
Maximum affinity grants:
- +20% sneak attack damage
- +40% duration for Stealth Boys
- Perfect for stealth builds
- Reflects his specialty

## Approves Of:
- Helping synths
- Deception and disguises
- Railroad operations
- Sarcastic responses
- Clever solutions
- Kindness to outsiders

## Disapproves Of:
- Cruelty
- Institute loyalty
- Brotherhood extremism
- Anti-synth bigotry
- Unnecessary violence
- Killing innocents

## Philosophy
Deacon believes:
- Identity is what you make it
- Synths deserve freedom
- Past doesn't define future
- Sometimes lying protects truth
- Everyone deserves second chances
- Humor defuses tension

## Relationships
Deacon's relationships are complicated:
- Trusts Desdemona completely
- Friendly with other Railroad agents
- Watches everyone constantly
- Slow to genuinely trust
- Eventually opens up to player
- Maintains emotional distance

## The Recall Code Mystery
Interesting note: Deacon claims to have no recall code when confronted. Either:
- He's not a synth
- He is a synth with modified programming
- He's lying again
- It's another layer of deception

## Unique Traits
- Appears in background before official meeting
- Changes appearance constantly
- Can't be romanced (keeps distance)
- Essential NPC
- Most quotable companion
- Breaking fourth wall tendencies

## Best Quotes
- "Everything I say is a lie. Except that. And that. And that..."
- "I'm a spy. It's what I do."
- "You know what I love about you? You shoot me in the face and I'm like 'that's a good day.'"
- "Trust me, I'm completely trustworthy."

## Character Analysis
Deacon uses humor and lies to:
- Protect himself emotionally
- Maintain operational security
- Cope with past trauma
- Keep enemies guessing
- Build walls against grief

Beneath the jokes and disguises lies someone who's lost everyone he loved and uses deception to avoid being hurt again.

## Impact
Deacon represents:
- Fluidity of identity
- Protective dishonesty
- Humor as armor
- Dedication despite cynicism
- Redemption through service

He's the least reliable narrator who tells the most important truth: Everyone deserves freedom to choose who they become.`,
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
        inventory: [
          'Deacon\'s Pompadour Wig',
          'Sunglasses',
          'Silenced Deliverer Pistol',
          'Various Disguises',
        ],
        quests: [
          'Tradecraft',
          'Boston After Dark',
          'Mercer Safehouse',
        ],
        relationships: {
          likes: ['Desdemona', 'Railroad', 'The Sole Survivor'],
          dislikes: ['The Institute', 'X6-88', 'Brotherhood (later)'],
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-11-15',
      },
    ]
  },

  // Get NPC by ID
  getNPC: async (npcId: number): Promise<NPC> => {
    const npcs = await npcService.getNPCs()
    const npc = npcs.find((n) => n.id === npcId)
    if (!npc) {
      throw new Error(`NPC with ID ${npcId} not found`)
    }
    return npc
  },

  // Get NPCs by role
  getNPCsByRole: async (role: string): Promise<NPC[]> => {
    const npcs = await npcService.getNPCs()
    if (role === 'All') return npcs
    return npcs.filter((n) => n.role === role)
  },

  // Get NPCs by faction
  getNPCsByFaction: async (faction: string): Promise<NPC[]> => {
    const npcs = await npcService.getNPCs()
    if (faction === 'All') return npcs
    return npcs.filter((n) => n.faction === faction)
  },

  // Get companions only
  getCompanions: async (): Promise<NPC[]> => {
    const npcs = await npcService.getNPCs()
    return npcs.filter((n) => n.isCompanion)
  },

  // Get merchants only
  getMerchants: async (): Promise<NPC[]> => {
    const npcs = await npcService.getNPCs()
    return npcs.filter((n) => n.isMerchant)
  },

  // Search NPCs
  searchNPCs: async (query: string): Promise<NPC[]> => {
    const npcs = await npcService.getNPCs()
    const lowerQuery = query.toLowerCase()
    return npcs.filter(
      (npc) =>
        npc.name.toLowerCase().includes(lowerQuery) ||
        npc.description.toLowerCase().includes(lowerQuery) ||
        npc.biography.toLowerCase().includes(lowerQuery) ||
        npc.location.toLowerCase().includes(lowerQuery) ||
        npc.faction.toLowerCase().includes(lowerQuery),
    )
  },
}

