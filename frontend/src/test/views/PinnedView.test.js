import { render, screen, fireEvent } from "@testing-library/react";
import PinnedView from "../../pages/Dashboard/views/main_content/PinnedView.jsx";
import { useNotes } from "../../context/NotesContext.jsx";
import { useSidebar } from "../../context/SidebarContext.jsx";

jest.mock("../../pages/Dashboard/components/NoteCard.jsx", () => {
  return function MockNoteCard({
    note,
    showDate,
    previewLines,
    showPin,
    compact,
    onPin,
    onDelete,
    onExport,
  }) {
    return (
      <div data-testid={`note-card-${note.id}`}>
        <span>{note.title}</span>

        <span data-testid={`show-date-${note.id}`}>
          {String(showDate)}
        </span>

        <span data-testid={`preview-lines-${note.id}`}>
          {String(previewLines)}
        </span>

        <span data-testid={`show-pin-${note.id}`}>
          {String(showPin)}
        </span>

        <span data-testid={`compact-${note.id}`}>
          {String(compact)}
        </span>

        <button onClick={onPin}>Pin</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onExport}>Export</button>
      </div>
    );
  };
});

jest.mock("../../pages/Dashboard/components/note_components/NoteMenu.jsx", () => {
  return function MockNoteMenu() {
    return <div data-testid="note-menu" />;
  };
});

jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

describe("PinnedView", () => {
  const mockHandlePin = jest.fn();
  const mockMoveToTrash = jest.fn();
  const mockExportNote = jest.fn();

  const notes = [
    {
      id: 1,
      title: "Pinned Note",
      isPinned: true,
      isDeleted: false,
    },
    {
      id: 2,
      title: "Regular Note",
      isPinned: false,
      isDeleted: false,
    },
    {
      id: 3,
      title: "Deleted Pinned Note",
      isPinned: true,
      isDeleted: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useSidebar.mockReturnValue({
      collapsed: false,
    });

    useNotes.mockReturnValue({
      notes,
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      exportNote: mockExportNote,
    });
  });

  test("This renders only pinned and non-deleted notes", () => {
    render(<PinnedView />);

    expect(screen.getByText("Pinned Note")).toBeInTheDocument();

    // regular notes not in pinnedView
    expect(screen.queryByText("Regular Note")).not.toBeInTheDocument();

    // Deleted + pinned = still deleted.
    expect(
      screen.queryByText("Deleted Pinned Note"),
    ).not.toBeInTheDocument();
  });

  test("This shows the empty message when there are no pinned notes", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 2,
          title: "Regular Note",
          isPinned: false,
          isDeleted: false,
        },
      ],
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      exportNote: mockExportNote,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("No pinned notes yet."),
    ).toBeInTheDocument();
  });

  test("shows the empty message when all pinned notes are deleted", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 3,
          title: "Deleted Pinned Note",
          isPinned: true,
          isDeleted: true,
        },
      ],
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      exportNote: mockExportNote,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("No pinned notes yet."),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Deleted Pinned Note"),
    ).not.toBeInTheDocument();
  });

  test("Thsi calls handlePin with the correct note id", () => {
    render(<PinnedView />);

    const noteCard = screen.getByTestId("note-card-1");

    fireEvent.click(
      noteCard.querySelector("button:nth-of-type(1)"),
    );

    expect(mockHandlePin).toHaveBeenCalledTimes(1);
    expect(mockHandlePin).toHaveBeenCalledWith(1);
  });

  test("It calls moveToTrash with the correct note id", () => {
    render(<PinnedView />);

    const noteCard = screen.getByTestId("note-card-1");

    fireEvent.click(
      noteCard.querySelector("button:nth-of-type(2)"),
    );

    expect(mockMoveToTrash).toHaveBeenCalledTimes(1);
    expect(mockMoveToTrash).toHaveBeenCalledWith(1);
  });

  test("It calls exportNote with the correct note object", () => {
    render(<PinnedView />);

    const noteCard = screen.getByTestId("note-card-1");

    fireEvent.click(
      noteCard.querySelector("button:nth-of-type(3)"),
    );

    expect(mockExportNote).toHaveBeenCalledTimes(1);
    expect(mockExportNote).toHaveBeenCalledWith(notes[0]);
  });

  test("This passes the correct display props to NoteCard", () => {
    render(<PinnedView />);

    expect(
      screen.getByTestId("show-date-1"),
    ).toHaveTextContent("false");

    expect(
      screen.getByTestId("preview-lines-1"),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId("show-pin-1"),
    ).toHaveTextContent("true");

    expect(
      screen.getByTestId("compact-1"),
    ).toHaveTextContent("true");
  });

  test("It renders multiple pinned notes", () => {
    const multiplePinnedNotes = [
      {
        id: 10,
        title: "First Pinned Note",
        isPinned: true,
        isDeleted: false,
      },
      {
        id: 11,
        title: "Second Pinned Note",
        isPinned: true,
        isDeleted: false,
      },
      {
        id: 12,
        title: "Not Pinned",
        isPinned: false,
        isDeleted: false,
      },
    ];

    useNotes.mockReturnValue({
      notes: multiplePinnedNotes,
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      exportNote: mockExportNote,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("First Pinned Note"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Second Pinned Note"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Not Pinned"),
    ).not.toBeInTheDocument();

    expect(screen.getAllByTestId(/^note-card-/)).toHaveLength(2);
  });

  test("It renders correctly when the sidebar is collapsed", () => {
    useSidebar.mockReturnValue({
      collapsed: true,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("Pinned Note"),
    ).toBeInTheDocument();
  });

  test("This renders correctly when the sidebar is expanded", () => {
    useSidebar.mockReturnValue({
      collapsed: false,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("Pinned Note"),
    ).toBeInTheDocument();
  });

  test("It does not render any NoteCard when there are no notes", () => {
    useNotes.mockReturnValue({
      notes: [],
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      exportNote: mockExportNote,
    });

    render(<PinnedView />);

    expect(
      screen.getByText("No pinned notes yet."),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId(/^note-card-/),
    ).not.toBeInTheDocument();
  });
});
