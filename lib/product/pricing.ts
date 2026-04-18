export const USER_PLANS = {
  free: {
    name: "Free tier",
    cadence: "Bi-weekly matches",
    price: "$0/month",
  },
  premium: {
    name: "Premium tier",
    cadence: "Daily matches",
    priceRange: "$8–$15/month",
  },
} as const;

export const AREA_DIRECTOR_ACTIVATION_FEE = "Area directors pay a one-time activation fee when a new area is spun up.";

export const EVENT_PAYMENTS_NOTE = "Event payments can be layered in later if needed.";
