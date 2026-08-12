export function getNextPauseExplorerRecordIndex({
  currentRecordIndex,
  availableRecordCount,
  direction,
  isSequencePaused,
}: {
  currentRecordIndex: number;
  availableRecordCount: number;
  direction: -1 | 1;
  isSequencePaused: boolean;
}) {
  // Preserve the selected record whenever the visitor has paused the sequence.
  if (isSequencePaused || availableRecordCount <= 0) return currentRecordIndex;

  // Wrap the focus index through the available records in either direction.
  return (currentRecordIndex + direction + availableRecordCount) % availableRecordCount;
}
