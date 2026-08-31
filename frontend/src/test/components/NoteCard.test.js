import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NoteCard from "../../pages/Dashboard/components/NoteCard.jsx";

jest.mock("../../utils/formateDate.js", () => {
  return jest.fn((date) => `formatted-${date}`);
});

jest.mock("../../icons/icons.jsx", () => {
  const Pin = (props) => (
    <span data-testid="pin-icon" {...props} />
  );

  const Ellipsis = (props) => (
    <span data-testid="ellipsis-icon" {...props} />
  );

  const FileText = (props) => (
    <span data-testid="file-text-icon" {...props} />
  );

  return {
    Pin,
    Ellipsis,
    FileText,
  };
});

const note = {
  id: "1",
  title: "Test Note",
  content: "<p>This is <strong>note content</strong>.</p>",
  createdAt: "2026-08-20T10:00:00.000Z",
  editedAt: "2026-08-25T10:00:00.000Z",
  isPinned: false,
};

const mockOnPin = jest.fn();
const mockOnDelete = jest.fn();
const mockOnExport = jest.fn();

const MockMenu = ({
  onPin,
  onDelete,
  onExport,
  isPinned,
}) => (
  <div data-testid="note-menu">
    <button onClick={onPin}>Pin</button>
    <button onClick={onDelete}>Delete</button>
    <button onClick={onExport}>Export</button>
    <span>{isPinned ? "Pinned" : "Not pinned"}</span>
  </div>
);


beforeEach(() => {
  jest.clearAllMocks();
});

const renderNoteCard = (props = {}) => {
  return render(
    <MemoryRouter>
      <NoteCard
        note={note}
        MenuComponent={MockMenu}
        onPin={mockOnPin}
        onDelete={mockOnDelete}
        onExport={mockOnExport}
        {...props}
      />
    </MemoryRouter>,
  );
};

test("It renders note title and preview", () => {
  renderNoteCard();

  expect(
    screen.getByRole("heading", {
      name: "Test Note",
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByText("This is note content."),
  ).toBeInTheDocument();
});


test("It removes HTML tags from note preview", () => {
  renderNoteCard({
    note: {
      ...note,
      content: "<h1>Hello</h1><p>This is <b>clean</b> text.</p>",
    },
  });

  expect(
    screen.getByText("HelloThis is clean text."),
  ).toBeInTheDocument();

  expect(
    screen.queryByText("<h1>Hello</h1>"),
  ).not.toBeInTheDocument();
});


test("It replaces non-breaking spaces in note preview", () => {
  renderNoteCard({
    note: {
      ...note,
      content: "Hello&nbsp;&nbsp;World",
    },
  });

  const preview = screen.getByText(/Hello\s+World/);

  expect(preview).toBeInTheDocument();
  expect(preview.textContent).toBe("Hello  World");
});

test("This links to the note details page", () => {
  renderNoteCard();

  const noteLink = screen.getByRole("link");

  expect(noteLink).toHaveAttribute(
    "href",
    "/notes/1",
  );
});


test("This shows edited date when editedAt exists", () => {
  renderNoteCard();

  expect(
    screen.getByText(
      "Edited formatted-2026-08-25T10:00:00.000Z",
    ),
  ).toBeInTheDocument();
});


test("It shows created date when editedAt does not exist", () => {
  renderNoteCard({
    note: {
      ...note,
      editedAt: undefined,
    },
  });

  expect(
    screen.getByText(
      "Created formatted-2026-08-20T10:00:00.000Z",
    ),
  ).toBeInTheDocument();
});


test("It hides date when showDate is false", () => {
  renderNoteCard({
    showDate: false,
  });

  expect(
    screen.queryByText(
      "Edited formatted-2026-08-25T10:00:00.000Z",
    ),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByText(
      "Created formatted-2026-08-20T10:00:00.000Z",
    ),
  ).not.toBeInTheDocument();
});

test("This shows pin icon when note is pinned and showPin is true", () => {
  renderNoteCard({
    note: {
      ...note,
      isPinned: true,
    },
    showPin: true,
  });

  expect(
    screen.getByTestId("pin-icon"),
  ).toBeInTheDocument();
});

test("This does not show pin icon when note is not pinned", () => {
  renderNoteCard({
    showPin: true,
  });

  expect(
    screen.queryByTestId("pin-icon"),
  ).not.toBeInTheDocument();
});


test("This shows pin icon in footer when showPin is false and note is pinned", () => {
  renderNoteCard({
    note: {
      ...note,
      isPinned: true,
    },
    showPin: false,
  });

  expect(
    screen.getByTestId("pin-icon"),
  ).toBeInTheDocument();
});


test("It opens note actions menu when action button is clicked", () => {
  renderNoteCard();

  const actionButton = screen.getByRole("button", {
    name: "Open note actions",
  });

  expect(
    screen.queryByTestId("note-menu"),
  ).not.toBeInTheDocument();

  fireEvent.click(actionButton);

  expect(
    screen.getByTestId("note-menu"),
  ).toBeInTheDocument();
});


test("This closes note actions menu when action button is clicked again", () => {
  renderNoteCard();

  const actionButton = screen.getByRole("button", {
    name: "Open note actions",
  });

  fireEvent.click(actionButton);

  expect(
    screen.getByTestId("note-menu"),
  ).toBeInTheDocument();

  fireEvent.click(actionButton);

  expect(
    screen.queryByTestId("note-menu"),
  ).not.toBeInTheDocument();
});


test("This closes note actions menu when mouse leaves the card", () => {
  renderNoteCard();

  const actionButton = screen.getByRole("button", {
    name: "Open note actions",
  });

  fireEvent.click(actionButton);

  expect(
    screen.getByTestId("note-menu"),
  ).toBeInTheDocument();

  fireEvent.mouseLeave(
    actionButton.closest("article"),
  );

  expect(
    screen.queryByTestId("note-menu"),
  ).not.toBeInTheDocument();
});



test("It passes pin callback to the menu", () => {
  renderNoteCard();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Open note actions",
    }),
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Pin",
    }),
  );

  expect(mockOnPin).toHaveBeenCalledTimes(1);
});


test("It passes delete callback to the menu", () => {
  renderNoteCard();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Open note actions",
    }),
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Delete",
    }),
  );

  expect(mockOnDelete).toHaveBeenCalledTimes(1);
});


test("It passes export callback to the menu", () => {
  renderNoteCard();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Open note actions",
    }),
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Export",
    }),
  );

  expect(mockOnExport).toHaveBeenCalledTimes(1);
});


test("This passes pinned state to the menu", () => {
  renderNoteCard({
    note: {
      ...note,
      isPinned: true,
    },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Open note actions",
    }),
  );

  expect(
    screen.getByText("Pinned"),
  ).toBeInTheDocument();
});


test("This passes unpinned state to the menu", () => {
  renderNoteCard();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Open note actions",
    }),
  );

  expect(
    screen.getByText("Not pinned"),
  ).toBeInTheDocument();
});