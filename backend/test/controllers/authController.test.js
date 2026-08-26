const { expect } = require("chai");
const sinon = require("sinon");//to replace methods with fake versions
const crypto = require("crypto");
const emailService =require("../../src/services/emailService");
// actual prism and bycrypt modules
const prisma = require("../../src/config/prisma");
const bcrypt = require("bcrypt");
const { signup , login, logout, forgotPassword, resetPassword, getCurrentUser} = require("../../src/controllers/authController");
// for signup
describe("Auth Controller : Signup", () => {
  let req;
  let res;

  beforeEach(() => {
    // to create a fresh req and res obj
    req = {
      body: {
        username: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    };

    // sinon to check status or json
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
    // removes sinon stubs
  });

  it("This should create a new user successfully", async () => {
    // new email without real database
    prisma.user.findUnique = sinon.stub().resolves(null);
    bcrypt.hash = sinon.stub().resolves("hashed-password");

    prisma.user.create = sinon.stub().resolves({
      id: 1,
      username: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });

    await signup(req, res);

    expect(res.status.calledWith(201)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Account created",
        user: {
          id: 1,
          username: "Test User",
          email: "test@example.com",
        },
      }),
    ).to.be.true;
  });

  it(" This should return 400 if the username, email or password is missing", async () => {
    req.body = {
      email: "test@example.com",
      password: "password123",
    };

    await signup(req, res);
// if invalid input
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Username, email and password required",
      }),
    ).to.be.true;
  });

  it("This should return 400 if the  password is less than 8 characters", async () => {
    req.body.password = "1234567";

    await signup(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Password must be at least 8 characters long",
      }),
    ).to.be.true;
  });

  it("This should return 400  pasifsword is longer than 64 characters", async () => {
    req.body.password = "a".repeat(65); //65 word password

    await signup(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Password must be 64 characters or less",
      }),
    ).to.be.true;
  });

  it("This should return 400 if format of email is invalid", async () => {
    req.body.email = "invalid-email";

    await signup(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Please enter a valid email",
      }),
    ).to.be.true;
  });

  it("It should return 409 if email is already registered", async () => {
    // prisma find an existing user
    prisma.user.findUnique = sinon.stub().resolves({
      id: 1,
      email: "test@example.com",
    });

    await signup(req, res);

    // if conflicting data this runs
    expect(res.status.calledWith(409)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Email is already registered",
      }),
    ).to.be.true;
  });
});
// for login
describe("Auth Controller : Login", () => {
  let req;
  let res;


  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };


    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      cookie: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("This should login successfully - valid credentials", async () => {
    // simulate to find user in the database - with hashed password
    prisma.user.findUnique = sinon.stub().resolves({
      id: 1,
      username: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });

    // simulate bcrypt - entered password matches with database hash.
    bcrypt.compare = sinon.stub().resolves(true);

    process.env.JWT_SECRET = "test-secret";

    await login(req, res);

    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Login successful",
        user: {
          id: 1,
          username: "Test User",
          email: "test@example.com",
        },
      }),
    ).to.be.true;

    // jwt stored in http-only cookie - cannot access the authentication token.
    expect(res.cookie.calledWith("token")).to.be.true;
  });



  it("It should return 400 if email or password is missing", async () => {
    req.body = {
      email: "test@example.com",
    };

    await login(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Email and password are required",
      }),
    ).to.be.true;
  });

  it("Thisshould return 401 when user does not exist", async () => {
    // prisma could  not finding an account with this email.
    prisma.user.findUnique = sinon.stub().resolves(null);

    await login(req, res);

    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid email or password",
      }),
    ).to.be.true;
  });

  it("This should return 401 when password is incorrect", async () => {
    prisma.user.findUnique = sinon.stub().resolves({
      id: 1,
      username: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });

    bcrypt.compare = sinon.stub().resolves(false);

    await login(req, res);

    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid email or password",
      }),
    ).to.be.true;
  });
});
// for logout
describe("Auth Controller : Logout", () => {
  let res;

  beforeEach(() => {
    //check the cookie and response status.
    res = {
      clearCookie: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });


  it("This should logout successfully and clear the authentication cookie", () => {
    // removes the auth token from the browser cookie.
    logout({}, res);
    expect(res.clearCookie.calledWith("token")).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Logout successful",
      }),
    ).to.be.true;
  });
});

// for forgot-password  and then sending reset email to user
describe("Auth Controller : Forgot Password", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });
  afterEach(() => {
    sinon.restore();
  });

  it("This should return 400 if email is missing", async () => {
    req.body = {};

    await forgotPassword(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Email is required",
      }),
    ).to.be.true;
  });

  it("This should return 200 if the email does not belong to an account", async () => {
    // if no user exists with this email.
    prisma.user.findUnique = sinon.stub().resolves(null);
    await forgotPassword(req, res);

    // same response whether the account exists or not.
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message:
          "If an account exists with this email, a reset link has been sent.",
      }),
    ).to.be.true;
  });

// for rest -email one in forgot password
  it("This should send a reset email when the user exists", async () => {
  prisma.user.findUnique = sinon.stub().resolves({
    id: 1,
    username: "Test User",
    email: "test@example.com",
  });

  // fake the token
    sinon.stub(crypto, "randomBytes").returns({
    toString: sinon.stub().returns("test-reset-token"),
  });

  // remove old reset token and creates the new reset token.
  prisma.$transaction = sinon.stub().resolves([]);
//   faking email service - not original resend
  const sendPasswordResetEmailStub = sinon
    .stub(emailService, "sendPasswordResetEmail")
    .resolves({ id: "test-email-id" });
  await forgotPassword(req, res);
//   
 expect(sendPasswordResetEmailStub.calledOnce).to.be.true;
  expect(
    sendPasswordResetEmailStub.calledWith(
      "test@example.com",
      sinon.match.string,
    ),
  ).to.be.true;
  // return the same generic success message
  expect(res.status.calledWith(200)).to.be.true;
  expect(
    res.json.calledWith({
      message:
        "If an account exists with this email, a reset link has been sent.",
    }),
  ).to.be.true;
});
});

// for reset-password functionality
describe("Auth Controller : Reset Password", () => {
  let req;
  let res;

  beforeEach(() => {
    // reset token and new password
    req = {
      body: {
        token: "test-reset-token",
        password: "newpassword123",
      },
    };

    // check response status and json
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });
  afterEach(() => {
    sinon.restore();
  });

  it("This should return 400 if token or password is missing", async () => {
    // password is missing
    req.body = {
      token: "test-reset-token",
    };

    await resetPassword(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Token and password are required",
      }),
    ).to.be.true;
  });

  it("This should return 400 if password is less than 8 characters", async () => {
    // short password
    req.body.password = "1234567";

    await resetPassword(req, res);
    // password validation should return 400
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Password must be at least 8 characters long",
      }),
    ).to.be.true;
  });

  it("This should return 400 if password is longer than 64 characters", async () => {
    req.body.password = "a".repeat(65);
    await resetPassword(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Password must be 64 characters or less",
      }),
    ).to.be.true;
  });

  it("This should return 400 if reset token is invalid", async () => {
    // reset token doesnot exist in the database
    prisma.passwordresettoken.findUnique = sinon.stub().resolves(null);

    await resetPassword(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid or expired reset link",
      }),
    ).to.be.true;
  });

  it("This should reset the password successfully", async () => {
    // simulate a valid reset token from the database
    prisma.passwordresettoken.findUnique = sinon.stub().resolves({
      id: 1,
      userId: 1,
      hashedToken: "hashed-token",
      tokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    bcrypt.hash = sinon.stub().resolves("new-hashed-password");

    // database transaction
    prisma.$transaction = sinon.stub().resolves([]);

    await resetPassword(req, res);
    expect(
      bcrypt.hash.calledWith("newpassword123", 10),
    ).to.be.true;

    expect(prisma.$transaction.calledOnce).to.be.true;
    // successful-return 200
    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Password reset successfully",
      }),
    ).to.be.true;
  });

  it("This should return 400 if reset token has expired", async () => {
    // simulate an expired reset token
    prisma.passwordresettoken.findUnique = sinon.stub().resolves({
      id: 1,
      userId: 1,
      hashedToken: "hashed-token",
      tokenExpiresAt: new Date(Date.now() - 1000),
    });
    prisma.passwordresettoken.delete = sinon.stub().resolves({});

    await resetPassword(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "This reset link has expired",
      }),
    ).to.be.true;

    // make sure the expired token was deleted
    expect(prisma.passwordresettoken.delete.calledOnce).to.be.true;
  });
});

// for get-current-user functionality
describe("Auth Controller : Get Current User", () => {
  let req;
  let res;

  beforeEach(() => {
    // simulate an authenticated user
    req = {
      userId: 1,
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("This should return the current user successfully", async () => {
    // find the logged-in user
    prisma.user.findUnique = sinon.stub().resolves({
      id: 1,
      username: "Test User",
      email: "test@example.com",
    });

    await getCurrentUser(req, res);
    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        user: {
          id: 1,
          username: "Test User",
          email: "test@example.com",
        },
      }),
    ).to.be.true;
  });
    it("This should return 404 if the current user does not exist", async () => {
    prisma.user.findUnique = sinon.stub().resolves(null);

    await getCurrentUser(req, res);
    expect(res.status.calledWith(404)).to.be.true;

    expect(
      res.json.calledWith({
        message: "User not found",
      }),
    ).to.be.true;
  });
    it("This should return 500 if fetching the current user fails", async () => {
    // if a database error
    prisma.user.findUnique = sinon
      .stub()
      .rejects(new Error("Database error"));

    await getCurrentUser(req, res);
    expect(res.status.calledWith(500)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Something went wrong",
      }),
    ).to.be.true;
  });
});