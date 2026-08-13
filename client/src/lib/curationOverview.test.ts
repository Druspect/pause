import { describe, expect, it } from "vitest";
import { buildCuratedCollectionSummary } from "./curationOverview";

describe("Curated collection summary", () => {
  it("counts public source dimensions and preserves the latest accessions", () => {
    const curatedCollectionSummary = buildCuratedCollectionSummary([
      {
        accession: "P-032",
        steward: "IBM Research",
        originalYearStart: 1970,
        primarySubject: "databases",
        sourceKind: "paper",
      },
      {
        accession: "P-037",
        steward: "University of California, Berkeley EECS",
        originalYearStart: 1995,
        primarySubject: "operating_systems",
        sourceKind: "archive",
      },
      {
        accession: "P-035",
        steward: "GNU Project",
        originalYearStart: null,
        primarySubject: "source_code",
        sourceKind: "archive",
      },
    ]);

    expect(curatedCollectionSummary.totalRecordCount).toBe(3);
    expect(curatedCollectionSummary.distinctStewardCount).toBe(3);
    expect(curatedCollectionSummary.earliestSourceYear).toBe(1970);
    expect(curatedCollectionSummary.subjectCounts).toMatchObject({
      databases: 1,
      operating_systems: 1,
      source_code: 1,
    });
    expect(curatedCollectionSummary.sourceKindCounts).toMatchObject({
      paper: 1,
      archive: 2,
    });
    expect(curatedCollectionSummary.mostRecentAccessions.map(source => source.accession)).toEqual(["P-037", "P-035", "P-032"]);
  });
});
