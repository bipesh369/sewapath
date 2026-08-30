import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Notification from "../src/models/notification.model.js";

describe("Notification API", () => {
  it("should require authentication to get notifications", async () => {
    const response = await request(app)
      .get("/api/notifications");

    expect(response.status).toBe(401);
  });

  it("should return notifications belonging to the authenticated user", async () => {
    const user = await User.findOne({
      email: "citizen-test@example.com",
    });

    expect(user).toBeDefined();

    await Notification.create({
      userId: user._id,
      type: "service",
      title: "Test Notification",
      message: "This is a test notification.",
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: "citizen-test@example.com",
        password: "123456",
      });

    expect(loginResponse.status).toBe(200);

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);

    expect(
      response.body.data.some(
        (notification) =>
          notification.title === "Test Notification"
      )
    ).toBe(true);
  });
});

it("should allow a user to mark their own notification as read", async () => {
  const user = await User.findOne({
    email: "citizen-test@example.com",
  });

  expect(user).toBeDefined();

  const notification = await Notification.create({
    userId: user._id,
    type: "service",
    title: "Unread Notification",
    message: "Please mark this as read.",
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      email: "citizen-test@example.com",
      password: "123456",
    });

  expect(loginResponse.status).toBe(200);

  const token = loginResponse.body.data.token;

  const response = await request(app)
    .patch(`/api/notifications/${notification._id}/read`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.read).toBe(true);
});