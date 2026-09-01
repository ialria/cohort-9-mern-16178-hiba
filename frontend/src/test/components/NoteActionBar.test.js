import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

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

const createMockFile = (content, name, type) => {
  const file = new File([content], name, { type });

  Object.defineProperty(file, "text", {
    configurable: true,
    value: jest.fn().mockResolvedValue(content),
  });

  return file;
};

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

test.each([
  ["date", "Date", "descending"],
  ["title", "Title", "ascending"],
  ["pinned", "Pinned", "ascending"],
])(
  "It calls onSort with %s when %s is selected",
  (sortValue, menuLabel, sortOrder) => {
    renderNoteActionBar({
      sortBy: "date",
      sortOrder,
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sort/i }),
    );

    fireEvent.click(
      screen.getByRole("menuitem", { name: menuLabel }),
    );

    expect(mockOnSort).toHaveBeenCalledTimes(1);

    expect(mockOnSort).toHaveBeenCalledWith(
      sortValue,
      sortOrder,
    );
  },
);

test("It calls onSort with ascending order when Ascending is selected", () => {
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

test("It calls onSort with descending order when Descending is selected", () => {
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

test("It shows check icons for the active date and descending options", () => {
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

test("It shows check icons for the active title and ascending options", () => {
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

  const file = createMockFile(
    JSON.stringify([
      {
        title: "Imported Note",
        content: "Imported content",
      },
    ]),
    "notes.json",
    "application/json",
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

  const file = createMockFile(
    "This is imported text",
    "My Note.txt",
    "text/plain",
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

  const file1 = createMockFile(
    "First note content",
    "First.txt",
    "text/plain",
  );

  const file2 = createMockFile(
    "Second note content",
    "Second.txt",
    "text/plain",
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


test("It rejects invalid JSON notes", async () => {
  const alertSpy = jest
    .spyOn(window, "alert")
    .mockImplementation(() => {});

  renderNoteActionBar();

  const file = createMockFile(
    JSON.stringify([
      {
        title: "Valid title",
        wrongProperty: "No content",
      },
    ]),
    "invalid.json",
    "application/json",
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

  const file = createMockFile(
    "some content",
    "notes.pdf",
    "application/pdf",
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

  const file = createMockFile(
    "Some note",
    "note.txt",
    "text/plain",
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