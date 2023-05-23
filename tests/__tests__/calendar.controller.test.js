const request = require("supertest");
const app = require("../appTest");
const seedDb = require("../testUtils/seedDb");

let specificUser;
let token;
let obj;

beforeAll(async () => {
  // assign to obj so I can access when needed
  obj = await seedDb();

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "testKing@gmail.com", password: "password123" })
    .set("Accept", "application/json");
  token = res.body.token;
  specificUser = res.body.user;
  //console.log(specificUser.friendRequests.length);
  //console.log(obj.testUsers);
});

describe("should confirm that calendar router is connected", () => {
  test("Should confirm the test json received", () => {
    request(app)
      .get("/api/calendar/test")
      .expect("Content-Type", /json/)
      .expect({ test: "calendar router working" })
      .expect(200);
  });
});

/* 
describe("should get calendar events from postgres db", () => {
  test("Get request should receive 3 mock events inserted", () => {
    const res = request(app)
      .get("/api/calendar")
      .set("Accept", "application/json");

    console.log(res.body);
  });
}); */
