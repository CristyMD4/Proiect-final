import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import { Icon } from "../components/Icons.jsx";

function Row({ icon, title, desc, bullets }) {
  return (
    <div className="card p-7">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[var(--sw-blue)] flex items-center justify-center">
          <Icon name={icon} className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold">{title}</h3>
          <p className="mt-2 text-slate-600 leading-7">{desc}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-[var(--sw-blue)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const svc = t("services.cards", { returnObjects: true });

  return (
    <div>
      <Section title={t("services.title")} subtitle={t("services.subtitle")}>
        <div className="grid gap-6">
          <Row
            icon="sparkle"
            title={svc.full.title}
            desc={svc.full.desc}
            bullets={["Hand wash exterior", "Interior vacuum", "Wheel & tire care", "Windows cleaned"]}
          />
          <Row
            icon="drop"
            title={svc.self.title}
            desc={svc.self.desc}
            bullets={["High-pressure wash", "Foam brush", "Spot-free rinse", "Vacuum stations"]}
          />
          <Row
            icon="wand"
            title={svc.detail.title}
            desc={svc.detail.desc}
            bullets={["Wax & polish", "Interior shampoo", "Leather conditioning", "Headlight restoration"]}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/book" className="btn btn-primary">{t("common.bookNow")}</Link>
        </div>
      </Section>
    </div>
  );
}
