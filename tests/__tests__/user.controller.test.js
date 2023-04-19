const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const User = require("../../models/user.model");

const seedDb = require("../testUtils/seedDb");
let specificUser;
let specificUser2;
let token;

beforeAll(async () => {
  // assign to obj so I can access when needed
  const obj = await seedDb();

  const body = {
    username: "test",
    email: "test@gmail.com",
    password: "password123",
  };
  const body2 = {
    username: "test2",
    email: "test2@gmail.com",
    password: "password123",
  };
  //const newUser = await User(body);
  const newUser2 = await User(body2);
  //await newUser.save();
  await newUser2.save();
  //specificUser = newUser;
  specificUser2 = newUser2;

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testKing@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
  specificUser = res.body.user;
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
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    //console.log(res.body);
  });
  test("should fetch user info WITHOUT password in returned obj", async () => {
    const res = await request(app)
      .get(`/api/users/${specificUser._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).not.toHaveProperty("email");
  });
});

describe("Friend Requests send and retract", () => {
  test("should send friend request", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser2._id}/friend-request`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Friendship requested");
  });
  test("should RETRACT friend request due to being previously sent", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser2._id}/friend-request`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Friendship unrequested");
  });
  test("should FAIL to send friend request due to bad ._id", async () => {
    const res = await request(app)
      .put(`/api/users/432143241231234233242/friend-request`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
  });
  test("should RETRACT friend request due to being previously sent", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("You can't be friends with yourself");
  });
});

describe("Friend Request Accept and Deny", () => {
  test("should deny friend Request", async () => {
    //send friend request from specificUser to specificUser2
    const res1 = await request(app)
      .put(`/api/users/${specificUser2._id}/friend-request`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    let view = await User.findById(specificUser2._id);
    //console.log(view);

    // log in different user
    const newLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: "test2@gmail.com", password: "password123" })
      .set("Accept", "application/json");
    token = newLogin.body.token;

    //console.log(newLogin.body);

    let view2 = await User.find({});
    //console.log(view2);
  });
});
