import Reveal from './Reveal.jsx';

// Inner-page hero banner
const PageHeader = ({ eyebrow, title, subtitle }) => (
  <section className="bg-photo-hero relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
    <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
    <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl" />
    <div className="pointer-events-none absolute top-20 -left-16 h-64 w-64 rounded-full bg-ocean-200/30 blur-3xl" />
    <div className="container-x relative text-center">
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{subtitle}</p>
        )}
      </Reveal>
    </div>
  </section>
);

export default PageHeader;
