export interface Treatment {
  slug: string;
  title: string;
  shortDescription: string;
  duration: string;
  overview: string;
  whatToExpect: string[];
}

export const treatments: Treatment[] = [
  {
    slug: "checkup-and-cleaning",
    title: "Checkup and cleaning",
    shortDescription:
      "Routine oral examination and gentle plaque removal to help keep your teeth and gums healthy.",
    duration: "30–45 mins",
    overview:
      "A comprehensive preventive visit focusing on oral health assessment and professional cleaning. Regular checkups help identify potential concerns early in a calm, comfortable environment.",
    whatToExpect: [
      "Visual assessment of teeth, gums, and oral tissues",
      "Gentle ultrasonic plaque and tartar removal",
      "Professional tooth polishing and flossing",
      "Clear explanation of daily oral care suggestions",
    ],
  },
  {
    slug: "fillings-and-root-canal",
    title: "Fillings and root canal",
    shortDescription:
      "Careful restoration for cavities and gentle treatment to relieve toothache and save natural teeth.",
    duration: "45–60 mins",
    overview:
      "Restorative care to repair decayed teeth and relieve discomfort caused by infected tooth pulp. The procedure is performed gently under local numbing to preserve your natural smile.",
    whatToExpect: [
      "Targeted numbing for treatment comfort",
      "Gentle removal of decay or infected pulp tissue",
      "Disinfection and filling or sealing with dental materials",
      "Step-by-step guidance on aftercare and chewing recovery",
    ],
  },
  {
    slug: "teeth-whitening",
    title: "Whitening",
    shortDescription:
      "In-clinic brightening sessions designed to lighten everyday tooth stains and discoloration safely.",
    duration: "45 mins",
    overview:
      "In-clinic aesthetic brightening designed to lift everyday food, tea, and coffee stains. Safe enamel application overseen by clinical staff ensures balanced, natural results.",
    whatToExpect: [
      "Shade evaluation and gum barrier protection",
      "Application of professional dental brightening gel",
      "Controlled activation under gentle clinical lighting",
      "Advice on maintaining enamel cleanliness after the session",
    ],
  },
  {
    slug: "braces-and-aligners",
    title: "Braces and aligners",
    shortDescription:
      "Orthodontic options for teeth straightening and bite alignment suitable for teens and adults.",
    duration: "30 mins",
    overview:
      "Personalized orthodontic evaluation exploring traditional brackets or clear aligner options. Designed to improve dental alignment, spacing, and long-term bite function.",
    whatToExpect: [
      "Initial facial and dental alignment inspection",
      "Discussion of metal, ceramic, or clear aligner alternatives",
      "Digital or physical dental impressions if needed",
      "Clear overview of estimated timeline and appointment intervals",
    ],
  },
  {
    slug: "implants-and-crowns",
    title: "Implants and crowns",
    shortDescription:
      "Durable replacements for missing or broken teeth to restore your natural chewing and smile.",
    duration: "45–60 mins",
    overview:
      "Long-lasting tooth replacement solutions to restore natural biting strength and aesthetics. Ideal for individual missing teeth, chipped edges, or heavily restored areas.",
    whatToExpect: [
      "Detailed jaw and tooth condition assessment",
      "Discussion of custom crown material or implant steps",
      "Comfortable fitting and bite coordination",
      "Long-term maintenance and hygiene recommendations",
    ],
  },
  {
    slug: "childrens-dentistry",
    title: "Children's dentistry",
    shortDescription:
      "A friendly, gentle dental experience designed to help young children feel calm and confident.",
    duration: "30 mins",
    overview:
      "Gentle, child-centered dental appointments focused on building positive dental visits from an early age. Our team takes extra time to explain every tool simply and calmly.",
    whatToExpect: [
      "Welcoming, child-paced introductory visit",
      "Gentle tooth count and decay check",
      "Simple brushing and dietary hygiene tips for parents",
      "Positive reinforcement to encourage confident future visits",
    ],
  },
];
