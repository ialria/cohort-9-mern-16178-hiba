import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TrashView from "../../pages/Dashboard/views/main_content/TrashView.jsx";
import { useNotes } from "../../context/NotesContext.jsx";
import { useSidebar } from "../../context/SidebarContext.jsx";


jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

jest.mock("../../components/Button.jsx", () => {
  return function MockButton({ children, onClick, ...props }) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock("../../components/modal/DeleteNoteModal.jsx", () => {
  return function MockDeleteNoteModal({
    isOpen,
    onClose,
    note,
    onConfirm,
  }) {
    if (!isOpen) {
      return null;
    }

    return (
      <div data-testid="delete-note-modal">
        <span data-testid="modal-note-title">
          {note?.title}
        </span>

        <button onClick={onClose}>Close Modal</button>

        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    );
  };
});

describe("TrashView", () => {
  const mockRestoreNote = jest.fn();
  const mockDeleteForever = jest.fn();

  // notes
  const notes = [
    {
      id: 1,
      title: "Deleted Note",
      isDeleted: true,
      deletedAt: "2026-08-28T12:00:00Z",
    },
    {
      id: 2,
      title: "Another Deleted Note",
      isDeleted: true,
      deletedAt: "2026-08-27T12:00:00Z",
    },
    {
      id: 3,
      title: "Normal Note",
      isDeleted: false,
      deletedAt: null,
    },
  ];

  beforeEach(() => {
    // clear previous calls
    jest.clearAllMocks();

    useSidebar.mockReturnValue({
      collapsed: false,
    });

    useNotes.mockReturnValue({
      notes,
      restoreNote: mockRestoreNote,
      deleteForever: mockDeleteForever,
    });
  });

  test("renders only deleted notes", () => {
    // render the component.
    render(<TrashView />);

    // deleted noted-visible.
    expect(screen.getByText("Deleted Note")).toBeInTheDocument();
    expect(
      screen.getByText("Another Deleted Note"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Normal Note"),
    ).not.toBeInTheDocument();
  });

  test("It shows the empty message when there are no notes in trash", () => {
    useNotes.mockReturnValue({
      notes: [],
      restoreNote: mockRestoreNote,
      deleteForever: mockDeleteForever,
    });

    render(<TrashView />);

    // empty-trash message
    expect(
      screen.getByText("No notes in trash yet."),
    ).toBeInTheDocument();
  });

  test("It shows the empty message when all notes are not deleted", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 10,
          title: "Active Note",
          isDeleted: false,
          deletedAt: null,
        },
      ],
      restoreNote: mockRestoreNote,
      deleteForever: mockDeleteForever,
    });

    render(<TrashView />);

    expect(
      screen.getByText("No notes in trash yet."),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Active Note"),
    ).not.toBeInTheDocument();
  });

  test("This renders the Restore button for deleted notes", () => {
    render(<TrashView />);

    expect(
      screen.getAllByRole("button", {
        name: "Restore",
      }),
    ).toHaveLength(2);
  });

  test("It calls restoreNote with the correct note id", () => {
    render(<TrashView />);

    const restoreButtons = screen.getAllByRole("button", {
      name: "Restore",
    });

    fireEvent.click(restoreButtons[0]);

    expect(mockRestoreNote).toHaveBeenCalledTimes(1);
    expect(mockRestoreNote).toHaveBeenCalledWith(1);
  });

  test("renders Delete Forever buttons for deleted notes", () => {
    render(<TrashView />);

    expect(
      screen.getAllByRole("button", {
        name: "Delete Forever",
      }),
    ).toHaveLength(2);
  });

  test("This opens the delete modal for the selected note", () => {
    render(<TrashView />);

    // first modal should not be visible.
    expect(
      screen.queryByTestId("delete-note-modal"),
    ).not.toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Forever",
    });

    fireEvent.click(deleteButtons[0]);

    // modal-visible.
    expect(
      screen.getByTestId("delete-note-modal"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("modal-note-title"),
    ).toHaveTextContent("Deleted Note");
  });

  test("This calls deleteForever with the correct note id", async () => {
    // API action resolve
    mockDeleteForever.mockResolvedValueOnce();

    render(<TrashView />);

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Forever",
    });

    fireEvent.click(deleteButtons[0]);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirm Delete",
      }),
    );

    await waitFor(() => {
      expect(mockDeleteForever).toHaveBeenCalledTimes(1);
    });

    // It should receive the selected note's id.
    expect(mockDeleteForever).toHaveBeenCalledWith(1);
  });

  test("This closes the modal after permanent deletion", async () => {
    mockDeleteForever.mockResolvedValueOnce();

    render(<TrashView />);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete Forever",
      })[0],
    );

    expect(
      screen.getByTestId("delete-note-modal"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Confirm Delete",
      }),
    );

    // The modal should close after deleteForever finishes.
    await waitFor(() => {
      expect(
        screen.queryByTestId("delete-note-modal"),
      ).not.toBeInTheDocument();
    });
  });

  test("This closes the modal when the close button is clicked", () => {
    render(<TrashView />);

    // Open the modal.
    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete Forever",
      })[0],
    );

    expect(
      screen.getByTestId("delete-note-modal"),
    ).toBeInTheDocument();

    // close the modal
    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Modal",
      }),
    );

    // modal-disappear
    expect(
      screen.queryByTestId("delete-note-modal"),
    ).not.toBeInTheDocument();

    expect(mockDeleteForever).not.toHaveBeenCalled();
  });

  test("This does not call deleteForever when no note is selected", async () => {
    render(<TrashView />);

    expect(
      screen.queryByTestId("delete-note-modal"),
    ).not.toBeInTheDocument();

    // deleteForever should not have been called.
    expect(mockDeleteForever).not.toHaveBeenCalled();
  });

  test("It renders correctly when the sidebar is collapsed", () => {
    useSidebar.mockReturnValue({
      collapsed: true,
    });

    render(<TrashView />);

    expect(
      screen.getByText("Deleted Note"),
    ).toBeInTheDocument();

    const section = screen
      .getByText("Deleted Note")
      .closest("section");

    expect(section).toHaveClass("md:gap-3");
    expect(section).toHaveClass("md:px-4");
  });

  test("This renders correctly when the sidebar is expanded", () => {
    useSidebar.mockReturnValue({
      collapsed: false,
    });

    render(<TrashView />);

    // notes-render normally.
    expect(
      screen.getByText("Deleted Note"),
    ).toBeInTheDocument();

    const section = screen
      .getByText("Deleted Note")
      .closest("section");

    expect(section).toHaveClass("md:gap-6");
    expect(section).toHaveClass("md:px-8");
  });

  test("This renders multiple deleted notes", () => {
    render(<TrashView />);

    expect(
      screen.getByText("Deleted Note"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Another Deleted Note"),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: "Restore",
      }),
    ).toHaveLength(2);

    expect(
      screen.getAllByRole("button", {
        name: "Delete Forever",
      }),
    ).toHaveLength(2);
  });

  test("This passes the correct note to the delete modal", () => {
    render(<TrashView />);

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Forever",
    });

    fireEvent.click(deleteButtons[1]);

    expect(
      screen.getByTestId("modal-note-title"),
    ).toHaveTextContent("Another Deleted Note");
  });
});
