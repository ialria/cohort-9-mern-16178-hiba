import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import { NotesProvider, useNotes } from "../../context/NotesContext";
import { apiFetch } from "../../config/api.js";

jest.mock("../../config/api.js", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("jszip", () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest
      .fn()
      .mockResolvedValue(new Blob(["zip content"])),
  }));
});

function TestConsumer() {
  const {
    notes,
    notesError,
    searchTerm,
    setSearchTerm,
    createNote,
    updateNote,
    getAllNotes,
    restoreNote,
    deleteForever,
    moveToTrash,
    handlePin,
    importNotes,
    exportNote,
    exportAllNotes,
    exportStatus,
    exportProgress,
  } = useNotes();

  return (
    <div>
      <div data-testid="notes">
        {JSON.stringify(notes)}
      </div>

      <div data-testid="notes-error">
        {notesError || ""}
      </div>

      <div data-testid="search-term">
        {searchTerm}
      </div>

      <div data-testid="export-status">
        {exportStatus}
      </div>

      <div data-testid="export-progress">
        {exportProgress}
      </div>

      <button
        onClick={() =>
          createNote(
            "New Note",
            "<p>New content</p>",
          ).catch(() => {})
        }
      >
        Create Note
      </button>

      <button
        onClick={() =>
          updateNote(
            1,
            "Updated Note",
            "<p>Updated content</p>",
            "2026-08-28T00:00:00.000Z",
          ).catch(() => {})
        }
      >
        Update Note
      </button>

      <button
        onClick={() => getAllNotes().catch(() => {})}
      >
        Get All Notes
      </button>

      <button
        onClick={() =>
          restoreNote(2).catch(() => {})
        }
      >
        Restore Note
      </button>

      <button
        onClick={() =>
          deleteForever(2).catch(() => {})
        }
      >
        Delete Forever
      </button>

      <button
        onClick={() =>
          moveToTrash(1).catch(() => {})
        }
      >
        Move To Trash
      </button>

      <button
        onClick={() =>
          handlePin(1).catch(() => {})
        }
      >
        Handle Pin
      </button>

      <button
        onClick={() =>
          importNotes([
            {
              title: "Imported One",
              content: "Content One",
            },
            {
              title: "Imported Two",
              content: "Content Two",
            },
          ]).catch(() => {})
        }
      >
        Import Notes
      </button>

      <button
        onClick={() =>
          exportNote({
            title: "My Note",
            content:
              "<p>Hello <strong>world</strong></p><p>Second line</p>",
          })
        }
      >
        Export Note
      </button>

      <button
        onClick={() =>
          exportNote({
            content: "<p>Untitled content</p>",
          })
        }
      >
        Export Untitled Note
      </button>

      <button
        onClick={() => exportAllNotes()}
      >
        Export All Notes
      </button>

      <button
        onClick={() => setSearchTerm("hello")}
      >
        Set Search
      </button>
    </div>
  );
}

function renderContext() {
  return render(
    <NotesProvider>
      <TestConsumer />
    </NotesProvider>,
  );
}

function response(data = {}, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  };
}

function notesResponse(notes = []) {
  return response({
    allNotes: notes,
  });
}

describe("NotesContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    global.URL.createObjectURL = jest.fn(
      () => "blob:test",
    );

    global.URL.revokeObjectURL = jest.fn();

    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    apiFetch.mockResolvedValue(
      notesResponse([]),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test("renders the provider with initial state", async () => {
    renderContext();

    expect(
      screen.getByTestId("notes"),
    ).toHaveTextContent("[]");

    expect(
      screen.getByTestId("notes-error"),
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("search-term"),
    ).toHaveTextContent("");

    expect(
      screen.getByTestId("export-status"),
    ).toHaveTextContent("idle");

    expect(
      screen.getByTestId("export-progress"),
    ).toHaveTextContent("0");

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/notes",
      );
    });
  });

  test("fetches notes when provider mounts", async () => {
    const notes = [
      {
        id: 1,
        title: "First Note",
        content: "First content",
        isDeleted: false,
      },
      {
        id: 2,
        title: "Second Note",
        content: "Second content",
        isDeleted: false,
      },
    ];

    apiFetch.mockResolvedValueOnce(
      notesResponse(notes),
    );

    renderContext();

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("notes").textContent,
        ),
      ).toEqual(notes);
    });
  });

  test("sets search term", () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Search",
      }),
    );

    expect(
      screen.getByTestId("search-term"),
    ).toHaveTextContent("hello");
  });

  test("creates a note successfully", async () => {
    const newNote = {
      id: 1,
      title: "New Note",
      content: "<p>New content</p>",
      isDeleted: false,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          { note: newNote },
          true,
          201,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Note",
      }),
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("notes").textContent,
        ),
      ).toEqual([newNote]);
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes",
      {
        method: "POST",
        body: JSON.stringify({
          title: "New Note",
          noteContent: "<p>New content</p>",
        }),
      },
    );

    expect(
      screen.getByTestId("notes-error"),
    ).toHaveTextContent("");
  });

  test("sets error when createNote fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Failed to create note",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create Note",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent(
        "Failed to create note",
      );
    });
  });

  test("updates a note successfully", async () => {
    const oldNote = {
      id: 1,
      title: "Old Note",
      content: "Old content",
      isDeleted: false,
    };

    const updatedNote = {
      id: 1,
      title: "Updated Note",
      content: "<p>Updated content</p>",
      updatedAt: "2026-08-28T00:00:00.000Z",
      isDeleted: false,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([oldNote]),
      )
      .mockResolvedValueOnce(
        response({ note: updatedNote }),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Old Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Note",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Updated Note");
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes/1",
      {
        method: "PATCH",
        body: JSON.stringify({
          title: "Updated Note",
          noteContent: "<p>Updated content</p>",
          updatedAt:
            "2026-08-28T00:00:00.000Z",
        }),
      },
    );
  });

  test("sets error when updateNote fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Update failed",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Note",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent("Update failed");
    });
  });

  test("getAllNotes fetches and replaces notes", async () => {
    const notes = [
      {
        id: 5,
        title: "Fetched Note",
        content: "Fetched content",
        isDeleted: false,
      },
    ];

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        notesResponse(notes),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Get All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("notes").textContent,
        ),
      ).toEqual(notes);
    });

    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  test("sets error when getAllNotes fails", async () => {
    apiFetch.mockResolvedValueOnce(
      response(
        {
          message: "Failed to fetch notes",
        },
        false,
        500,
      ),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent(
        "Failed to fetch notes",
      );
    });
  });

  test("restores a note successfully", async () => {
    const deletedNote = {
      id: 2,
      title: "Deleted Note",
      content: "Content",
      isDeleted: true,
    };

    const restoredNote = {
      ...deletedNote,
      isDeleted: false,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([deletedNote]),
      )
      .mockResolvedValueOnce(
        response({ note: restoredNote }),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isDeleted":true',
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Restore Note",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isDeleted":false',
      );
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes/2/restore",
      {
        method: "PATCH",
      },
    );
  });

  test("sets error when restoreNote fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Restore failed",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Restore Note",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent("Restore failed");
    });
  });

  test("permanently deletes a note", async () => {
    const notes = [
      {
        id: 1,
        title: "Keep Note",
        content: "Keep",
        isDeleted: false,
      },
      {
        id: 2,
        title: "Delete Note",
        content: "Delete",
        isDeleted: true,
      },
    ];

    apiFetch
      .mockResolvedValueOnce(
        notesResponse(notes),
      )
      .mockResolvedValueOnce(
        response({
          message: "Note deleted",
        }),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Delete Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Forever",
      }),
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("notes").textContent,
        ),
      ).toEqual([notes[0]]);
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes/2",
      {
        method: "DELETE",
      },
    );
  });

  test("sets error when permanent deletion fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Delete failed",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete Forever",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent("Delete failed");
    });
  });

  test("moves a note to trash", async () => {
    const note = {
      id: 1,
      title: "My Note",
      content: "Content",
      isDeleted: false,
    };

    const trashedNote = {
      ...note,
      isDeleted: true,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([note]),
      )
      .mockResolvedValueOnce(
        response({ note: trashedNote }),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isDeleted":false',
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Move To Trash",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isDeleted":true',
      );
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes/1/trash",
      {
        method: "PATCH",
      },
    );
  });

  test("sets error when moving note to trash fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Trash failed",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Move To Trash",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent("Trash failed");
    });
  });

  test("pins a note", async () => {
    const note = {
      id: 1,
      title: "My Note",
      content: "Content",
      isPinned: false,
      isDeleted: false,
    };

    const pinnedNote = {
      ...note,
      isPinned: true,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([note]),
      )
      .mockResolvedValueOnce(
        response({ note: pinnedNote }),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isPinned":false',
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Handle Pin",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent(
        '"isPinned":true',
      );
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes/1/pin",
      {
        method: "PATCH",
      },
    );
  });

  test("sets error when pinning fails", async () => {
    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Pin failed",
          },
          false,
          500,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Handle Pin",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("notes-error"),
      ).toHaveTextContent("Pin failed");
    });
  });

  test("imports multiple notes", async () => {
    const firstNote = {
      id: 1,
      title: "Imported One",
      content: "Content One",
      isDeleted: false,
    };

    const secondNote = {
      id: 2,
      title: "Imported Two",
      content: "Content Two",
      isDeleted: false,
    };

    apiFetch
      .mockResolvedValueOnce(
        notesResponse([]),
      )
      .mockResolvedValueOnce(
        response(
          {
            note: firstNote,
          },
          true,
          201,
        ),
      )
      .mockResolvedValueOnce(
        response(
          {
            note: secondNote,
          },
          true,
          201,
        ),
      );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Import Notes",
      }),
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("notes").textContent,
        ),
      ).toEqual([
        firstNote,
        secondNote,
      ]);
    });

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/notes",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Imported One",
          noteContent: "Content One",
        }),
      },
    );

    expect(apiFetch).toHaveBeenNthCalledWith(
      3,
      "/api/notes",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Imported Two",
          noteContent: "Content Two",
        }),
      },
    );
  });

  test("exports a normal note", async () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export Note",
      }),
    );

    await waitFor(() => {
      expect(
        URL.createObjectURL,
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      URL.revokeObjectURL,
    ).toHaveBeenCalledWith("blob:test");

    expect(
      HTMLAnchorElement.prototype.click,
    ).toHaveBeenCalled();
  });

  test("exports an untitled note", async () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export Untitled Note",
      }),
    );

    await waitFor(() => {
      expect(
        URL.createObjectURL,
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      URL.revokeObjectURL,
    ).toHaveBeenCalledWith("blob:test");

    expect(
      HTMLAnchorElement.prototype.click,
    ).toHaveBeenCalled();
  });

  test("does nothing when there are no active notes", async () => {
    const deletedNote = {
      id: 1,
      title: "Deleted Note",
      content: "Content",
      isDeleted: true,
    };

    apiFetch.mockResolvedValueOnce(
      notesResponse([deletedNote]),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Deleted Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    expect(
      screen.getByTestId("export-status"),
    ).toHaveTextContent("idle");

    expect(
      screen.getByTestId("export-progress"),
    ).toHaveTextContent("0");

    expect(
      URL.createObjectURL,
    ).not.toHaveBeenCalled();
  });

  test("exports all active notes", async () => {
    const notes = [
      {
        id: 1,
        title: "First Note",
        content: "<p>First content</p>",
        isDeleted: false,
      },
      {
        id: 2,
        title: "Second Note",
        content: "<p>Second content</p>",
        isDeleted: false,
      },
      {
        id: 3,
        title: "Deleted Note",
        content: "<p>Deleted</p>",
        isDeleted: true,
      },
    ];

    apiFetch.mockResolvedValueOnce(
      notesResponse(notes),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("First Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("completed");
    });

    expect(
      screen.getByTestId("export-progress"),
    ).toHaveTextContent("2");

    expect(
      URL.createObjectURL,
    ).toHaveBeenCalledTimes(1);

    expect(
      URL.revokeObjectURL,
    ).toHaveBeenCalledWith("blob:test");
  });

  test("handles duplicate note titles during export", async () => {
    const notes = [
      {
        id: 1,
        title: "Same Title",
        content: "<p>First</p>",
        isDeleted: false,
      },
      {
        id: 2,
        title: "Same Title",
        content: "<p>Second</p>",
        isDeleted: false,
      },
    ];

    apiFetch.mockResolvedValueOnce(
      notesResponse(notes),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Same Title");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("completed");
    });

    const JSZip = require("jszip");
    const zipInstance =
      JSZip.mock.results[0].value;

    expect(zipInstance.file).toHaveBeenCalledTimes(
      2,
    );

    expect(
      zipInstance.file,
    ).toHaveBeenNthCalledWith(
      1,
      "Same Title.txt",
      "Same Title\n\nFirst",
    );

    expect(
      zipInstance.file,
    ).toHaveBeenNthCalledWith(
      2,
      "Same Title (1).txt",
      "Same Title\n\nSecond",
    );
  });

  test("sanitizes invalid characters in exported filenames", async () => {
    const notes = [
      {
        id: 1,
        title: 'Test:/\\*?"<>|Note',
        content: "<p>Hello</p>",
        isDeleted: false,
      },
    ];

    apiFetch.mockResolvedValueOnce(
      notesResponse(notes),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Test:/");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("completed");
    });

    const JSZip = require("jszip");
    const zipInstance =
      JSZip.mock.results[0].value;

    expect(
      zipInstance.file,
    ).toHaveBeenCalledWith(
      "Test_________Note.txt",
      'Test:/\\*?"<>|Note\n\nHello',
    );
  });

  test("shows exporting status while generating the zip", async () => {
    let resolveZip;

    const zipPromise = new Promise((resolve) => {
      resolveZip = resolve;
    });

    const JSZip = require("jszip");

    JSZip.mockImplementationOnce(() => ({
      file: jest.fn(),
      generateAsync: jest.fn(() => zipPromise),
    }));

    const note = {
      id: 1,
      title: "Test Note",
      content: "<p>Content</p>",
      isDeleted: false,
    };

    apiFetch.mockResolvedValueOnce(
      notesResponse([note]),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Test Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("exporting");
    });

    expect(
      screen.getByTestId("export-progress"),
    ).toHaveTextContent("1");

    await act(async () => {
      resolveZip(new Blob(["zip"]));
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("completed");
    });
  });

  test("resets export status after three seconds", async () => {
    jest.useFakeTimers();

    const note = {
      id: 1,
      title: "Test Note",
      content: "<p>Content</p>",
      isDeleted: false,
    };

    apiFetch.mockResolvedValueOnce(
      notesResponse([note]),
    );

    renderContext();

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByTestId("notes"),
    ).toHaveTextContent("Test Note");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("completed");
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByTestId("export-status"),
    ).toHaveTextContent("idle");

    expect(
      screen.getByTestId("export-progress"),
    ).toHaveTextContent("0");
  });

  test("handles export failure", async () => {
    const JSZip = require("jszip");

    JSZip.mockImplementationOnce(() => ({
      file: jest.fn(),
      generateAsync: jest
        .fn()
        .mockRejectedValue(
          new Error("ZIP generation failed"),
        ),
    }));

    const note = {
      id: 1,
      title: "Test Note",
      content: "<p>Content</p>",
      isDeleted: false,
    };

    apiFetch.mockResolvedValueOnce(
      notesResponse([note]),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("notes"),
      ).toHaveTextContent("Test Note");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Export All Notes",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("export-status"),
      ).toHaveTextContent("error");
    });
  });
});
