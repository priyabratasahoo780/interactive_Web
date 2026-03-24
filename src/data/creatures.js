// ============================================================
// creatures.js — Ocean creature data for all depth zones
// ============================================================

const OCEAN_CREATURES = {
  sunlight: [
    {
      id: "dolphin",
      name: "Bottlenose Dolphin",
      depth: "10 – 100m",
      zone: "Sunlight Zone",
      glowColor: "#00d4ff",
      emoji: "🐬",
      facts: [
        "Can swim up to 37 km/h",
        "Communicate via complex clicks and whistles",
        "Live in pods of up to 30 dolphins",
        "Sleep with one eye open",
      ],
      description:
        "Intelligent and playful, dolphins are the acrobats of the sunlit ocean. They use echolocation to navigate and hunt in crystal-clear waters.",
    },
    {
      id: "sea-turtle",
      name: "Green Sea Turtle",
      depth: "0 – 40m",
      zone: "Sunlight Zone",
      glowColor: "#00ff88",
      emoji: "🐢",
      facts: [
        "Can live over 80 years",
        "Navigate using Earth's magnetic field",
        "Return to the same beach to nest",
        "Can hold breath for up to 7 hours",
      ],
      description:
        "Ancient mariners of the sea, green sea turtles have roamed the oceans for over 100 million years, gliding gracefully through sunlit waters.",
    },
    {
      id: "clownfish",
      name: "Clownfish",
      depth: "1 – 15m",
      zone: "Sunlight Zone",
      glowColor: "#ff6b35",
      emoji: "🐠",
      facts: [
        "Immune to anemone stings",
        "Can change gender from male to female",
        "Maintain a symbiotic bond with anemones",
        "Never stray far from their host anemone",
      ],
      description:
        "Famous for their orange-and-white stripes, clownfish live in symbiosis with sea anemones — a partnership of mutual protection.",
    },
  ],
  twilight: [
    {
      id: "anglerfish",
      name: "Anglerfish",
      depth: "200 – 1000m",
      zone: "Twilight Zone",
      glowColor: "#7b2fff",
      emoji: "🐡",
      facts: [
        "Bioluminescent lure attracts prey in darkness",
        "Males fuse permanently with females",
        "Can swallow prey twice their size",
        "One of the ugliest fish in the ocean",
      ],
      description:
        "The living lantern of the deep — the anglerfish dangles a glowing lure to attract prey in the pitch-black twilight zone.",
    },
    {
      id: "vampire-squid",
      name: "Vampire Squid",
      depth: "600 – 900m",
      zone: "Twilight Zone",
      glowColor: "#ff0055",
      emoji: "🦑",
      facts: [
        "Not actually a squid or an octopus",
        "Turns inside-out when threatened",
        "Covered in light-producing photophores",
        "Feeds on marine snow (organic particles)",
      ],
      description:
        "Despite its name, the vampire squid feeds on ocean snowflakes — tiny particles of organic matter drifting down from above.",
    },
    {
      id: "lanternfish",
      name: "Lanternfish",
      depth: "300 – 700m",
      zone: "Twilight Zone",
      glowColor: "#00ffcc",
      emoji: "🐟",
      facts: [
        "Make up 65% of all deep sea fish",
        "Migrate upward at night to feed",
        "Produce light via bioluminescence",
        "Their patterns are unique to each species",
      ],
      description:
        "Lanternfish are among the most abundant vertebrates on Earth, forming vast schools that create shimmering galaxies in the twilight zone.",
    },
  ],
  midnight: [
    {
      id: "viperfish",
      name: "Pacific Viperfish",
      depth: "1000 – 2800m",
      zone: "Midnight Zone",
      glowColor: "#ff4500",
      emoji: "🦈",
      facts: [
        "Hinged skull to consume large prey",
        "Photophores line their belly and sides",
        "Fang-like teeth never fully close",
        "Can paralyze prey on contact",
      ],
      description:
        "With teeth so large they can't close its mouth, the viperfish is one of the most ferocious predators in the midnight zone.",
    },
    {
      id: "giant-squid",
      name: "Giant Squid",
      depth: "1000 – 4000m",
      zone: "Midnight Zone",
      glowColor: "#ff69b4",
      emoji: "🦑",
      facts: [
        "Up to 13 meters long — largest invertebrate",
        "Eyes the size of dinner plates",
        "Natural enemy of the sperm whale",
        "First photographed alive in 2004",
      ],
      description:
        "The legendary kraken — the giant squid has inspired sea monster myths for centuries. Its dinner-plate eyes see in near-total darkness.",
    },
    {
      id: "dumbo-octopus",
      name: "Dumbo Octopus",
      depth: "1000 – 6000m",
      zone: "Midnight Zone",
      glowColor: "#ffd700",
      emoji: "🐙",
      facts: [
        "Named after Disney's Dumbo for ear-like fins",
        "Deepest known octopus",
        "Flap fins to swim like an elephant flapping ears",
        "Swallow prey whole — no radula in deepest species",
      ],
      description:
        "The cutest creature in the deep sea, the dumbo octopus uses ear-like fins to hover gracefully at depths no other octopus can reach.",
    },
  ],
  abyss: [
    {
      id: "sea-pig",
      name: "Sea Pig",
      depth: "4000 – 6000m",
      zone: "Abyssal Zone",
      glowColor: "#ff99cc",
      emoji: "🐷",
      facts: [
        "A type of sea cucumber (Scotoplanes)",
        "Walks on tube legs across the ocean floor",
        "Feeds on the sunken detritus from above",
        "Harvests decomposing matter for nutrients",
      ],
      description:
        "Swimming through absolute darkness, sea pigs walk the ocean floor like underwater piglets, vacuuming up nutrients from the sediment.",
    },
    {
      id: "barreleye",
      name: "Barreleye Fish",
      depth: "600 – 4000m",
      zone: "Abyssal Zone",
      glowColor: "#00ffff",
      emoji: "🐠",
      facts: [
        "Transparent dome head",
        "Rotatable tubular eyes",
        "Eyes glow green and face upward",
        "Steal food from siphonophores",
      ],
      description:
        "The barreleye fish has a transparent head filled with fluid — a window through which its glowing, rotating eyes hunt for silhouetted prey above.",
    },
  ],
  hadal: [
    {
      id: "mariana-snailfish",
      name: "Mariana Snailfish",
      depth: "6000 – 8200m",
      zone: "Hadal Zone",
      glowColor: "#e0e0e0",
      emoji: "🐟",
      facts: [
        "Deepest living fish ever recorded",
        "Body is nearly transparent under lights",
        "Bones are thin and flexible to resist pressure",
        "Can survive pressure equivalent to 1,600 elephants",
      ],
      description:
        "The undisputed king of the trenches — the Mariana snailfish survives at depths where most life is crushed by the overwhelming weight of the ocean.",
    },
    {
      id: "giant-amphipod",
      name: "Giant Amphipod",
      depth: "6000 – 10000m",
      zone: "Hadal Zone",
      glowColor: "#ffccaa",
      emoji: "🦐",
      facts: [
        "Can grow up to 34cm — giant for an amphipod",
        "Scavengers that eat anything that sinks",
        "Have evolved to withstand extreme pressure",
        "Lack pigments, appearing ghostly white",
      ],
      description:
        "These 'super-giant' scavengers roam the deepest trenches, cleaning the ocean floor of whatever organic matter drifts down from the world above.",
    },
  ],
};

const ZONE_CONFIG = {
  surface: { name: "Ocean Surface", depth: 0, color: "#0099dd", bgStart: "#87ceeb", bgEnd: "#0099dd" },
  sunlight: { name: "Sunlight Zone", depth: 200, color: "#0077b6", bgStart: "#0099dd", bgEnd: "#0077b6" },
  twilight: { name: "Twilight Zone", depth: 1000, color: "#023e8a", bgStart: "#0077b6", bgEnd: "#023e8a" },
  midnight: { name: "Midnight Zone", depth: 4000, color: "#03045e", bgStart: "#023e8a", bgEnd: "#03045e" },
  abyss: { name: "Abyssal Zone", depth: 6000, color: "#000010", bgStart: "#03045e", bgEnd: "#000010" },
  hadal: { name: "Hadal Zone", depth: 11000, color: "#000000", bgStart: "#000010", bgEnd: "#000000" },
};

export { OCEAN_CREATURES, ZONE_CONFIG };
