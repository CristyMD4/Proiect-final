import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import { Icon } from "../components/Icons.jsx";
import { addMessage, uid, seedIfEmpty } from "../lib/storage.js";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    seedIfEmpty();
    addMessage({
      id: uid("MSG"),
      ...form,
      at: Date.now(),
      read: false
    });
    alert("Message sent (demo). Open /admin/messages to view.");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <div>
      <Section title={t("contact.title")} subtitle={t("contact.subtitle")}>
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

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div className="font-extrabold">{t("contact.hours")}</div>
                <div className="mt-2 text-slate-600 text-sm leading-6">
                  <div>{t("contact.fullHours")}</div>
                  <div>{t("contact.selfHours")}</div>
                </div>
              </div>

              <div className="card overflow-hidden">
                <iframe
                  title="map"
                  className="w-full h-72"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=New%20York&output=embed"
                />
              </div>
            </div>
          </div>

          <div className="card p-7">
            <div className="text-xl font-extrabold">{t("contact.send")}</div>
            <form className="mt-6 grid gap-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="h-12 rounded-xl border border-slate-200 px-4"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder={t("contact.placeholders.name")}
                  required
                />
                <input
                  className="h-12 rounded-xl border border-slate-200 px-4"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder={t("contact.placeholders.email")}
                  type="email"
                  required
                />
              </div>
              <input
                className="h-12 rounded-xl border border-slate-200 px-4"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder={t("contact.placeholders.phone")}
                required
              />
              <textarea
                className="min-h-[140px] rounded-xl border border-slate-200 px-4 py-3"
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder={t("contact.placeholders.message")}
                required
              />
              <button className="btn btn-primary" type="submit">
                {t("contact.sendBtn")}
              </button>
            </form>
            <div className="mt-4 text-xs text-slate-500">Messages are stored in localStorage for the demo admin panel.</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
