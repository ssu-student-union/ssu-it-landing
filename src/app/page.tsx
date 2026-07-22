import { About } from "./_components/About";
import { Faq } from "./_components/Faq";
import { DARK_SECTION_GRADIENT } from "./_components/gradients";
import { Hero } from "./_components/Hero";
import { MainProjects } from "./_components/MainProjects";
import { PartIntro } from "./_components/PartIntro";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <div
        className="relative overflow-hidden"
        style={{ backgroundImage: DARK_SECTION_GRADIENT }}
      >
        <PartIntro />
        <MainProjects />
      </div>
      <Faq />
    </main>
  );
}
