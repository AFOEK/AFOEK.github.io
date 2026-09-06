const links = [
    { label: "Home", href: "/#home" },
    { label: "Research", href: "/#research" },
    { label: "Publications", href: "/#publications" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  return (
    <nav className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="/#home" className="text-sm font-semibold tracking-wide text-white">Felix Montalfu</a>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">{link.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}