import Card from '../ui/Card';
import { levels, roles } from '../../lib/roles';
import { Select } from '../ui/Field';

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <label className="label">Role</label>
        <Select value={value.role} onChange={(event) => onChange({ ...value, role: event.target.value })}>
          <option value="">Choose a role</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </Select>
        <p className="mt-3 text-sm text-slate-400">Select the interview track you want to practice.</p>
      </Card>

      <Card>
        <label className="label">Level</label>
        <Select value={value.level} onChange={(event) => onChange({ ...value, level: event.target.value })}>
          <option value="">Choose a level</option>
          {levels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </Select>
        <p className="mt-3 text-sm text-slate-400">Tune the question difficulty to match the candidate profile.</p>
      </Card>
    </div>
  );
}