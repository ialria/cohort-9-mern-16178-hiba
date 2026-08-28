import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import AllNotesView from "../../views/AllNotesView.jsx";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../../../context/SidebarContext.jsx";
import { useNotes } from "../../../../context/NotesContext.jsx";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

jest.mock("../../../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../../../icons/icons.jsx", () => ({
  Plus: () => <span data-testid="plus-icon">Plus</span>,
}));

jest.mock("../../../../components/NoteCard.jsx", () => {
  return function MockNoteCard({
    note,
    onPin,
    onDelete,
    onExport,
  }) {
    return (
      <div data-testid={`note-card-${note.id}`}>
        <span data-testid={`note-title-${note.id}`}>
          {note.title}
        </span>

        <span data-testid={`note-pinned-${note.id}`}>
          {String(note.isPinned)}
        </span>

        <button
          type="button"
          onClick={onPin}
          data-testid={`pin-${note.id}`}
        >
          Pin
        </button>

        <button
          type="button"
          onClick={onDelete}
          data-testid={`delete-${note.id}`}
        >
          Delete
        </button>

        <button
          type="button"
          onClick={onExport}
          data-testid={`export-${note.id}`}
        >
          Export
        </button>
      </div>
    );
  };
});

jest.mock("../../components/note_components/NoteActionBar.jsx", () => {
  return function MockNoteActionBar({
    sortBy,
    sortOrder,
    onSort,
    onImport,
  }) {
    return (
      <div data-testid="note-action-bar">
        <span data-testid="current-sort-by">
          {sortBy}
        </span>

        <span data-testid="current-sort-order">
          {sortOrder}
        </span>

        <button
          type="button"
          onClick={() => onSort("title", "ascending")}
        >
          Sort Title Ascending
        </button>

        <button
          type="button"
          onClick={() => onSort("title", "descending")}
        >
          Sort Title Descending
        </button>

        <button
          type="button"
          onClick={() => onSort("date", "ascending")}
        >
          Sort Date Ascending
        </button>

        <button
          type="button"
          onClick={() => onSort("date", "descending")}
        >
          Sort Date Descending
        </button>

        <button
          type="button"
          onClick={() => onSort("pinned", "ascending")}
        >
          Sort Pinned Ascending
        </button>

        <button
          type="button"
          onClick={() => onSort("pinned", "descending")}
        >
          Sort Pinned Descending
        </button>

        <button
          type="button"
          onClick={onImport}
        >
          Import
        </button>
      </div>
    );
  };
});

describe("AllNotesView", () => {
  let navigate;
  let handlePin;
  let moveToTrash;
  let importNotes;
  let exportNote;

  const notes = [
    {
      id: 1,
      title: "Banana",
      content: "Banana content",
      isPinned: false,
      isDeleted: false,
      createdAt: "2026-08-20T10:00:00Z",
      editedAt: "2026-08-25T10:00:00Z",
    },
    {
      id: 2,
      title: "Apple",
      content: "Apple content",
      isPinned: true,
      isDeleted: false,
      createdAt: "2026-08-22T10:00:00Z",
      editedAt: "2026-08-26T10:00:00Z",
    },
    {
      id: 3,
      title: "Cherry",
      content: "Cherry content",
      isPinned: false,
      isDeleted: true,
      createdAt: "2026-08-24T10:00:00Z",
      editedAt: "2026-08-27T10:00:00Z",
    },
    {
      id: 4,
      title: "Date",
      content: "Date content",
      isPinned: true,
      isDeleted: false,
      createdAt: "2026-08-23T10:00:00Z",
      editedAt: "2026-08-28T10:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    navigate = jest.fn();
    handlePin = jest.fn();
    moveToTrash = jest.fn();
    importNotes = jest.fn();
    exportNote = jest.fn();

    useNavigate.mockReturnValue(navigate);

    useSidebar.mockReturnValue({
      collapsed: false,
    });

    useNotes.mockReturnValue({
      notes,
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });
  });

  test("renders the note action bar", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("note-action-bar"),
    ).toBeInTheDocument();
  });

  test("renders all non-deleted notes", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("note-card-1"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("note-card-2"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("note-card-4"),
    ).toBeInTheDocument();
  });

  test("does not render deleted notes", () => {
    render(<AllNotesView />);

    expect(
      screen.queryByTestId("note-card-3"),
    ).not.toBeInTheDocument();
  });

  test("renders notes with the correct titles", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("note-title-1"),
    ).toHaveTextContent("Banana");

    expect(
      screen.getByTestId("note-title-2"),
    ).toHaveTextContent("Apple");

    expect(
      screen.getByTestId("note-title-4"),
    ).toHaveTextContent("Date");
  });

  test("renders pinned status correctly", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("note-pinned-1"),
    ).toHaveTextContent("false");

    expect(
      screen.getByTestId("note-pinned-2"),
    ).toHaveTextContent("true");

    expect(
      screen.getByTestId("note-pinned-4"),
    ).toHaveTextContent("true");
  });

  test("does not mutate the original notes array while sorting", () => {
    const originalNotes = [...notes];

    render(<AllNotesView />);

    expect(notes).toEqual(originalNotes);
  });

  test("puts pinned notes first by default", () => {
    render(<AllNotesView />);

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-4",
      "note-card-2",
      "note-card-1",
    ]);
  });

  test("sorts notes by title in ascending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-2",
      "note-card-4",
      "note-card-1",
    ]);
  });

  test("sorts notes by title in descending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Descending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-4",
      "note-card-2",
      "note-card-1",
    ]);
  });

  test("sorts notes by date in ascending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Date Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-2",
      "note-card-4",
      "note-card-1",
    ]);
  });

  test("sorts notes by date in descending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Date Descending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-4",
      "note-card-2",
      "note-card-1",
    ]);
  });

  test("sorts notes by pinned status in ascending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Pinned Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-1",
      "note-card-2",
      "note-card-4",
    ]);
  });

  test("sorts notes by pinned status in descending order", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Pinned Descending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-2",
      "note-card-4",
      "note-card-1",
    ]);
  });

  test("updates the selected sort values after changing sort", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("current-sort-by"),
    ).toHaveTextContent("date");

    expect(
      screen.getByTestId("current-sort-order"),
    ).toHaveTextContent("descending");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Ascending",
      }),
    );

    expect(
      screen.getByTestId("current-sort-by"),
    ).toHaveTextContent("title");

    expect(
      screen.getByTestId("current-sort-order"),
    ).toHaveTextContent("ascending");
  });

  test("calls importNotes when import is triggered", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Import",
      }),
    );

    expect(importNotes).toHaveBeenCalledTimes(1);
  });

  test("calls handlePin with the correct note id", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByTestId("pin-2"),
    );

    expect(handlePin).toHaveBeenCalledTimes(1);
    expect(handlePin).toHaveBeenCalledWith(2);
  });

  test("calls moveToTrash with the correct note id", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByTestId("delete-1"),
    );

    expect(moveToTrash).toHaveBeenCalledTimes(1);
    expect(moveToTrash).toHaveBeenCalledWith(1);
  });

  test("calls exportNote with the complete note", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByTestId("export-4"),
    );

    expect(exportNote).toHaveBeenCalledTimes(1);
    expect(exportNote).toHaveBeenCalledWith(notes[3]);
  });

  test("navigates to the new note page from the floating plus button", () => {
    render(<AllNotesView />);

    fireEvent.click(
      screen.getByTestId("plus-icon"),
    );

    expect(navigate).toHaveBeenCalledWith(
      "/notes/new",
    );
  });

  test("renders the create note empty state when there are no active notes", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 1,
          title: "Deleted note",
          isPinned: false,
          isDeleted: true,
          createdAt: "2026-08-20T10:00:00Z",
        },
      ],
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    expect(
      screen.getByText("No notes yet"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first note to get started.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create note",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("note-card-1"),
    ).not.toBeInTheDocument();
  });

  test("navigates to the new note page from the empty state button", () => {
    useNotes.mockReturnValue({
      notes: [],
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Create note",
      }),
    );

    expect(navigate).toHaveBeenCalledWith(
      "/notes/new",
    );
  });

  test("handles null notes safely", () => {
    useNotes.mockReturnValue({
      notes: null,
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    expect(
      screen.getByText("No notes yet"),
    ).toBeInTheDocument();
  });

  test("uses createdAt when editedAt is missing", () => {
    const notesWithoutEditedAt = [
      {
        id: 1,
        title: "Older",
        isPinned: false,
        isDeleted: false,
        createdAt: "2026-08-20T10:00:00Z",
      },
      {
        id: 2,
        title: "Newer",
        isPinned: false,
        isDeleted: false,
        createdAt: "2026-08-25T10:00:00Z",
      },
    ];

    useNotes.mockReturnValue({
      notes: notesWithoutEditedAt,
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Date Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-1",
      "note-card-2",
    ]);
  });

  test("uses an empty string when a note title is missing", () => {
    const notesWithMissingTitle = [
      {
        id: 1,
        isPinned: false,
        isDeleted: false,
        createdAt: "2026-08-20T10:00:00Z",
      },
      {
        id: 2,
        title: "Apple",
        isPinned: false,
        isDeleted: false,
        createdAt: "2026-08-21T10:00:00Z",
      },
    ];

    useNotes.mockReturnValue({
      notes: notesWithMissingTitle,
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sort Title Ascending",
      }),
    );

    const cards = screen.getAllByTestId(/note-card-/);

    expect(
      cards.map((card) => card.dataset.testid),
    ).toEqual([
      "note-card-1",
      "note-card-2",
    ]);
  });

  test("applies the collapsed sidebar gap class", () => {
    useSidebar.mockReturnValue({
      collapsed: true,
    });

    const { container } = render(<AllNotesView />);

    const section = container.querySelector("section");

    expect(section).toHaveClass("gap-4");
    expect(section).not.toHaveClass("gap-6");
  });

  test("applies the expanded sidebar gap class", () => {
    useSidebar.mockReturnValue({
      collapsed: false,
    });

    const { container } = render(<AllNotesView />);

    const section = container.querySelector("section");

    expect(section).toHaveClass("gap-6");
    expect(section).not.toHaveClass("gap-4");
  });

  test("does not render the floating plus button when there are no notes", () => {
    useNotes.mockReturnValue({
      notes: [],
      handlePin,
      moveToTrash,
      importNotes,
      exportNote,
    });

    render(<AllNotesView />);

    expect(
      screen.queryByTestId("plus-icon"),
    ).not.toBeInTheDocument();
  });

  test("passes the expected sorting values to the action bar", () => {
    render(<AllNotesView />);

    expect(
      screen.getByTestId("current-sort-by"),
    ).toHaveTextContent("date");

    expect(
      screen.getByTestId("current-sort-order"),
    ).toHaveTextContent("descending");
  });
});