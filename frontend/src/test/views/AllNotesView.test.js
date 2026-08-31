import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AllNotesView from "../../pages/Dashboard/views/main_content/AllNotesView.jsx";
import { useNotes } from "../../context/NotesContext.jsx";
import { useSidebar } from "../../context/SidebarContext.jsx";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../pages/Dashboard/components/NoteCard.jsx", () => {
  return function MockNoteCard({ note, onPin, onDelete, onExport }) {
    return (
      <div data-testid={`note-card-${note.id}`}>
        <span>{note.title}</span>

        <button onClick={onPin}>Pin</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onExport}>Export</button>
      </div>
    );
  };
});

jest.mock(
  "../../pages/Dashboard/components/note_components/NoteActionBar.jsx",
  () => {
    return function MockNoteActionBar({
      sortBy,
      sortOrder,
      onSort,
      onImport,
    }) {
      return (
        <div data-testid="note-action-bar">
          <span data-testid="sort-by">{sortBy}</span>
          <span data-testid="sort-order">{sortOrder}</span>

          {/* controls- sort this chaos */}
          <button onClick={() => onSort("date", "descending")}>
            Sort Date Descending
          </button>

          <button onClick={() => onSort("date", "ascending")}>
            Sort Date Ascending
          </button>

          <button onClick={() => onSort("title", "ascending")}>
            Sort Title Ascending
          </button>

          <button onClick={() => onSort("title", "descending")}>
            Sort Title Descending
          </button>

          <button onClick={() => onSort("pinned", "ascending")}>
            Sort Pinned Ascending
          </button>

          <button onClick={() => onSort("pinned", "descending")}>
            Sort Pinned Descending
          </button>

          <button onClick={onImport}>Import</button>
        </div>
      );
    };
  },
);

jest.mock(
  "../../pages/Dashboard/components/note_components/NoteMenu.jsx",
  () => {
    return function MockNoteMenu() {
      return <div data-testid="note-menu" />;
    };
  },
);

jest.mock("../../icons/icons.jsx", () => ({
  Plus: () => <span data-testid="plus-icon" />,
}));

jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

describe("AllNotesView", () => {
  const mockHandlePin = jest.fn();
  const mockMoveToTrash = jest.fn();
  const mockImportNotes = jest.fn();
  const mockExportNote = jest.fn();

  const notes = [
    {
      id: 1,
      title: "Zebra Note",
      isDeleted: false,
      isPinned: false,
      createdAt: "2026-08-01T10:00:00Z",
      editedAt: "2026-08-05T10:00:00Z",
    },
    {
      id: 2,
      title: "Apple Note",
      isDeleted: false,
      isPinned: true,
      createdAt: "2026-08-02T10:00:00Z",
      editedAt: "2026-08-10T10:00:00Z",
    },
    {
      id: 3,
      title: "Deleted Note",
      isDeleted: true,
      isPinned: false,
      createdAt: "2026-08-03T10:00:00Z",
      editedAt: "2026-08-11T10:00:00Z",
    },
  ];

  mockNavigate.mockClear();
  beforeEach(() => {
    jest.clearAllMocks();

    useSidebar.mockReturnValue({
      collapsed: false,
    });

    useNotes.mockReturnValue({
      notes,
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      importNotes: mockImportNotes,
      exportNote: mockExportNote,
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AllNotesView />
      </MemoryRouter>,
    );
  };

  test("This renders only non-deleted notes", () => {
    renderComponent();

    expect(screen.getByText("Zebra Note")).toBeInTheDocument();
    expect(screen.getByText("Apple Note")).toBeInTheDocument();

    // RIP Deleted Note
    expect(screen.queryByText("Deleted Note")).not.toBeInTheDocument();
  });

  test("This renders the empty state when there are no active notes", () => {
    useNotes.mockReturnValue({
      notes: [],
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      importNotes: mockImportNotes,
      exportNote: mockExportNote,
    });

    renderComponent();

    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first note to get started."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Create note" }),
    ).toBeInTheDocument();
  });

  test("This handles null notes without crashing", () => {
    useNotes.mockReturnValue({
      notes: null,
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      importNotes: mockImportNotes,
      exportNote: mockExportNote,
    });

    renderComponent();

    expect(screen.getByText("No notes yet")).toBeInTheDocument();
  });

test("This navigates to the new note page from the empty state", () => {
  useNotes.mockReturnValue({
    notes: [],
    handlePin: mockHandlePin,
    moveToTrash: mockMoveToTrash,
    importNotes: mockImportNotes,
    exportNote: mockExportNote,
  });

  renderComponent();

  fireEvent.click(
    screen.getByRole("button", { name: "Create note" }),
  );

  expect(mockNavigate).toHaveBeenCalledWith("/notes/new");
});

  test("It calls importNotes when the import button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Import" }));

    expect(mockImportNotes).toHaveBeenCalledTimes(1);
  });

  test("It calls handlePin with the correct note id", () => {
    renderComponent();

    const appleNote = screen.getByTestId("note-card-2");

    fireEvent.click(
      appleNote.querySelector("button:nth-of-type(1)"),
    );

    expect(mockHandlePin).toHaveBeenCalledTimes(1);
    expect(mockHandlePin).toHaveBeenCalledWith(2);
  });

  test("This calls moveToTrash with the correct note id", () => {
    renderComponent();

    const appleNote = screen.getByTestId("note-card-2");

    fireEvent.click(
      appleNote.querySelector("button:nth-of-type(2)"),
    );

    expect(mockMoveToTrash).toHaveBeenCalledTimes(1);
    expect(mockMoveToTrash).toHaveBeenCalledWith(2);
  });

  test("This calls exportNote with the correct note object", () => {
    renderComponent();

    const appleNote = screen.getByTestId("note-card-2");

    fireEvent.click(
      appleNote.querySelector("button:nth-of-type(3)"),
    );

    expect(mockExportNote).toHaveBeenCalledTimes(1);
    expect(mockExportNote).toHaveBeenCalledWith(notes[1]);
  });

  test("It puts pinned notes first when sorting by date", () => {
    renderComponent();

    const cards = screen.getAllByTestId(/^note-card-/);

    // pin
    expect(cards[0]).toHaveAttribute("data-testid", "note-card-2");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-1");
  });

  test("This sorts notes by date in ascending order", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Date Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/^note-card-/);

    // Apple is pinned, so it still gets priority.
    // Among the remaining notes, older dates come first.
    expect(cards[0]).toHaveAttribute("data-testid", "note-card-2");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-1");
  });

  test("This sorts notes by title in ascending order", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/^note-card-/);

    // pin- stays first
    expect(cards[0]).toHaveAttribute("data-testid", "note-card-2");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-1");
  });

  test("This sorts notes by title in descending order", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Descending",
      }),
    );

    const cards = screen.getAllByTestId(/^note-card-/);

    expect(cards[0]).toHaveAttribute("data-testid", "note-card-2");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-1");
  });

  test("This sorts directly by pinned status without applying pin-first logic", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Pinned Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/^note-card-/);

    // when sortBy === "pinned",not  sorting before the requested sort
    expect(cards[0]).toHaveAttribute("data-testid", "note-card-1");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-2");
  });

  test("This sorts directly by pinned status in descending order", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Pinned Descending",
      }),
    );

    const cards = screen.getAllByTestId(/^note-card-/);

    expect(cards[0]).toHaveAttribute("data-testid", "note-card-2");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-1");
  });

  test("This uses createdAt when editedAt is missing", () => {
    const notesWithoutEditedAt = [
      {
        id: 10,
        title: "Older Note",
        isDeleted: false,
        isPinned: false,
        createdAt: "2026-08-01T10:00:00Z",
      },
      {
        id: 11,
        title: "Newer Note",
        isDeleted: false,
        isPinned: false,
        createdAt: "2026-08-10T10:00:00Z",
      },
    ];

    useNotes.mockReturnValue({
      notes: notesWithoutEditedAt,
      handlePin: mockHandlePin,
      moveToTrash: mockMoveToTrash,
      importNotes: mockImportNotes,
      exportNote: mockExportNote,
    });

    renderComponent();

    const cards = screen.getAllByTestId(/^note-card-/);

    expect(cards[0]).toHaveAttribute("data-testid", "note-card-11");
    expect(cards[1]).toHaveAttribute("data-testid", "note-card-10");
  });

  test("It renders correctly when sidebar is collapsed", () => {
    useSidebar.mockReturnValue({
      collapsed: true,
    });

    renderComponent();

    expect(screen.getByText("Apple Note")).toBeInTheDocument();
    expect(screen.getByText("Zebra Note")).toBeInTheDocument();
  });
});
