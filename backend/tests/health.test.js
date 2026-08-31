

import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Health API", () => {
  it("should return API health status", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "SewaPath API is running"
    );
  });

  it("should return 404 for an unknown route", async () => {
  const response = await request(app)
    .get("/api/does-not-exist");

  expect(response.status).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Route not found");
});

});