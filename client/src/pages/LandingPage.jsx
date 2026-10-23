import { Link } from 'react-router-dom';
import { roles } from '../lib/roles';

const capabilities = [
  'Questions built from a resume or job description.',
  'A score with strengths and gaps after every answer.',
  'Sessions saved, so progress is easy to revisit.'
];

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
      <div className="grid gap-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start">
          <h1 className="max-w-[20ch] font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Practice interviews that feel like the real hiring loop.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted md:text-lg md:leading-8">
            Pick a role, add a resume or job description, and answer questions one at a time with
            instant AI feedback.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/interview/new" className="btn-primary px-5 py-2.5 text-base">
              New interview
            </Link>
            <Link to="/dashboard" className="btn-secondary px-5 py-2.5 text-base">
              Open dashboard
            </Link>
          </div>

          <ul className="mt-12 grid w-full gap-4 border-t border-line pt-4 sm:grid-cols-3 sm:gap-6">
            {capabilities.map((item) => (
              <li key={item} className="text-sm leading-6 text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="sheet h-fit p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Roles</h2>
            <span className="font-mono text-xs text-ink-faint">{roles.length} tracks</span>
          </div>
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {roles.map((role) => (
              <li key={role.value} className="py-3.5">
                <p className="text-sm font-semibold text-ink">{role.label}</p>
                <p className="mt-0.5 text-[13px] leading-5 text-ink-muted">{role.description}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
