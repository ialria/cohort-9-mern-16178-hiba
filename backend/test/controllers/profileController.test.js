const { getProfile, updateProfile } = require("../../src/controllers/profileController");
const sinon = require("sinon");
const prisma = require("../../src/config/prisma");
const { expect } = require("chai");

// get profile like after edit or init 
describe("Profile Controller : Get Profile", () => {
  let req;
  let res;

  beforeEach(() => {
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

  it("This should return the current user's profile successfully", async () => {
    const user = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      avatarUrl: null,
      bio: "Test bio",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };

    prisma.user.findUnique = sinon.stub().resolves(user);
    await getProfile(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(user)).to.be.true;

    // profile is fetched with logged in user ID.
    expect(
      prisma.user.findUnique.calledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
        },
      }),
    ).to.be.true;
  });

  it("This should return 404 if the user does not exist", async () => {
    // null if no matching user
    prisma.user.findUnique = sinon.stub().resolves(null);

    await getProfile(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWith({
        message: "User not found",
      }),
    ).to.be.true;
  });

  it("This should return 500 if fetching the profile fails", async () => {
    // database failure-fetching the profile.
    prisma.user.findUnique = sinon
      .stub()
      .rejects(new Error("Database error"));

    await getProfile(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Failed to fetch profile",
      }),
    ).to.be.true;
  });
});
describe("Profile Controller : Update Profile", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      userId: 1,
      body: {
        username: "Updated User",
        bio: "Updated bio",
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

  it("This should update the profile successfully", async () => {
    const updatedUser = {
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: null,
      bio: "Updated bio",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };

    prisma.user.update = sinon.stub().resolves(updatedUser);
    await updateProfile(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedUser)).to.be.true;

    // only editable profile fields sent
    expect(
      prisma.user.update.calledWith({
        where: {
          id: 1,
        },
        data: {
          username: "Updated User",
          bio: "Updated bio",
        },
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
        },
      }),
    ).to.be.true;
  });
  it("This should trim the username and bio before updating", async () => {
    req.body.username = "  Updated User  ";
    req.body.bio = "  Updated bio  ";

    prisma.user.update = sinon.stub().resolves({
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: null,
      bio: "Updated bio",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    });

    await updateProfile(req, res);
    expect(
      prisma.user.update.calledWith(
        sinon.match({
          data: {
            username: "Updated User",
            bio: "Updated bio",
          },
        }),
      ),
    ).to.be.true;
  });

  it("This should return 400 if username is missing", async () => {
    req.body.username = "";
    await updateProfile(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Username is required!",
      }),
    ).to.be.true;
  });
  it("This should return 400 if username is not a string", async () => {
    req.body.username = 123;

    await updateProfile(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Username is required!",
      }),
    ).to.be.true;
  });

  it("This should return 400 if username contains only spaces", async () => {
    req.body.username = "     ";

    await updateProfile(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Username is required!",
      }),
    ).to.be.true;
  });

  it("This should return 400 if bio is not a string", async () => {
    req.body.bio = 123;
    await updateProfile(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Bio must be a string.",
      }),
    ).to.be.true;
  });
  it("This should allow bio to be omitted", async () => {
    delete req.body.bio;

    const updatedUser = {
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: null,
      bio: null,
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };

    prisma.user.update = sinon.stub().resolves(updatedUser);
    await updateProfile(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedUser)).to.be.true;
  expect(
      prisma.user.update.calledWith(
        sinon.match({
          data: {
            username: "Updated User",
            bio: null,
          },
        }),
      ),
    ).to.be.true;
  });

  it("This should allow bio to be null", async () => {
    req.body.bio = null;

    const updatedUser = {
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: null,
      bio: null,
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };
    prisma.user.update = sinon.stub().resolves(updatedUser);

    await updateProfile(req, res);

    expect(res.status.calledWith(200)).to.be.true;
  });
  it("This should update the profile with a valid JPG avatar", async () => {
    req.body.avatarUrl = "data:image/jpeg;base64,aGVsbG8=";

    const updatedUser = {
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: req.body.avatarUrl,
      bio: "Updated bio",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };
    prisma.user.update = sinon.stub().resolves(updatedUser);

    await updateProfile(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedUser)).to.be.true;

    // avatar passed only when supplied
    expect(
      prisma.user.update.calledWith(
        sinon.match({
          data: {
            username: "Updated User",
            bio: "Updated bio",
            avatarUrl: req.body.avatarUrl,
          },
        }),
      ),
    ).to.be.true;
  });

  it("This should update the profile with a valid PNG avatar", async () => {
    req.body.avatarUrl = "data:image/png;base64,aGVsbG8=";

    const updatedUser = {
      id: 1,
      username: "Updated User",
      email: "test@example.com",
      avatarUrl: req.body.avatarUrl,
      bio: "Updated bio",
      createdAt: new Date("2026-08-20T10:00:00.000Z"),
    };
    prisma.user.update = sinon.stub().resolves(updatedUser);

    await updateProfile(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(updatedUser)).to.be.true;
  });

  it("This should return 400 if the avatar is not JPG or PNG", async () => {
    req.body.avatarUrl = "data:image/gif;base64,aGVsbG8=";
    await updateProfile(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Only JPG and PNG images are allowed.",
      }),
    ).to.be.true;
  });
  it("This should return 400 if avatar data is invalid", async () => {
    req.body.avatarUrl = "data:image/jpeg;base64,";

    await updateProfile(req, res);
    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Invalid image data.",
      }),
    ).to.be.true;
  });

  it("This should return 400 if the avatar is larger than 2MB", async () => {
    // base64 string-more than 2MB of data
    const largeImage = Buffer.alloc(2 * 1024 * 1024 + 1).toString("base64");

    req.body.avatarUrl = `data:image/jpeg;base64,${largeImage}`;
    await updateProfile(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Image must be smaller than 2MB.",
      }),
    ).to.be.true;
  });
  it("This should return 500 if updating the profile fails", async () => {
    // database failure during the update
    prisma.user.update = sinon
      .stub()
      .rejects(new Error("Database error"));
    await updateProfile(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Error! Failed to update profile",
      }),
    ).to.be.true;
  });

  it("This should allow avatarUrl to be null", async () => {
  req.body.avatarUrl = null;
  const updatedUser = {
    id: 1,
    username: "Updated User",
    email: "test@example.com",
    avatarUrl: null,
    bio: "Updated bio",
    createdAt: new Date("2026-08-20T10:00:00.000Z"),
  };

  prisma.user.update = sinon.stub().resolves(updatedUser);
  await updateProfile(req, res);

  expect(res.status.calledWith(200)).to.be.true;
  expect(res.json.calledWith(updatedUser)).to.be.true;
  expect(
    prisma.user.update.calledWith(
      sinon.match({
        data: {
          username: "Updated User",
          bio: "Updated bio",
          avatarUrl: null,
        },
      }),
    ),
  ).to.be.true;
});
});