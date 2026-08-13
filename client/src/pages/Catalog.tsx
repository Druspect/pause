import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { ArchiveFooter, ArchiveHeader } from "@/components/ArchiveChrome";
import { trpc } from "@/lib/trpc";

const subjectFilters = [
  { value: "all", label: "All subjects" },
  { value: "operating_systems", label: "Operating systems" },
  { value: "computer_architecture", label: "Architecture" },
  { value: "networks", label: "Networks" },
  { value: "databases", label: "Databases" },
  { value: "programming_languages", label: "Languages" },
  { value: "source_code", label: "Source code" },
  { value: "manuals", label: "Manuals" },
  { value: "general_computing_history", label: "Computing history" },
] as const;

const sourceKindFilters = [
  { value: "all", label: "All source types" },
  { value: "archive", label: "Archives" },
  { value: "source_code", label: "Source code" },
  { value: "book", label: "Books" },
  { value: "documentation", label: "Documentation" },
  { value: "software", label: "Software" },
] as const;

type SubjectFilterValue = (typeof subjectFilters)[number]["value"];
type SourceKindFilterValue = (typeof sourceKindFilters)[number]["value"];

function getInitialSubjectFilter(): SubjectFilterValue {
  if (typeof window === "undefined") return "all";

  const requestedSubject = new URLSearchParams(window.location.search).get("subject");
  const matchingSubject = subjectFilters.find(filter => filter.value === requestedSubject);

  return matchingSubject?.value ?? "all";
}

function formatEnumLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatYearRange(originalYearStart: number | null, originalYearEnd: number | null) {
  if (!originalYearStart) return "Era undated";
  if (!originalYearEnd || originalYearEnd === originalYearStart) return String(originalYearStart);
  return `${originalYearStart}–${originalYearEnd}`;
}

export default function Catalog() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilterValue>(getInitialSubjectFilter);
  const [selectedSourceKind, setSelectedSourceKind] = useState<SourceKindFilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const catalogQueryInput = useMemo(
    () => ({
      primarySubject: selectedSubject === "all" ? undefined : selectedSubject,
      sourceKind: selectedSourceKind === "all" ? undefined : selectedSourceKind,
      query: searchTerm.trim() || undefined,
    }),
    [searchTerm, selectedSourceKind, selectedSubject],
  );

  const { data: sources = [], isLoading, isError } = trpc.catalog.list.useQuery(catalogQueryInput);

  return (
    <div className="pause-site-shell">
      <ArchiveHeader findingAid="CATALOG / 001" />
      <main className="archive-page-main">
        <section className="catalog-intro">
          <div>
            <p className="section-eyebrow">PUBLIC SOURCE LEDGER</p>
            <h1>Browse the verified record.</h1>
          </div>
          <div className="catalog-intro-note">
            <p>
              Each published entry has a canonical link, an original era, a responsible steward where available, and an access or rights note. Records without that minimum context stay out of the public shelf.
            </p>
            <Link className="inline-link" href="/contribute">
              Suggest a missing source <ArrowUpRight size={17} strokeWidth={1.7} />
            </Link>
          </div>
        </section>

        <section className="catalog-controls" aria-label="Catalog filters">
          <label className="catalog-search-field">
            <Search size={17} strokeWidth={1.7} />
            <span className="sr-only">Search catalog</span>
            <input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search title, steward, or description" />
          </label>
          <div className="catalog-filter-group">
            <span className="catalog-filter-label"><SlidersHorizontal size={14} /> Subject</span>
            <div className="catalog-filter-list">
              {subjectFilters.map(filter => (
                <button
                  className={selectedSubject === filter.value ? "filter-chip is-active" : "filter-chip"}
                  key={filter.value}
                  onClick={() => setSelectedSubject(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="catalog-filter-group">
            <span className="catalog-filter-label">Type</span>
            <div className="catalog-filter-list">
              {sourceKindFilters.map(filter => (
                <button
                  className={selectedSourceKind === filter.value ? "filter-chip is-active" : "filter-chip"}
                  key={filter.value}
                  onClick={() => setSelectedSourceKind(filter.value)}
                  type="button"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="catalog-results" aria-live="polite">
          <div className="catalog-result-summary">
            <span>CATALOG RESULTS</span>
            <span>{isLoading ? "Updating ledger" : `${String(sources.length).padStart(2, "0")} published records`}</span>
          </div>

          {isError && <p className="catalog-state-note">The public ledger could not be opened. Please refresh and try again.</p>}
          {isLoading && <p className="catalog-state-note">Opening the verified source ledger…</p>}
          {!isLoading && !isError && sources.length === 0 && (
            <p className="catalog-state-note">No published records match these filters. Try a wider subject or a shorter search.</p>
          )}

          <div className="catalog-card-grid">
            {sources.map(source => (
              <article className="catalog-source-card" key={source.accession}>
                <div className="catalog-card-topline">
                  <span>{source.accession}</span>
                  <span>{formatEnumLabel(source.sourceKind)}</span>
                </div>
                <h2>{source.title}</h2>
                <p className="catalog-card-description">{source.description}</p>
                <p className="catalog-card-matters"><strong>Why it matters.</strong> {source.whyItMatters}</p>
                <dl className="catalog-card-facts">
                  <div><dt>Era</dt><dd>{formatYearRange(source.originalYearStart, source.originalYearEnd)}</dd></div>
                  <div><dt>Subject</dt><dd>{formatEnumLabel(source.primarySubject)}</dd></div>
                  <div><dt>Steward</dt><dd>{source.steward ?? "Not specified"}</dd></div>
                  <div><dt>Access</dt><dd>{source.accessNotes ?? "No additional note recorded."}</dd></div>
                </dl>
                <a className="catalog-source-link" href={source.canonicalUrl} target="_blank" rel="noreferrer">
                  Visit canonical source <ExternalLink size={16} strokeWidth={1.8} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <ArchiveFooter />
    </div>
  );
}
