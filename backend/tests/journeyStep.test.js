import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Journey API", () => {
  it("should allow public users to get journey steps", async () => {
    const response = await request(app)
      .get("/api/services/6a8aa1d127d7f9db63cc3a94/journey");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should not allow a citizen to create a journey step", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "citizen-test@example.com",
        password: "123456",
      });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/services/6a8aa1d127d7f9db63cc3a94/journey")
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: 99,
        title: {
          en: "Unauthorized step",
          ne: "अनधिकृत चरण",
        },
        instructions: {
          en: "This should not be created.",
          ne: "यो सिर्जना हुनु हुँदैन।",
        },
        responsibleOffice: null,
        estimatedTime: {
          en: "1 day",
          ne: "१ दिन",
        },
      });

    expect(response.status).toBe(403);
  });
});