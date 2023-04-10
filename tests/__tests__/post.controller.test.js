const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const User = require("../../models/user.model");

const seedDb = require("../testUtils/seedDb");

let token;
// create var to tie a post produced from seedDb to wider scope for test because i need the
// the ._id to call in specific post test. assigned in beforeAll because of ._id changes every time test is ran
let specificPost;
let specificUser;

beforeAll(async () => {
  // assign to obj so I can access when needed
  const obj = await seedDb();
  specificPost = obj.testPosts[0];
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
  //console.log(obj.testPosts);
  //console.log(specificPost);
  console.log(specificUser);
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
    // 15 posts created on seedDb, plus 1 through prev tests
    expect(res.body.posts.length).toEqual(16);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("posts");

    //console.log(res.statusCode);
  });
});

describe("Get posts by User", () => {
  test("should return posts specified by UserId", async () => {
    const res = await request(app).get(
      `/api/posts/byUserId/${specificUser._id}`
    );
    console.log(res.body);
  });
});

describe("Get Specific Posts", () => {
  test("should retrieve specific post with proper objectId", async () => {
    //specificPost is created and then defined in beforeAll
    const res = await request(app)
      .get(`/api/posts/${specificPost._id}`)
      .set("Authorization", token)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("post");
    //console.log(res.body);
  });
});
