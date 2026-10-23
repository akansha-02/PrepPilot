import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Field';
import RoleSelector from '../components/interview/RoleSelector';
import { sessionsApi } from '../lib/api';

const sourceOptions = [
  { value: 'resume', label: 'Resume' },
  { value: 'job-description', label: 'Job description' }
];

function Section({ index, title, children }) {
  return (
    <section className="sheet p-5 md:p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-ink-faint">{index}</span>
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function NewSessionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: '',
    level: '',
    sourceType: 'resume',
    title: '',
    sourceText: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const hasManualText = Boolean(form.sourceText.trim());
  const canSubmit = Boolean(form.role && form.level && (form.sourceType === 'resume' ? (resumeFile || hasManualText) : hasManualText));

  const handleFiles = (files) => {
    const selectedFile = files?.[0] || null;
    if (selectedFile) setResumeFile(selectedFile);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer?.files);
  };

  const createSession = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = form.sourceType === 'resume' && resumeFile
        ? (() => {
            const data = new FormData();
            data.append('role', form.role);
            data.append('level', form.level);
            data.append('sourceType', form.sourceType);
            data.append('title', form.title);
            data.append('sourceText', form.sourceText);
            data.append('resumeFile', resumeFile);
            return data;
          })()
        : form;

      const session = await sessionsApi.create(payload);
      await sessionsApi.generate(session.session._id, form);
      navigate(`/interview/${session.session._id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="page max-w-3xl md:py-12">
      <h2 className="page-title">Set up your interview</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Three choices stand between you and your first question.
      </p>

      <form onSubmit={createSession} className="mt-8 grid gap-4">
        <Section index="01" title="Role and level">
          <RoleSelector value={form} onChange={(next) => setForm(next)} />
        </Section>

        <Section index="02" title="Source material">
          <div className="inline-flex rounded-md border border-line-strong bg-sheet p-0.5">
            {sourceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, sourceType: option.value })}
                aria-pressed={form.sourceType === option.value}
                className={clsx(
                  'rounded-[5px] px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  form.sourceType === option.value
                    ? 'bg-ink text-paper'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {form.sourceType === 'resume' ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={clsx(
                'mt-4 rounded-lg border border-dashed p-4 transition-colors',
                dragOver ? 'border-ink bg-marker/25' : 'border-line-strong bg-paper'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {resumeFile ? resumeFile.name : 'Drop your resume here'}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    {resumeFile
                      ? `${Math.round(resumeFile.size / 1024)} KB`
                      : 'PDF, TXT, or MD'}
                  </p>
                </div>
                <label className="btn-secondary cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-ink">
                  {resumeFile ? 'Replace file' : 'Choose file'}
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,application/pdf,text/plain"
                    onChange={(event) => handleFiles(event.target.files)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <label htmlFor="sourceText" className="field-label">
              {form.sourceType === 'resume'
                ? 'Or paste resume text'
                : 'Paste the job description'}
            </label>
            <Textarea
              id="sourceText"
              className="mt-2"
              rows={7}
              value={form.sourceText}
              onChange={(event) => setForm({ ...form, sourceText: event.target.value })}
              placeholder={
                form.sourceType === 'resume'
                  ? 'Paste resume text here…'
                  : 'Paste the full job description here…'
              }
              required={form.sourceType !== 'resume' || !resumeFile}
            />
          </div>
        </Section>

        <Section index="03" title="Details">
          <label htmlFor="title" className="field-label">Title, so you can find it later</label>
          <Input
            id="title"
            className="mt-2"
            type="text"
            maxLength={80}
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="e.g. Frontend prep for GridLab"
          />
        </Section>

        {error ? (
          <p role="alert" className="text-sm font-medium text-danger">{error}</p>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting || !canSubmit}>
            {submitting ? 'Generating questions…' : 'Generate questions'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
