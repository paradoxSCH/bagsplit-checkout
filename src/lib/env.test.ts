import { describe, expect, it } from "vitest";

import { getEnvStatus } from "./env";

describe("getEnvStatus", () => {
  it("returns safe defaults and does not require exposing secrets", () => {
    const status = getEnvStatus();

    expect(status.ok).toBeUndefined();
    expect(status.bagsApiBaseUrl).toContain("https://");
    expect(status.publicEnvValid).toBe(true);
    expect(status.publicEnv?.NEXT_PUBLIC_APP_NAME).toBeTruthy();
  });
});