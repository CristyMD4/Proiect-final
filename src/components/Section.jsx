import React from "react";

export default function Section({ title, subtitle, children, className = "" }) {
  return (
    <section className={"py-16 " + className}>
      <div className="container-page">
        {(title || subtitle) && (
          <div className="text-center max-w-2xl mx-auto">
            {title && <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>}
            {subtitle && <p className="mt-4 text-slate-600 leading-7">{subtitle}</p>}
          </div>
        )}
        <div className={(title || subtitle) ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}
