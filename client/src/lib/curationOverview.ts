export type CuratedCollectionSource = {
  accession: string;
  steward: string | null;
  originalYearStart: number | null;
  primarySubject: string;
  sourceKind: string;
};

export function buildCuratedCollectionSummary<TSource extends CuratedCollectionSource>(sources: TSource[]) {
  const distinctStewardNames = new Set(sources.map(source => source.steward).filter(Boolean));
  const datedSourceYears = sources
    .map(source => source.originalYearStart)
    .filter((year): year is number => typeof year === "number");

  const subjectCounts = sources.reduce<Record<string, number>>((summary, source) => {
    summary[source.primarySubject] = (summary[source.primarySubject] ?? 0) + 1;
    return summary;
  }, {});

  const sourceKindCounts = sources.reduce<Record<string, number>>((summary, source) => {
    summary[source.sourceKind] = (summary[source.sourceKind] ?? 0) + 1;
    return summary;
  }, {});

  return {
    totalRecordCount: sources.length,
    distinctStewardCount: distinctStewardNames.size,
    earliestSourceYear: datedSourceYears.length > 0 ? Math.min(...datedSourceYears) : null,
    subjectCounts,
    sourceKindCounts,
    mostRecentAccessions: [...sources]
      .sort((leftSource, rightSource) => rightSource.accession.localeCompare(leftSource.accession))
      .slice(0, 5),
  };
}
