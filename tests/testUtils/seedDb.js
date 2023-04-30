// used to get fake data to populate for users and schema properties
const { faker } = require("@faker-js/faker");

const User = require("../../models/user.model");
const Post = require("../../models/post.model");
const bcrypt = require("bcrypt");

// users generated through faker
const testUsers = [];
const testPosts = [];

const generateTestUser = async () => {
  const body = {
    username: "testking",
    email: "testKing@gmail.com",
    password: "password123",
  };
  const newUser = new User(body);
  // console.log(newUser);
  testUsers.push(newUser);
};

const generateFakerUsers = async () => {
  const body = {
    username: faker.name.firstName(),
    email: faker.helpers.unique(faker.internet.email),
    password: faker.name.fullName(),
  };
  const newUser = new User(body);
  //await newUser.save();
  //console.log(newUser);
  testUsers.push(newUser);
};

const createFakePost = (user) => {
  const post = new Post({
    author: user._id,
    timestamp: faker.date.past(10),
    postContent: faker.lorem.sentences(2),
  });
  testPosts.push(post);
};

const genFakePosts = () => {
  testUsers.forEach((testUser) => {
    for (let i = 0; i < 3; i++) {
      createFakePost(testUser);
    }
  });
};

const genFriendRequests = () => {
  const specificUser = testUsers.find((user) => user.username === "testking");
  //console.log(testUsers);
  const fakeUsers = testUsers.filter((user) => user.username !== "testKing");
  fakeUsers.forEach((user) => {
    specificUser.friendRequests.push(user._id);
  });
};

const seedDb = async () => {
  //console.log(faker.date.past(10));
  generateTestUser();
  for (i = 0; i < 5; i++) {
    generateFakerUsers();
  }
  genFakePosts();
  genFriendRequests();
  testUsers.forEach(async (testUser) => {
    try {
      await testUser.save();
    } catch (err) {
      console.log("err trying to save test user," + err);
    }
  });

  testPosts.forEach(async (testPost) => {
    try {
      await testPost.save();
    } catch (err) {
      console.log("err trying to save test user," + err);
    }
  });

  return { testUsers, testPosts };
};

module.exports = seedDb;
