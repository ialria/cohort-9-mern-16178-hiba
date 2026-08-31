import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecentView from "../../pages/Dashboard/views/main_content/RecentView.jsx";
import { useNotes } from "../../context/NotesContext.jsx";
import { useSidebar } from "../../context/SidebarContext.jsx";

jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

describe("RecentView", () => {
  const notes = [
    {
      id: 1,
      title: "Newest Note",
      isDeleted: false,
      updatedAt: "2026-08-28T12:00:00Z",
    },
    {
      id: 2,
      title: "Older Note",
      isDeleted: false,
      updatedAt: "2026-08-27T12:00:00Z",
    },
    {
      id: 3,
      title: "Deleted Note",
      isDeleted: true,
      updatedAt: "2026-08-29T12:00:00Z",
    },
  ];

  const renderRecentView = () => {
    return render(
      <MemoryRouter>
        <RecentView />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSidebar.mockReturnValue({
      collapsed: false,
    });

    useNotes.mockReturnValue({
      notes,
    });
  });

  test("It renders only non-deleted notes", () => {
    renderRecentView();

    expect(screen.getByText("Newest Note")).toBeInTheDocument();
    expect(screen.getByText("Older Note")).toBeInTheDocument();

    expect(
      screen.queryByText("Deleted Note"),
    ).not.toBeInTheDocument();
  });

  test("This shows the empty message when there are no recent notes", () => {
    useNotes.mockReturnValue({
      notes: [],
    });

    renderRecentView();

    expect(
      screen.getByText("No recent notes yet."),
    ).toBeInTheDocument();
  });

  test("This shows the empty message when all notes are deleted", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 3,
          title: "Deleted Note",
          isDeleted: true,
          updatedAt: "2026-08-29T12:00:00Z",
        },
      ],
    });

    renderRecentView();

    expect(
      screen.getByText("No recent notes yet."),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Deleted Note"),
    ).not.toBeInTheDocument();
  });

  test("It renders correctly when notes is null", () => {
    useNotes.mockReturnValue({
      notes: null,
    });

    renderRecentView();

    expect(
      screen.getByText("No recent notes yet."),
    ).toBeInTheDocument();
  });

  test("This sorts notes from newest to oldest", () => {
    useNotes.mockReturnValue({
      notes: [
        {
          id: 1,
          title: "Oldest Note",
          isDeleted: false,
          updatedAt: "2026-08-20T12:00:00Z",
        },
        {
          id: 2,
          title: "Newest Note",
          isDeleted: false,
          updatedAt: "2026-08-30T12:00:00Z",
        },
        {
          id: 3,
          title: "Middle Note",
          isDeleted: false,
          updatedAt: "2026-08-25T12:00:00Z",
        },
      ],
    });

    renderRecentView();

    const noteTitles = screen.getAllByRole("heading", {
      level: 2,
    });

    expect(noteTitles[0]).toHaveTextContent("Newest Note");
    expect(noteTitles[1]).toHaveTextContent("Middle Note");
    expect(noteTitles[2]).toHaveTextContent("Oldest Note");
  });

  test("It creates the correct link for each note", () => {
    renderRecentView();

    const newestNote = screen.getByText("Newest Note");
    const olderNote = screen.getByText("Older Note");

    expect(newestNote.closest("a")).toHaveAttribute(
      "href",
      "/notes/1",
    );

    expect(olderNote.closest("a")).toHaveAttribute(
      "href",
      "/notes/2",
    );
  });

  test("This renders correctly when the sidebar is collapsed", () => {
    useSidebar.mockReturnValue({
      collapsed: true,
    });

    renderRecentView();

    const section = screen.getByText("Newest Note").closest("section");

    expect(section).toHaveClass("md:grid-cols-1");
  });

  test("This renders correctly when the sidebar is expanded", () => {
    useSidebar.mockReturnValue({
      collapsed: false,
    });

    renderRecentView();

    const section = screen.getByText("Newest Note").closest("section");

    expect(section).toHaveClass("md:grid-cols-2");
  });

  test("It shows only 8 notes initially", () => {
    const manyNotes = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Note ${index + 1}`,
      isDeleted: false,
      updatedAt: `2026-08-${String(30 - index).padStart(2, "0")}T12:00:00Z`,
    }));

    useNotes.mockReturnValue({
      notes: manyNotes,
    });

    renderRecentView();

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      8,
    );

    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 8")).toBeInTheDocument();

    expect(screen.queryByText("Note 9")).not.toBeInTheDocument();
    expect(screen.queryByText("Note 10")).not.toBeInTheDocument();
  });

  test("This shows View more when there are more than 8 notes", () => {
    const manyNotes = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Note ${index + 1}`,
      isDeleted: false,
      updatedAt: `2026-08-${String(30 - index).padStart(2, "0")}T12:00:00Z`,
    }));

    useNotes.mockReturnValue({
      notes: manyNotes,
    });

    renderRecentView();

    expect(
      screen.getByRole("button", {
        name: "View more →",
      }),
    ).toBeInTheDocument();
  });

  test("This loads 5 more notes when View more is clicked", () => {
    const manyNotes = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Note ${index + 1}`,
      isDeleted: false,
      updatedAt: `2026-08-${String(30 - index).padStart(2, "0")}T12:00:00Z`,
    }));

    useNotes.mockReturnValue({
      notes: manyNotes,
    });

    renderRecentView();

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      8,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "View more →",
      }),
    );

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      10,
    );

    expect(screen.getByText("Note 9")).toBeInTheDocument();
    expect(screen.getByText("Note 10")).toBeInTheDocument();
  });

  test("It does not show View more when all notes are visible", () => {
    useNotes.mockReturnValue({
      notes,
    });

    renderRecentView();

    expect(
      screen.queryByRole("button", {
        name: "View more →",
      }),
    ).not.toBeInTheDocument();
  });
});
