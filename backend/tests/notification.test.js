import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import User from "../src/models/user.model.js";
import Notification from "../src/models/notification.model.js";

import { createTestUser } from "./helpers/testData.js";
import { loginTestUser } from "./helpers/auth.js";

describe("Notification API", () => {
  it("should require authentication to get notifications", async () => {
    const response = await request(app)
      .get("/api/notifications");

    expect(response.status).toBe(401);
  });

  it("should return notifications belonging to the authenticated user", async () => {
    const citizen = await createTestUser();

    const notification = await Notification.create({
      userId: citizen.user._id,
      type: "service",
      title: "Test Notification",
      message: "This is a test notification.",
    });

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(
      response.body.data.some(
        (item) => item._id === notification._id.toString()
      )
    ).toBe(true);
  });

  it("should allow a user to mark their own notification as read", async () => {
    const citizen = await createTestUser();

    const notification = await Notification.create({
      userId: citizen.user._id,
      type: "service",
      title: "Unread Notification",
      message: "Please mark this as read.",
    });

    const token = await loginTestUser({
      email: citizen.email,
      password: citizen.password,
    });

    const response = await request(app)
      .patch(`/api/notifications/${notification._id}/read`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.read).toBe(true);
  });
});