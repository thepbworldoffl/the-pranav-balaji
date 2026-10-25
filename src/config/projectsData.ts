/**
 * ============================================================================
 * PB WORLD — PROJECTS & SERVICES MASTER CATALOG
 * ============================================================================
 * 
 * Contains all canonical project synopses, concept artwork paths, category
 * filters, and service disciplines for PB World.
 */

export type ProjectCategory = "Games" | "Animation & Film" | "VFX" | "Apps";

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  genre: string;
  oneLiner: string;
  status: string; // e.g. "Original Game Concept / Pre-Production"
  statusBadge: string;
  heroImage: string;
  aspectRatio?: string;
  targetDate?: string;
  trailerUrl?: string;
  order: number; // Games first, Animation & Film second
  overview: string;
  deepDiveSections?: {
    title: string;
    description: string;
    points?: string[];
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  disclaimer?: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  orderNumber: string;
  categoryTag: string;
  tagline: string;
  description: string;
  technicalCapabilities: string[];
  pipelineTools: string[];
  deliveryPhases: string[];
}

export const INITIAL_PROJECTS: ProjectDetail[] = [
  {
    id: "proj_aetherfall",
    slug: "aetherfall",
    title: "Aetherfall",
    category: "Games",
    genre: "3D Open-World Fantasy RPG",
    oneLiner: "An expansive, mythic fantasy realm where ancient ruins, towering elemental colossi, and forgotten magic converge.",
    status: "Original Game Concept / Pre-Production",
    statusBadge: "Pre-Production",
    heroImage: "/src/assets/images/aetherfall_concept_1792945952859.jpg",
    targetDate: "Planned Target: 25 December 2026",
    trailerUrl: "",
    order: 1, // Games in 1st position
    overview:
      "Aetherfall is an ambitious original 3D open-world fantasy action RPG currently in early conceptual pre-production. Set within the shattered continent of Aethergard, players step into a breathing wilderness sculpted by primordial titan energy. The project is being designed to harmonize solitary contemplative exploration with deep, responsive tactical combat and shared multiplayer adventures.",
    deepDiveSections: [
      {
        title: "The Living World of Aethergard",
        description:
          "Envisioned as a vast, seamless ecosystem featuring bioluminescent ancient canopies, windswept mountain citadels, subterranean crystal catacombs, and forgotten elemental temples. Dynamic weather fronts, realistic day-night cycles, and vertical terrain exploration form the foundational world design.",
        points: [
          "Multi-biome topography: Sunless Valleys, Whispering Groves, and the Spire of Zenith.",
          "Environmental navigation: Gliding mechanics, climbing surfaces, and tether physics.",
          "Atmospheric world simulation built around Unreal Engine 5 Nanite and Lumen technology.",
        ],
      },
      {
        title: "Combat Mechanics & Weapon Mastery",
        description:
          "Skill-based real-time combat emphasizing deliberate momentum, precision parrying, weapon switching, and elemental reactions. Weapons embody distinct weight profiles and martial arts traditions.",
        points: [
          "Arsenal: Colossal Greatswords, Dual Aether Daggers, Longbows with infused shafts, and Conduit Staves.",
          "Dynamic stagger gauges and limb-targeting systems against giant foes.",
          "Fluid synergy combining kinetic strikes with channeled elemental glyphs.",
        ],
      },
      {
        title: "Creatures & Titan Boss Encounters",
        description:
          "The wildlife of Aethergard ranges from solitary woodland guardians to continent-striding primordial colossi that demand multi-stage cooperative strategies.",
        points: [
          "Adaptive predator AI with territorial pack behavior and reactive threat levels.",
          "Epic multi-phase titan battles requiring environmental climbing and vulnerability timing.",
          "Creature research and codex system yielding tactical craftable concoctions.",
        ],
      },
      {
        title: "Progression & Gear Customization",
        description:
          "Player advancement combines classical skill trees with gear forging, relic attunement, and elemental resonance gems gathered from perilous deep dungeons.",
        points: [
          "Deep mastery paths allowing seamless hybridization between martial combat and spellcraft.",
          "Dungeon delves with shifting procedural modifiers, rare boss drops, and unique crafting reagents.",
          "Transmogrification and appearance customization rooted in in-world craftsmanship.",
        ],
      },
      {
        title: "Multiplayer Vision & Cooperative Play",
        description:
          "While fully enjoyable as a solo narrative journey, Aetherfall is engineered with a shared-world architecture allowing players to seamlessly invite allies for dungeon expeditions and world bosses.",
        points: [
          "Drop-in 4-player cooperative adventuring with level-scaling party balance.",
          "Shared sanctuary hubs where adventurers can trade reagents, forge alliances, and prepare expeditions.",
          "Long-term architectural goal: Cross-platform exploration across PC and high-end mobile devices.",
        ],
      },
      {
        title: "Development Roadmap & Target Milestones",
        description:
          "Transparent production stages currently mapped across pre-production, prototyping, and vertical slice execution.",
        points: [
          "Phase 1 (Current): Core world lore, character concept art, and greybox locomotion prototyping.",
          "Phase 2: Combat feel polish, single-biome vertical slice, and preliminary multiplayer netcode tests.",
          "Phase 3: Teaser trailer premiere target (25 December 2026, planned target).",
          "Phase 4: Community alpha testing milestones contingent upon development resources.",
        ],
      },
    ],
    specifications: [
      { label: "Target Platforms", value: "PC & High-End Mobile (Subject to technical feasibility)" },
      { label: "Core Engine", value: "Unreal Engine 5 (Planned)" },
      { label: "Visual Style", value: "Stylized Cinematic Realism" },
      { label: "Production Phase", value: "Concept Art & Systems Architecture" },
      { label: "Teaser Reveal", value: "Target: 25 December 2026 (Planned Target)" },
    ],
    disclaimer:
      "All gameplay systems, platform targets, and dates represent early pre-production creative targets and are subject to continuous iteration as development progresses.",
  },
  {
    id: "proj_stars_found_us",
    slug: "where-the-stars-found-us",
    title: "Where The Stars Found Us",
    category: "Animation & Film",
    genre: "Emotional Fantasy Romance",
    oneLiner: "A lonely young man encounters a mysterious light from beyond his world and discovers a connection that changes his understanding of life, love, and the universe.",
    status: "Upcoming Concept / In Development",
    statusBadge: "In Development",
    heroImage: "/src/assets/images/stars_found_us_concept_1792945953148.jpg",
    order: 2, // Animation Movies in 2nd position
    overview:
      "Where The Stars Found Us is an original feature animation project exploring vulnerability, isolation, and interstellar affinity. In a quiet, coastal town nestled beneath an eternal expanse of starlight, a solitary youth searching for purpose witnesses a warm, celestial radiance descended from the outer cosmos. What begins as an inexplicable phenomenon unfurls into an intimate bond that challenges the boundaries of distance, time, and human heart.",
    deepDiveSections: [
      {
        title: "Narrative Arc & Core Theme",
        description:
          "A delicate contemplation on loneliness in a hyperconnected universe. The film investigates how unexpected compassion can awaken a dormant spirit and restore one's faith in the beauty of life.",
        points: [
          "Intimate character-driven drama interwoven with poetic cosmic surrealism.",
          "Lush hand-crafted visual aesthetic combining painterly 2D backgrounds with 3D stylized lighting.",
          "An evocative acoustic and orchestral score exploring melancholy and boundless hope.",
        ],
      },
      {
        title: "Visual Language & Art Direction",
        description:
          "Influenced by golden hour twilight, deep indigo nightscapes, and warm luminescent starlight that guides the audience through the emotional tempo of the protagonists.",
        points: [
          "Color scripting that shifts from desaturated slate tones to vibrant celestial warmth.",
          "Volumetric lighting portraying the otherworldly visitor as an organic, living presence.",
          "Rich environmental depth highlighting coastal shores, wildflower meadows, and infinite skies.",
        ],
      },
    ],
    specifications: [
      { label: "Format", value: "Animated Feature Film Concept" },
      { label: "Visual Medium", value: "Hybrid 2.5D Stylized Cinematic Animation" },
      { label: "Production Stage", value: "Screenplay Treatment & Visual Development" },
      { label: "Target Audience", value: "Young Adult / General Audiences" },
    ],
    disclaimer: "Concept in creative development. Never presented as a completed film or released production.",
  },
  {
    id: "proj_dragon_world",
    slug: "the-dragon-world",
    title: "The Dragon World",
    category: "Animation & Film",
    genre: "Fantasy Adventure",
    oneLiner: "After a life-changing tragedy, a young man witnesses a dragon above a city and discovers a hidden world of masked warriors, monsters, and ancient forces threatening the balance between two worlds.",
    status: "Upcoming Concept / In Development",
    statusBadge: "In Development",
    heroImage: "/src/assets/images/the_dragon_world_concept_1792945954026.jpg",
    order: 3,
    overview:
      "The Dragon World is an epic fantasy adventure exploring grief, destiny, and hidden realms. In the wake of an unbearable personal loss, an ordinary young protagonist catches sight of a legendary serpentine dragon circling high above a smoke-shrouded modern metropolis. Following the creature's path breaches the veil into an ancient realm where order is guarded by masked warrior clans, primeval beasts roam unchained, and a dark forgotten conspiracy threatens to pull both worlds into catastrophe.",
    deepDiveSections: [
      {
        title: "Dual-World Mythology",
        description:
          "The narrative explores the stark juxtaposition between the mundane, steel-and-glass human world and the untamed, mythic majesty of the Dragon Realm.",
        points: [
          "The Masked Sentinels: Ancient guardian orders bound by solemn oaths of elemental balance.",
          "The Dragon Hierarchy: Primeval creatures possessing unique elemental wisdom rather than sheer savagery.",
          "High-stakes adventure focusing on courage, redemption, and overcoming paralyzing grief.",
        ],
      },
      {
        title: "Action Choreography & Cinematic Scope",
        description:
          "Dynamic camera angles, aerial dragon dogfights across towering architectural spires, and martial swordplay imbued with elemental momentum.",
        points: [
          "Fluid kinetic combat staging designed for cinematic impact.",
          "Colossal world scale contrasting human vulnerability against monumental beast architecture.",
          "Rich world lore featuring ancient scripts, clan insignias, and forgotten prophecies.",
        ],
      },
    ],
    specifications: [
      { label: "Format", value: "Animated Adventure Epic / Franchise Concept" },
      { label: "Visual Medium", value: "High-Fidelity 3D Stylized Cinematic Pipeline" },
      { label: "Production Stage", value: "World Codex & Storyboard Sequences" },
      { label: "Themes", value: "Resilience, Ancient Honor, Reconciliation" },
    ],
    disclaimer: "Concept in creative development. Never presented as a completed film or released production.",
  },
  {
    id: "proj_vampire_king",
    slug: "the-last-vampire-king",
    title: "The Last Vampire King",
    category: "Animation & Film",
    genre: "Supernatural Fantasy Adventure",
    oneLiner: "A young man living quietly in the modern world discovers an ancient supernatural heritage when a mysterious order begins searching for him.",
    status: "Upcoming Concept / In Development",
    statusBadge: "In Development",
    heroImage: "/src/assets/images/vampire_king_concept_1792945953928.jpg",
    order: 4,
    overview:
      "The Last Vampire King is a dark, regal supernatural adventure set in the shadows of modern civilization. Unbeknownst to himself, an unassuming young archivist carries the uncorrupted bloodline of the sovereign vampire monarchs who ruled centuries past. When a clandestine order of hunters and rebel vampire factions ignite a covert shadow war across European cities, he must embrace his latent sovereign powers to determine the future of two species.",
    deepDiveSections: [
      {
        title: "Gothic Modernism & Aristocratic Lore",
        description:
          "Combining atmospheric neo-gothic architecture, candlelit archives, and contemporary nocturnal intrigue.",
        points: [
          "The Bloodline Heritage: Royal supernatural abilities transcending traditional vampire folklore.",
          "The Inquisitorial Syndicate: A relentless ancient faction operating in the upper echelons of modern society.",
          "Moral complexity: Rejecting simple heroism in favor of complex political intrigue and survival.",
        ],
      },
      {
        title: "Cinematic Atmosphere & Production Design",
        description:
          "A moody, refined aesthetic characterized by moonlit stone arches, deep crimson velvet drapery, shadow play, and sleek modern action sequences.",
        points: [
          "Dramatic chiaroscuro lighting inspired by classic European cinema.",
          "Original heraldic iconography, royal seals, and ancestral armaments.",
          "Fast-paced nocturnal chase sequences and intense supernatural duels.",
        ],
      },
    ],
    specifications: [
      { label: "Format", value: "Supernatural Series / Feature Film Concept" },
      { label: "Visual Medium", value: "Cinematic Dark Fantasy Production" },
      { label: "Production Stage", value: "Lore Bible & Character Design" },
      { label: "Tone", value: "Nocturnal, Sophisticated, High Tension" },
    ],
    disclaimer: "Concept in creative development. Never presented as a completed film or released production.",
  },
];

export const SERVICES_CATALOG: ServiceDetail[] = [
  {
    id: "serv_game_dev",
    slug: "game-development",
    title: "Game Development",
    orderNumber: "01",
    categoryTag: "Interactive Systems",
    tagline: "Building immersive, player-driven worlds from pre-production to interactive reality.",
    description:
      "PB World approaches game development as the supreme confluence of storytelling, mechanics, and computational craft. We focus on original intellectual properties, innovative gameplay loops, and scalable cross-platform architectures with an initial focus on 3D open-world fantasy experiences.",
    technicalCapabilities: [
      "Unreal Engine 5 architectural design (Nanite, Lumen, Chaos Physics)",
      "Real-time combat system engineering and precision animation state machines",
      "Dynamic open-world biome generation, daylight scripting, and streaming optimization",
      "Multiplayer networking framework, client-server authority, and cooperative replication",
      "Cross-platform scalability planning across modern PC and high-end mobile architectures",
    ],
    pipelineTools: ["Unreal Engine 5", "C++", "Houdini Engine", "Blender", "Substance 3D", "Perforce"],
    deliveryPhases: ["Ideation & Codex", "Greybox Mechanics Prototyping", "Vertical Slice Production", "Multiplayer Netcode Hardening"],
  },
  {
    id: "serv_animation_film",
    slug: "animation-and-film",
    title: "Animation & Film",
    orderNumber: "02",
    categoryTag: "Cinematic Storytelling",
    tagline: "Translating human emotion and mythic imagination into breathtaking moving pictures.",
    description:
      "Our film and animation division conceives original cinematic stories with enduring emotional resonance. We bridge traditional artistic storytelling with cutting-edge real-time previs and stylized 3D rendering pipelines to bring evocative animated stories to life.",
    technicalCapabilities: [
      "Complete screenplay treatments, narrative architecture, and emotional beat mapping",
      "Character concept design, costume research, and expressional turnarounds",
      "Dynamic 2D/3D storyboarding and cinematic camera previz sequencing",
      "Stylized rendering pipelines blending painterly backgrounds with expressive 3D lighting",
      "Audio scripting, voice direction framework, and orchestral theme curation",
    ],
    pipelineTools: ["Storyboard Pro", "Blender", "Maya", "Unreal Engine CineCamera", "DaVinci Resolve", "Substance Painter"],
    deliveryPhases: ["Narrative Bible", "Concept & Color Scripting", "Animatic Previs", "High-Fidelity Assembly"],
  },
  {
    id: "serv_vfx",
    slug: "visual-effects",
    title: "Visual Effects (VFX)",
    orderNumber: "03",
    categoryTag: "Simulation & Reality",
    tagline: "Sculpting the invisible boundary between reality and fantastical spectacle.",
    description:
      "Visual Effects at PB World focuses on high-impact simulations, digital environments, and virtual production workflows. We craft photorealistic natural phenomena, otherworldly elemental magic, and seamless set extensions designed to elevate both games and motion pictures.",
    technicalCapabilities: [
      "Procedural environment generation and large-scale architectural set extensions",
      "Complex particle simulations: Smoke, pyroclastics, water bodies, and magical energy fields",
      "Virtual production LED volume calibration and real-time camera tracking synchronization",
      "Look development, multi-pass photorealistic lighting, and color grading integration",
      "Houdini procedural asset (HDA) pipelines for rapid environment authoring",
    ],
    pipelineTools: ["Houdini FX", "Nuke", "Unreal Engine Niagara", "ZBrush", "ACES Color Pipeline"],
    deliveryPhases: ["Lookdev & R&D", "Procedural Sim Setup", "Compositing Integration", "Master Color Pass"],
  },
  {
    id: "serv_app_dev",
    slug: "app-development",
    title: "App Development",
    orderNumber: "04",
    categoryTag: "Software & Tools",
    tagline: "Engineering resilient, high-performance software tools, portals, and interactive engines.",
    description:
      "Behind every world-class creative studio stands robust technology. PB World engineers full-stack applications, internal studio tooling, companion experiences, and web portals using clean, modern, zero-compromise engineering standards.",
    technicalCapabilities: [
      "High-performance responsive web portals with resilient server-side architectures",
      "Creative pipeline automation tools and asset version control dashboards",
      "Cross-platform client applications with smooth motion physics and intuitive interfaces",
      "Secure backend APIs with role-based access control and persistent database schemas",
      "Modern AI integration points for intelligent content analysis and media pipelines",
    ],
    pipelineTools: ["TypeScript", "React", "Node.js / Express", "Tailwind CSS", "Firebase / PostgreSQL", "Docker"],
    deliveryPhases: ["Architecture Blueprint", "Design System Implementation", "Full-Stack API Buildout", "Hardened Security Audit"],
  },
];
