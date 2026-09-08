import { useCallback, useState } from "react";

import { Mail, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { SiOrcid, SiGooglescholar } from "react-icons/si";
import ContactCircuit from "@/components/portfolio/ContactCircuit";
import PacmanTitle from "@/components/portfolio/PacmanTitle";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/AFOEK",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/afoek",
    icon: FaLinkedin,
  },
  {
    label: "ORCID",
    href: "https://orcid.org/0009-0005-4784-5777",
    icon: SiOrcid,
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.ca/citations?hl=en&authuser=2&user=JyPYns0AAAAJ",
    icon: SiGooglescholar,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/totmalone",
    icon: FaInstagram,
    },
];

export default function Contact() {
  const [eggRun, setEggRun] = useState(0);
  const [eggRunning, setEggRunning] = useState(false);

  const triggerPacman = useCallback(() => {
    if (eggRunning) return;

    setEggRunning(true);
    setEggRun((current) => current + 1);
  }, [eggRunning]);

  const finishPacman = useCallback(() => {
    setEggRunning(false);
  }, []);

  return (
    <section id="contact" className="page-section snap-start relative flex min-h-screen items-center overflow-hidden py-28 sm:py-36">
      <ContactCircuit onPulseClick={triggerPacman} />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-quantum-blue">
            04 / Contact
          </p>

          <PacmanTitle trigger={eggRun}  onComplete={finishPacman} />
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
            I&apos;m open to conversations around quantum computing, artificial intelligence, research collaboration, open-source work, and technical projects.
          </p>

          <a
            href="mailto:felix.montalfu@gmail.com"
            className="contact-focus group mt-10 inline-flex items-center gap-3 text-xl font-medium text-white transition-colors hover:text-quantum-green sm:text-2xl"
          >
            <Mail className="size-5 text-white/35 transition-colors group-hover:text-quantum-blue" />
            felix.montalfu@gmail.com
            <ArrowUpRight className="size-5 text-white/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <div className="mt-12 flex flex-wrap gap-6">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}