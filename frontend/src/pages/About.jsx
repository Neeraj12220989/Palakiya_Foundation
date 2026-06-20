import { Target, Eye, Award, Heart, Users2, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import CTASection from '../components/CTASection.jsx';

const team = [
  { name: 'Johnson Topno', role: 'Executive Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Anjali Sharma', role: 'Head of Health Programs', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Rahul Mishra', role: 'Community Outreach Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Priya Verma', role: 'Education & Empowerment', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
];

const About = () => {
  const { content } = useContent();

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A living story of change"
        subtitle="For over a decade we have partnered with marginalised communities to deliver lasting, dignified change."
      />

      {/* Story */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80"
              alt="Our journey"
              className="rounded-3xl object-cover shadow-soft"
            />
          </Reveal>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Our Background"
              title="Built on hope, driven by community"
              subtitle={content.about_intro}
            />
            <p className="mt-5 text-ink-500 leading-relaxed">
              What began as a small group of volunteers has grown into a movement spanning
              thousands of villages. We believe that sustainable change is only possible when
              communities lead the way — we are the facilitators, they are the changemakers.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { v: content.stat_people, l: 'People reached' },
                { v: content.stat_villages, l: 'Villages covered' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-brand-50 p-5">
                  <p className="text-2xl font-extrabold text-brand-700">
                    <CountUp value={s.v} suffix="+" />
                  </p>
                  <p className="text-sm text-ink-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-photo-brand section relative">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: 'Our Mission', text: content.mission, grad: 'from-brand-500 to-emerald-600' },
            { icon: Eye, title: 'Our Vision', text: content.vision, grad: 'from-ocean-500 to-ocean-700' },
          ].map((m) => (
            <Reveal key={m.title}>
              <div className="card relative h-full overflow-hidden p-8">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.grad} opacity-10`} />
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.grad} text-white shadow-glow`}>
                  <m.icon size={26} />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-ink-900">{m.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-500">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our core values"
            subtitle="The principles that guide every decision and every program we run."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, t: 'Compassion', d: 'Leading with empathy and dignity.' },
              { icon: Award, t: 'Integrity', d: 'Full transparency and accountability.' },
              { icon: Users2, t: 'Inclusion', d: 'Leaving absolutely no one behind.' },
              { icon: Sprout, t: 'Sustainability', d: 'Change that lasts for generations.' },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="card-hover h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <v.icon size={26} />
                  </span>
                  <h3 className="mt-4 font-bold text-ink-900">{v.t}</h3>
                  <p className="mt-2 text-sm text-ink-500">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-photo-soft section relative">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our People"
            title="Meet the team behind the mission"
            subtitle="Dedicated individuals working tirelessly to create lasting impact."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="card-hover group overflow-hidden text-center">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-ink-900">{m.name}</h3>
                    <p className="text-sm text-brand-600">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" className="btn-primary">
              Join our team
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default About;
