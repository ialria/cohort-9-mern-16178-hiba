import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteActionBar from "../../pages/Dashboard/components/note_components/NoteActionBar.jsx";

jest.mock("../../icons/icons", () => ({
  Upload: (props) => <span data-testid="upload-icon" {...props} />,
  ArrowDownUp: (props) => (
    <span data-testid="sort-icon" {...props} />
  ),
  Check: (props) => <span data-testid="check-icon" {...props} />,
}));

const mockOnSort = jest.fn();
const mockOnImport = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockOnImport.mockResolvedValue();
});

const renderNoteActionBar = (props = {}) => {
  return render(
    <NoteActionBar
      sortBy="date"
      sortOrder="descending"
      onSort={mockOnSort}
      onImport={mockOnImport}
      {...props}
    />,
  );
};

/* =========================
   RENDERING
========================= */

test("It renders Sort and Import buttons", () => {
  renderNoteActionBar();

  expect(
    screen.getByRole("button", { name: /sort/i }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("menuitem", { name: /import/i }),
  ).toBeInTheDocument();
});

test("It renders sort and upload icons", () => {
  renderNoteActionBar();

  expect(
    screen.getByTestId("sort-icon"),
  ).toBeInTheDocument();

  expect(
    screen.getByTestId("upload-icon"),
  ).toBeInTheDocument();
});

/* =========================
   SORT MENU
========================= */

test("It opens sort menu when Sort button is clicked", () => {
  renderNoteActionBar();

  expect(
    screen.queryByRole("menuitem", { name: "Date" }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  expect(
    screen.getByRole("menuitem", { name: "Date" }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("menuitem", { name: "Title" }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("menuitem", { name: "Pinned" }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("menuitem", { name: "Ascending" }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("menuitem", { name: "Descending" }),
  ).toBeInTheDocument();
});

test("It closes sort menu when Sort button is clicked again", () => {
  renderNoteActionBar();

  const sortButton = screen.getByRole("button", {
    name: /sort/i,
  });

  fireEvent.click(sortButton);

  expect(
    screen.getByRole("menuitem", { name: "Date" }),
  ).toBeInTheDocument();

  fireEvent.click(sortButton);

  expect(
    screen.queryByRole("menuitem", { name: "Date" }),
  ).not.toBeInTheDocument();
});

/* =========================
   SORT BY
========================= */

test("It sorts by date when Date is selected", () => {
  renderNoteActionBar({
    sortBy: "title",
    sortOrder: "descending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Date" }),
  );

  expect(mockOnSort).toHaveBeenCalledTimes(1);
  expect(mockOnSort).toHaveBeenCalledWith(
    "date",
    "descending",
  );
});

test("It sorts by title when Title is selected", () => {
  renderNoteActionBar({
    sortBy: "date",
    sortOrder: "ascending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Title" }),
  );

  expect(mockOnSort).toHaveBeenCalledTimes(1);
  expect(mockOnSort).toHaveBeenCalledWith(
    "title",
    "ascending",
  );
});

test("It sorts by pinned when Pinned is selected", () => {
  renderNoteActionBar({
    sortBy: "date",
    sortOrder: "ascending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Pinned" }),
  );

  expect(mockOnSort).toHaveBeenCalledTimes(1);
  expect(mockOnSort).toHaveBeenCalledWith(
    "pinned",
    "ascending",
  );
});

/* =========================
   SORT ORDER
========================= */

test("It sorts in ascending order when Ascending is selected", () => {
  renderNoteActionBar({
    sortBy: "date",
    sortOrder: "descending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Ascending" }),
  );

  expect(mockOnSort).toHaveBeenCalledTimes(1);
  expect(mockOnSort).toHaveBeenCalledWith(
    "date",
    "ascending",
  );
});

test("It sorts in descending order when Descending is selected", () => {
  renderNoteActionBar({
    sortBy: "title",
    sortOrder: "ascending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Descending" }),
  );

  expect(mockOnSort).toHaveBeenCalledTimes(1);
  expect(mockOnSort).toHaveBeenCalledWith(
    "title",
    "descending",
  );
});

test("It closes sort menu after selecting an order", () => {
  renderNoteActionBar();

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Ascending" }),
  );

  expect(
    screen.queryByRole("menuitem", { name: "Date" }),
  ).not.toBeInTheDocument();
});

/* =========================
   CHECK ICONS
========================= */

test("It shows check icon for the active sort option", () => {
  renderNoteActionBar({
    sortBy: "date",
    sortOrder: "descending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  expect(
    screen.getAllByTestId("check-icon"),
  ).toHaveLength(2);
});

test("It shows check icon for the active title sort", () => {
  renderNoteActionBar({
    sortBy: "title",
    sortOrder: "ascending",
  });

  fireEvent.click(
    screen.getByRole("button", { name: /sort/i }),
  );

  expect(
    screen.getAllByTestId("check-icon"),
  ).toHaveLength(2);
});

/* =========================
   IMPORT BUTTON / FILE INPUT
========================= */

test("It renders a hidden file input", () => {
  renderNoteActionBar();

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  expect(fileInput).toBeInTheDocument();
  expect(fileInput).toHaveAttribute(
    "accept",
    ".json,.txt,application/json,text/plain",
  );
  expect(fileInput).toHaveAttribute("multiple");
});

test("It imports a valid JSON file", async () => {
  renderNoteActionBar();

  const file = new File(
    [
      JSON.stringify([
        {
          title: "Imported Note",
          content: "Imported content",
        },
      ]),
    ],
    "notes.json",
    {
      type: "application/json",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(mockOnImport).toHaveBeenCalledTimes(1);
  });

  expect(mockOnImport).toHaveBeenCalledWith([
    {
      title: "Imported Note",
      content: "Imported content",
    },
  ]);
});

test("It imports a valid TXT file", async () => {
  renderNoteActionBar();

  const file = new File(
    ["This is imported text"],
    "My Note.txt",
    {
      type: "text/plain",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(mockOnImport).toHaveBeenCalledTimes(1);
  });

  expect(mockOnImport).toHaveBeenCalledWith([
    {
      title: "My Note",
      content: "This is imported text",
    },
  ]);
});

test("It imports multiple TXT files", async () => {
  renderNoteActionBar();

  const file1 = new File(
    ["First note content"],
    "First.txt",
    {
      type: "text/plain",
    },
  );

  const file2 = new File(
    ["Second note content"],
    "Second.txt",
    {
      type: "text/plain",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file1, file2],
    },
  });

  await waitFor(() => {
    expect(mockOnImport).toHaveBeenCalledTimes(1);
  });

  expect(mockOnImport).toHaveBeenCalledWith([
    {
      title: "First",
      content: "First note content",
    },
    {
      title: "Second",
      content: "Second note content",
    },
  ]);
});

/* =========================
   INVALID / UNSUPPORTED FILES
========================= */

test("It rejects invalid JSON notes", async () => {
  const alertSpy = jest
    .spyOn(window, "alert")
    .mockImplementation(() => {});

  renderNoteActionBar();

  const file = new File(
    [
      JSON.stringify([
        {
          title: "Valid title",
          wrongProperty: "No content",
        },
      ]),
    ],
    "invalid.json",
    {
      type: "application/json",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith(
      "Invalid notes file: invalid.json",
    );
  });

  expect(mockOnImport).not.toHaveBeenCalled();

  alertSpy.mockRestore();
});

test("It rejects unsupported file types", async () => {
  const alertSpy = jest
    .spyOn(window, "alert")
    .mockImplementation(() => {});

  renderNoteActionBar();

  const file = new File(
    ["some content"],
    "notes.pdf",
    {
      type: "application/pdf",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith(
      "Unsupported file: notes.pdf",
    );
  });

  expect(mockOnImport).not.toHaveBeenCalled();

  alertSpy.mockRestore();
});

/* =========================
   IMPORT FAILURE
========================= */

test("It handles import failure", async () => {
  const alertSpy = jest
    .spyOn(window, "alert")
    .mockImplementation(() => {});

  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  mockOnImport.mockRejectedValue(
    new Error("Import failed"),
  );

  renderNoteActionBar();

  const file = new File(
    ["Some note"],
    "note.txt",
    {
      type: "text/plain",
    },
  );

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [file],
    },
  });

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to import notes:",
      expect.any(Error),
    );
  });

  expect(alertSpy).toHaveBeenCalledWith(
    "Failed to import notes. Please try again.",
  );

  consoleErrorSpy.mockRestore();
  alertSpy.mockRestore();
});

/* =========================
   EMPTY FILE SELECTION
========================= */

test("It does nothing when no files are selected", () => {
  renderNoteActionBar();

  const fileInput = document.querySelector(
    'input[type="file"]',
  );

  fireEvent.change(fileInput, {
    target: {
      files: [],
    },
  });

  expect(mockOnImport).not.toHaveBeenCalled();
});
