const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const User = require("../../models/user.model");

const seedDb = require("../testUtils/seedDb");

let token;

beforeAll(async () => {
  const obj = await seedDb();

  const body = {
    username: "test",
    email: "test@gmail.com",
    password: "password123",
  };
  const newUser = await User(body);
  await newUser.save();

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
  const allUsers = await User.find({});
  console.log(allUsers);
});

/*
backup working beforeAll seed setup in case accidental editing occurs
beforeAll(async () => {
  seedDb();

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
}); */

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
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .send({ postContent: "test post content" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("post creation success");
  });
  // will cause a jwt token error in console.log
  test("should NOT create new post due to no token", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Accept", "application/json")
      .send({ postContent: "test post content" });
    expect(res.statusCode).not.toEqual(201);
    expect(res.body.message).not.toEqual("post creation success");
  });
  test("should NOT create new post due to empty postContent input", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", token)
      .set("Accept", "application/json")
      .send({});
    expect(res.statusCode).toEqual(422);
  });
});

describe("Get Posts", () => {
  test("should get posts as long as logged in", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", token)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
  });
});
