"use client";
import React from "react";
import Link from "next/link";

// Terminology note:
// This is a responsive, collapsible sidebar (aka navigation rail when thin).
// On mobile it is hidden and can be toggled with a hamburger button.

interface SidebarProps {
  nav?: Array<{ href: string; label: string; icon?: React.ReactNode }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  nav = [
    { href: "/", label: "Home", icon: "H" },
    { href: "/pages/kanjis", label: "Kanjis", icon: "K" },
    { href: "/pages/story", label: "Stories", icon: "S" },
  ],
}) => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  const toggle = () => setOpen((o) => !o);

  // Prevent background scroll when mobile menu open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="app-sidebar"
        onClick={toggle}
        className="md:hidden fixed top-2 left-2 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md bg-foreground/10 backdrop-blur text-foreground hover:bg-foreground/20 transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-foreground/40"
      >
        <span className="sr-only">Toggle navigation</span>
        <span
          className={`relative block h-4 w-6 before:absolute before:left-0 before:top-0 before:h-0.5 before:w-full before:bg-current before:transition-all before:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-current after:transition-all after:content-[''] ${
            open
              ? "before:translate-y-2 before:rotate-45 after:-translate-y-2 after:-rotate-45"
              : "before:translate-y-0 after:translate-y-0"
          }`}
        >
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
        </span>
      </button>

      {/* Overlay when sidebar open on mobile */}
      {open && (
        <div
          onClick={close}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar (always visible) + mobile slide panel */}
      <nav
        id="app-sidebar"
        className={`group fixed md:static left-0 top-0 z-50 md:z-auto h-full md:h-auto flex flex-col border-r border-foreground/15 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-52 transition-transform duration-300 will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2 p-4 ">
          <span className="text-lg font-semibold select-none">KT</span>
        </div>
        <ul className="flex-1 flex flex-col gap-2 px-2 ">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                className="group/item flex items-center gap-3 rounded-md p-2 text-sm font-medium text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                {/* Icon placeholder */}
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground/10 text-xs font-bold">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
