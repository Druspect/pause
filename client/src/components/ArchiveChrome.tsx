import { Github } from "lucide-react";
import { Link } from "wouter";

const pauseMarkUrl = "/manus-storage/pause-mark_29e76b0f.png";

export function ArchiveHeader({ findingAid }: { findingAid: string }) {
  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="Pause home">
        <img className="brand-mark" src={pauseMarkUrl} alt="Pause mark" />
        <span className="brand-wordmark">pause</span>
      </Link>

      <div className="header-finding-aid" aria-label="Pause finding aid">
        <span>Finding Aid</span>
        <span>{findingAid}</span>
      </div>

      <div className="header-right-frame">
        <nav className="header-nav" aria-label="Primary navigation">
          <Link href="/catalog">Catalog</Link>
          <Link href="/overview">Overview</Link>
          <Link href="/contribute">Contribute</Link>
        </nav>
        <a className="header-github-link" href="https://github.com/Druspect/pause" target="_blank" rel="noreferrer">
          <Github size={15} strokeWidth={1.8} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}

export function ArchiveFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-lockup" href="/">
        <img src={pauseMarkUrl} alt="" />
        <span>pause</span>
      </Link>
      <p>Built with AI. Kept for the human record.</p>
      <a href="https://github.com/Druspect/pause" target="_blank" rel="noreferrer">
        <Github size={16} strokeWidth={1.8} /> View the repository
      </a>
    </footer>
  );
}
