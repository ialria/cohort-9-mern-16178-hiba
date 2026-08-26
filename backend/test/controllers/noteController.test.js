const {
  createNote,
  getAllNotes,
  updateNote,
  togglePin,
  moveToTrash,
  restoreNote,
  deleteForever
} = require("../../src/controllers/noteController");
const sinon = require("sinon");
const prisma = require("../../src/config/prisma");
const { expect } = require("chai");

// create note-all functionalities and scenarios done
describe("Note Controller : Create Note", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      body: {
        title: "Test Note",
        noteContent: "This is a test note",
      },
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

  it("This should create a new note successfully", async () => {
    // successful note creation
    prisma.note.create = sinon.stub().resolves({
      id: 1,
      title: "Test Note",
      content: "This is a test note",
      userId: 1,
    });

    await createNote(req, res);
    expect(res.status.calledWith(201)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note created successfully",
        note: {
          id: 1,
          title: "Test Note",
          content: "This is a test note",
          userId: 1,
        },
      }),
    ).to.be.true;
  });

  it("This should return 400 if note content is missing", async () => {
    // note content required
    req.body.noteContent = "";

    await createNote(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note content is required",
      }),
    ).to.be.true;
  });

  it("This should use Untitled Note when title is empty", async () => {
    // title-optional, controller-default title
    req.body.title = "";

    prisma.note.create = sinon.stub().resolves({
      id: 1,
      title: "Untitled Note",
      content: "This is a test note",
      userId: 1,
    });
    await createNote(req, res);
    expect(prisma.note.create.calledOnce).to.be.true;

    expect(
      prisma.note.create.calledWith({
        data: {
          title: "Untitled Note",
          content: "This is a test note",
          userId: 1,
        },
      }),
    ).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;
  });

  it("This should return 500 if note creation fails", async () => {
    prisma.note.create = sinon.stub().rejects(new Error("Database error"));

    await createNote(req, res);
    expect(res.status.calledWith(500)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Something went wrong",
      }),
    ).to.be.true;
  });
});

// get all notes all cases test done-
describe("Note Controller : Get All Notes", () => {
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

  it("This should return all notes successfully", async () => {
    prisma.note.findMany = sinon.stub().resolves([
      {
        id: 1,
        title: "First Note",
        content: "First note content",
        userId: 1,
      },
      {
        id: 2,
        title: "Second Note",
        content: "Second note content",
        userId: 1,
      },
    ]);
    await getAllNotes(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        allNotes: [
          {
            id: 1,
            title: "First Note",
            content: "First note content",
            userId: 1,
          },
          {
            id: 2,
            title: "Second Note",
            content: "Second note content",
            userId: 1,
          },
        ],
      }),
    ).to.be.true;
  });

  it("This should return an empty array if the user has no notes", async () => {
    // simulate no notes
    prisma.note.findMany = sinon.stub().resolves([]);

    await getAllNotes(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ allNotes: [] })).to.be.true;
  });

  it("This should fetch only notes belonging to the current user", async () => {
    //  database query
    const findManyStub = (prisma.note.findMany = sinon.stub().resolves([]));

    await getAllNotes(req, res);

    // use the logged-in user's ID
    expect(
      findManyStub.calledWith({
        where: {
          userId: 1,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ).to.be.true;
  });

  it("This should return 500 if fetching notes fails", async () => {
    // in case of database failure
    prisma.note.findMany = sinon.stub().rejects(new Error("Database error"));

    await getAllNotes(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Something went wrong",
      }),
    ).to.be.true;
  });
});

// update note -all scenarios done too
describe("Note Controller : Update Note", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      params: {
        noteId: "1",
      },
      body: {
        title: "Updated Note",
        noteContent: "Updated note content",
        updatedAt: "2026-08-26T10:00:00.000Z",
      },
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
  it("This should update the note successfully", async () => {
    const existingNote = {
      id: 1,
      title: "Old Note",
      content: "Old note content",
      userId: 1,
      updatedAt: new Date("2026-08-26T10:00:00.000Z"),
    };
    const updatedNote = {
      id: 1,
      title: "Updated Note",
      content: "Updated note content",
      userId: 1,
    };

    prisma.note.findFirst = sinon.stub().resolves(existingNote);

    prisma.note.updateMany = sinon.stub().resolves({
      count: 1,
    });

    prisma.note.findUnique = sinon.stub().resolves(updatedNote);

    await updateNote(req, res);

    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note updated successfully",
        note: updatedNote,
      }),
    ).to.be.true;
  });

  it("This should return 400 if note ID is invalid", async () => {
    //  noteId-> number and  then controller rejects non-positive or non-integer IDs
    req.params.noteId = "abc";

    await updateNote(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid note ID",
      }),
    ).to.be.true;
  });

  it("This should return 404 if note does not exist", async () => {
    // note does not exist +does not belong to the user
    prisma.note.findFirst = sinon.stub().resolves(null);
    await updateNote(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: "Couldn't find note" })).to.be.true;
  });

  // incas of database failure
  it("This should return 500 if updating the note fails", async () => {
    prisma.note.findFirst = sinon.stub().rejects(new Error("Database error"));
    await updateNote(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: "Something went wrong" })).to.be.true;
  });

  //   concurrent update test
  it("This should return 409 if the note was updated by another request", async () => {
    // Note exists and belongs to the current user
    prisma.note.findFirst = sinon
      .stub()
      .resolves({
        id: 1,
        title: "Ol d Note",
        content: "Old note content",
        userId: 1,
        updatedAt: new Date("2026-08-26T10:00:00.000Z"),
      }); // count 0 - updatedAt value no longer matches
       // so another request changed the note first

    prisma.note.updateMany = sinon.stub().resolves({ count: 0 });
    await updateNote(req, res);
    expect(res.status.calledWith(409)).to.be.true;
    expect(
      res.json.calledWith({
        message:
          "Note was updated by another request. Please reload and try again.",
      }),
    ).to.be.true;
  });
});

// implementing test for handling toogle pin
describe("Note Controller : Toggle Pin", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        noteId: "1",
      },
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

  it("This should pin the note successfully", async () => {
    const existingNote = {
      id: 1,
      title: "Test Note",
      content: "Test note content",
      userId: 1,
      isPinned: false,
    };

    const updatedNote = {
      id: 1,
      title: "Test Note",
      content: "Test note content",
      userId: 1,
      isPinned: true,
    };
    prisma.note.findFirst = sinon.stub().resolves(existingNote);

    prisma.note.updateMany = sinon.stub().resolves({
      count: 1,
    });
    prisma.note.findUnique = sinon.stub().resolves(updatedNote);

    await togglePin(req, res);
    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note pin status updated successfully",
        note: updatedNote,
      }),
    ).to.be.true;
  });

  it("This should return 400 if note ID is invalid", async () => {
    // accept positive integer note IDs
    req.params.noteId = "abc";

    await togglePin(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid note ID",
      }),

    ).to.be.true;
  });

  it("This should return 404 if the note does not belong to the current user", async () => {
    // findFirst checks both the note ID and the logged-in user's ID
    prisma.note.findFirst = sinon.stub().resolves(null);
    await togglePin(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Couldn't find note",
      }),
    ).to.be.true;
  });
  it("This should unpin the note successfully", async () => {
    const existingNote = {
      id: 1,
      title: "Pinned Note",
      content: "Pinned note content",
      userId: 1,
      isPinned: true,
    };

    const updatedNote = {
      id: 1,
      title: "Pinned Note",
      content: "Pinned note content",
      userId: 1,
      isPinned: false,
    };
    prisma.note.findFirst = sinon.stub().resolves(existingNote);

    prisma.note.updateMany = sinon.stub().resolves({
      count: 1,
    });

 prisma.note.findUnique = sinon.stub().resolves(updatedNote);

    await togglePin(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Note pin status updated successfully",
        note: updatedNote,
      }),
    ).to.be.true;
  });

  it("This should return 409 if the note pin status was changed by another request", async () => {
    // count 0 - isPinned value no longer matches-another request changed status 
    prisma.note.findFirst = sinon.stub().resolves({
      id: 1,
      title: "Test Note",
      content: "Test note content",
      userId: 1,
      isPinned: false,
    });
    prisma.note.updateMany = sinon.stub().resolves({
      count: 0,
    });

    await togglePin(req, res);
    expect(res.status.calledWith(409)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note was updated by another request. Please try again.",
      }),
    ).to.be.true;
  });
  it("This should return 500 if updating pin status fails", async () => {
    prisma.note.findFirst = sinon.stub().rejects(new Error("Database error"));
    await togglePin(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Error! Something went wrong",
      }),
    ).to.be.true;
  });
});

// move note to trash
describe("Note Controller : Move To Trash", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      params: {
        noteId: "1",
      },
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

  it("This should move the note to trash successfully", async () => {
    const existingNote = {
      id: 1,
      title: "Test Note",
      content: "Test note content",
      userId: 1,
    };
    const updatedNote = {
      id: 1,
      title: "Test Note",
      content: "Test note content",
      userId: 1,
      isDeleted: true,
    };

    prisma.note.findFirst = sinon.stub().resolves(existingNote);
    prisma.note.update = sinon.stub().resolves(updatedNote);

    await moveToTrash(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Note moved to Trash successfully",
        note: updatedNote,
      }),
    ).to.be.true;
  });

  it("This should return 400 if note ID is invalid", async () => {
  // reject non-numeric, zero and negative id
  req.params.noteId = "abc";

  await moveToTrash(req, res);
  expect(res.status.calledWith(400)).to.be.true;
  expect(
    res.json.calledWith({
      message: "Invalid note ID",
    }),
  ).to.be.true;
});

it("This should return 404 if the note does not exist or does not belong to the current user", async () => {
  // check both note id + logged-in user id
  prisma.note.findFirst = sinon.stub().resolves(null);
  await moveToTrash(req, res);

  expect(res.status.calledWith(404)).to.be.true;
  expect(
    res.json.calledWith({
      message: "Couldn't find note",
    }),
  ).to.be.true;
});

it("This should return 500 if moving the note to trash fails", async () => {
  // failure while we are finding note
  prisma.note.findFirst = sinon
    .stub()
    .rejects(new Error("Database error"));

  await moveToTrash(req, res);
  expect(res.status.calledWith(500)).to.be.true;
  expect(
    res.json.calledWith({
      message: "Error! Something went wrong",
    }),
  ).to.be.true;
});
});


// test for restore from trash
describe("Note Controller : Restore Note", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        noteId: "1",
      },
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
  it("This should restore the note successfully", async () => {
    const deletedNote = {
      id: 1,
      title: "Deleted Note",
      content: "Deleted note content",
      userId: 1,
      isDeleted: true,
    };
    const restoredNote = {
      id: 1,
      title: "Deleted Note",
      content: "Deleted note content",
      userId: 1,
      isDeleted: false,
      deletedAt: null,
    };

    // deleted note that belongs to current
    prisma.note.findFirst = sinon.stub().resolves(deletedNote);
    // Restore the note
    prisma.note.update = sinon.stub().resolves(restoredNote);

    await restoreNote(req, res);
    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Note restored successfully",
        note: restoredNote,
      }),
    ).to.be.true;
  });



  it("This should return 400 if note ID is invalid", async () => {
    req.params.noteId = "abc";
    await restoreNote(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Invalid note ID",
      }),
    ).to.be.true;
  });

  it("This should return 404 if the deleted note does not exist or does not belong to the current user", async () => {
    // check note ID+user ID+ isDeleted
    prisma.note.findFirst = sinon.stub().resolves(null);
    await restoreNote(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Couldn't find deleted note",
      }),
    ).to.be.true;
  });

  it("This should return 500 if restoring the note fails", async () => {
    prisma.note.findFirst = sinon
      .stub()
      .rejects(new Error("Database error"));

    await restoreNote(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Something went wrong",
      }),
    ).to.be.true;
  });
});

// permanent deletion
describe("Note Controller - Delete Forever", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        noteId: "1",
      },
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

  it("This should permanently delete the note successfully", async () => {
    const deletedNote = {
      id: 1,
      title: "Deleted Note",
      content: "Deleted note content",
      userId: 1,
      isDeleted: true,
    };

    // note in trash
    prisma.note.findFirst = sinon.stub().resolves(deletedNote);
    prisma.note.deleteMany = sinon.stub().resolves({
      count: 1,
    });

    await deleteForever(req, res);
    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Note permanently deleted",
      }),
    ).to.be.true;
  });

  it("This should return 400 if note ID is invalid", async () => {
    req.params.noteId = "abc";

    await deleteForever(req, res);
    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Error! Invalid note ID",
      }),
    ).to.be.true;
  });

  it("This should return 404 if the note does not exist, does not belong to the user, or is not in trash", async () => {
    prisma.note.findFirst = sinon.stub().resolves(null);
    await deleteForever(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Couldn't find note",
      }),
    ).to.be.true;
  });

  it("This should return 409 if the note state changes before permanent deletion", async () => {
    const deletedNote = {
      id: 1,
      title: "Deleted Note",
      content: "Deleted note content",
      userId: 1,
      isDeleted: true,
    };

    // note currently in trash
    prisma.note.findFirst = sinon.stub().resolves(deletedNote);

    // count 0 -note not matches delete condition
    prisma.note.deleteMany = sinon.stub().resolves({
      count: 0,
    });

    await deleteForever(req, res);

    expect(res.status.calledWith(409)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Note state changed. Please reload and try again.",
      }),
    ).to.be.true;
  });

  it("This should return 500 if permanently deleting the note fails", async () => {
    // database failure
    prisma.note.findFirst = sinon
      .stub()
      .rejects(new Error("Database error"));

    await deleteForever(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(
      res.json.calledWith({
        message: "Error! Something went wrong",
      }),
    ).to.be.true;
  });
});
