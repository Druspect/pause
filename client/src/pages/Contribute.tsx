import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, FilePlus2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArchiveFooter, ArchiveHeader } from "@/components/ArchiveChrome";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const subjectOptions = [
  ["", "Choose a primary subject"],
  ["programming_languages", "Programming languages"],
  ["operating_systems", "Operating systems"],
  ["computer_architecture", "Computer architecture"],
  ["compilers_and_toolchains", "Compilers and toolchains"],
  ["networks", "Networks"],
  ["databases", "Databases"],
  ["graphics", "Graphics"],
  ["security", "Security"],
  ["source_code", "Source code"],
  ["manuals", "Manuals"],
  ["oral_histories", "Oral histories"],
  ["general_computing_history", "General computing history"],
] as const;

const sourceKindOptions = [
  ["", "Choose a source type"],
  ["archive", "Archive"],
  ["book", "Book"],
  ["documentation", "Documentation"],
  ["manual", "Manual"],
  ["oral_history", "Oral history"],
  ["paper", "Paper"],
  ["software", "Software"],
  ["source_code", "Source code"],
] as const;

type SubmissionFormValues = {
  title: string;
  sourceUrl: string;
  originalYear: string;
  proposedSubject: string;
  sourceKind: string;
  technicalSummary: string;
  lastingValue: string;
  accessNotes: string;
};

const initialSubmissionFormValues: SubmissionFormValues = {
  title: "",
  sourceUrl: "",
  originalYear: "",
  proposedSubject: "",
  sourceKind: "",
  technicalSummary: "",
  lastingValue: "",
  accessNotes: "",
};

export default function Contribute() {
  const { user, loading, isAuthenticated } = useAuth();
  const catalogUtilities = trpc.useUtils();
  const [submissionFormValues, setSubmissionFormValues] = useState<SubmissionFormValues>(initialSubmissionFormValues);
  const { data: mySubmissions = [] } = trpc.submissions.mine.useQuery(undefined, { enabled: isAuthenticated });

  const createSubmissionMutation = trpc.submissions.create.useMutation({
    onSuccess: async () => {
      setSubmissionFormValues(initialSubmissionFormValues);
      await catalogUtilities.submissions.mine.invalidate();
      toast.success("Source proposal recorded for editorial review.");
    },
    onError: error => {
      toast.error(error.message || "The proposal could not be recorded. Please try again.");
    },
  });

  const updateSubmissionField = (field: keyof SubmissionFormValues, value: string) => {
    setSubmissionFormValues(currentValues => ({ ...currentValues, [field]: value }));
  };

  const handleSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated) {
      startLogin();
      return;
    }

    const parsedOriginalYear = submissionFormValues.originalYear ? Number(submissionFormValues.originalYear) : undefined;
    createSubmissionMutation.mutate({
      title: submissionFormValues.title,
      sourceUrl: submissionFormValues.sourceUrl,
      originalYear: parsedOriginalYear,
      proposedSubject: submissionFormValues.proposedSubject
        ? (submissionFormValues.proposedSubject as Exclude<(typeof subjectOptions)[number][0], "">)
        : undefined,
      sourceKind: submissionFormValues.sourceKind
        ? (submissionFormValues.sourceKind as Exclude<(typeof sourceKindOptions)[number][0], "">)
        : undefined,
      technicalSummary: submissionFormValues.technicalSummary,
      lastingValue: submissionFormValues.lastingValue,
      accessNotes: submissionFormValues.accessNotes || undefined,
    });
  };

  return (
    <div className="pause-site-shell">
      <ArchiveHeader findingAid="SUBMISSIONS / 001" />
      <main className="archive-page-main contribution-page-main">
        <section className="contribution-intro">
          <div>
            <p className="section-eyebrow">PROPOSE A SOURCE</p>
            <h1>Help keep the decision trail intact.</h1>
          </div>
          <div className="contribution-intro-note">
            <p>
              Pause publishes only sources that an editor can trace to a steward or original context. A strong proposal identifies the primary material, explains its technical value, and names any access or rights caveat.
            </p>
            <Link className="inline-link" href="/catalog">
              <ArrowLeft size={17} strokeWidth={1.7} /> Return to the catalog
            </Link>
          </div>
        </section>

        <section className="contribution-layout">
          <aside className="contribution-guidance">
            <div className="contribution-guidance-icon"><FilePlus2 size={22} strokeWidth={1.5} /></div>
            <h2>What makes the shelf</h2>
            <ol>
              <li><strong>Original material.</strong><span>Manuals, source code, papers, programs, or informed firsthand records come first.</span></li>
              <li><strong>A practical thread.</strong><span>Explain what a future builder can learn or reconstruct from this source.</span></li>
              <li><strong>Traceable provenance.</strong><span>Point to the canonical steward, publisher, museum, university, or project.</span></li>
            </ol>
            <p className="contribution-guidance-note">Submissions are not public by default. Editorial review comes before inclusion.</p>
          </aside>

          <section className="contribution-form-panel">
            {!loading && !isAuthenticated && (
              <div className="signin-callout">
                <LockKeyhole size={18} strokeWidth={1.7} />
                <div>
                  <strong>Sign in to add a proposal.</strong>
                  <p>Your name is attached to the review queue, not the public source record.</p>
                </div>
                <button className="primary-action" type="button" onClick={startLogin}>Sign in</button>
              </div>
            )}

            {isAuthenticated && (
              <div className="contributor-identity">
                <CheckCircle2 size={17} strokeWidth={1.8} />
                <span>Submitting as <strong>{user?.name || user?.email || "a Pause contributor"}</strong></span>
              </div>
            )}

            <form className="source-proposal-form" onSubmit={handleSubmission}>
              <fieldset disabled={createSubmissionMutation.isPending || loading}>
                <div className="form-grid-two">
                  <label>
                    <span>Source title <b>*</b></span>
                    <input required value={submissionFormValues.title} onChange={event => updateSubmissionField("title", event.target.value)} placeholder="e.g., Project, paper, archive, or manual title" />
                  </label>
                  <label>
                    <span>Canonical URL <b>*</b></span>
                    <input required type="url" value={submissionFormValues.sourceUrl} onChange={event => updateSubmissionField("sourceUrl", event.target.value)} placeholder="https://" />
                  </label>
                  <label>
                    <span>Original year</span>
                    <input type="number" min="1800" max={new Date().getFullYear()} value={submissionFormValues.originalYear} onChange={event => updateSubmissionField("originalYear", event.target.value)} placeholder="e.g., 1976" />
                  </label>
                  <label>
                    <span>Primary subject</span>
                    <select value={submissionFormValues.proposedSubject} onChange={event => updateSubmissionField("proposedSubject", event.target.value)}>
                      {subjectOptions.map(([value, label]) => <option key={value || "placeholder"} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <label className="form-span-two">
                    <span>Source type</span>
                    <select value={submissionFormValues.sourceKind} onChange={event => updateSubmissionField("sourceKind", event.target.value)}>
                      {sourceKindOptions.map(([value, label]) => <option key={value || "placeholder"} value={value}>{label}</option>)}
                    </select>
                  </label>
                </div>

                <label>
                  <span>What does the reader find here? <b>*</b></span>
                  <textarea required minLength={30} value={submissionFormValues.technicalSummary} onChange={event => updateSubmissionField("technicalSummary", event.target.value)} placeholder="Describe the material, its original setting, and the systems or ideas it exposes." rows={5} />
                </label>
                <label>
                  <span>Why will it still matter? <b>*</b></span>
                  <textarea required minLength={30} value={submissionFormValues.lastingValue} onChange={event => updateSubmissionField("lastingValue", event.target.value)} placeholder="Name the concrete technical question, trade-off, or design decision this source helps a future reader understand." rows={5} />
                </label>
                <label>
                  <span>Access, license, or preservation note</span>
                  <textarea value={submissionFormValues.accessNotes} onChange={event => updateSubmissionField("accessNotes", event.target.value)} placeholder="Optional: non-commercial limitation, archive mirror, login requirement, or other caveat." rows={3} />
                </label>

                <button className="primary-action form-submit-action" type="submit">
                  {createSubmissionMutation.isPending ? "Recording proposal…" : isAuthenticated ? "Send to editorial review" : "Sign in to send proposal"}
                  <ArrowUpRight size={17} strokeWidth={1.8} />
                </button>
              </fieldset>
            </form>
          </section>
        </section>

        {isAuthenticated && mySubmissions.length > 0 && (
          <section className="my-submissions-section">
            <div className="my-submissions-heading">
              <p className="section-eyebrow">YOUR PROPOSALS</p>
              <p>These records are visible to you and the editors while they are reviewed.</p>
            </div>
            <div className="my-submissions-list">
              {mySubmissions.map(submission => (
                <article className="my-submission-row" key={submission.id}>
                  <div><span>{submission.status}</span><h2>{submission.title}</h2></div>
                  <p>{new Date(submission.createdAt).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <ArchiveFooter />
    </div>
  );
}
