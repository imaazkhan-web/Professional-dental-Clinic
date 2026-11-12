import { Hero } from "@/components/Hero";
import { Treatments } from "@/components/Treatments";
import { Dentist } from "@/components/Dentist";
import { Reviews } from "@/components/Reviews";
import { FindUs } from "@/components/FindUs";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      <Hero />
      <Treatments />
      <Dentist />
      <Reviews />
      <FindUs />
    </main>
  );
}
