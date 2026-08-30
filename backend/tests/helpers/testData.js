import bcrypt from "bcryptjs";

import User from "../../src/models/user.model.js";
import Service from "../../src/models/service.model.js";

export const createTestUser = async ({
  role = "user",
  email = `test-${Date.now()}@example.com`,
} = {}) => {
  const password = "123456";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: role === "admin" ? "Test Admin" : "Test Citizen",
    email,
    password: hashedPassword,
    role,
  });

  return {
    user,
    email,
    password,
  };
};

export const createTestService = async ({
  status = "published",
} = {}) => {
  const service = await Service.create({
    title: `Test Service ${Date.now()}`,
    slug: `test-service-${Date.now()}`,
    description: "Test service for automated testing.",
    category: "Test",
    fee: 0,
    processingTime: "1 day",
    deliveryMode: "Online",
    status,
  });

  return service;
};