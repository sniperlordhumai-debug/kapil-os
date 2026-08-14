import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { SkillVault } from "@/components/sections/SkillVault";
import { ProjectLab } from "@/components/sections/ProjectLab";
import { CertificateVault } from "@/components/sections/CertificateVault";
import { BuildActivity } from "@/components/sections/BuildActivity";
import { Journey } from "@/components/sections/Journey";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <SkillVault />
      <ProjectLab />
      <CertificateVault />
      <Journey />
      <BuildActivity />
      <Resume />
      <Contact />
    </>
  );
}
