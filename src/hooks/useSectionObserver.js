import { useEffect, useState } from "react";

export function useSectionObserver(containerRef, sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const id = visible[0].target.id;
        setActiveSection(id);

        sections.forEach((section) => section.classList.toggle("section-active", section.id === id));

        history.replaceState(null, "", `#${id}`);
      },
      {
        root,
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-15% 0px -15% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [containerRef, sectionIds]);

  return activeSection;
}