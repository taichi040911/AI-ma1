import { describe, expect, it } from "vitest";
import { formatProgress, progressRatio } from "./utils";

describe("life navigation progress utils", () => {
  it("formats progress without total", () => {
    expect(formatProgress(1, null)).toBe("質問 1");
  });

  it("formats progress with total", () => {
    expect(formatProgress(2, 5)).toBe("質問 2 / 5");
  });

  it("caps progress ratio", () => {
    expect(progressRatio(10, 3)).toBe(1);
  });
});
