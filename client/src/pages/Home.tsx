/**
 * Pause design reminder: Field Archive — contemporary archival editorial design;
 * warm paper, deep ink, controlled Archive Orange, asymmetric catalog-sheet layout.
 */
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpenText,
  Code2,
  ExternalLink,
  Github,
  LibraryBig,
  Network,
  Plus,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

type ResourceCategory = "All" | "Archive" | "Architecture" | "Source Code" | "Research";

type ResourceRecord = {
  accession: string;
  title: string;
  url: string;
  category: Exclude<ResourceCategory, "All">;
  year: string;
  description: string;
  label: string;
};

const resourceCategories: ResourceCategory[] = [
  "All",
  "Archive",
  "Architecture",
  "Source Code",
  "Research",
];

const resourceRecords: ResourceRecord[] = [
  {
    accession: "P-001",
    title: "Retrocomputing Archive",
    url: "http://www.retroarchive.org/",
    category: "Archive",
    year: "1970s–2000s",
    label: "Classic programs & documentation",
    description:
      "A deep archive of classic software, programming tools, disk images, manuals, and hardware-specific collections spanning CP/M, DOS, 8080, 6502, VAX, and early online systems.",
  },
  {
    accession: "P-002",
    title: "Bitsavers",
    url: "https://bitsavers.org/",
    category: "Archive",
    year: "1950s–2000s",
    label: "Manuals, systems & components",
    description:
      "A primary-source shelf for technical manuals, software, components, communications equipment, magazines, and test gear. Essential for reconstructing systems from first principles.",
  },
  {
    accession: "P-003",
    title: "The Architecture of Open Source Applications",
    url: "https://aosabook.org/en/",
    category: "Architecture",
    year: "2011–2016",
    label: "How enduring software was built",
    description:
      "First-person architecture studies of Bash, LLVM, Git, FreeRTOS, GDB, nginx, PyPy, SQLAlchemy, Twisted, ZeroMQ, and dozens of other serious systems.",
  },
  {
    accession: "P-004",
    title: "Computer History Museum — Software History Center",
    url: "https://computerhistory.org/software-history-center/",
    category: "Source Code",
    year: "1950s–present",
    label: "Source code & original context",
    description:
      "Historical source releases, oral histories, and demonstrations that let the code sit beside the people, decisions, and machines that made it matter.",
  },
  {
    accession: "P-005",
    title: "Software Heritage",
    url: "https://www.softwareheritage.org/",
    category: "Source Code",
    year: "1960s–present",
    label: "Universal source-code preservation",
    description:
      "A long-term source-code archive and preservation effort. Use it to locate origins, preserve legacy code, and understand software as cultural record.",
  },
  {
    accession: "P-006",
    title: "SIGCIS History Resources Guide",
    url: "https://www.sigcis.org/resources",
    category: "Research",
    year: "Computing history",
    label: "The map to the map",
    description:
      "A historian-created guide to archives, museums, journals, oral histories, bibliographies, and specialist collections across the history of computing.",
  },
  {
    accession: "P-007",
    title: "Internet Archive Software Collection",
    url: "https://archive.org/details/software",
    category: "Archive",
    year: "1960s–2000s",
    label: "Programs that still run",
    description:
      "A vast library of historical programs, disk images, CD-ROMs, documentation, and browser-accessible software. Enormous, imperfect, and worth navigating.",
  },
  {
    accession: "P-008",
    title: "Programming Textfiles",
    url: "http://www.textfiles.com/programming/",
    category: "Research",
    year: "1980s–1990s",
    label: "Early technical notes & culture",
    description:
      "Primary-source programming files that capture early approaches to topics including security, cryptography, artificial intelligence, and software craft.",
  },
  {
    accession: "P-009",
    title: "Awesome Computer History",
    url: "https://github.com/watson/awesome-computer-history",
    category: "Research",
    year: "Computing history",
    label: "A lightweight companion index",
    description:
      "A concise link list of historical talks, documentaries, interviews, texts, source-code references, and websites—useful for context around the technical record.",
  },
];

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

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-eyebrow">{children}</p>;
}

export default function Home() {
  const [activeResourceCategory, setActiveResourceCategory] = useState<ResourceCategory>("All");

  const visibleResourceRecords = useMemo(
    () =>
      activeResourceCategory === "All"
        ? resourceRecords
        : resourceRecords.filter((record) => record.category === activeResourceCategory),
    [activeResourceCategory],
  );

  return (
    <div className="pause-site-shell overflow-hidden">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Pause home">
          <img
            className="brand-mark"
            src="/manus-storage/pause-mark_29e76b0f.png"
            alt="Pause mark"
          />
          <span className="brand-wordmark">pause</span>
        </a>

        <div className="header-finding-aid" aria-label="Pause finding aid">
          <span>Finding Aid</span>
          <span>PAUSE / 001</span>
        </div>

        <div className="header-right-frame">
          <nav className="header-nav" aria-label="Primary navigation">
            <a href="#collection">Collection</a>
            <a href="#principles">Principles</a>
            <a href="#contribute">Contribute</a>
          </nav>
          <a
            className="header-github-link"
          href="https://github.com/Druspect/pause"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} strokeWidth={1.8} />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy-column">
            <p className="hero-prelude">
              <strong>PROVENANCE NOTE / 2026</strong> — Built using AI, in support of its responsible and expansive use.
            </p>
            <div className="hero-title-wrap">
              <span className="hero-title-index">PAUSE / 001</span>
              <h1>A reference shelf for the human record.</h1>
            </div>
            <p className="hero-description">
              Accurate documentation of human advances before the generative-AI explosion feels imperative. Pause is a hand-built index of the programs, manuals, architecture, source code, and thinking that got us here.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#collection">
                Browse the first shelf <ArrowDownRight size={17} strokeWidth={1.8} />
              </a>
              <a className="text-action" href="#contribute">
                Submit a source <Plus size={16} strokeWidth={1.8} />
              </a>
            </div>
            <div className="hero-microcopy">
              <span>Human-selected</span>
              <span>Pre-AI reference material</span>
              <span>Open contribution model</span>
            </div>
          </div>

          <div className="hero-visual-column" aria-label="An archival computing workspace">
            <div className="hero-visual-frame">
              <img
                src="/manus-storage/pause-hero-archive_2e519120.jpg"
                alt="Archival technical materials arranged on a research desk"
              />
              <div className="hero-visual-caption">
                <span className="caption-rule" />
                <p>
                  <strong>FIELD NOTE 01</strong>
                  Knowledge survives when somebody decides it is worth finding again.
                </p>
              </div>
            </div>
            <div className="hero-acquisition-card">
              <span>ACCESSION NOTE</span>
              <strong>9</strong>
              <p>starting collections for rebuilding technical context.</p>
            </div>
          </div>
        </section>

        <section className="statement-strip" aria-label="Pause purpose statement">
          <div className="statement-mark">⟦Ⅱ⟧</div>
          <p>
            <span>Pause is not an anti-AI project.</span> It is an argument for keeping the raw material close: the human decisions, trade-offs, failure modes, and systems knowledge that new tools cannot manufacture retroactively.
          </p>
          <a href="#principles" aria-label="Read Pause principles">
            <ArrowDownRight size={24} strokeWidth={1.4} />
          </a>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading-row">
            <div>
              <SectionEyebrow>THE FIRST SHELF</SectionEyebrow>
              <h2>Places to begin, before you decide what to build next.</h2>
            </div>
            <p className="section-side-note">Each entry is a doorway—not a replacement for the original work.</p>
          </div>

          <div className="collection-toolbar" role="toolbar" aria-label="Filter sources">
            <div className="collection-filter-list">
              {resourceCategories.map((category) => (
                <button
                  key={category}
                  className={activeResourceCategory === category ? "filter-chip is-active" : "filter-chip"}
                  type="button"
                  onClick={() => setActiveResourceCategory(category)}
                >
                  {category}
                  {category === "All" && <span>{resourceRecords.length}</span>}
                </button>
              ))}
            </div>
            <p className="collection-count">{visibleResourceRecords.length.toString().padStart(2, "0")} sources visible</p>
          </div>

          <div className="resource-ledger">
            {visibleResourceRecords.map((record) => (
              <a
                className="resource-record"
                key={record.accession}
                href={record.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="record-accession">
                  <span>{record.accession}</span>
                  <span className="record-category">{record.category}</span>
                </div>
                <div className="record-main">
                  <div className="record-title-line">
                    <h3>{record.title}</h3>
                    <ExternalLink className="record-external-icon" size={17} strokeWidth={1.8} />
                  </div>
                  <p>{record.description}</p>
                </div>
                <div className="record-meta">
                  <span>{record.year}</span>
                  <span>{record.label}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="context-section" id="principles">
          <div className="context-photo-wrap">
            <img
              src="/manus-storage/pause-sourcecode-detail_887f2420.jpg"
              alt="Vintage technical manual and punch cards arranged on a desk"
            />
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
            <a className="inline-link" href="#contribute">
              Read the contribution standard <ArrowUpRight size={17} strokeWidth={1.7} />
            </a>
          </div>
        </section>

        <section className="principles-section">
          <div className="principles-heading">
            <SectionEyebrow>THE KEEPER’S RULE</SectionEyebrow>
            <p>Include the sources that help a careful reader reconstruct a chain of human reasoning.</p>
          </div>
          <div className="principles-grid">
            {archivalPrinciples.map((principle) => {
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
                Add the original reference, its era, a short explanation, and any access notes. Good contributions preserve a decision trail, not just a URL.
              </p>
              <a
                className="primary-action light-action"
                href="https://github.com/Druspect/pause/issues/new?template=source-proposal.md"
                target="_blank"
                rel="noreferrer"
              >
                Propose a source <ArrowUpRight size={17} strokeWidth={1.8} />
              </a>
            </div>
            <div className="contribute-image-wrap">
              <img
                src="/manus-storage/pause-systems-grid_5f75bdcd.jpg"
                alt="Abstract computing diagrams and archival paper materials"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-lockup" href="#top">
          <img src="/manus-storage/pause-mark_29e76b0f.png" alt="" />
          <span>pause</span>
        </a>
        <p>Built with AI. Kept for the human record.</p>
        <a href="https://github.com/Druspect/pause" target="_blank" rel="noreferrer">
          <Github size={16} strokeWidth={1.8} /> View the repository
        </a>
      </footer>
    </div>
  );
}
