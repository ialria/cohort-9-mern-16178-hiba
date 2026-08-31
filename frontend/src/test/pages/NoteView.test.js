import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import NoteView from "../../pages/Dashboard/views/NoteView.jsx";
import { useNotes } from "../../context/NotesContext.jsx";
import { useParams, useNavigate } from "react-router-dom";

jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("quill/dist/quill.snow.css", () => ({}));
// trigger save/cancel
jest.mock("../../pages/Dashboard/components/note_components/NoteToolBar", () => {
  return function MockNoteToolBar({
    onSave,
    onCancel,
    saveStatus,
  }) {
    return (
      <div data-testid="note-toolbar">
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
        <span data-testid="save-status">{saveStatus}</span>
      </div>
    );
  };
});

// Mock TextArea
jest.mock("../../components/TextArea.jsx", () => {
  return function MockTextArea({
    value,
    onChange,
    placeholder,
  }) {
    return (
      <textarea
        aria-label="Note title"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  };
});

// Mock ReactQuill
jest.mock("react-quill-new", () => {
  return function MockReactQuill({
    value,
    onChange,
    placeholder,
  }) {
    return (
      <div>
        <textarea
          aria-label="Note content editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };
});

// Mock ErrorPage
jest.mock("../../pages/ErrorPage.jsx", () => {
  return function MockErrorPage({
    title,
    message,
    onRetry,
  }) {
    return (
      <div data-testid="error-page">
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    );
  };
});

describe("NoteView", () => {
  const mockNavigate = jest.fn();
  const mockCreateNote = jest.fn();
  const mockUpdateNote = jest.fn();

  const existingNote = {
    id: "123",
    title: "My Note",
    content: "<p>My note content</p>",
    updatedAt: "2026-08-28T10:00:00.000Z",
    isDeleted: false,
  };

  let currentNoteId = "123";

  beforeEach(() => {
    jest.clearAllMocks();

    currentNoteId = "123";

    useParams.mockImplementation(() => ({
      noteId: currentNoteId,
    }));

    useNavigate.mockReturnValue(mockNavigate);

    useNotes.mockReturnValue({
      notes: [existingNote],
      createNote: mockCreateNote,
      updateNote: mockUpdateNote,
    });

    window.confirm = jest.fn();
  });

  test("It renders an existing note with its title and content", () => {
    render(<NoteView />);

    expect(screen.getByPlaceholderText("Untitled note")).toHaveValue(
      "My Note",
    );

    expect(screen.getByLabelText("Note content editor")).toHaveValue(
      "<p>My note content</p>",
    );

    expect(screen.getByTestId("save-status")).toHaveTextContent("saved");
  });

  test("This renders a new empty note when noteId is new", () => {
    currentNoteId = "new";

    render(<NoteView />);

    expect(screen.getByPlaceholderText("Untitled note")).toHaveValue("");

    expect(screen.getByLabelText("Note content editor")).toHaveValue("");

    expect(screen.getByTestId("save-status")).toHaveTextContent("idle");
  });

  test("This updates title when the user types", () => {
    render(<NoteView />);

    const titleInput = screen.getByPlaceholderText("Untitled note");

    fireEvent.change(titleInput, {
      target: {
        value: "Updated title",
      },
    });

    expect(titleInput).toHaveValue("Updated title");

    expect(screen.getByTestId("save-status")).toHaveTextContent("unsaved");
  });

  test("It updates content when the user types", () => {
    render(<NoteView />);

    const editor = screen.getByLabelText("Note content editor");

    fireEvent.change(editor, {
      target: {
        value: "<p>Updated content</p>",
      },
    });

    expect(editor).toHaveValue("<p>Updated content</p>");

    expect(screen.getByTestId("save-status")).toHaveTextContent("unsaved");
  });

  test("This sets save status to unsaved when only title is changed", () => {
    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "New title",
      },
    });

    expect(screen.getByTestId("save-status")).toHaveTextContent("unsaved");
  });

  test("It sets save status to unsaved when only content is changed", () => {
    render(<NoteView />);

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>New content</p>",
      },
    });

    expect(screen.getByTestId("save-status")).toHaveTextContent("unsaved");
  });

  test("This does not save an existing note when there are no changes", async () => {
    render(<NoteView />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockUpdateNote).not.toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("It updates an existing note with the changed title and content", async () => {
    mockUpdateNote.mockResolvedValueOnce({});

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "  Updated title  ",
      },
    });

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>Updated content</p>",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdateNote).toHaveBeenCalledWith(
      "123",
      "  Updated title  ",
      "<p>Updated content</p>",
      existingNote.updatedAt,
    );

    expect(screen.getByTestId("save-status")).toHaveTextContent("saved");
  });

  test("This creates a new note and navigates to the created note", async () => {
    currentNoteId = "new";

    mockCreateNote.mockResolvedValueOnce({
      id: "456",
    });

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "New note",
      },
    });

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>New note content</p>",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalledTimes(1);
    });

    expect(mockCreateNote).toHaveBeenCalledWith(
      "New note",
      "<p>New note content</p>",
    );

    expect(mockNavigate).toHaveBeenCalledWith("/notes/456");

    expect(screen.getByTestId("save-status")).toHaveTextContent("saved");
  });

  test("It shows validation error when saving empty content", async () => {
    currentNoteId = "new";

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Title only",
      },
    });

    // Content is still empty
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent(
        "validation-error",
      );
    });

    expect(mockCreateNote).not.toHaveBeenCalled();
  });

 test("This shows validation error when content contains only HTML whitespace", async () => {
  currentNoteId = "new";

  render(<NoteView />);

  fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
    target: {
      value: "Test note",
    },
  });

  fireEvent.change(screen.getByLabelText("Note content editor"), {
    target: {
      value: "<p>   </p>",
    },
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    expect(screen.getByTestId("save-status")).toHaveTextContent(
      "validation-error",
    );
  });

  expect(mockCreateNote).not.toHaveBeenCalled();
});

  test("This allows saving content that contains actual text inside HTML", async () => {
    currentNoteId = "new";

    mockCreateNote.mockResolvedValueOnce({
      id: "789",
    });

    render(<NoteView />);

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>Hello world</p>",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalledWith(
        "",
        "<p>Hello world</p>",
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/notes/789");
  });

  test("It shows saving status while an existing note is being updated", async () => {
    let resolveUpdate;

    mockUpdateNote.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Changed title",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByTestId("save-status")).toHaveTextContent("saving");

    resolveUpdate({});

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent("saved");
    });
  });

  test("It shows error status when updating an existing note fails", async () => {
    mockUpdateNote.mockRejectedValueOnce(
      new Error("Failed to update note."),
    );

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Changed title",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent("error");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("This shows error status when creating a new note fails", async () => {
    currentNoteId = "new";

    mockCreateNote.mockRejectedValueOnce(
      new Error("Failed to create note."),
    );

    render(<NoteView />);

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>New content</p>",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent("error");
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("It does not navigate when cancel is clicked without unsaved changes", () => {
    render(<NoteView />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);

    expect(window.confirm).not.toHaveBeenCalled();
  });

  test("This asks for confirmation when cancelling with unsaved changes", () => {
    window.confirm.mockReturnValue(true);

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Changed title",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "You have unsaved changes. Are you sure you want to leave?",
    );

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("This does not navigate when cancel confirmation is rejected", () => {
    window.confirm.mockReturnValue(false);

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Changed title",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(window.confirm).toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("It asks for confirmation when cancelling after a save error", async () => {
    currentNoteId = "new";

    window.confirm.mockReturnValue(false);

    mockCreateNote.mockRejectedValueOnce(
      new Error("Create failed"),
    );

    render(<NoteView />);

    fireEvent.change(screen.getByLabelText("Note content editor"), {
      target: {
        value: "<p>Content</p>",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent("error");
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(window.confirm).toHaveBeenCalledWith(
      "You have unsaved changes. Are you sure you want to leave?",
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

test("This shows validation error when saving after validation failure", async () => {
  currentNoteId = "new";

  render(<NoteView />);

  fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
    target: {
      value: "Test note",
    },
  });

  fireEvent.change(screen.getByLabelText("Note content editor"), {
    target: {
      value: "<p>   </p>",
    },
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    expect(screen.getByTestId("save-status")).toHaveTextContent(
      "validation-error",
    );
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    expect(screen.getByTestId("save-status")).toHaveTextContent(
      "validation-error",
    );
  });

  expect(mockCreateNote).not.toHaveBeenCalled();
});
  test("It shows ErrorPage when the note is in trash", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          ...existingNote,
          isDeleted: true,
        },
      ],
      createNote: mockCreateNote,
      updateNote: mockUpdateNote,
    });

    render(<NoteView />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();

    expect(
      screen.getByText("Note is in trash"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This note is currently in the trash and cannot be edited.",
      ),
    ).toBeInTheDocument();
  });

  test("This navigates to dashboard when retry is clicked for a deleted note", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          ...existingNote,
          isDeleted: true,
        },
      ],
      createNote: mockCreateNote,
      updateNote: mockUpdateNote,
    });

    render(<NoteView />);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("It shows ErrorPage when the note does not exist", () => {
    currentNoteId = "999";

    useNotes.mockReturnValue({
      notes: [],
      createNote: mockCreateNote,
      updateNote: mockUpdateNote,
    });

    render(<NoteView />);

    expect(screen.getByTestId("error-page")).toBeInTheDocument();

    expect(
      screen.getByText("Oops! Note not found"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "We couldn't find it. It may have been deleted, or it's not one of your notes.",
      ),
    ).toBeInTheDocument();
  });

  test("This navigates to dashboard when retry is clicked for a missing note", () => {
    currentNoteId = "999";

    useNotes.mockReturnValue({
      notes: [],
      createNote: mockCreateNote,
      updateNote: mockUpdateNote,
    });

    render(<NoteView />);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("It adds accessibility label to the ReactQuill editor", async () => {
    render(<NoteView />);

    expect(
      screen.getByLabelText("Note content editor"),
    ).toBeInTheDocument();
  });

  test("This does not save when saveStatus is idle", () => {
    currentNoteId = "new";

    render(<NoteView />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockCreateNote).not.toHaveBeenCalled();
    expect(mockUpdateNote).not.toHaveBeenCalled();
  });

  test("This does not save when saveStatus is saving", async () => {
    let resolveUpdate;

    mockUpdateNote.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<NoteView />);

    fireEvent.change(screen.getByPlaceholderText("Untitled note"), {
      target: {
        value: "Changed",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByTestId("save-status")).toHaveTextContent("saving");

    // save again while saving should not call updateProfile again
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockUpdateNote).toHaveBeenCalledTimes(1);

    resolveUpdate({});

    await waitFor(() => {
      expect(screen.getByTestId("save-status")).toHaveTextContent("saved");
    });
  });
});
