"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Shield,
  Truck,
  Tag,
  Award,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  MessageCircle,
  ArrowLeft,
  Send,
  Check,
  Menu,
  X,
  Clock,
  Sparkles,
  HelpCircle,
  ShoppingBag
} from "lucide-react";

interface LandingClientProps {
  aboutUsEntries?: any[];
  contactInfos?: any[];
  faqs?: any[];
  ads?: any[];
  hasError?: boolean;
}

export function LandingClient({
  aboutUsEntries = [],
  contactInfos = [],
  faqs = [],
  ads = []
}: LandingClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    }, 1200);
  };

  // Find active WhatsApp contact
  const activeContacts = (contactInfos || []).filter((c) => c && c.is_active);
  const whatsappContact = activeContacts.find((c) => c.type === "whatsapp");
  const whatsappVal = whatsappContact ? (whatsappContact.value_en || whatsappContact.value_ar) : "967777123456";
  const whatsappClean = (whatsappVal || "967777123456").replace(/\s+/g, "").replace("+", "");
  const whatsappUrl = `https://wa.me/${whatsappClean}`;

  // Default fallback contacts if backend is empty
  const defaultContacts = [
    {
      id: "def-phone",
      type: "phone",
      title_ar: "رقم الهاتف",
      title_en: "Phone Number",
      value_ar: "+967 777 123 456",
      value_en: "+967 777 123 456",
    },
    {
      id: "def-email",
      type: "email",
      title_ar: "البريد الإلكتروني",
      title_en: "Email Address",
      value_ar: "info@al-bairaq.com",
      value_en: "info@al-bairaq.com",
    },
    {
      id: "def-loc",
      type: "location",
      title_ar: "العنوان الرئيسي",
      title_en: "Location",
      value_ar: "اليمن - حضرموت - تريم",
      value_en: "Yemen - Hadramout - Tarim",
    },
  ];

  const displayedContacts = activeContacts.length > 0 ? activeContacts : defaultContacts;

  // Apple App Store Icon SVG
  const AppleIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08 2.15-.52 2.81-1.33z" />
    </svg>
  );

  // Google Play Icon SVG
  const GooglePlayIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M5 3.25c-.28 0-.5.22-.5.5v16.5c0 .28.22.5.5.5h.12l9.63-9.63L5.12 3.25H5zm1.5 1.4l7.53 7.53-7.53 7.53V4.65zm9.12 6.6l3.23-3.23c.39-.39.39-1.02 0-1.41l-.12-.12a1.003 1.003 0 0 0-1.41 0l-2.65 2.65 2.12 2.12c.31.31.55.07.83-.01zm-.7 2.12l-2.12-2.12-7.53 7.53h.12c.28 0 .5-.22.5-.5V13.37zm8.58-2.62a1.996 1.996 0 0 1 0 2.83l-3.65 3.65-2.12-2.12 3.65-3.65c.78-.78 2.12-.71 2.12 1.29z" />
    </svg>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col text-right selection:bg-brand selection:text-white scroll-smooth" dir="rtl" id="home">
      
      {/* 1. Header / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#111111]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white p-1.5 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="البيرق ماركت"
                  width={42}
                  height={42}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient-gold tracking-wide leading-tight">البيرق ماركت</span>
                <span className="text-[10px] text-gray-400 -mt-1 font-semibold">AL-BAIRAQ MARKET</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "home")}
              className="text-sm font-medium text-white hover:text-brand transition-colors relative group py-2"
            >
              الرئيسية
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, "about")}
              className="text-sm font-medium text-gray-300 hover:text-brand transition-colors relative group py-2"
            >
              من نحن
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#services"
              onClick={(e) => scrollToSection(e, "services")}
              className="text-sm font-medium text-gray-300 hover:text-brand transition-colors relative group py-2"
            >
              خدماتنا
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
            </a>
            {faqs && faqs.filter((f) => f && f.is_active).length > 0 && (
              <a
                href="#faqs"
                onClick={(e) => scrollToSection(e, "faqs")}
                className="text-sm font-medium text-gray-300 hover:text-brand transition-colors relative group py-2"
              >
                الأسئلة الشائعة
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
              </a>
            )}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "contact")}
              className="text-sm font-medium text-gray-300 hover:text-brand transition-colors relative group py-2"
            >
              تواصل معنا
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Admin Login Button */}
          <div className="hidden md:block">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand text-brand hover:bg-brand hover:text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>دخول الأدمن</span>
            </Link>
          </div>

          {/* Mobile Menu Burger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-brand p-1.5 rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#161616] border-b border-white/10 shadow-2xl py-6 px-4">
            <nav className="flex flex-col gap-4 mb-6">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, "home")}
                className="text-white hover:text-brand text-right font-medium py-2 border-b border-white/5"
              >
                الرئيسية
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, "about")}
                className="text-gray-300 hover:text-brand text-right font-medium py-2 border-b border-white/5"
              >
                من نحن
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="text-gray-300 hover:text-brand text-right font-medium py-2 border-b border-white/5"
              >
                خدماتنا
              </a>
              {faqs && faqs.filter((f) => f && f.is_active).length > 0 && (
                <a
                  href="#faqs"
                  onClick={(e) => scrollToSection(e, "faqs")}
                  className="text-gray-300 hover:text-brand text-right font-medium py-2 border-b border-white/5"
                >
                  الأسئلة الشائعة
                </a>
              )}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="text-gray-300 hover:text-brand text-right font-medium py-2"
              >
                تواصل معنا
              </a>
            </nav>
            <div className="w-full">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand text-white font-semibold transition-all duration-300 shadow-md shadow-brand/20 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>دخول الأدمن</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center bg-[#111111] overflow-hidden pt-28 pb-16 lg:py-0">
        
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg_hero.jpg"
            alt="البيرق ماركت"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/85 to-[#111111]/60"></div>
          {/* Subtle gold spotlight in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/15 blur-[140px] rounded-full pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Right Column: Title and Details */}
            <div className="lg:col-span-7 text-right space-y-8 lg:pr-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-semibold backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تطبيق البيرق الذكي متوفر الآن</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                تجربة تسوّق
                <span className="block text-gradient-gold mt-2 select-none">أذكى وأسهل</span>
              </h1>
              
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                كل احتياجاتك اليومية والغذائية من مكان واحد. نوفر لك منتجات طازجة عالية الجودة، بأسعار تنافسية لا تقبل المنافسة، مع خدمة التوصيل السريع مباشرة إلى باب بيتك.
              </p>

              {/* Row of Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                
                {/* Feature 1 */}
                <div className="bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-all duration-300 rounded-2xl p-4 text-center group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand/15 flex items-center justify-center text-brand mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">تسوق آمن</h3>
                  <p className="text-gray-400 text-xs">حماية بياناتك بالكامل</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-all duration-300 rounded-2xl p-4 text-center group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand/15 flex items-center justify-center text-brand mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">توصيل سريع</h3>
                  <p className="text-gray-400 text-xs">مباشرة إلى باب بيتك</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-all duration-300 rounded-2xl p-4 text-center group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand/15 flex items-center justify-center text-brand mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Tag className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">أفضل الأسعار</h3>
                  <p className="text-gray-400 text-xs font-medium">عروض وتخفيضات يومية</p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-all duration-300 rounded-2xl p-4 text-center group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-brand/15 flex items-center justify-center text-brand mb-3 transition-transform duration-300 group-hover:scale-110">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">جودة مضمونة</h3>
                  <p className="text-gray-400 text-xs">منتجات طازجة ومختارة</p>
                </div>

              </div>
            </div>

            {/* Left Column: Ultra-Luxurious Hero Mockup Image Presentation */}
            <div className="lg:col-span-5 flex items-center justify-center relative w-full">
              <div className="relative w-full max-w-[540px] lg:max-w-none flex items-center justify-center">
                
                {/* Ambient Golden Glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand/35 via-yellow-500/20 to-brand/10 blur-3xl rounded-3xl opacity-80 pointer-events-none -z-10 animate-pulse"></div>
                
                {/* Premium Frame Wrapper */}
                <div
                  className="relative w-full rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-white/15 via-white/5 to-black/70 border border-white/20 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-brand/40 group"
                  style={{ animation: "float 6s ease-in-out infinite" }}
                >
                  {/* Image container with fixed intrinsic aspect ratio */}
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-inner flex items-center justify-center">
                    <Image
                      src="/hero_mockup.jpg"
                      alt="تطبيق البيرق ماركت والتسوق الفاخر"
                      width={680}
                      height={520}
                      className="w-full h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105 rounded-2xl block"
                      priority
                    />
                    {/* Soft reflective lighting overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none rounded-2xl"></div>
                  </div>

                  {/* Floating Badge 1 (Top Left) */}
                  <div className="absolute -top-3.5 -left-3.5 bg-[#161616]/95 border border-white/20 backdrop-blur-md text-white py-1.5 px-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-transform duration-300 group-hover:-translate-y-1">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                    </span>
                    <span>تجربة تسوق فاخرة</span>
                  </div>

                  {/* Floating Badge 2 (Bottom Right) */}
                  <div className="absolute -bottom-3.5 -right-3.5 bg-[#161616]/95 border border-brand/40 backdrop-blur-md text-white py-2 px-4 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-transform duration-300 group-hover:translate-y-1">
                    <div className="w-6 h-6 rounded-lg bg-brand/20 flex items-center justify-center text-brand">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-gray-400 leading-none">تطبيق البيرق</span>
                      <span className="block text-xs font-bold text-gradient-gold">أسرع وأسهل طلب</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Scroll Down Smooth Arrow Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, "about")}
            className="w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:border-brand hover:bg-brand/15 flex items-center justify-center text-white hover:text-brand transition-all duration-300 shadow-lg backdrop-blur-md animate-bounce hover:animate-none hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="الانتقال لأسفل"
            title="الانتقال لأسفل"
          >
            <ChevronDown className="w-5 h-5 transition-transform duration-300" />
          </a>
        </div>
      </section>

      {/* CSS Float Animation Style Block */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* 3. Info Cards Section (About Us, Download App, Contact Us) */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 relative" id="about">
        
        {/* Subtle decorative background blur */}
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: تواصل معنا */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[500px]" id="contact">
              <div>
                <span className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand/10 text-brand mb-6 shadow-sm">
                  <Phone className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">تواصل معنا</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  يسعدنا استقبال مقترحاتكم والرد على جميع استفساراتكم على مدار الساعة.
                </p>

                {/* Contact details */}
                <div className="space-y-5">
                  {displayedContacts.map((contact) => {
                    let href = "";
                    let icon = <Phone className="w-4 h-4" />;
                    let label = contact.title_ar || contact.title_en;
                    let value = contact.value_ar || contact.value_en;

                    if (contact.type === "phone" || contact.type === "telephone") {
                      href = `tel:${contact.value_en || contact.value_ar}`;
                      icon = <Phone className="w-4 h-4" />;
                    } else if (contact.type === "email") {
                      href = `mailto:${contact.value_en || contact.value_ar}`;
                      icon = <Mail className="w-4 h-4" />;
                    } else if (contact.type === "location") {
                      const val = contact.value_en || contact.value_ar || "";
                      if (val.startsWith("http")) {
                        href = val;
                      }
                      icon = <MapPin className="w-4 h-4" />;
                    } else if (contact.type === "whatsapp") {
                      const cleanNumber = (contact.value_en || contact.value_ar || "").replace(/\s+/g, "").replace("+", "");
                      href = `https://wa.me/${cleanNumber}`;
                      icon = <MessageCircle className="w-4 h-4" />;
                    } else if (contact.type === "website") {
                      href = contact.value_en || contact.value_ar;
                      if (href && !href.startsWith("http")) href = `https://${href}`;
                      icon = <Sparkles className="w-4 h-4" />;
                    }

                    const Component = href ? "a" : "div";
                    const extraProps = href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined } : {};

                    return (
                      <Component
                        key={contact.id}
                        {...extraProps}
                        className={`flex items-center gap-4 group ${href ? "cursor-pointer" : ""}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                          {icon}
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-gray-400">{label}</span>
                          <span className={`text-sm font-bold text-gray-800 ${contact.type === 'phone' || contact.type === 'telephone' || contact.type === 'email' ? 'direction-ltr inline-block hover:underline' : ''}`}>
                            {value}
                          </span>
                        </div>
                      </Component>
                    );
                  })}
                </div>
              </div>

              {/* Message us now button */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-brand/10 hover:bg-brand hover:text-white text-brand font-bold text-sm transition-all duration-300 shadow-sm active:scale-98"
                >
                  <span>راسلنا الآن</span>
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: من نحن */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[500px]">
              <div>
                <span className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand/10 text-brand mb-6 shadow-sm">
                  <Award className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">من نحن</h2>
                
                {aboutUsEntries && aboutUsEntries.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {aboutUsEntries.map((entry, idx) => (
                      <div key={entry.id} className={idx > 0 ? "pt-4 border-t border-gray-100" : ""}>
                        <h3 className="text-md font-bold text-gray-800 mb-1">{entry.title_ar || entry.title_en}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{entry.description_ar || entry.description_en}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      البيرق هايبر ماركت هو خياركم الأول لتسوق الأغذية والاستهلاكيات بجودة استثنائية وأسعار تنافسية تلبي احتياجات الأسرة في اليمن.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      تأسست مجموعتنا لتقدم مفهوماً حديثاً ومتطوراً للتسوق، نركز فيه على توفير المنتجات الطازجة وخيارات متنوعة، إلى جانب تفعيل خدمات التوصيل الذكية والتطبيقات المتطورة لراحتكم وتوفير وقتكم وجهدكم.
                    </p>
                  </div>
                )}

                {/* Stats underneath */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-2">
                    <span className="block text-xl sm:text-2xl font-black text-brand mb-1">+5</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">سنوات خدمة</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-2">
                    <span className="block text-xl sm:text-2xl font-black text-brand mb-1">+20K</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">عميل سعيد</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-2">
                    <span className="block text-xl sm:text-2xl font-black text-brand mb-1">+5000</span>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">منتج متنوع</span>
                  </div>
                </div>
              </div>

              {/* تعرف علينا أكثر button */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <a
                  href="#services"
                  onClick={(e) => scrollToSection(e, "services")}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 shadow-sm active:scale-98"
                >
                  <span>تعرف علينا أكثر</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 3: حمل تطبيقنا الآن */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[500px]" id="services">
              <div>
                <span className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand/10 text-brand mb-6 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">حمل تطبيقنا الآن</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  استمتع بتجربة تسوق أسهل وأسرع وأنت في منزلك. متوفر مجاناً على أنظمة iOS وأندرويد.
                </p>

                {/* QR Code and App badges details */}
                <div className="flex flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  {/* Custom Vector QR Code */}
                  <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-sm border border-gray-200 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full text-gray-900" viewBox="0 0 100 100">
                      {/* Anchor pattern top-left */}
                      <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                      <rect x="10" y="10" width="15" height="15" fill="white" />
                      <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                      
                      {/* Anchor pattern top-right */}
                      <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                      <rect x="75" y="10" width="15" height="15" fill="white" />
                      <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                      
                      {/* Anchor pattern bottom-left */}
                      <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                      <rect x="10" y="75" width="15" height="15" fill="white" />
                      <rect x="13" y="78" width="9" height="9" fill="currentColor" />

                      {/* Fake QR code bits */}
                      <rect x="35" y="5" width="6" height="6" fill="currentColor" />
                      <rect x="45" y="10" width="10" height="6" fill="currentColor" />
                      <rect x="60" y="5" width="6" height="12" fill="currentColor" />
                      <rect x="35" y="20" width="12" height="6" fill="currentColor" />
                      <rect x="52" y="22" width="6" height="6" fill="currentColor" />
                      
                      <rect x="35" y="35" width="6" height="6" fill="currentColor" />
                      <rect x="5" y="35" width="12" height="6" fill="currentColor" />
                      <rect x="22" y="40" width="6" height="10" fill="currentColor" />
                      <rect x="5" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="18" y="55" width="10" height="6" fill="currentColor" />
                      
                      <rect x="45" y="45" width="18" height="6" fill="currentColor" />
                      <rect x="70" y="35" width="12" height="6" fill="currentColor" />
                      <rect x="85" y="45" width="10" height="10" fill="currentColor" />
                      <rect x="75" y="58" width="6" height="12" fill="currentColor" />
                      <rect x="90" y="58" width="5" height="5" fill="currentColor" />
                      
                      <rect x="35" y="65" width="6" height="6" fill="currentColor" />
                      <rect x="45" y="60" width="10" height="10" fill="currentColor" />
                      <rect x="60" y="70" width="6" height="6" fill="currentColor" />
                      <rect x="35" y="78" width="12" height="6" fill="currentColor" />
                      <rect x="52" y="80" width="10" height="12" fill="currentColor" />
                      
                      <rect x="70" y="75" width="8" height="6" fill="currentColor" />
                      <rect x="85" y="80" width="10" height="6" fill="currentColor" />
                      <rect x="75" y="90" width="12" height="5" fill="currentColor" />
                      <rect x="40" y="90" width="6" height="5" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Badges Stack */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Google Play */}
                    <a
                      href="#"
                      className="flex items-center gap-2.5 bg-[#111111] hover:bg-black text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm border border-white/5 active:scale-98"
                    >
                      <GooglePlayIcon />
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-400 font-bold uppercase leading-tight">حمل تطبيقنا من</span>
                        <span className="block text-xs font-bold -mt-0.5 tracking-wide">Google Play</span>
                      </div>
                    </a>

                    {/* App Store */}
                    <a
                      href="#"
                      className="flex items-center gap-2.5 bg-[#111111] hover:bg-black text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm border border-white/5 active:scale-98"
                    >
                      <AppleIcon />
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-400 font-bold uppercase leading-tight">حمل تطبيقنا من</span>
                        <span className="block text-xs font-bold -mt-0.5 tracking-wide">App Store</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Install app instructions text */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Clock className="w-4 h-4 text-brand" />
                <span>امسح الكود بكاميرا الهاتف للتحميل فوراً</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQs Section */}
      {faqs && faqs.filter((faq) => faq && faq.is_active).length > 0 && (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100" id="faqs">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>مساعدة ودعم</span>
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">الأسئلة الشائعة</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                تصفح الإجابات على الأسئلة الأكثر تكراراً من قبل عملائنا لتوفير وقتك وجهدك.
              </p>
            </div>

            <div className="space-y-4">
              {faqs
                .filter((faq) => faq && faq.is_active)
                .map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden hover:border-brand/35 transition-all duration-300 shadow-sm"
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full py-5 px-6 flex items-center justify-between text-right font-bold text-gray-800 hover:text-brand focus:outline-none transition-colors gap-4"
                      >
                        <span>{faq.question_ar || faq.question_en}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-brand" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-[500px] border-t border-gray-100 bg-white" : "max-h-0"
                        }`}
                      >
                        <p className="p-6 text-sm text-gray-600 leading-relaxed">
                          {faq.answer_ar || faq.answer_en}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* 5. Footer */}
      <footer className="bg-[#111111] text-gray-300 pt-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12">
            
            {/* Column 1: Brand details (Col span 4) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="البيرق ماركت"
                    width={38}
                    height={38}
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-gradient-gold">البيرق ماركت</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                نحن في البيرق ماركت نسعى لتوفير تجربة تسوق استثنائية متكاملة لجميع عملائنا، من خلال جودة منتجاتنا العالية، وأسعارنا المنافسة، وخدمة توصيل سريعة ومميزة.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-3.5 pt-2">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand/20 hover:text-brand flex items-center justify-center text-gray-400 transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand/20 hover:text-brand flex items-center justify-center text-gray-400 transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand/20 hover:text-brand flex items-center justify-center text-gray-400 transition-colors" aria-label="X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand/20 hover:text-brand flex items-center justify-center text-gray-400 transition-colors" aria-label="WhatsApp">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.858.002-2.634-1.013-5.112-2.86-6.962s-4.325-2.87-6.958-2.87c-5.438 0-9.863 4.42-9.866 9.86-.001 1.762.474 3.423 1.378 4.917l-.982 3.587 3.676-.964zM16.9 14.86c-.26-.13-1.537-.76-1.777-.85-.24-.09-.41-.13-.58.13-.17.26-.66.82-.81.99-.15.17-.3.19-.56.06-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.11-.53.12-.11.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.46-.06-.13-.58-1.39-.8-1.9-.2-.5-.43-.43-.59-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.31-.24.25-.91.89-.91 2.17s.93 2.51 1.06 2.69c.13.17 1.83 2.79 4.43 3.92.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.53-.63 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.26-.17-.52-.3z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (Col span 2) */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wide">روابط سريعة</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-400 hover:text-brand transition-colors">
                    الأقسام
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-400 hover:text-brand transition-colors">
                    العروض
                  </a>
                </li>
                <li>
                  <a href="#home" onClick={(e) => scrollToSection(e, "home")} className="text-gray-400 hover:text-brand transition-colors">
                    المنتجات الجديدة
                  </a>
                </li>
                {faqs && faqs.filter((f) => f && f.is_active).length > 0 && (
                  <li>
                    <a href="#faqs" onClick={(e) => scrollToSection(e, "faqs")} className="text-gray-400 hover:text-brand transition-colors">
                      الأسئلة الشائعة
                    </a>
                  </li>
                )}
                <li>
                  <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="text-gray-400 hover:text-brand transition-colors">
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Services (Col span 2) */}
            <div className="lg:col-span-2 space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wide">خدماتنا</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#services" onClick={(e) => scrollToSection(e, "services")} className="text-gray-400 hover:text-brand transition-colors">
                    التوصيل والشحن
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, "about")} className="text-gray-400 hover:text-brand transition-colors">
                    الاسترجاع والاستبدال
                  </a>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-brand transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="text-gray-400 hover:text-brand transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter subscription (Col span 4) */}
            <div className="lg:col-span-4 space-y-5">
              <h4 className="text-white font-bold text-sm tracking-wide">اشترك في نشرتنا</h4>
              <p className="text-sm text-gray-400">
                كن أول من يعرف عن العروض الأسبوعية الحصرية والخصومات الجديدة والمنتجات الطازجة.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/60 transition-all duration-300">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ادخل بريدك الإلكتروني"
                    className="bg-transparent border-none outline-none text-white text-sm w-full px-3 py-2 text-right focus:ring-0 placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="p-2.5 rounded-lg bg-brand hover:opacity-90 active:scale-95 text-white transition-all shrink-0 disabled:opacity-50"
                    aria-label="Subscribe"
                  >
                    {newsletterStatus === "loading" ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {newsletterStatus === "success" && (
                  <p className="text-xs text-brand font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>تم الاشتراك بنجاح! شكراً لك.</span>
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* Bottom Bar: Copyright and design credit */}
          <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <div>
              <p>جميع الحقوق محفوظة © {new Date().getFullYear()} البيرق ماركت.</p>
            </div>
            <div className="flex items-center gap-1">
              <span>مصمم بـ</span>
              <span className="text-red-500 animate-pulse text-sm">❤️</span>
              <span>لعملائنا الكرام</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 6. Floating WhatsApp help widget */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#df9f00] hover:bg-[#b38000] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 active:scale-95 hover:scale-105"
        >
          {/* Label visible on hover or desktop screens */}
          <span className="text-xs font-bold whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] lg:max-w-[200px] transition-all duration-300 ease-in-out">
            تحتاج مساعدة؟ تحدث معنا
          </span>
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

    </div>
  );
}
