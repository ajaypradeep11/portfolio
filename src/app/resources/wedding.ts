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
  dressCode: "Floral & pastel — wear something that makes you feel beautiful",
  heroImage: "/images/wedding/hero.jpg",
  loveStoryImage: "/images/wedding/love-story.jpg",
  coupleImages: [
    "/images/couple/1.jpg",
    "/images/couple/2.jpg",
    "/images/couple/3.jpg",
    "/images/couple/4.jpg",
    "/images/couple/5.jpg",
    "/images/couple/6.jpg",
    "/images/couple/7.jpg",
    "/images/couple/8.jpg",
    "/images/couple/9.jpg",
    "/images/couple/10.jpg",
    "/images/couple/11.jpg",
    "/images/couple/12.jpg",
    "/images/couple/13.jpg",
    "/images/couple/14.jpg",
    "/images/couple/15.jpg",
    "/images/couple/16.jpg",
    "/images/couple/17.jpg",
    "/images/couple/18.jpg",
  ],
  hashtag: "#AjayAleena2026",
  location: "Thornhill, Ontario",
  rsvpDeadlineISO: "2026-05-17",
  loveStoryTitleLines: ["The Walk to", "Warehouse"],
  loveStorySinceYear: 2022,
  loveStory: [
    "She was waiting for the bus to the Warehouse — literally a 500-metre walk away. When I crossed paths with her, I asked why she'd stand around when she could just walk it. She said, 'Too much energy will be wasted.' So we started walking together.",
    "She asked what kind of TV shows I watch, and without flinching I said anime. She pulled a Saitama figure out of her bag — and that's where the love story began. We talked Jujutsu Kaisen the whole way, and here we are.",
  ],
  program: [
    { time: "3:00 PM", event: "Ceremony" },
    { time: "4:30 PM", event: "Cocktail Hour" },
    { time: "5:00 PM", event: "Reception" },
    { time: "5:30 PM", event: "Dinner" },
    { time: "6:00 PM", event: "Cake Cutting & Toasts" },
    { time: "6:30 PM", event: "Games" },
    { time: "7:00 PM", event: "DJ & Dancing" },
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
