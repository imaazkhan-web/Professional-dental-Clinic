// Use environment variable in production, fallback to local development URL
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Professional Dental Clinic",
  tagline: "Gentle dental care, explained clearly.",
  description:
    "Comprehensive family and cosmetic dentistry in a calm, professional clinic. We explain the plan and costs before starting.",
  url: siteUrl,
  phone: "(0300) 1234567",
  phoneRaw: "+923001234567",
  whatsappRaw: "923001234567",
  email: "info@professional.dentalclinic",
  address: {
    street: "Main Boulevard, Phase 5 DHA",
    city: "Lahore",
    country: "Pakistan",
    formatted: "Main Boulevard, Phase 5 DHA, Lahore, Pakistan",
  },
  hours: {
    monSat: "Mon–Sat 9:00 AM – 9:00 PM",
    sunday: "Sunday: Emergency On-Call Only",
  },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Phase+5+DHA+Lahore",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.498305886477!2d74.4020!3d31.4680!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI4JzA0LjgiTiA3NMKwMjQnMDcuMiJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
};
