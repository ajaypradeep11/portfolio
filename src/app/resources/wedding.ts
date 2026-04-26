// src/app/resources/wedding.ts
export const wedding = {
  couple: {
    primary: "Ajay",
    partner: "Aleena",
  },
  dateISO: "2026-05-31",
  dateDisplay: "May 31, 2026",
  time: "3:00 PM ceremony",
  venue: {
    name: "Heintzman House",
    address: "135 Bay Thorn Dr, Thornhill, ON L3T 3V1",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Heintzman+House+135+Bay+Thorn+Dr+Thornhill+ON",
  },
  dressCode: "Traditional",
  heroImage: "/images/wedding/hero.jpg",
  loveStoryImage: "/images/wedding/love-story.jpg",
  hashtag: "#AjayAleena2026",
  rsvpDeadlineISO: "2026-05-17",
  loveStory: [
    "Write a paragraph here that tells your story as a couple — how you met, your journey together, and what makes your relationship special.",
    "This is the spot to share your personality and connect with your guests — a glimpse into your love story and what this day means to you.",
  ],
  program: [
    { time: "5:00 PM", event: "Welcome Photos & Cocktails" },
    { time: "6:00 PM", event: "Dinner Program" },
    { time: "7:00 PM", event: "Toasts & Speeches" },
    { time: "8:00 PM", event: "Official Picture Taking" },
    { time: "9:00 PM", event: "Open Bar & Dancing" },
  ],
  reception: [
    {
      heading: "Reception Venue",
      body:
        "Our reception will take place at Heintzman House — a heritage venue with garden grounds. Expect indoor seating with a flowing outdoor space.",
    },
    {
      heading: "Dress Code",
      body:
        "Traditional. Comfortable shoes recommended — the venue includes outdoor pathways.",
    },
    {
      heading: "Parking & Directions",
      body:
        "Free on-site parking is available. If you need accessible parking or a drop-off closer to the entrance, just let us know.",
    },
  ],
} as const;

export type WeddingConfig = typeof wedding;
