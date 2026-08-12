import { describe, expect, it } from "vitest";
import { getNextPauseExplorerRecordIndex } from "./pauseExplorer";

describe("Pause explorer sequencing", () => {
  it("keeps the focused record fixed while the visitor has paused the sequence", () => {
    const nextRecordIndex = getNextPauseExplorerRecordIndex({
      currentRecordIndex: 2,
      availableRecordCount: 5,
      direction: 1,
      isSequencePaused: true,
    });

    expect(nextRecordIndex).toBe(2);
  });

  it("wraps forward and backward through available source records", () => {
    const wrappedForwardRecordIndex = getNextPauseExplorerRecordIndex({
      currentRecordIndex: 4,
      availableRecordCount: 5,
      direction: 1,
      isSequencePaused: false,
    });
    const wrappedBackwardRecordIndex = getNextPauseExplorerRecordIndex({
      currentRecordIndex: 0,
      availableRecordCount: 5,
      direction: -1,
      isSequencePaused: false,
    });

    expect(wrappedForwardRecordIndex).toBe(0);
    expect(wrappedBackwardRecordIndex).toBe(4);
  });
});
