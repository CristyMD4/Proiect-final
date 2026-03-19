import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import { Icon } from "../components/Icons.jsx";

const SERVICES = [
  { slug: "full-service",       icon: "sparkle", price: "$25", key: "full",   title: "Full-Service Wash",   desc: "Complete exterior and interior cleaning by our professional team." },
  { slug: "self-service",       icon: "drop",    price: "$8",  key: "self",   title: "Self-Service Wash",   desc: "24/7 bays with high-pressure washers, foam cannon, and free vacuums." },
  { slug: "premium-detailing",  icon: "wand",    price: "$89", key: "detail", title: "Premium Detailing",   desc: "Deep restoration — wax, polish, interior shampoo, headlight renewal." },
  { slug: "interior-cleaning",  icon: "sparkle", price: "$45", key: "interior", title: "Interior Cleaning", desc: "Full vacuum, carpet shampoo, odour treatment, and surface polish." },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <Section title={t("services.title")} subtitle={t("services.subtitle")}>
      <div className="grid gap-6 sm:grid-cols-2">
        {SERVICES.map((svc) => (
          <div key={svc.slug} className="card p-6 flex flex-col">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center flex-shrink-0">
                <Icon name={svc.icon} className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{svc.title}</div>
                <div className="text-xs font-semibold text-[var(--sw-blue)]">From {svc.price}</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-6 flex-1">{svc.desc}</p>
            <Link
              to={`/services/${svc.slug}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sw-blue)] hover:underline"
            >
              See full details →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/book" className="btn btn-primary">Book Now</Link>
      </div>
    </Section>
  );
}
