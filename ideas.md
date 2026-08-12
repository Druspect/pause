# Pause — Design Directions

## Three possible approaches

### 1. The Field Archive
**Very Brief Intro:** A tactile editorial index inspired by a well-used research library: evidence slips, brass rules, catalog labels, and a quiet sense of stewardship. It is designed to feel useful before it feels nostalgic.

**Probability:** 0.07

### 2. Terminal Almanac
**Very Brief Intro:** A dense, black-and-phosphor interface that borrows from command lines, CRT monitors, and old technical manuals. It would foreground raw systems culture and the feeling of excavation.

**Probability:** 0.04

### 3. Human Systems Journal
**Very Brief Intro:** A restrained publication-style experience that treats computing history as an ongoing intellectual tradition, using generous margins, oversized type, and careful annotation.

**Probability:** 0.09

---

# Chosen Direction — The Field Archive

## Design Movement

**Contemporary archival editorial design**, influenced by research-library finding aids, mid-century technical manuals, and disciplined Swiss information systems rather than retro-interface pastiche.

## Core Principles

1. **Evidence over spectacle.** Links and descriptions are the visual material, so the interface gives sources, dates, and provenance real hierarchy.
2. **Human selection is visible.** Catalog marks, issue labels, and considered annotations make it clear that this is an index, not an automated feed.
3. **Calm density.** The site welcomes serious browsing with compact reference cards, broad margins, and clear reading rhythm.
4. **A system that can grow.** Every section can accept more sources without losing the visual order.

## Color Philosophy

The base is warm paper, not stark white, so the site feels like a working research object. Deep ink blue carries intellectual weight and dependable contrast. **Signal orange** marks the living edge of the collection—newly added, important, or directly actionable—without turning the experience into a neon dashboard.

## Layout Paradigm

The page works as a **catalog sheet unfolding into an archive table**. A slim left rail carries the project mark and section labels on wide screens, while the main column shifts between a large editorial statement and uneven, source-first rows. The hero is asymmetrical: the manifesto occupies the left while a physical-looking index card and timeline occupy the right.

## Signature Elements

1. A square, bracketed **pause mark** used as a catalog stamp and favicon.
2. Numbered source slips with a left-side accession rule and small caps metadata.
3. Fine graph-paper grain and red-orange indexing lines that appear subtly throughout the page.

## Interaction Philosophy

Interactions feel like handling a physical archive. Cards lift only slightly, source links underline from the left, and filter chips have firm pressed states. No faux-terminal theatrics or gratuitous motion.

## Animation

Elements enter with short, staggered upward fades of 160–240ms using a crisp ease-out. On hover, cards move up by two pixels, rules extend, and icons nudge by two pixels. Motion is disabled under `prefers-reduced-motion`.

## Typography System

**DM Mono** carries dates, tags, source labels, and utility text, giving the archive an exact technical register. **Newsreader** carries headlines and manifesto copy with human editorial warmth. Headlines use an optical rhythm of large serif at 500–600 weight; metadata remains uppercase, mono, and tracked.

## Brand Essence

**Pause is a human-selected index of the computing knowledge we should not forget.**

Personality: **deliberate, rigorous, humane**.

## Brand Voice

Headlines are clear, slightly urgent, and never alarmist. CTAs invite contribution as stewardship rather than engagement bait. Microcopy is specific about evidence and origin.

Example lines: “Before the answer machine, there was the work.”

Example line: “Add a source worth returning to in ten years.”

## Wordmark & Logo

The wordmark uses a serif “pause” paired with a bold bracketed double-bar mark: `⟦Ⅱ⟧`. The mark suggests both a pause button and a library call-number bracket. The standalone icon is the bracketed double-bar symbol in deep ink.

## Signature Brand Color

**Archive Orange — `#E65C2E`**. It appears only where the site wants a reader to notice, save, or act.

## Style Decisions

- Visible project notes use a provenance-and-stewardship voice, never a casual build disclaimer.
- The global frame behaves like a finding aid, using a numbered catalog label, restrained rules, and section logic before conventional website cues.
- Archive Orange remains scarce: it is reserved for accession details, rules, small stamps, source actions, and the contribution moment.
