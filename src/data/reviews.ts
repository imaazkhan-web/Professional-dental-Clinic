export interface Review {
  id: string;
  patientName: string;
  reviewText: string;
}

export const reviews: Review[] = [
  {
    id: "review-1",
    patientName: "Patient A",
    reviewText:
      "Very gentle cleaning session. The dentist took time to explain each step beforehand, which made the entire visit comfortable and stress-free.",
  },
  {
    id: "review-2",
    patientName: "Patient B",
    reviewText:
      "Clear explanation of treatment options and costs without any pressure. Highly professional environment and respectful staff.",
  },
  {
    id: "review-3",
    patientName: "Patient C",
    reviewText:
      "Prompt consultation for toothache. The clinic is clean, appointments run on time, and the staff is reassuring with nervous patients.",
  },
];

