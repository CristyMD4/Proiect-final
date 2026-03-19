import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Section from "../components/Section.jsx";
import { addBooking, listLocations, getBookingsForLocationDate, uid, seedIfEmpty } from "../lib/storage.js";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function AvailabilityGrid({ location, date, selectedBox, onSelectBox }) {
  const totalBoxes = location?.features?.selfWashBoxes || 4;
  const totalParking = location?.features?.parkingSpots || 8;

  const occupiedBoxes = useMemo(() => {
    if (!date) return new Set();
    const bookings = getBookingsForLocationDate(location.id, date);
    return new Set(bookings.map((b) => b.box).filter(Boolean));
  }, [location?.id, date]);

  // Simulate a few occupied parking spots based on date hash (no real tracking)
  const occupiedParking = useMemo(() => {
    if (!date) return 0;
    const hash = date.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Math.min(Math.floor(hash % 4), totalParking - 1);
  }, [date, totalParking]);

  const freeBoxes = totalBoxes - occupiedBoxes.size;
  const freeParking = totalParking - occupiedParking;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">Disponibilitate la {location.name}</span>
        <span className="text-xs text-slate-400">{date}</span>
      </div>

      {/* Boxuri self-wash */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Boxuri Self-Wash</span>
          <span className={`text-xs font-semibold ${freeBoxes > 0 ? "text-emerald-600" : "text-rose-500"}`}>
            {freeBoxes} / {totalBoxes} libere
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalBoxes }, (_, i) => {
            const boxNum = i + 1;
            const occupied = occupiedBoxes.has(String(boxNum));
            const isSelected = selectedBox === String(boxNum);
            return (
              <button
                key={boxNum}
                type="button"
                disabled={occupied}
                onClick={() => onSelectBox(isSelected ? "" : String(boxNum))}
                className={[
                  "flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 text-xs font-bold transition",
                  occupied
                    ? "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-400"
                    : isSelected
                    ? "border-[var(--sw-blue)] bg-blue-50 text-[var(--sw-blue)] shadow-md"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400",
                ].join(" ")}
              >
                <span className="text-base leading-none">{occupied ? "✕" : isSelected ? "✓" : "▣"}</span>
                <span className="mt-1">Box {boxNum}</span>
              </button>
            );
          })}
        </div>
        {selectedBox && (
          <p className="mt-2 text-xs text-[var(--sw-blue)] font-semibold">Box {selectedBox} selectat</p>
        )}
        {!selectedBox && freeBoxes > 0 && (
          <p className="mt-2 text-xs text-slate-400">Selectează un box liber</p>
        )}
      </div>

      {/* Parcări */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parcări disponibile</span>
          <span className={`text-xs font-semibold ${freeParking > 0 ? "text-emerald-600" : "text-rose-500"}`}>
            {freeParking} / {totalParking} libere
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: totalParking }, (_, i) => {
            const occupied = i < occupiedParking;
            return (
              <div
                key={i}
                className={[
                  "h-8 w-10 rounded-lg border text-[10px] font-bold flex items-center justify-center",
                  occupied
                    ? "border-rose-200 bg-rose-50 text-rose-400"
                    : "border-emerald-200 bg-emerald-50 text-emerald-600",
                ].join(" ")}
              >
                {occupied ? "✕" : "P"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Book() {
  const { t } = useTranslation();
  const [selectedBox, setSelectedBox] = useState("");

  const vehicleOpts = useMemo(() => t("book.opts.vehicle", { returnObjects: true }) || [], [t]);
  const serviceOpts = useMemo(() => t("book.opts.service", { returnObjects: true }) || [], [t]);
  const timeOpts = useMemo(() => t("book.opts.time", { returnObjects: true }) || [], [t]);
  const locations = useMemo(() => listLocations(), []);

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().min(2, t("errors.name", { defaultValue: "Name is required" })),
        email: z.string().email(t("errors.email", { defaultValue: "Enter a valid email" })),
        phone: z.string().min(6, t("errors.phone", { defaultValue: "Enter a valid phone" })),
        vehicle: z.string().min(1, t("errors.vehicle", { defaultValue: "Select a vehicle" })),
        locationId: z.string().min(1, "Select a location"),
        service: z.string().min(1, t("errors.service", { defaultValue: "Select a service" })),
        date: z.string().min(1, t("errors.date", { defaultValue: "Select a date" })),
        time: z.string().optional(),
        notes: z.string().optional(),
      }).superRefine((data, ctx) => {
        if (data.service !== "Self-Service" && !data.time) {
          ctx.addIssue({ path: ["time"], code: "custom", message: t("errors.time", { defaultValue: "Select a time" }) });
        }
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicle: "",
      locationId: locations?.[0]?.id || "loc_1",
      service: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  const selectedService = watch("service");
  const selectedLocationId = watch("locationId");
  const selectedDate = watch("date");
  const isSelfService = selectedService === "Self-Service";

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );

  const showAvailability = isSelfService && selectedLocation && selectedDate;

  const FieldError = ({ name }) =>
    errors?.[name]?.message ? (
      <p className="mt-1 text-sm text-rose-600">{String(errors[name].message)}</p>
    ) : null;

  const onSubmit = (data) => {
    seedIfEmpty();

    addBooking({
      id: uid("BKG"),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      vehicle: data.vehicle,
      locationId: data.locationId,
      service: data.service,
      date: data.date,
      time: data.time,
      box: isSelfService ? selectedBox : "",
      notes: data.notes || "",
      status: "pending",
      at: Date.now(),
    });

    alert("Booking submitted (demo). Open /admin/bookings to manage.");
    reset();
    setSelectedBox("");
  };

  return (
    <div>
      <Section title={t("book.title")} subtitle={t("book.subtitle")}>
        <div className="max-w-3xl mx-auto card p-8">
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.fullName")}</label>
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("fullName")}
                  placeholder={t("contact.placeholders.name")}
                />
                <FieldError name="fullName" />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.email")}</label>
                <input
                  type="email"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("email")}
                  placeholder={t("contact.placeholders.email")}
                />
                <FieldError name="email" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.phone")}</label>
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("phone")}
                  placeholder={t("contact.placeholders.phone")}
                />
                <FieldError name="phone" />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.vehicle")}</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("vehicle")}
                >
                  {vehicleOpts.map((x, i) => (
                    <option key={i} value={i === 0 ? "" : x}>{x}</option>
                  ))}
                </select>
                <FieldError name="vehicle" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.service")}</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("service")}
                >
                  {serviceOpts.map((x, i) => (
                    <option key={i} value={i === 0 ? "" : x}>{x}</option>
                  ))}
                </select>
                <FieldError name="service" />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <select
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("locationId")}
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <FieldError name="locationId" />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">{t("book.fields.date")}</label>
                <input
                  type="date"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                  {...register("date")}
                />
                <FieldError name="date" />
              </div>

              {!isSelfService && (
                <div>
                  <label className="text-sm font-semibold text-slate-700">{t("book.fields.time")}</label>
                  <select
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                    {...register("time")}
                  >
                    {timeOpts.map((x, i) => (
                      <option key={i} value={i === 0 ? "" : x}>{x}</option>
                    ))}
                  </select>
                  <FieldError name="time" />
                </div>
              )}
            </div>

            {/* Grila disponibilitate Self-Wash */}
            {showAvailability && (
              <AvailabilityGrid
                location={selectedLocation}
                date={selectedDate}
                selectedBox={selectedBox}
                onSelectBox={setSelectedBox}
              />
            )}

            {isSelfService && !showAvailability && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
                Selectează locația și data pentru a vedea disponibilitatea boxurilor
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700">{t("book.notes")}</label>
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                {...register("notes")}
                placeholder={t("book.notesPh")}
              />
            </div>

            <button
              className="btn btn-primary h-12 disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {t("book.confirm")}
            </button>

            <div className="text-xs text-slate-500">
              Demo: booking is stored in localStorage and visible in Admin → Bookings.
            </div>
          </form>
        </div>
      </Section>
    </div>
  );
}
