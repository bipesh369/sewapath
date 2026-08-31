import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../src/app.js";

import Notification from "../src/models/notification.model.js";

import { createTestUser } from "./helpers/testData.js";
import { loginTestUser } from "./helpers/auth.js";
import { createTestService } from "./helpers/testData.js";

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

  it("should not allow a user to remove another user's saved service", async () => {
  const service = await createTestService({
    status: "published",
  });

  const userA = await createTestUser();
  const userB = await createTestUser();

  const tokenA = await loginTestUser({
    email: userA.email,
    password: userA.password,
  });

  const tokenB = await loginTestUser({
    email: userB.email,
    password: userB.password,
  });

  // User A saves the service
  await request(app)
    .post(`/api/saved-services/${service._id}`)
    .set("Authorization", `Bearer ${tokenA}`);

  // User B tries to remove User A's saved service
  const response = await request(app)
    .delete(`/api/saved-services/${service._id}`)
    .set("Authorization", `Bearer ${tokenB}`);

  expect(response.status).toBe(404);

  // Confirm User A's saved service still exists
  const savedServices = await request(app)
    .get("/api/saved-services")
    .set("Authorization", `Bearer ${tokenA}`);

  expect(savedServices.status).toBe(200);
  expect(savedServices.body.data.length).toBe(1);
});

it("should not allow a user to mark another user's notification as read", async () => {
  const userA = await createTestUser();
  const userB = await createTestUser();

  const notification = await Notification.create({
    userId: userA.user._id,
    type: "service",
    title: "Private Notification",
    message: "This belongs to User A.",
  });

  const tokenB = await loginTestUser({
    email: userB.email,
    password: userB.password,
  });

  const response = await request(app)
    .patch(`/api/notifications/${notification._id}/read`)
    .set("Authorization", `Bearer ${tokenB}`);

  expect(response.status).toBe(404);

  const unchangedNotification =
    await Notification.findById(notification._id);

  expect(unchangedNotification.read).toBe(false);
});

});