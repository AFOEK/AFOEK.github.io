import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "jy4qYmf3TxA";

export default function DebugPrank() {
  const [active, setActive] = useState(false);
  const originalTitle = useRef(document.title);
  const bypassRef = useRef(sessionStorage.getItem("debug-prank-bypass") === "true");

  const trigger = async () => {
    if (active || bypassRef.current) return;

    setActive(true);
    document.title = "Look somebody try become hacker";

    try {
        await document.documentElement.requestFullscreen?.();
    } catch {
        // Browser may block fullscreen.
    }
    };

  useEffect(() => {
    const handleKeyDown = (event) => {
        const key = event.key.toLowerCase();

        const bypassShortcut =
            event.ctrlKey &&
            event.altKey &&
            event.shiftKey &&
            key === "p";

        if (bypassShortcut) {
            bypassRef.current = !bypassRef.current;

            if (bypassRef.current) {
            sessionStorage.setItem("debug-prank-bypass", "true");
            console.log("Debug prank bypass enabled.");
            } else {
            sessionStorage.removeItem("debug-prank-bypass");
            console.log("Debug prank bypass disabled.");
            }

            return;
        }

        const devtoolsShortcut =
            event.key === "F12" ||
            (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
            (event.metaKey && event.altKey && ["i", "j", "c"].includes(key));

        if (devtoolsShortcut && !bypassRef.current) trigger();
        };

    const detectDevTools = () => {
        if (bypassRef.current) return;
        if (window.innerWidth < 768) return;

        const threshold = 180;
        const widthGap = window.outerWidth - window.innerWidth > threshold;
        const heightGap = window.outerHeight - window.innerHeight > threshold;

        if (widthGap || heightGap) trigger();
    };

    window.addEventListener("keydown", handleKeyDown);

    const detector = window.setInterval(detectDevTools, 1000);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearInterval(detector);
      document.title = originalTitle.current;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=0&controls=0&rel=0&playsinline=0`}
        title="Debug easter egg"
        allow="autoplay; fullscreen"
        allowFullScreen
      />

      <button
        type="button"
        onClick={() => {
          setActive(false);
          document.title = originalTitle.current;

          if (document.fullscreenElement) {
            document.exitFullscreen?.();
          }
        }}
        className="absolute right-4 top-4 z-10 rounded-md bg-black/50 px-3 py-2 text-xs text-white/40 opacity-0 transition-opacity hover:opacity-100"
      >
        Exit
      </button>
    </div>
  );
}