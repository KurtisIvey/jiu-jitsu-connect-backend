const request = require("supertest");
const app = require("../appTest");
const Post = require("../../models/post.model");
const {
  connect,
  cleanData,
  disconnect,
} = require("../testUtils/mongoConfigTesting");

beforeAll(async () => await connect());
//beforeEach(async () => await cleanData());
afterAll(async () => await disconnect());

describe("should confirm that post router is connected", () => {
  test("Should confirm the post json received", () => {
    request(app)
      .get("/api/posts/test")
      .expect("Content-Type", /json/)
      .expect({ test: "post router working" })
      .expect(200);
  });
});

/* describe("Create Post", () => {
  test("should create new post w/ token and text content", function (done) {
    request(app)
      .post("/api/posts/create-post")
      .set(
        "Authorization",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZzZGZzZGZzZCIsImVtYWlsIjoidGVzdGVyQGdtYWlsLmNvbSIsIl9pZCI6IjY0MmFjOGQ4ZGQyYWZhOGFlMjc2MTBhZiIsImlhdCI6MTY4MDU0ODU0NCwiZXhwIjoxNjgwNTU5MzQ0fQ.K8UerV17rOqiLFNkw1eoLwTpSSfBwxSETG-8VdA0lMc"
      )
      .send({ postContent: "test post content" })
      .expect(201, done);
  });
}); */
