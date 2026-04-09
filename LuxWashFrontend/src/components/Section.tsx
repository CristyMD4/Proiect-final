import type { ReactNode } from "react";

type SectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Section({ title, subtitle, children, className = "" }: SectionProps) {
  return (
    <section className={"py-16 " + className}>
      <div className="container-page">
        {(title || subtitle) && (
          <div className="mx-auto max-w-2xl text-center">
            {title && <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 leading-7 text-slate-600">{subtitle}</p>}
          </div>
        )}
        <div className={title || subtitle ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}
