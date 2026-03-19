"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Plus,
  Minus,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation, useNavigate } from "@/lib/router";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopCollections = [
  {
    title: "Living Room",
    id: "living-room",
    sub: "Sofas, accent chairs, coffee tables",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Bedroom",
    id: "bedroom",
    sub: "Beds, nightstands, soft textiles",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Dining Room",
    id: "dining-room",
    sub: "Tables, chairs, sideboards",
    img: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Decor",
    id: "decor",
    sub: "Lighting, ceramics, wall accents",
    img: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&q=80&w=1200",
  },
];

const Announcement = () => (
  <div className="fixed left-0 right-0 top-0 z-[1200] flex h-9 items-center overflow-hidden border-b border-white/10 bg-primary text-white/90">
    <div className="flex gap-10 whitespace-nowrap px-[100%] animate-marquee">
      {[1, 2].map((i) => (
        <React.Fragment key={i}>
          <span className="text-[11px] font-semibold tracking-wider sm:text-xs">
            <strong className="mr-2 uppercase tracking-[2px] text-secondary">
              Free Delivery
            </strong>
            on orders over ₹999
          </span>
          <span className="text-[11px] font-semibold tracking-wider sm:text-xs">
            <strong className="mr-2 uppercase tracking-[2px] text-secondary">
              Easy Returns
            </strong>
            within 14 days
          </span>
          <span className="text-[11px] font-semibold tracking-wider sm:text-xs">
            <strong className="mr-2 uppercase tracking-[2px] text-secondary">
              New
            </strong>
            The Velvet Retreat Collection
          </span>
          <span className="text-[11px] font-semibold tracking-wider sm:text-xs">
            <strong className="mr-2 uppercase tracking-[2px] text-secondary">
              White-Glove
            </strong>
            Assembly Available
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Navbar = ({
  theme,
  toggleTheme,
  onSearchOpen,
}: {
  theme: string;
  toggleTheme: () => void;
  onSearchOpen: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMegaOpen, setIsMobileMegaOpen] = useState(false);
  const { cartCount } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileMegaOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const desktopNavClass = (href: string) =>
    `relative inline-flex items-center py-2 text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-200 ${
      pathname === href ? "text-secondary" : "text-foreground hover:text-secondary"
    }`;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-9 z-[1100] h-[70px] border-b transition-all duration-200 sm:h-[74px] ${
          isScrolled
            ? "border-border bg-background/90 shadow-md backdrop-blur-md"
            : "border-border/70 bg-background/85 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-[5%]">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="select-none font-heading text-[20px] font-bold uppercase tracking-[2px] text-foreground xs:text-[22px] sm:text-[24px] lg:text-[28px]"
            >
           <img src="/assets/Image/nestcraft-logo.svg" alt="Logo" className="w-20 h-20" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                href="/shop"
                className={`group relative inline-flex items-center gap-1 py-2 text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-200 ${
                  isMegaMenuOpen || pathname === "/shop"
                    ? "text-secondary"
                    : "text-foreground hover:text-secondary"
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180" : ""
                  }`}
                />
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-secondary transition-all duration-200 ${
                    isMegaMenuOpen || pathname === "/shop"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="fixed left-1/2 top-[106px] z-[1150] w-[min(1180px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_25px_80px_rgba(0,0,0,0.18)]"
                  >
                    <div className="grid gap-6 p-5 lg:grid-cols-[280px_1fr] xl:gap-8 xl:p-6">
                      {/* intro */}
                      <div className="rounded-[22px] border border-border bg-muted/10 p-5 xl:p-6">
                        <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-secondary">
                          <span>Furniture</span>
                          <span className="opacity-50">•</span>
                          <span>Curated</span>
                        </div>

                        <h3 className="mt-3 font-heading text-[28px] font-bold leading-[1] text-foreground xl:text-[34px]">
                          Design-led essentials for every room.
                        </h3>

                        <p className="mt-3 max-w-[240px] text-sm font-semibold leading-6 text-muted">
                          Explore best-selling silhouettes, artisan materials,
                          and modern classics crafted for timeless living.
                        </p>

                        <Link
                          href="/shop"
                          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-5 text-[13px] font-semibold uppercase tracking-wider text-white transition-all hover:-translate-y-[1px] hover:bg-primary/90"
                        >
                          Explore Collections
                        </Link>
                      </div>

                      {/* cards */}
                      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-5">
                        {shopCollections.map((item) => (
                          <Link
                            key={item.title}
                            href={`/category/${item.id}`}
                            className="group block rounded-[20px] p-1 transition-all hover:bg-muted/10"
                          >
                            <div className="overflow-hidden rounded-[18px] border border-border bg-muted/10">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="h-[150px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.05] xl:h-[170px]"
                              />
                            </div>

                            <div className="pt-3">
                              <div className="font-heading text-[24px] font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-secondary">
                                {item.title}
                              </div>
                              <div className="mt-2 text-sm font-bold leading-6 text-muted">
                                {item.sub}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className={desktopNavClass(item.href)}>
                <span className="relative">
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-secondary transition-all duration-200 ${
                      pathname === item.href ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onSearchOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 sm:h-10 sm:w-10"
            >
              <Search size={18} />
            </button>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 sm:h-10 sm:w-10"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-secondary text-[9px] font-black text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* lg+ theme toggle with label */}
            <button
              onClick={toggleTheme}
              className="hidden lg:inline-flex h-[38px] items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 text-[11px] font-extrabold uppercase tracking-wider text-foreground transition-all hover:border-secondary/50"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-secondary" />
              ) : (
                <Moon size={16} className="text-secondary" />
              )}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* mobile / tablet icon-only theme toggle (< lg) */}
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground transition-all hover:border-secondary/50 lg:hidden sm:h-10 sm:w-10"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-secondary" />
              ) : (
                <Moon size={16} className="text-secondary" />
              )}
            </button>

            {/* hamburger — only visible below lg */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-all hover:bg-muted/10 lg:hidden sm:h-10 sm:w-10"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[106px] z-[1098] bg-black/45 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-[106px] z-[1099] h-[calc(100vh-106px)] w-[min(92vw,380px)] overflow-y-auto border-l border-border bg-background px-5 pb-8 pt-5 shadow-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-[2px] text-muted">
                  Menu
                </p>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 border-b border-border pb-4">
                <button
                  className="flex w-full items-center justify-between rounded-2xl px-1 py-3 text-left text-[13px] font-black uppercase tracking-[2px] text-foreground"
                  onClick={() => setIsMobileMegaOpen(!isMobileMegaOpen)}
                >
                  <span className="flex items-center gap-2">
                    Shop
                    <small className="text-[10px] tracking-[2px] text-muted">
                      Mega
                    </small>
                  </span>
                  {isMobileMegaOpen ? <Minus size={16} /> : <Plus size={16} />}
                </button>

                <AnimatePresence>
                  {isMobileMegaOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-3 pb-3">
                        {shopCollections.map((item) => (
                          <Link
                            key={item.title}
                            href={`/category/${item.id}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="rounded-[18px] border border-border bg-surface p-3 transition-all hover:border-secondary/40"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="h-16 w-16 rounded-xl object-cover"
                              />
                              <div>
                                <div className="font-heading text-[20px] font-bold leading-tight text-foreground">
                                  {item.title}
                                </div>
                                <small className="mt-1 block text-xs font-bold leading-5 text-muted">
                                  {item.sub}
                                </small>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                >
                  Shop <ArrowRight size={16} />
                </Link>

                <Link
                  href="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                >
                  Services <ArrowRight size={16} />
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                >
                  Journal <ArrowRight size={16} />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                >
                  About <ArrowRight size={16} />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-1 py-3 text-[13px] font-black uppercase tracking-[2px] text-foreground"
                >
                  Contact <ArrowRight size={16} />
                </Link>
              </div>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-[13px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-primary/90"
              >
                Book a Free Demo
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SearchOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredProducts =
    query.length > 1
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSelect = (id: number) => {
    navigate(`/product/${id}`);
    onClose();
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex flex-col items-center bg-background/95 px-4 pt-24 backdrop-blur-xl sm:px-[5%] sm:pt-32"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all hover:bg-surface sm:right-10 sm:top-10 sm:h-12 sm:w-12"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-3xl">
            <div className="relative mb-10 sm:mb-12">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted sm:left-6"
                size={22}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for furniture, decor, or collections..."
                className="h-16 w-full rounded-[24px] border border-border bg-surface pl-12 pr-4 text-lg font-bold outline-none transition-all placeholder:text-muted/30 focus:border-secondary sm:h-20 sm:pl-16 sm:pr-8 sm:text-2xl"
              />
            </div>

            <div className="space-y-8">
              {query.length > 1 ? (
                <>
                  <h4 className="text-[11px] font-black uppercase tracking-[3px] text-muted">
                    Search Results ({filteredProducts.length})
                  </h4>

                  <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 text-left transition-all hover:border-secondary sm:gap-6 sm:p-4"
                      >
                        <div className="h-16 w-14 overflow-hidden rounded-lg border border-border bg-background sm:h-20 sm:w-16">
                          <img
                            src={product.img}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold tracking-tight transition-colors group-hover:text-secondary sm:text-lg">
                            {product.title}
                          </p>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted sm:text-xs">
                            {product.category}
                          </p>
                        </div>
                        <div className="ml-auto text-sm font-black text-secondary sm:text-base">
                          {product.price}
                        </div>
                      </button>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="py-12 text-center">
                        <p className="text-lg font-bold text-muted sm:text-xl">
                          No results found for "{query}"
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-[11px] font-black uppercase tracking-[3px] text-muted">
                    Popular Categories
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {["Living Room", "Bedroom", "Dining Room", "Lighting", "Decor"].map(
                      (cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase().replace(" ", "-")}`}
                          onClick={onClose}
                          className="flex h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-bold transition-all hover:border-secondary hover:text-secondary sm:h-12 sm:px-6"
                        >
                          {cat}
                        </Link>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="border-t border-border bg-surface px-[5%] pb-10 pt-20">
    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-6">
        <Link
              href="/"
              className="select-none font-heading text-[20px] font-bold uppercase tracking-[2px] text-foreground xs:text-[22px] sm:text-[24px] lg:text-[28px]"
            >
           <img src="/assets/Image/nestcraft-logo.svg" alt="Logo" className="w-36  h-32" />
            </Link>
        <p className="max-w-[300px] font-semibold text-muted">
          Sculpting personal spaces with design-led essentials. Minimalist
          furniture crafted for the modern home.
        </p>
        <div className="flex gap-4">
          {[
            { name: "Instagram", icon: Instagram, url: "#" },
            { name: "Facebook", icon: Facebook, url: "#" },
            { name: "Twitter", icon: Twitter, url: "#" },
            { name: "Youtube", icon: Youtube, url: "#" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-secondary hover:text-secondary"
            >
              <span className="sr-only">{social.name}</span>
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Shop
        </h4>
        <ul className="space-y-4">
          {["Living Room", "Bedroom", "Dining Room", "Home Office", "Decor"].map(
            (item) => (
              <li key={item}>
                <Link
                  href="/shop"
                  className="font-bold text-muted transition-colors hover:text-secondary"
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Company
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Our Story", path: "/about" },
            { name: "Craftsmanship", path: "/about" },
            { name: "Sustainability", path: "/about" },
            { name: "Journal", path: "/blog" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-[11px] font-black uppercase tracking-[2px] text-foreground">
          Support
        </h4>
        <ul className="space-y-4">
          {[
            { name: "Shipping & Delivery", path: "/faq" },
            { name: "Returns & Exchanges", path: "/faq" },
            { name: "Care Guide", path: "/faq" },
            { name: "FAQ", path: "/faq" },
            { name: "Privacy Policy", path: "/faq" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="font-bold text-muted transition-colors hover:text-secondary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="huge-watermark">NESTCRAFT</div>

    <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-10 md:flex-row">
      <p className="text-[11px] font-black  tracking-[2px] text-muted">
        © 2026 NestCraft Interiors. All rights reserved.
      </p>
      <div className="flex items-center gap-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px] text-muted transition-colors hover:text-secondary"
        >
          Back to Top <ArrowUp size={14} />
        </button>
        <div className="hidden gap-8 md:flex">
          <a
            href="#"
            className="text-[11px] font-black uppercase tracking-[2px] text-muted transition-colors hover:text-secondary"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[11px] font-black uppercase tracking-[2px] text-muted transition-colors hover:text-secondary"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[11px] font-black uppercase tracking-[2px] text-muted transition-colors hover:text-secondary"
          >
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/30">
      <Announcement />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchOpen={() => setIsSearchOpen(true)}
      />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <main className="pt-[106px] sm:pt-[110px]">{children}</main>
      <Footer />
    </div>
  );
}