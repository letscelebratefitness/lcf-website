import React from 'react';

export default function ImplementationPlan({ content = {} }) {
  const heading = content.heading || 'Implementation Plan';
  const steps = Array.isArray(content.steps) ? content.steps : [];
  const visibleSteps = steps.filter(step => step?.title || (step?.points || []).some(Boolean));

  if (!visibleSteps.length) return null;

  return (
    <section className="w-full overflow-hidden bg-[linear-gradient(180deg,#f8f4ef_0%,#ffffff_45%,#f4f8f6_100%)] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-center md:mb-16">
          <div className="inline-flex rounded-full border border-primary/10 bg-white/90 px-6 py-3 shadow-sm backdrop-blur">
            <h2 className="text-center text-2xl font-bold tracking-tight text-primary-dark md:text-3xl">
              {heading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4 xl:gap-6">
          {visibleSteps.map((step, index) => (
            <article
              key={`${step.title || 'step'}-${index}`}
              className="group relative flex h-full min-h-[320px] flex-col justify-between rounded-[28px] border border-primary/10 bg-white/90 p-6 shadow-[0_18px_50px_rgba(22,44,34,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(22,44,34,0.14)]"
            >
              <div className="absolute inset-x-6 top-20 hidden h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent md:block" />
              <div>
                <div className="mb-8 text-5xl font-black leading-none tracking-tight text-primary md:text-6xl">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="pt-6">
                <h3 className="mb-4 text-lg font-bold leading-snug text-primary-dark md:text-xl">
                  {step.title}
                </h3>
                <ul className="space-y-3 text-sm leading-6 text-gray-600">
                  {(step.points || []).filter(Boolean).map((point, pointIndex) => (
                    <li key={`${index}-${pointIndex}`} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent transition-colors duration-300 group-hover:bg-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
