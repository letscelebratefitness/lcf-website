import React from 'react';

const Arrow = () => (
  <div className="flex justify-center py-1">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-primary/50"
      aria-hidden="true"
    >
      <path
        d="M12 5v14m0 0-5-5m5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

function FlowCard({ label, value, tone = 'bg-white' }) {
  return (
    <div className={`rounded-2xl border border-primary/10 ${tone} p-4 text-center shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-md`}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      <p className="text-sm leading-6 text-gray-700">{value}</p>
    </div>
  );
}

export default function TheoryOfChange({ content = {} }) {
  const heading = content.heading || 'LCF | Theory of Change';
  const categories = Array.isArray(content.categories) ? content.categories : [];
  const visibleCategories = categories.filter(category => category?.label);

  if (!visibleCategories.length) return null;

  return (
    <section className="w-full bg-[linear-gradient(180deg,#f7fbf8_0%,#ffffff_48%,#f9f5ef_100%)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-center md:mb-16">
          <div className="inline-flex rounded-full border border-primary/10 bg-white px-6 py-3 shadow-sm">
            <h2 className="text-center text-2xl font-bold tracking-tight text-primary-dark md:text-3xl">
              {heading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <article
              key={`${category.label}-${index}`}
              className="group rounded-[30px] border border-primary/10 bg-white/90 p-6 shadow-[0_18px_45px_rgba(20,48,38,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(20,48,38,0.14)]"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex rounded-full bg-primary-light px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">
                  {category.label}
                </div>
              </div>

              <div className="space-y-2">
                <FlowCard label="Intervention" value={category.intervention} tone="bg-primary-light/60" />
                <Arrow />
                <FlowCard label="Inputs" value={category.inputs} />
                <Arrow />
                <FlowCard label="Outcomes" value={category.outcomes} />
                <Arrow />
                <FlowCard label="Impact" value={category.impact} tone="bg-accent/10" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
