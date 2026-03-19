import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b1220] text-slate-200 mt-16">
      <div className="container-page py-14">
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-2xl font-extrabold text-[var(--sw-blue)]">SparkleWash</div>
            <p className="mt-4 text-slate-300 text-sm leading-6">{t("footer.tagline")}</p>
          </div>

          <div>
            <div className="font-semibold">{t("footer.quickLinks")}</div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link className="hover:text-white" to="/">{t("nav.home")}</Link>
              <Link className="hover:text-white" to="/services">{t("nav.services")}</Link>
              <Link className="hover:text-white" to="/pricing">{t("nav.pricing")}</Link>
              <Link className="hover:text-white" to="/contact">{t("nav.contact")}</Link>
              <Link className="hover:text-white" to="/shop">Shop</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("footer.services")}</div>
            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <Link className="hover:text-white" to="/services/full-service">Full-Service Wash</Link>
              <Link className="hover:text-white" to="/services/self-service">Self-Service Wash</Link>
              <Link className="hover:text-white" to="/services/premium-detailing">Premium Detailing</Link>
              <Link className="hover:text-white" to="/services/interior-cleaning">Interior Cleaning</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("footer.followUs")}</div>
            <div className="mt-4 flex items-center gap-3">
              {[
                { label: "f", title: "Facebook" },
                { label: "◎", title: "Instagram" },
                { label: "𝕏", title: "X" }
              ].map((s) => (
                <a
                  key={s.title}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.title}
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white"
                >
                  <span className="font-bold">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} SparkleWash. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
