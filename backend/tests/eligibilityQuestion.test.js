import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import {
  createTestUser,
  createTestService,
} from "./helpers/testData.js";

import { loginTestUser } from "./helpers/auth.js";

describe("Eligibility API", () => {
  it("should allow public users to get eligibility questions", async () => {
    const service = await createTestService();

    const response = await request(app)
      .get(`/api/services/${service._id}/eligibility`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should not allow a citizen to create an eligibility question", async () => {
    const service = await createTestService();

    const citizen = await createTestUser();

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .post(`/api/services/${service._id}/eligibility`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        order: 1,
        questionText: {
          en: "Are you eligible?",
          ne: "के तपाईं योग्य हुनुहुन्छ?",
        },
        options: [
          {
            label: {
              en: "Yes",
              ne: "हो",
            },
            value: "yes",
            resultsInEligible: true,
            nextQuestionOrder: null,
          },
        ],
        isTerminal: true,
      });

    expect(response.status).toBe(403);
  });

  it("should evaluate eligibility", async () => {
    const service = await createTestService();

    const admin = await createTestUser({
      role: "admin",
    });

    const adminToken = await loginTestUser({
      email: admin.email,
      password: admin.password,
    });

    const createResponse = await request(app)
      .post(`/api/services/${service._id}/eligibility`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        order: 1,
        questionText: {
          en: "Are you eligible?",
          ne: "के तपाईं योग्य हुनुहुन्छ?",
        },
        options: [
          {
            label: {
              en: "Yes",
              ne: "हो",
            },
            value: "yes",
            resultsInEligible: true,
            nextQuestionOrder: null,
          },
        ],
        isTerminal: true,
      });

    expect(createResponse.status).toBe(201);

    const response = await request(app)
      .post(`/api/services/${service._id}/eligibility/evaluate`)
      .send({
        answers: [
          {
            questionOrder: 1,
            value: "yes",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
});