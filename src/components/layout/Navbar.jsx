import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/#home" },
  { label: "Research", href: "/#research" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Publications", href: "/#publications" },
  { label: "Writing", href: "/#blog" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.querySelector("#home");
    const scrollRoot = document.querySelector(".portfolio-scroll");

    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting &&
          entry.intersectionRatio > 0.05;

        setIsHeroVisible(visible);

        if (!visible) {
          setOpen(false);
        }
      },
      {
        root: scrollRoot,
        threshold: [0, 0.05, 0.1],
      }
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-[100]
        transition-all duration-500 ease-in-out
        ${
          isHeroVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <nav className="
        mx-auto flex w-full max-w-7xl
        items-center justify-between
        px-6 py-5 lg:px-8
      ">
        {/* Brand */}
        <a
          href="/#home"
          className="whitespace-nowrap text-sm font-semibold tracking-wide text-white"
          onClick={() => setOpen(false)}
        >
          Felix Montalfu
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                text-sm text-white/60
                transition-colors hover:text-white
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="
            flex size-10 items-center justify-center
            text-white/60 transition-colors
            hover:text-white md:hidden
          "
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="
          border-t border-white/[0.06]
          bg-background/95 px-6 py-5
          backdrop-blur-xl md:hidden
        ">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  rounded-md px-3 py-3
                  text-sm text-white/60
                  transition-colors
                  hover:bg-white/[0.03]
                  hover:text-white
                "
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
