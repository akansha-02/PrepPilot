import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Field';
import RoleSelector from '../components/interview/RoleSelector';
import { sessionsApi } from '../lib/api';

const sourceOptions = [
  { value: 'resume', label: 'Resume' },
  { value: 'job-description', label: 'Job description' }
];

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
  const [fileMessage, setFileMessage] = useState('');

  const hasManualText = Boolean(form.sourceText.trim());
  const canSubmit = Boolean(form.role && form.level && (form.sourceType === 'resume' ? (resumeFile || hasManualText) : hasManualText));

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setResumeFile(selectedFile);
    setFileMessage(selectedFile ? `${selectedFile.name} selected` : '');
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">
            New session
          </div>
          <h2 className="section-title mt-4">Create a focused interview session</h2>
          <p className="section-copy">Upload a resume or paste a job description, then generate role-specific questions and AI feedback in one flow.</p>
        </div>
        <Card className="bg-white/5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['1', 'Select role', 'Choose the interview track and level.'],
              ['2', 'Add source', 'Upload a resume or paste a JD.'],
              ['3', 'Start interview', 'Generate questions and begin answering.']
            ].map(([step, title, copy]) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Step {step}</p>
                <p className="mt-2 font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <form onSubmit={createSession} className="grid gap-6">
        <RoleSelector value={form} onChange={(next) => setForm(next)} />

        <Card>
          <label className="label">Source type</label>
          <Select value={form.sourceType} onChange={(event) => setForm({ ...form, sourceType: event.target.value })}>
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <label className="label">Session title</label>
            <Input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Frontend interview prep for Acme"
            />
          </Card>
          <Card>
            <label className="label">Instructions</label>
            <p className="text-sm leading-6 text-slate-300">
              Use a resume upload for candidate-specific practice or paste a job description to simulate a live interview brief.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">PDF, TXT, or MD resume</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Structured AI feedback</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Saved sessions</span>
            </div>
          </Card>
        </div>

        {form.sourceType === 'resume' ? (
          <Card className="border-dashed border-white/15 bg-white/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <label className="label">Upload resume</label>
                <p className="text-sm leading-6 text-slate-300">
                  Upload a PDF, TXT, or MD resume. If you prefer, you can also paste resume text below as a fallback.
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">Supported: .pdf, .txt, .md</p>
              </div>
              <div className="min-w-[280px] rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                <input
                  type="file"
                  accept=".pdf,.txt,.md,application/pdf,text/plain"
                  onChange={handleFileChange}
                  className="block w-full cursor-pointer rounded-2xl border border-dashed border-slate-500/30 bg-white/5 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:bg-white/10"
                />
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <p>{fileMessage || 'No resume uploaded yet.'}</p>
                  {resumeFile && (
                    <p className="text-slate-400">{Math.round(resumeFile.size / 1024)} KB</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <Card>
          <label className="label">Resume text or job description</label>
          <Textarea
            value={form.sourceText}
            onChange={(event) => setForm({ ...form, sourceText: event.target.value })}
            placeholder={form.sourceType === 'resume' ? 'Paste resume text here if you are not uploading a file...' : 'Paste the job description here...'}
            required={form.sourceType !== 'resume' || !resumeFile}
          />
        </Card>

        {error && <p className="text-sm font-medium text-red-300">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting || !canSubmit}>
            {submitting ? 'Creating session...' : 'Generate questions'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}