const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../../src/middleware/authMiddleware");

describe("Auth Middleware : Authentication", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // cookies must be available on request 
    req = {
      cookies: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.stub();

    // test secret not  application secret
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    sinon.restore();
  });

  it("This should return 401 if authentication token is missing", () => {
    // no token is added to cookies
    authMiddleware(req, res, next);

    // should reject the request with 401
    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Authentication required",
      }),
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("This should authenticate the user successfully with a valid token", () => {
    // real JWT-payload contains userId
    const token = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
      },
    );
    req.cookies.token = token;

    authMiddleware(req, res, next);
    expect(req.userId).to.equal(1);

    expect(next.calledOnce).to.be.true;

    expect(res.status.notCalled).to.be.true;
    expect(res.json.notCalled).to.be.true;
  });

  it("This should return 401 if the token is invalid", () => {
    // not a valid jwt- corrupted token.
    req.cookies.token = "invalid-token";

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Invalid or expired token",
      }),
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("This should return 401 if the token has expired", () => {

    const token = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: -1,
      },
    );
    req.cookies.token = token;
    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Invalid or expired token",
      }),
    ).to.be.true;

    expect(next.notCalled).to.be.true;
  });

  it("This should reject a token using an unsupported algorithm", () => {
    //
    // jwt.verify(token, JWT_SECRET, {
    //   algorithms: ["HS256"]
    // });

    const token = jwt.sign(
      { userId: 1 },
      process.env.JWT_SECRET,
      {
        algorithm: "HS384",
      },
    );

    req.cookies.token = token;

    authMiddleware(req, res, next);
    // fail and the request should receive 401
    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid or expired token",
      }),
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});