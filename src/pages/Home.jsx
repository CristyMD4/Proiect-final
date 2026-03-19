import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import BeforeAfterCarousel from "../components/BeforeAfterCarousel.jsx";
import { Icon } from "../components/Icons.jsx";
import { listProducts } from "../lib/shopStorage.js";
import { useCart } from "../context/CartContext.jsx";

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="card p-7">
      <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
      <p className="mt-3 text-slate-600 leading-7">{desc}</p>
    </div>
  );
}

function Plan({ name, tagline, price, unit, features, featured }) {
  return (
    <div className={"card p-8 relative " + (featured ? "ring-2 ring-[var(--sw-blue)]" : "")}> 
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--sw-blue)] px-4 py-1 text-xs font-extrabold text-white">
          Most Popular
        </div>
      )}
      <div className="text-lg font-extrabold">{name}</div>
      <div className="mt-2 text-sm text-slate-600">{tagline}</div>
      <div className="mt-6 flex items-end gap-2">
        <div className="text-5xl font-extrabold text-slate-900">{price}</div>
        <div className="pb-2 text-sm text-slate-500">{unit}</div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--sw-blue)]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/book" className={"btn h-11 w-full mt-8 " + (featured ? "btn-primary" : "btn-outline")}>
        Get Started
      </Link>
    </div>
  );
}

const EMOJI_MAP = {
  "foam-shampoo": "🧴", "pre-wash-spray": "💧", "wheel-cleaner": "🔵",
  "wash-mitt": "🧤", "microfiber-set": "🪣", "snow-foam-lance": "❄️",
  "bucket-set": "🪣", "drying-aid": "✨", "car-wax": "✨",
  "quick-detailer": "🌟", "leather-conditioner": "🛋️", "interior-dressing": "🪟",
  "glass-cleaner": "🪟", "paint-sealant": "🛡️", "tire-dressing": "⚫",
  "air-freshener": "🌸", "clay-bar": "🔷",
};

function ShopPreviewCard({ product, onAdd, added }) {
  return (
    <div className="card p-5 flex flex-col">
      <div className="h-32 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-4xl mb-4">
        {EMOJI_MAP[product.id] || "🧴"}
      </div>
      {product.badge && (
        <span className={`self-start mb-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          product.badge === "Best Seller" ? "bg-amber-100 text-amber-700" :
          product.badge === "New" ? "bg-emerald-100 text-emerald-700" :
          "bg-rose-100 text-rose-700"
        }`}>{product.badge}</span>
      )}
      <div className="font-extrabold text-slate-900 text-sm leading-tight">{product.name}</div>
      <div className="mt-1 text-[11px] text-slate-400">{product.category}</div>
      <div className="mt-2 text-lg font-black text-[var(--sw-blue)]">${product.price.toFixed(2)}</div>
      <p className="mt-2 text-xs text-slate-500 leading-5 flex-1 line-clamp-2">{product.description}</p>
      <button
        onClick={() => onAdd(product.id)}
        className={`mt-4 h-9 w-full rounded-xl text-xs font-bold transition ${
          added ? "bg-emerald-500 text-white" : "bg-[var(--sw-blue)] text-white hover:bg-blue-600"
        }`}
      >
        {added ? "✓ Adăugat" : "Adaugă în coș"}
      </button>
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
  return (
    <div className="card p-7">
      <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
      <p className="mt-3 text-slate-600 leading-7">{desc}</p>
    </div>
  );
}

function Testimonial({ name, role, text }) {
  return (
    <div className="card p-7">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-full bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center font-extrabold">
          {name[0]}
        </div>
        <div>
          <div className="font-extrabold">{name}</div>
          <div className="text-sm text-slate-500">{role}</div>
        </div>
      </div>
      <p className="mt-5 text-slate-700 leading-7">“{text}”</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState({});

  const svc = t("services.cards", { returnObjects: true }) || {};
  const plans = t("pricing.plans", { returnObjects: true }) || {};
  const why = t("why.items", { returnObjects: true }) || {};
  const testimonials = t("testimonials.cards", { returnObjects: true }) || [];

  const featuredProducts = React.useMemo(
    () => listProducts().filter((p) => p.badge === "Best Seller").slice(0, 4),
    []
  );

  const handleAdd = (id) => {
    addToCart(id);
    setAddedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [id]: false })), 1500);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,0.70), rgba(15,23,42,0.30)), url(https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="relative">
          <div className="container-page py-20 md:py-28">
            <div className="max-w-2xl">
              <div className="badge bg-white/15 text-white border border-white/20">⭐ 4.9 rating • 2,000+ washes</div>
              <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-white whitespace-pre-line">
                {t("hero.title")}
              </h1>
              <p className="mt-6 text-white/85 text-lg leading-8">{t("hero.subtitle")}</p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/book" className="btn btn-primary">{t("hero.cta1")}</Link>
                <Link to="/services" className="btn btn-outline">{t("hero.cta2")}</Link>
              </div>
            </div>
          </div>

          {/* soft wave */}
          <div className="h-12 bg-gradient-to-b from-transparent to-[#f5f7fb]" />
        </div>
      </section>

      {/* SERVICES */}
      <Section title={t("services.title")} subtitle={t("services.subtitle")}> 
        <div className="grid gap-6 md:grid-cols-3">
          <ServiceCard icon="sparkle" title={svc.full?.title || ""} desc={svc.full?.desc || ""} />
          <ServiceCard icon="drop" title={svc.self?.title || ""} desc={svc.self?.desc || ""} />
          <ServiceCard icon="wand" title={svc.detail?.title || ""} desc={svc.detail?.desc || ""} />
        </div>
      </Section>

      {/* PRICING */}
      <Section title={t("pricing.title")} subtitle={t("pricing.subtitle")} className="bg-white">
        <div className="grid gap-6 lg:grid-cols-3">
          <Plan {...(plans.self || { features: [] })} />
          <Plan {...(plans.express || { features: [] })} featured />
          <Plan {...(plans.premium || { features: [] })} />
        </div>
      </Section>

      {/* SHOP PREVIEW */}
      <Section title="Shop SparkleWash" subtitle="Produse profesionale de spălătorie și îngrijire auto — direct la tine acasă." className="bg-white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ShopPreviewCard
              key={p.id}
              product={p}
              onAdd={handleAdd}
              added={!!addedIds[p.id]}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/shop" className="btn btn-primary px-10">Vezi toate produsele</Link>
        </div>
      </Section>

      {/* WHY */}
      <Section title={t("why.title")} subtitle={t("why.subtitle")}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <WhyCard icon="clock" title={why.open?.title || ""} desc={why.open?.desc || ""} />
          <WhyCard icon="drop" title={why.eco?.title || ""} desc={why.eco?.desc || ""} />
          <WhyCard icon="badge" title={why.staff?.title || ""} desc={why.staff?.desc || ""} />
          <WhyCard icon="shield" title={why.guarantee?.title || ""} desc={why.guarantee?.desc || ""} />
          <WhyCard icon="cart" title="Online Shop" desc="Comandă produse profesionale de îngrijire auto direct din magazinul nostru online." />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((x) => (
            <Testimonial key={x.name} {...x} />
          ))}
        </div>
      </Section>

      {/* GALLERY */}
      <Section title={t("gallery.title")} subtitle={t("gallery.subtitle")}> 
        <BeforeAfterCarousel />
      </Section>

      {/* CONTACT CTA */}
      <Section title={t("contact.title")} subtitle={t("contact.subtitle")} className="bg-white">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
                  <Icon name="pin" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.location")}</div>
                  <div className="text-slate-600">123 Clean Street, Wash City, WC 12345</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
                  <Icon name="phone" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.phone")}</div>
                  <div className="text-slate-600">(555) 123-4567</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
                  <Icon name="mail" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold">{t("contact.email")}</div>
                  <div className="text-slate-600">info@sparklewash.com</div>
                </div>
              </div>

              <div className="mt-2 rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="font-extrabold">{t("contact.hours")}</div>
                <div className="mt-2 text-slate-600 text-sm leading-6">
                  <div>{t("contact.fullHours")}</div>
                  <div>{t("contact.selfHours")}</div>
                </div>
              </div>

              <Link to="/book" className="btn btn-primary mt-2">{t("common.bookNow")}</Link>
            </div>
          </div>

          <div className="card p-7">
            <div className="text-xl font-extrabold">{t("contact.send")}</div>
            <p className="mt-2 text-slate-600">We typically respond within 2 hours.</p>
            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent (demo). Open Admin → Messages to see it.");
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.name")} />
                <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.email")} />
              </div>
              <input className="h-12 rounded-xl border border-slate-200 px-4" placeholder={t("contact.placeholders.phone")} />
              <textarea
                className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-3"
                placeholder={t("contact.placeholders.message")}
              />
              <button className="btn btn-primary" type="submit">
                {t("contact.sendBtn")}
              </button>
            </form>
            <div className="mt-4 text-xs text-slate-500">Demo form: no backend required.</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
