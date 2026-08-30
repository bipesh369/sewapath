import request from "supertest";

import app from "../../src/app.js";

export const loginTestUser = async ({
  email,
  password,
}) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email,
      password,
    });

  if (response.status !== 200) {
    throw new Error(
      `Test login failed: ${response.status} ${JSON.stringify(response.body)}`
    );
  }

  return response.body.data.token;
};