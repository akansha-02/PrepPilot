import { Link, NavLink, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview/new', label: 'New Session' },
  { to: '/history', label: 'History' }
];

export default function AppShell({ children }) {
  const location = useLocation();
  const compact = useMemo(() => location.pathname.startsWith('/interview/'), [location.pathname]);

  return (
    <div className="min-h-screen text-slate-100">
      <header className={`sticky top-0 z-50 border-b border-white/10 ${compact ? 'bg-slate-950/80 backdrop-blur-xl' : 'bg-slate-950/80 backdrop-blur-xl'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-400 text-lg font-black text-slate-950 shadow-glow">
              PP
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">PrepPilot</p>
              <p className="text-xs text-slate-400">AI interview practice studio</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/interview/new" className="btn-primary">
            Start interview
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}