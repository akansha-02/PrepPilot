import { Link, NavLink } from 'react-router-dom';

const desktopLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'History' }
];

const mobileLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview/new', label: 'New interview' },
  { to: '/history', label: 'History' }
];

const desktopClass = ({ isActive }) =>
  `relative text-sm font-medium transition-colors ${
    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
  }`;

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-xl font-extrabold tracking-tight text-ink">
            PrepPilot
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {desktopLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopClass}>
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-[7px] left-0 h-[3px] w-full bg-marker"
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <Link to="/interview/new" className="btn-primary hidden md:inline-flex">
            New interview
          </Link>
        </div>

        <nav className="grid grid-cols-3 border-t border-line md:hidden" aria-label="Main">
          {mobileLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `border-r border-line py-2.5 text-center text-[13px] font-medium transition-colors last:border-r-0 ${
                  isActive ? 'bg-marker/40 text-ink' : 'text-ink-muted'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
