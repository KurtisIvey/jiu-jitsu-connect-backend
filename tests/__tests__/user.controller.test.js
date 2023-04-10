const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const User = require("../../models/user.model");

const seedDb = require("../testUtils/seedDb");
let specificUser;
let token;

beforeAll(async () => {
  // assign to obj so I can access when needed
  const obj = await seedDb();

  const body = {
    username: "test",
    email: "test@gmail.com",
    password: "password123",
  };
  const newUser = await User(body);
  await newUser.save();
  specificUser = newUser;

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
  console.log(specificUser);
});

describe("should confirm that post router is connected", () => {
  test("Should confirm the post json received", () => {
    request(app)
      .get("/api/users/test")
      .expect("Content-Type", /json/)
      .expect({ test: "user router working" })
      .expect(200);
  });
});

describe("should fetch info from specific user with id", () => {
  test("should not fetch user info if NOT LOGGED IN", async () => {
    const res = await request(app)
      .get(`/api/users/${specificUser._id}`)
      .set("Accept", "application/json");

    expect(res.statusCode).not.toEqual(200);
    expect(res.body).not.toHaveProperty("user");
  });
  test("should fetch user info with provided id", async () => {
    const res = await request(app)
      .get(`/api/users/${specificUser._id}`)
      .set("Authorization", token)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
  });
  test("should fetch user info WITHOUT password in returned obj", async () => {
    const res = await request(app)
      .get(`/api/users/${specificUser._id}`)
      .set("Authorization", token)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).not.toHaveProperty("email");
  });
});
