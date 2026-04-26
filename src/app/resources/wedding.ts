// src/app/resources/wedding.ts
export const wedding = {
  couple: {
    primary: "Ajay",
    partner: "Aleena",
  },
  dateISO: "2026-12-31",
  dateDisplay: "December 31, 2026",
  time: "5:00 PM onwards",
  venue: {
    name: "Venue Name",
    address: "123 Street, City, State",
    mapUrl: "https://maps.google.com/?q=Venue+Name",
  },
  dressCode: "Traditional",
  heroImage: "/images/wedding/hero.jpg",
  rsvpDeadlineISO: "2026-11-30",
} as const;

export type WeddingConfig = typeof wedding;
