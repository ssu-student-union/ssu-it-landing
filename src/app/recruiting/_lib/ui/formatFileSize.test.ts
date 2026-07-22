import { describe, expect, it } from "vitest";
import { formatFileSize } from "./formatFileSize";

describe("formatFileSize", () => {
  it("정수 MB는 소수점 없이 보여준다", () => {
    expect(formatFileSize(10 * 1024 * 1024)).toBe("10MB");
  });

  it("소수 MB는 소수점 첫째 자리까지 보여준다", () => {
    expect(formatFileSize(2.3 * 1024 * 1024)).toBe("2.3MB");
  });

  it("0바이트는 0MB로 보여준다", () => {
    expect(formatFileSize(0)).toBe("0MB");
  });
});
