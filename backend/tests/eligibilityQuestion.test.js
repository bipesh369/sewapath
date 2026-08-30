import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Eligibility API", () => {
  it("should allow public users to get eligibility questions", async () => {
    const response = await request(app)
      .get("/api/services/6a8aa1d127d7f9db63cc3a94/eligibility");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should not allow a citizen to create an eligibility question", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "citizen-test@example.com",
        password: "123456",
      });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/services/6a8aa1d127d7f9db63cc3a94/eligibility")
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: 99,
        questionText: {
          en: "Test question?",
          ne: "परीक्षण प्रश्न?"
        },
        options: [
          {
            label: {
              en: "Yes",
              ne: "हो"
            },
            value: "yes",
            resultsInEligible: true,
            nextQuestionOrder: null
          }
        ],
        isTerminal: true
      });

    expect(response.status).toBe(403);
  });
});

it("should evaluate eligibility", async () => {
  const response = await request(app)
    .post("/api/services/6a8aa1d127d7f9db63cc3a94/eligibility/evaluate")
    .send({
  answers: [
    {
      questionOrder: 1,
      value: "yes",
    },
    {
      questionOrder: 2,
      value: "yes",
    },
  ],
});

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data).toBeDefined();
});