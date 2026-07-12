import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { roles } from '../lib/roles';

const features = [
  'Generate role-specific interview questions from a resume or job description.',
  'Answer one question at a time with instant AI feedback.',
  'Store sessions in MongoDB so users can revisit progress later.'
];

export default function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">
              AI-powered interview prep
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Practice interviews that feel like a real hiring loop.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                PrepPilot turns resumes and job descriptions into structured mock interviews, evaluates every answer, and stores every session for review.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/interview/new">
                <Button className="px-6 py-3 text-base">Start a session</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" className="px-6 py-3 text-base">View dashboard</Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature} className="bg-white/5">
                  <p className="text-sm leading-6 text-slate-200">{feature}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="hero-panel rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">Supported roles</p>
                <p className="mt-2 text-sm text-slate-300">Built for common early-career and general engineering tracks.</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs text-slate-200">MERN stack</div>
            </div>
            <div className="grid gap-3">
              {roles.map((role) => (
                <Card key={role.value} className="border-white/10 bg-slate-950/40 p-4">
                  <p className="font-semibold text-white">{role.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{role.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}