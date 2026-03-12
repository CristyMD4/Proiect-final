import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";

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

export default function Pricing() {
  const { t } = useTranslation();
  const plans = t("pricing.plans", { returnObjects: true });

  return (
    <div>
      <Section title={t("pricing.title")} subtitle={t("pricing.subtitle")}> 
        <div className="grid gap-6 lg:grid-cols-3">
          <Plan {...plans.self} />
          <Plan {...plans.express} featured />
          <Plan {...plans.premium} />
        </div>

        <div className="mt-10 card p-7 bg-white">
          <div className="text-xl font-extrabold">Need fleet or monthly plans?</div>
          <p className="mt-2 text-slate-600">Contact us for custom pricing for businesses and frequent-wash memberships.</p>
          <div className="mt-5">
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
