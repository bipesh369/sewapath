import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

describe("Document Requirement API", () => {
  it("should not allow a citizen to create a document requirement", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "citizen-test@example.com",
        password: "123456",
      });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/services/6a93e83aa26b25f169a5fba1/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        label: {
          en: "Citizenship Certificate",
          ne: "नागरिकता प्रमाणपत्र",
        },
        mandatory: true,
        notes: {
          en: "Bring the original document.",
          ne: "सक्कल कागजात ल्याउनुहोस्।",
        },
        order: 1,
      });

    expect(response.status).toBe(403);
  });
});

it("should allow public users to get document requirements", async () => {
  const response = await request(app)
    .get("/api/services/6a93e83aa26b25f169a5fba1/documents");

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeInstanceOf(Array);
});

it("should not allow a citizen to update a document requirement", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "citizen-test@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .patch("/api/documents/6a8aa1d127d7f9db63cc3a94")
    .set("Authorization", `Bearer ${token}`)
    .send({
      mandatory: false,
    });

  expect(response.status).toBe(403);
});

it("should not allow a citizen to delete a document requirement", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "citizen-test@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .delete("/api/documents/6a8aa1d127d7f9db63cc3a94")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(403);
});