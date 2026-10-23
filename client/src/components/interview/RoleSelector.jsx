import clsx from 'clsx';
import { levels, roles } from '../../lib/roles';

function PickerLabel({ children }) {
  return <span className="field-label">{children}</span>;
}

export default function RoleSelector({ value, onChange }) {
  const pickRole = (role) => onChange({ ...value, role });
  const pickLevel = (level) => onChange({ ...value, level });

  return (
    <div className="grid gap-6">
      <div>
        <PickerLabel>Role</PickerLabel>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {roles.map((role) => {
            const selected = value.role === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => pickRole(role.value)}
                aria-pressed={selected}
                className={clsx(
                  'rounded-md border p-3 text-left transition-colors',
                  selected
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line-strong bg-sheet hover:border-ink'
                )}
              >
                <span className="block text-sm font-semibold">{role.label}</span>
                <span
                  className={clsx(
                    'mt-0.5 block text-[13px] leading-5',
                    selected ? 'text-paper/70' : 'text-ink-muted'
                  )}
                >
                  {role.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <PickerLabel>Experience level</PickerLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {levels.map((level) => {
            const selected = value.level === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => pickLevel(level.value)}
                aria-pressed={selected}
                className={clsx(
                  'rounded-md border px-3.5 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line-strong bg-sheet hover:border-ink'
                )}
              >
                {level.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
