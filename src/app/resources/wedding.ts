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
  rsvpDeadlineISO: "2026-05-17",
} as const;

export type WeddingConfig = typeof wedding;
