function userErrorHandler(err) {
  let errors = { email: "", password: "" };
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }
  if (err.message === 'User validation failed: password: Path `password` is required.'){
    errors.password = "Password field is empty. Password field is required";
  }
  if (err.code === 11000) {
    errors.email = "that email is already registered";
  }

  return errors;
}


module.exports = userErrorHandler;