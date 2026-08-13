import { Archive, ArrowUpRight, BookOpenText, Database, Landmark, Network, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";
import { ArchiveFooter, ArchiveHeader } from "@/components/ArchiveChrome";
import { buildCuratedCollectionSummary } from "@/lib/curationOverview";
import { trpc } from "@/lib/trpc";

const overviewSubjectOrder = [
  "computer_architecture",
  "operating_systems",
  "networks",
  "databases",
  "programming_languages",
  "source_code",
  "manuals",
  "general_computing_history",
] as const;

const subjectIcons = {
  computer_architecture: Landmark,
  operating_systems: Archive,
  networks: Network,
  databases: Database,
  programming_languages: BookOpenText,
  source_code: Archive,
  manuals: BookOpenText,
  general_computing_history: Landmark,
};

const eraBands = [
  { label: "1960s or earlier", startYear: 0, endYear: 1969 },
  { label: "1970s", startYear: 1970, endYear: 1979 },
  { label: "1980s", startYear: 1980, endYear: 1989 },
  { label: "1990s", startYear: 1990, endYear: 1999 },
  { label: "2000s", startYear: 2000, endYear: 2009 },
  { label: "2010 to 2021", startYear: 2010, endYear: 2021 },
];

function formatSubjectLabel(subject: string) {
  return subject.replaceAll("_", " ");
}

function formatSourceKind(sourceKind: string) {
  return sourceKind.replaceAll("_", " ");
}

export default function Overview() {
  const { data: catalogSources = [], isLoading, isError } = trpc.catalog.list.useQuery({});

  const collectionOverview = useMemo(() => buildCuratedCollectionSummary(catalogSources), [catalogSources]);

  const subjectSummaries = useMemo(
    () => overviewSubjectOrder
      .map(subject => ({
        subject,
        count: catalogSources.filter(source => source.primarySubject === subject).length,
      }))
      .filter(summary => summary.count > 0),
    [catalogSources],
  );

  const eraSummaries = useMemo(
    () => eraBands.map(eraBand => ({
      ...eraBand,
      count: catalogSources.filter(source =>
        typeof source.originalYearStart === "number"
        && source.originalYearStart >= eraBand.startYear
        && source.originalYearStart <= eraBand.endYear,
      ).length,
    })),
    [catalogSources],
  );

  const sourceKindSummaries = useMemo(
    () => Object.entries(collectionOverview.sourceKindCounts).sort((leftEntry, rightEntry) => rightEntry[1] - leftEntry[1]),
    [collectionOverview.sourceKindCounts],
  );

  return (
    <div className="pause-site-shell">
      <ArchiveHeader findingAid="OVERVIEW / 001" />
      <main className="archive-page-main overview-page-main">
        <section className="overview-intro">
          <div>
            <p className="section-eyebrow">THE CURATED SHELF</p>
            <h1>A working map of where computing learned to think.</h1>
          </div>
          <div className="overview-intro-note">
            <p>
              Pause does not try to preserve everything. It keeps an inspectable route back to the systems, documents, code, and institutions that explain how key technical decisions were made.
            </p>
            <Link className="inline-link" href="/catalog">
              Browse each record <ArrowUpRight size={17} strokeWidth={1.7} />
            </Link>
          </div>
        </section>

        {isLoading && <p className="catalog-state-note">Reading the curated shelf…</p>}
        {isError && <p className="catalog-state-note">The overview could not be opened. Please refresh and try again.</p>}

        {!isLoading && !isError && (
          <>
            <section className="overview-brief" aria-label="Collection snapshot">
              <article>
                <span>VERIFIED RECORDS</span>
                <strong>{String(catalogSources.length).padStart(2, "0")}</strong>
                <p>Every visible record has a canonical source and a reviewed reason to remain findable.</p>
              </article>
              <article>
                <span>STEWARDS REPRESENTED</span>
                <strong>{String(collectionOverview.distinctStewardCount).padStart(2, "0")}</strong>
                <p>Institutions, projects, publishers, and original organizations carry the underlying record.</p>
              </article>
              <article>
                <span>EARLIEST ORIGINAL ERA</span>
                <strong>{collectionOverview.earliestSourceYear ?? "N/A"}</strong>
                <p>The catalog begins where durable primary material and technical context can be verified.</p>
              </article>
            </section>

            <section className="overview-section overview-subject-section">
              <div className="overview-section-heading">
                <div>
                  <p className="section-eyebrow">WHAT THE SHELF COVERS</p>
                  <h2>Human decisions, grouped by the systems they made possible.</h2>
                </div>
                <p>These are curation lenses, not claims that one field can be separated cleanly from another.</p>
              </div>
              <div className="overview-subject-grid">
                {subjectSummaries.map(summary => {
                  const SubjectIcon = subjectIcons[summary.subject];
                  const proportion = catalogSources.length > 0 ? (summary.count / catalogSources.length) * 100 : 0;

                  return (
                    <Link className="overview-subject-card" key={summary.subject} href={`/catalog?subject=${summary.subject}`}>
                      <div className="overview-card-topline">
                        <SubjectIcon size={18} strokeWidth={1.55} />
                        <span>{String(summary.count).padStart(2, "0")}</span>
                      </div>
                      <h3>{formatSubjectLabel(summary.subject)}</h3>
                      <div className="overview-measure" aria-label={`${summary.count} records`}>
                        <span style={{ width: `${proportion}%` }} />
                      </div>
                      <p>Inspect this thread in the public catalog.</p>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="overview-section overview-timeline-section">
              <div className="overview-section-heading">
                <div>
                  <p className="section-eyebrow">THE TIME SPAN</p>
                  <h2>Not a nostalgia shelf. A chain of technical memory.</h2>
                </div>
                <p>Dates refer to the original era of a record when the responsible steward makes it clear enough to capture.</p>
              </div>
              <div className="overview-timeline">
                {eraSummaries.map(eraSummary => (
                  <div className="overview-timeline-row" key={eraSummary.label}>
                    <span>{eraSummary.label}</span>
                    <div className="overview-timeline-rule"><i style={{ width: `${catalogSources.length > 0 ? (eraSummary.count / catalogSources.length) * 100 : 0}%` }} /></div>
                    <strong>{String(eraSummary.count).padStart(2, "0")}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="overview-lower-grid">
              <article className="overview-method-card">
                <ShieldCheck size={22} strokeWidth={1.5} />
                <p className="section-eyebrow">HOW PAUSE CURATES</p>
                <h2>Provenance before popularity.</h2>
                <p>
                  An entry must lead to a primary publisher, original project, institutional steward, or a clearly documented preservation source. It also needs an era, technical scope, and a sentence explaining its use beyond nostalgia.
                </p>
                <Link className="inline-link" href="/contribute">
                  Propose a missing trail <ArrowUpRight size={17} strokeWidth={1.7} />
                </Link>
              </article>
              <article className="overview-kind-card">
                <p className="section-eyebrow">FORMS OF EVIDENCE</p>
                <div className="overview-kind-list">
                  {sourceKindSummaries.map(([sourceKind, count]) => (
                    <div key={sourceKind}>
                      <span>{formatSourceKind(sourceKind)}</span>
                      <strong>{String(count).padStart(2, "0")}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="overview-recent-section">
              <div className="overview-recent-heading">
                <div>
                  <p className="section-eyebrow">LATEST VERIFIED ACQUISITIONS</p>
                  <h2>New trails into the record.</h2>
                </div>
                <Link className="inline-link" href="/catalog">
                  See the full shelf <ArrowUpRight size={17} strokeWidth={1.7} />
                </Link>
              </div>
              <div className="overview-recent-grid">
                {collectionOverview.mostRecentAccessions.map(source => (
                  <a className="overview-recent-record" key={source.accession} href={source.canonicalUrl} target="_blank" rel="noreferrer">
                    <span>{source.accession}</span>
                    <h3>{source.title}</h3>
                    <p>{formatSubjectLabel(source.primarySubject)}</p>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <ArchiveFooter />
    </div>
  );
}
