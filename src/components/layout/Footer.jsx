import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiOrcid, SiGooglescholar } from "react-icons/si";

const socials = [
  { label: "GitHub", href: "https://github.com/AFOEK", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/afoek", icon: FaLinkedin },
  { label: "ORCID", href: "https://orcid.org/0009-0005-4784-5777", icon: SiOrcid },
  { label: "Google Scholar", href: "https://scholar.google.ca/citations?hl=en&authuser=2&user=JyPYns0AAAAJ", icon: SiGooglescholar },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-8">
        <p className="text-sm text-white/40">© 2026 Felix Montalfu</p>
        <div className="flex items-center gap-5">
          {socials.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-white/40 transition-colors hover:text-white">
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}