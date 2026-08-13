This GitHub was developed using AI, and I am a strong proponent of using it.

# Pause

> **Before the answer machine, there was the work.**

Pause is a human-selected, source-first index of programming, software, source code, operating systems, and computer-architecture references that preserve the human record before generative AI became a routine layer in technical work. The purpose is not to reject AI. It is to preserve the original thinking, practical constraints, and decision trails that future builders will still need.

Pause is deliberately an **index**, not another file warehouse. It points outward to the institutions, projects, publishers, and communities that steward the original material.

## What is live now

The project includes a public, searchable catalog at `/catalog`, an interactive subject-and-sequence explorer on the landing page, and an authenticated source-proposal flow at `/contribute`. Public entries are delivered from the database and contain a stable accession, canonical URL, original era where known, steward, description, concrete technical value, and access or rights notes.

| Layer | Purpose | Publication rule |
|---|---|---|
| **Public catalog** | Browse verified sources by subject, type, and free-text query. | Only `verified` and `archived` records are visible. |
| **Pause explorer** | Follow a focused source trail through architecture, systems, networks, and data records. | Visitors may lock one record in place or resume sequencing through that thread. |
| **Source proposals** | Let authenticated contributors propose missing material. | Submissions remain private to the contributor and editors during review. |
| **Editorial standard** | Keep the catalog explainable and source-first. | Every visible entry needs a canonical source and enough context to make its technical value clear. |

The verified shelf now contains **36 public records** spanning archival collections, early operating-system releases, historical source code, architecture, networking, distributed systems, database systems, programming-language texts, hardware history, and spaceflight computing. The newest deep-search batch adds [IPv4](https://datatracker.ietf.org/doc/html/rfc791), [UDP](https://datatracker.ietf.org/doc/html/rfc768), [SMTP](https://datatracker.ietf.org/doc/html/rfc821), [FTP](https://datatracker.ietf.org/doc/html/rfc959), [HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616), [Codd’s relational model](https://research.ibm.com/publications/a-relational-model-of-data-for-large-shared-data-banks), [Ritchie’s C history](https://www.nokia.com/bell-labs/about/dennis-m-ritchie/chist.html), [Chord](https://pdos.csail.mit.edu/papers/ton:chord/paper-ton.pdf), the [GNU Software Archive](https://ftp.gnu.org/gnu/), the [Intel 4004 record](https://www.intel.com/content/www/us/en/history/virtual-vault/articles/the-intel-4004.html), and the [Berkeley CSRG archive](https://ftp.eecs.berkeley.edu/4bsd/csrg-cdrom.html).

## Editorial standard

Pause prioritizes material that a working programmer, systems engineer, architect, student, or historian can use to understand how computing ideas were actually built. Good contributions include original manuals, influential papers, source-code releases, architecture explanations, historic language documentation, systems documentation, recordings with technical context, and durable archival collections.

> The editorial test is simple: **will this help a thoughtful person reconstruct the human chain of reasoning behind a computing advance?**

The live [collection overview](/overview) groups the public shelf by subject, era, source type, steward, and latest verified acquisition. The GitHub-readable [curation overview](docs/CURATION-OVERVIEW.md) explains the collection and cites every record added in the latest inline research batch. The full data contract, controlled vocabulary, review statuses, and publication policy live in [docs/CATALOG-STANDARD.md](docs/CATALOG-STANDARD.md). Research notes for the three catalog expansions live in [docs/research-batch-01.md](docs/research-batch-01.md), [docs/research-batch-02.md](docs/research-batch-02.md), and [docs/research-batch-03.md](docs/research-batch-03.md).

## Contributing

Open the live `/contribute` page, sign in, and provide the canonical source, original era, subject, source type, technical summary, lasting value, and any access or rights caveat. Every proposal enters a private editorial queue. Existing-source standards and GitHub contribution guidance are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Pause is a React, TypeScript, Express, tRPC, Drizzle, and MySQL/TiDB project. The application uses the provided OAuth flow for authenticated proposals and a database-backed catalog for public source discovery.

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

Database changes follow the schema-first workflow: update `drizzle/schema.ts`, generate and review the migration, apply it through the project database workflow, then verify the public catalog and contributor flow.

## Launch copy

An X-ready launch post is maintained in [docs/X-POST.md](docs/X-POST.md). It is intentionally short enough to post with the repository link and a catalog screenshot.

## License

The site and original editorial material are released under the [MIT License](LICENSE). Every external source remains subject to its own rights, licenses, access requirements, and archival policies.
