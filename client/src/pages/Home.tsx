/** Pause design reminder: Field Archive — contemporary archival editorial design. */
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  ExternalLink,
  LibraryBig,
  Pause as PauseIcon,
  Play,
  Plus,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArchiveFooter, ArchiveHeader } from "@/components/ArchiveChrome";
import { getNextPauseExplorerRecordIndex } from "@/lib/pauseExplorer";
import { trpc } from "@/lib/trpc";

const archivalPrinciples = [
  {
    number: "01",
    title: "Human-selected",
    text: "Every entry is here because a person can explain why it is worth returning to.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Source-first",
    text: "Original manuals, code, papers, and firsthand accounts outrank summaries about them.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Built to persist",
    text: "The index links outward to institutions and projects working on durable access.",
    icon: LibraryBig,
  },
];

const pauseExplorerModes = [
  { id: "all", label: "Entire shelf", note: "A cross-section of the verified record." },
  { id: "computer_architecture", label: "Architecture", note: "Machine and system blueprints." },
  { id: "operating_systems", label: "Systems", note: "Operating-system decisions in context." },
  { id: "networks", label: "Networks", note: "Protocols and shared infrastructure." },
  { id: "databases", label: "Data", note: "Storage, queries, and consistency choices." },
] as const;

type PauseExplorerMode = (typeof pauseExplorerModes)[number]["id"];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-eyebrow">{children}</p>;
}

function formatSourceKind(sourceKind: string) {
  return sourceKind.replaceAll("_", " ");
}

function formatSourceSubject(sourceSubject: string) {
  return sourceSubject.replaceAll("_", " ");
}

function formatYearRange(originalYearStart: number | null, originalYearEnd: number | null) {
  if (!originalYearStart) return "Era undated";
  if (!originalYearEnd || originalYearEnd === originalYearStart) return String(originalYearStart);
  return `${originalYearStart}–${originalYearEnd}`;
}

export default function Home() {
  const { data: publishedSources = [], isLoading: isCatalogLoading } = trpc.catalog.list.useQuery({});
  const { data: catalogStats } = trpc.catalog.stats.useQuery();
  const [activePauseExplorerMode, setActivePauseExplorerMode] = useState<PauseExplorerMode>("computer_architecture");
  const [focusedPauseRecordIndex, setFocusedPauseRecordIndex] = useState(0);
  const [isSingleRecordMode, setIsSingleRecordMode] = useState(false);

  const pauseExplorerSources = useMemo(() => {
    const subjectMatchedSources = activePauseExplorerMode === "all"
      ? publishedSources
      : publishedSources.filter(source => source.primarySubject === activePauseExplorerMode);

    return subjectMatchedSources.length > 0 ? subjectMatchedSources : publishedSources;
  }, [activePauseExplorerMode, publishedSources]);

  const focusedPauseRecord = pauseExplorerSources.length > 0
    ? pauseExplorerSources[focusedPauseRecordIndex % pauseExplorerSources.length]
    : undefined;

  const featuredSources = useMemo(() => {
    const architectureFirstSources = publishedSources.filter(source =>
      ["computer_architecture", "operating_systems", "networks", "databases"].includes(source.primarySubject),
    );
    const remainingSources = publishedSources.filter(source => !architectureFirstSources.includes(source));

    return [...architectureFirstSources, ...remainingSources].slice(0, 6);
  }, [publishedSources]);
  const publishedSourceCount = catalogStats?.publishedSourceCount ?? publishedSources.length;

  function choosePauseExplorerMode(explorerMode: PauseExplorerMode) {
    if (isSingleRecordMode) return;

    setActivePauseExplorerMode(explorerMode);
    setFocusedPauseRecordIndex(0);
  }

  function moveFocusedPauseRecord(direction: -1 | 1) {
    const availableRecordCount = pauseExplorerSources.length;
    if (availableRecordCount === 0) return;

    setFocusedPauseRecordIndex(currentIndex =>
      getNextPauseExplorerRecordIndex({
        currentRecordIndex: currentIndex,
        availableRecordCount,
        direction,
        isSequencePaused: isSingleRecordMode,
      }),
    );
  }

  return (
    <div className="pause-site-shell overflow-hidden">
      <ArchiveHeader findingAid="PAUSE / 002" />

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy-column">
            <p className="hero-prelude">
              <strong>PROVENANCE NOTE / 2026</strong> / Built using AI, in support of its responsible and expansive use.
            </p>
            <div className="hero-title-wrap">
              <span className="hero-title-index">PAUSE / 002</span>
              <h1>A reference shelf for the human record.</h1>
            </div>
            <p className="hero-description">
              Accurate documentation of human advances before the generative-AI explosion feels imperative. Pause is a hand-built, independently checked index of programs, manuals, architecture, source code, and the thinking that got us here.
            </p>
            <div className="hero-actions">
              <Link className="primary-action" href="/catalog">
                Browse the catalog <ArrowDownRight size={17} strokeWidth={1.8} />
              </Link>
              <Link className="text-action" href="/contribute">
                Submit a source <Plus size={16} strokeWidth={1.8} />
              </Link>
            </div>
            <div className="hero-microcopy">
              <span>Human-selected</span>
              <span>Verified provenance</span>
              <span>Open contribution model</span>
            </div>
          </div>

          <div className="hero-visual-column" aria-label="An archival computing workspace">
            <div className="hero-visual-frame">
              <img src="/manus-storage/pause-hero-archive_2e519120.jpg" alt="Archival technical materials arranged on a research desk" />
              <div className="hero-visual-caption">
                <span className="caption-rule" />
                <p>
                  <strong>FIELD NOTE 02</strong>
                  Knowledge survives when somebody decides it is worth finding again.
                </p>
              </div>
            </div>
            <div className="hero-acquisition-card">
              <span>VERIFIED SHELF</span>
              <strong>{String(publishedSourceCount).padStart(2, "0")}</strong>
              <p>public records with source, scope, era, and access context.</p>
            </div>
          </div>
        </section>

        <section className="statement-strip" aria-label="Pause purpose statement">
          <div className="statement-mark">⟦Ⅱ⟧</div>
          <p>
            <span>Pause is not an anti-AI project.</span> It is an argument for keeping the raw material close: the human decisions, trade-offs, failure modes, and systems knowledge that new tools cannot manufacture retroactively.
          </p>
          <Link href="/catalog" aria-label="Browse the Pause catalog">
            <ArrowDownRight size={24} strokeWidth={1.4} />
          </Link>
        </section>

        <section className="pause-explorer-section" aria-labelledby="pause-explorer-title">
          <div className="pause-explorer-heading">
            <div>
              <SectionEyebrow>THE PAUSE INTERFACE</SectionEyebrow>
              <h2 id="pause-explorer-title">Slow the shelf down. Inspect one decision trail at a time.</h2>
            </div>
            <p>
              Choose a systems thread, then sequence through the catalog without losing the source, era, or steward behind the idea.
            </p>
          </div>

          <div className="pause-explorer-console">
            <div className="pause-explorer-rail" aria-label="Choose a catalog thread">
              <div className="pause-explorer-rail-topline">
                <Compass size={18} strokeWidth={1.5} />
                <span>SELECT A THREAD</span>
              </div>
              <div className="pause-explorer-mode-list">
                {pauseExplorerModes.map(explorerMode => {
                  const modeSourceCount = explorerMode.id === "all"
                    ? publishedSources.length
                    : publishedSources.filter(source => source.primarySubject === explorerMode.id).length;

                  return (
                    <button
                      className={`pause-explorer-mode ${activePauseExplorerMode === explorerMode.id ? "is-active" : ""}`}
                      type="button"
                      key={explorerMode.id}
                      onClick={() => choosePauseExplorerMode(explorerMode.id)}
                      aria-pressed={activePauseExplorerMode === explorerMode.id}
                      disabled={isSingleRecordMode}
                    >
                      <span>
                        <strong>{explorerMode.label}</strong>
                        <small>{explorerMode.note}</small>
                      </span>
                      <em>{String(modeSourceCount).padStart(2, "0")}</em>
                    </button>
                  );
                })}
              </div>
              <button
                className={`pause-mode-toggle ${isSingleRecordMode ? "is-active" : ""}`}
                type="button"
                onClick={() => setIsSingleRecordMode(currentMode => !currentMode)}
                aria-pressed={isSingleRecordMode}
              >
                {isSingleRecordMode ? <Play size={15} strokeWidth={1.7} /> : <PauseIcon size={15} strokeWidth={1.7} />}
                {isSingleRecordMode ? "Resume shelf view" : "Pause on this record"}
              </button>
            </div>

            <article className={`pause-focus-record ${isSingleRecordMode ? "is-paused" : ""}`} aria-live="polite">
              {focusedPauseRecord ? (
                <>
                  <div className="pause-focus-topline">
                    <span>FOCUS RECORD / {focusedPauseRecord.accession}</span>
                    <span>{isSingleRecordMode ? "SEQUENCE PAUSED" : `${String(focusedPauseRecordIndex + 1).padStart(2, "0")} / ${String(pauseExplorerSources.length).padStart(2, "0")}`}</span>
                  </div>
                  <div className="pause-focus-body">
                    <p className="pause-focus-kicker">{formatSourceSubject(focusedPauseRecord.primarySubject)}</p>
                    <h3>{focusedPauseRecord.title}</h3>
                    <p>{focusedPauseRecord.whyItMatters}</p>
                  </div>
                  <div className="pause-focus-footer">
                    <dl>
                      <div>
                        <dt>Original era</dt>
                        <dd>{formatYearRange(focusedPauseRecord.originalYearStart, focusedPauseRecord.originalYearEnd)}</dd>
                      </div>
                      <div>
                        <dt>Steward</dt>
                        <dd>{focusedPauseRecord.steward ?? "Independent record"}</dd>
                      </div>
                    </dl>
                    <a href={focusedPauseRecord.canonicalUrl} target="_blank" rel="noreferrer" className="pause-focus-source-link">
                      Open source <ExternalLink size={16} strokeWidth={1.7} />
                    </a>
                  </div>
                  <div className="pause-focus-controls" aria-label="Sequence through records">
                    <button type="button" onClick={() => moveFocusedPauseRecord(-1)} aria-label="Previous source record" disabled={isSingleRecordMode}>
                      <ArrowLeft size={18} strokeWidth={1.6} />
                    </button>
                    <div className="pause-focus-progress" aria-hidden="true">
                      {pauseExplorerSources.map((source, sourceIndex) => (
                        <span className={sourceIndex === focusedPauseRecordIndex ? "is-active" : ""} key={source.accession} />
                      ))}
                    </div>
                    <button type="button" onClick={() => moveFocusedPauseRecord(1)} aria-label="Next source record" disabled={isSingleRecordMode}>
                      <ArrowRight size={18} strokeWidth={1.6} />
                    </button>
                  </div>
                </>
              ) : (
                <p className="pause-explorer-loading">Opening a source trail…</p>
              )}
            </article>
          </div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading-row">
            <div>
              <SectionEyebrow>THE VERIFIED SHELF</SectionEyebrow>
              <h2>Places to begin, before you decide what to build next.</h2>
            </div>
            <p className="section-side-note">Every public record carries a canonical link, original era, steward, and access note.</p>
          </div>

          <div className="collection-toolbar collection-toolbar-home">
            <p className="collection-count">{String(publishedSourceCount).padStart(2, "0")} verified sources in the catalog</p>
            <Link className="inline-link" href="/catalog">
              Search all records <ArrowUpRight size={17} strokeWidth={1.7} />
            </Link>
          </div>

          <div className="resource-ledger">
            {isCatalogLoading && <p className="catalog-loading-note">Opening the source ledger…</p>}
            {featuredSources.map(source => (
              <a className="resource-record" key={source.accession} href={source.canonicalUrl} target="_blank" rel="noreferrer">
                <div className="record-accession">
                  <span>{source.accession}</span>
                  <span className="record-category">{formatSourceKind(source.sourceKind)}</span>
                </div>
                <div className="record-main">
                  <div className="record-title-line">
                    <h3>{source.title}</h3>
                    <ExternalLink className="record-external-icon" size={17} strokeWidth={1.8} />
                  </div>
                  <p>{source.description}</p>
                </div>
                <div className="record-meta">
                  <span>{formatYearRange(source.originalYearStart, source.originalYearEnd)}</span>
                  <span>{source.steward ?? "Independent record"}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="context-section">
          <div className="context-photo-wrap">
            <img src="/manus-storage/pause-sourcecode-detail_887f2420.jpg" alt="Vintage technical manual and punch cards arranged on a desk" />
            <div className="photo-card-note">
              <span>REFERENCE, NOT REVERENCE</span>
              <p>The old work earns a place here because it can still teach us something operational.</p>
            </div>
          </div>
          <div className="context-copy">
            <SectionEyebrow>WHY PAUSE EXISTS</SectionEyebrow>
            <h2>Software has a memory problem.</h2>
            <p>
              We inherit abstractions without always inheriting the reasoning that made them necessary. A compiler error, a distributed-systems constraint, or a database design can look new until you find the manual, program, or paper where someone already described the trade-off.
            </p>
            <p>
              Pause keeps a trail back to that work. It makes no claim that the past was cleaner. It only insists that a field moving faster should become more—not less—legible to the people working inside it.
            </p>
            <Link className="inline-link" href="/catalog">
              Inspect the catalog standard <ArrowUpRight size={17} strokeWidth={1.7} />
            </Link>
          </div>
        </section>

        <section className="principles-section">
          <div className="principles-heading">
            <SectionEyebrow>THE KEEPER’S RULE</SectionEyebrow>
            <p>Include the sources that help a careful reader reconstruct a chain of human reasoning.</p>
          </div>
          <div className="principles-grid">
            {archivalPrinciples.map(principle => {
              const PrincipleIcon = principle.icon;
              return (
                <article className="principle-card" key={principle.number}>
                  <div className="principle-card-topline">
                    <span>{principle.number}</span>
                    <PrincipleIcon size={21} strokeWidth={1.5} />
                  </div>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="contribute-section" id="contribute">
          <div className="contribute-panel">
            <div className="contribute-copy">
              <SectionEyebrow>OPEN THE NEXT FOLDER</SectionEyebrow>
              <h2>Know a source we will still need in ten years?</h2>
              <p>
                Add the original reference, its era, a technical description, and why it helps reconstruct a decision trail. Every submission is reviewed before it reaches the public shelf.
              </p>
              <Link className="primary-action light-action" href="/contribute">
                Propose a source <ArrowUpRight size={17} strokeWidth={1.8} />
              </Link>
            </div>
            <div className="contribute-image-wrap">
              <img src="/manus-storage/pause-systems-grid_5f75bdcd.jpg" alt="Abstract computing diagrams and archival paper materials" />
            </div>
          </div>
        </section>
      </main>

      <ArchiveFooter />
    </div>
  );
}
