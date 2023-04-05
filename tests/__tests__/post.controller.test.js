const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const User = require("../../models/user.model");
const {
  connect,
  cleanData,
  disconnect,
} = require("../testUtils/mongoConfigTesting");

let token;

beforeAll(async () => {
  const body = {
    username: "test",
    email: "test@gmail.com",
    password: "password123",
  };
  const newUser = await User(body);
  await newUser.save();

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "password123" });

  token = res.body.token;
  console.log(res.body);
});

describe("should confirm that post router is connected", () => {
  test("Should confirm the post json received", () => {
    request(app)
      .get("/api/posts/test")
      .expect("Content-Type", /json/)
      .expect({ test: "post router working" })
      .expect(200);
  });
});

describe("Create Post", () => {
  test("should create new post w/ token and text content", async () => {
    let res = await request(app)
      .post("/api/posts")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .send({ postContent: "test post content" });
    console.log(res.body);
    expect(res.body.message).toEqual("post creation success");
  });
});
