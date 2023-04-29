const request = require("supertest");
const app = require("../appTest");
const User = require("../../models/user.model");
const seedDb = require("../testUtils/seedDb");

let specificUser;
let specificUser2;
let token;
let obj;

beforeAll(async () => {
  // assign to obj so I can access when needed
  obj = await seedDb();

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
  //console.log(specificUser.friendRequests.length);
  //console.log(obj.testUsers);
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
  test("should return an error when the user is not logged in", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request-handler`)
      .set("Accept", "application/json")
      .send({
        requesterId: obj.testUsers[1]._id,
        response: "deny",
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("unauthorized access");
  });

  test("should return an error when an invalid friend request response is provided", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request-handler`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        requesterId: obj.testUsers[1]._id,
        response: "invalid",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Invalid friend request response");
  });

  test("should return an error when the friend request is not found", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request-handler`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        requesterId: "invalid-id",
        response: "deny",
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Friend request not found");
  });

  test("should accept friend request and add requester as friend", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request-handler`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        requesterId: obj.testUsers[1]._id,
        response: "accept",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Friend request accepted");
  });

  test("should deny friend request and remove it from user's friend requests", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friend-request-handler`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        requesterId: obj.testUsers[2]._id,
        response: "deny",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Friend request denied");
    const user = await User.findById(specificUser._id);
    expect(user.friendRequests).not.toContain(obj.testUsers[2]._id);
    //console.log(user);
  });
});

describe("Remove Friend", () => {
  // removes friend set by previous tests
  test("should remove friend when logged in", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friends`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        unfriendId: obj.testUsers[1]._id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Friend successfully removed");
    const user = await User.findById(specificUser._id);
    expect(user.friends.length).toEqual(0);
  });
  test("should return 401 when not logged in", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friends`)
      .send({ unfriendId: "test_friend_id" });
    expect(res.statusCode).toEqual(401);
  });
  test("should return 400 when friend ID is not provided", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friends`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(400);
  });
  test("should return 400 when friend id not in friends ", async () => {
    const res = await request(app)
      .put(`/api/users/${specificUser._id}/friends`)
      .set("Authorization", `Bearer ${token}`)
      .send({ unfriendId: "test_friend_id" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual("Friend not found");
  });
});

describe("update account user settings", () => {
  test("should return an error when the user is not logged in", async () => {
    const res = await request(app)
      .put(`/api/users/account-settings`)
      .set("Accept", "application/json")
      .send({
        username: "testing123",
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("unauthorized access");
  });

  test("should update username", async () => {
    const res = await request(app)
      .put(`/api/users/account-settings`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        username: "testing123",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.currentUser.username).toEqual("testing123");
  });

  test("should return an ERROR if username is not provided", async () => {
    const res = await request(app)
      .put(`/api/users/account-settings`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({});
    expect(res.statusCode).toEqual(422);
    expect(res.body.errors.username.msg).toEqual("Invalid value");
  });

  test("should return an error if database update fails", async () => {
    jest
      .spyOn(User, "updateOne")
      .mockRejectedValue(new Error("Database error"));
    const res = await request(app)
      .put(`/api/users/account-settings`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({
        username: "testing123",
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Internal server error.");
  });
});
