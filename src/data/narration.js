export const NARRATION_DATA = {
  intro: {
    id: "intro",
    title: "Welcome to the Depths",
    script: "Prepare yourself for a journey unlike any other. Today, we will dive from the sunlit surface to the deepest trenches of our planet. As we descend, keep an eye on your HUD for vital statistics. Let us begin.",
  },
  sections: [
    {
      id: "sunlight",
      title: "Sunlight Zone",
      depth: "0 – 200m",
      script: "We are now in the Sunlight Zone. This is the only part of the ocean where photosynthesis is possible. It’s warm, vibrant, and home to ninety percent of all marine life. Look around at the dazzling array of species that thrive in these shallow waters.",
      elements: [
        { id: "dolphin", title: "Bottlenose Dolphin", script: "The Bottlenose Dolphin is highly intelligent and social, using sophisticated sonar to hunt and communicate." },
        { id: "turtle", title: "Green Sea Turtle", script: "These ancient mariners migrate thousands of miles between foraging and nesting grounds." }
      ]
    },
    {
      id: "twilight",
      title: "Twilight Zone",
      depth: "200 – 1000m",
      script: "As light fades, we enter the Twilight Zone. The water turns a deep, dim blue. Sunlight is too weak for photosynthesis here, so creatures rely on bioluminescence — light they generate themselves — to find prey and mates.",
      elements: [
        { id: "jellyfish", title: "Comb Jelly", script: "Comb jellies use rows of cilia to move, refracting light into shifting rainbow patterns." }
      ]
    },
    {
      id: "shipwreck",
      title: "The Resting Giant",
      depth: "1,450m",
      script: "At nearly fifteen hundred meters, we encounter the SS Azure. Lost in 1902, this iron hull has become a sanctuary for life that thrives in the heavy pressure of the deep. It is a skeletal witness to forgotten storms.",
    },
    {
      id: "midnight",
      title: "Midnight Zone",
      depth: "1000 – 4000m",
      script: "One thousand meters below. Total darkness begins. The temperature hovers near freezing, and the pressure is intense. Most life here depends on 'marine snow' — organic debris falling from the surface.",
      elements: [
        { id: "anglerfish", title: "Anglerfish", script: "The Anglerfish uses a glowing lure to attract prey in the absolute darkness of the midnight zone." }
      ]
    },
    {
      id: "abyss",
      title: "The Abyss",
      depth: "4000 – 6000m",
      script: "We have reached the Abyssal Zone. This is the vastest ecosystem on Earth. It is cold, still, and largely unexplored. In fact, we have better maps of the surface of Mars than we do of this ocean floor.",
    },
    {
      id: "hadal",
      title: "Hadal Zone",
      depth: "6000 – 11,000m",
      script: "Finally, we reach the Hadal Zone. Named after Hades, god of the underworld, these deepest trenches represent the absolute limits of exploration. The pressure here is over one thousand times that of the surface, yet life still chooses to endure in these silent depths.",
    }
  ],
  outro: {
    title: "Voyage Complete",
    script: "The descent is over, but the mysteries remain. You have reached the bottom of the world. From here, the journey takes us back toward the light. Thank you for diving with us today."
  }
};
