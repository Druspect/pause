This GitHub was developed using AI, and I am a strong proponent of using it.

# Pause

> **Before the answer machine, there was the work.**

Pause is a human-selected, source-first index of programming, software, source code, operating systems, and computer-architecture references that preserve the human record before generative AI became a routine layer in technical work. The purpose is not to reject AI. It is to preserve the original thinking, practical constraints, and decision trails that future builders will still need.

Pause is deliberately an **index**, not another file warehouse. It points outward to the institutions, projects, publishers, and communities that steward the original material.

## What is live now

The project includes a public, searchable catalog at `/catalog` and an authenticated source-proposal flow at `/contribute`. Public entries are delivered from the database and contain a stable accession, canonical URL, original era where known, steward, description, concrete technical value, and access or rights notes.

| Layer | Purpose | Publication rule |
|---|---|---|
| **Public catalog** | Browse verified sources by subject, type, and free-text query. | Only `verified` and `archived` records are visible. |
| **Source proposals** | Let authenticated contributors propose missing material. | Submissions remain private to the contributor and editors during review. |
| **Editorial standard** | Keep the catalog explainable and source-first. | Every visible entry needs a canonical source and enough context to make its technical value clear. |

The initial verified shelf covers archival collections, early operating-system releases, historical source code, software architecture, programming-language texts, and spaceflight computing. Representative starting points include [Bitsavers](https://bitsavers.org/), [the Computer History Museum Software History Center](https://computerhistory.org/software-history-center/), [xv6](https://pdos.csail.mit.edu/6.828/2026/xv6.html), [Multicians](https://www.multicians.org/), [Virtual AGC](https://www.ibiblio.org/apollo/), [SICP](https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/), [AOSA](https://aosabook.org/en/), and [Software Heritage](https://www.softwareheritage.org/).

## Editorial standard

Pause prioritizes material that a working programmer, systems engineer, architect, student, or historian can use to understand how computing ideas were actually built. Good contributions include original manuals, influential papers, source-code releases, architecture explanations, historic language documentation, systems documentation, recordings with technical context, and durable archival collections.

> The editorial test is simple: **will this help a thoughtful person reconstruct the human chain of reasoning behind a computing advance?**

The full data contract, controlled vocabulary, review statuses, and publication policy live in [docs/CATALOG-STANDARD.md](docs/CATALOG-STANDARD.md). Research notes for the first catalog expansion live in [docs/research-batch-01.md](docs/research-batch-01.md).

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
