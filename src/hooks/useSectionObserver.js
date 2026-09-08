import { useEffect, useState } from "react";

export function useSectionObserver(containerRef, sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    let frame = null;

    const update = () => {
      frame = null;

      const rootRect = root.getBoundingClientRect();
      const center = rootRect.top + root.clientHeight / 2;

      let bestSection = sections[0];
      let bestDistance = Infinity;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= center && rect.bottom >= center) {
          bestSection = section;
          break;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - center);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestSection = section;
        }
      }

      if (!bestSection) return;

      sections.forEach((section) => {
        section.classList.toggle(
          "section-active",
          section === bestSection,
        );
      });

      const id = bestSection.id;

      setActiveSection((current) => {
        if (current === id) return current;

        history.replaceState(null, "", `#${id}`);
        return id;
      });
    };

    const handleScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };

    root.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    update();

    return () => {
      root.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [containerRef, sectionIds]);

  return activeSection;
}