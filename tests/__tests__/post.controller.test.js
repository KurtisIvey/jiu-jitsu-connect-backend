const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");

const User = require("../../models/user.model");

const seedDb = require("../testUtils/seedDb");

let token;
// create var to tie a post produced from seedDb to wider scope for test because i need the
// the ._id to call in specific post test. assigned in beforeAll because of ._id changes every time test is ran
let specificPost;
let specificUser;
let nonPostingUser;

beforeAll(async () => {
  // assign to obj so I can access when needed
  const obj = await seedDb();
  specificPost = obj.testPosts[0];

  const newUser = await User({
    username: "test",
    email: "test@gmail.com",
    password: "password123",
  });
  await newUser.save();
  specificUser = newUser;

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
  //console.log(obj.testPosts);
  //console.log(specificPost);
  //console.log(specificUser);
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
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({});
    expect(res.statusCode).toEqual(422);
  });
});

describe("Get Posts", () => {
  test("should get posts as long as logged in", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    // 15 posts created on seedDb, plus 1 through prev tests
    expect(res.body.posts.length).toEqual(19);
    expect(res.header["content-type"]).toEqual(expect.stringMatching(/json/));
    expect(res.body).toHaveProperty("posts");
  });
});

describe("Get posts by User", () => {
  test("should return posts specified by UserId", async () => {
    // create another post from user
    const sres = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({ postContent: "test post content" });

    const res = await request(app)
      .get(`/api/posts/byUserId/${specificUser._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body.posts.length).toEqual(2);
  });
  test("should return empty arr if the user hasn't made any posts", async () => {
    // create new user that has no posts created under it
    const newUser2 = await User({
      username: "test2",
      email: "test2@gmail.com",
      password: "password123",
    });
    await newUser2.save();
    nonPostingUser = newUser2;

    const res = await request(app)
      .get(`/api/posts/byUserId/${nonPostingUser._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body.posts.length).toEqual(0);
  });
});

describe("Get Specific Posts", () => {
  test("should retrieve specific post with proper objectId", async () => {
    //specificPost is created and then defined in beforeAll
    const res = await request(app)
      .get(`/api/posts/${specificPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("post");
  });
});

describe("Comment Post", () => {
  test("should comment on post ", async () => {
    const res = await request(app)
      .put(`/api/posts/${specificPost._id}/comment`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({ commentContent: "test comment" });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("post commented");
    expect(res.body.comment.commentContent).toEqual("test comment");
  });
  test("should NOT comment on post w/o token ", async () => {
    const res = await request(app)
      .put(`/api/posts/${specificPost._id}/comment`)
      .set("Accept", "application/json")
      .send({ commentContent: "test comment" });
    expect(res.statusCode).toEqual(401);
  });
  test("should NOT comment on post w/o comment field filled in ", async () => {
    const res = await request(app)
      .put(`/api/posts/${specificPost._id}/comment`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(422);
  });
});

describe("Like Post", () => {
  test("should return an error when liking a non-existent post", async () => {
    const res = await request(app)
      .put(`/api/posts/nonexistentpost/like`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(400);
    expect(res.body.error.value).toEqual("nonexistentpost");
  });
  test("should like post ", async () => {
    const res = await request(app)
      .put(`/api/posts/${specificPost._id}/like`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("post liked");
  });
  test("should UNLIKE post ", async () => {
    const res = await request(app)
      .put(`/api/posts/${specificPost._id}/like`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("post unliked");
  });
});

describe("Delete Post", () => {
  test("should return an error if post doesn't exist", async () => {
    const res = await request(app)
      .delete(`/api/posts/123`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(500);
  });
  test("should return post deleted successfully if post exists", async () => {
    // delete post
    const newPost = await Post.create({
      author: specificUser._id,
      postContent: "Test Post",
    });

    // Create a test comment
    await request(app)
      .put(`/api/posts/${newPost._id}/comment`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .send({ commentContent: "test comment" });

    const postQuery = await Post.findById(newPost._id);
    // have to define comment in variable to access in query to confirm at end
    const comments = postQuery.comments[0];
    // Delete the post
    const res = await request(app)
      .delete(`/api/posts/${newPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(202);
    expect(res.body).toEqual({
      status: "success",
      message: "Post deleted successfully",
    });

    // Check if the post is deleted from the database
    const deletedPost = await Post.findById(newPost._id);
    expect(deletedPost).toBeNull();
    // Check if the comment is deleted from the database
    const commentsQuery = await Comment.findById(comments._id);
    expect(commentsQuery).toBeNull();
  });
  test("should fail to delete post due to not being author", async () => {
    // delete post
    const newPost = await Post.create({
      author: nonPostingUser._id,
      postContent: "Test Post to try to delete",
    });

    const res = await request(app)
      .delete(`/api/posts/${newPost._id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(403);
    expect(res.body).toEqual({
      status: "error",
      message: "permission denied, not the author of the post",
    });
  });
});
