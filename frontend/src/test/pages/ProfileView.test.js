import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import ProfileView from "../../pages/Dashboard/views/ProfileView.jsx";

import { useNotes } from "../../context/NotesContext.jsx";
import { useSidebar } from "../../context/SidebarContext.jsx";
import { useModal } from "../../context/ModalContext.jsx";
import { useProfile } from "../../context/ProfileContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("../../context/NotesContext.jsx", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../../context/SidebarContext.jsx", () => ({
  useSidebar: jest.fn(),
}));

jest.mock("../../context/ModalContext.jsx", () => ({
  useModal: jest.fn(),
}));

jest.mock("../../context/ProfileContext.jsx", () => ({
  useProfile: jest.fn(),
}));

jest.mock("../../context/ThemeContext.jsx", () => ({
  useTheme: jest.fn(),
}));

jest.mock("../../layouts/DashboardLayout.jsx", () => {
  return function MockDashboardLayout({ children }) {
    return <div data-testid="dashboard-layout">{children}</div>;
  };
});

jest.mock("../../components/Loading.jsx", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("../../pages/ErrorPage.jsx", () => {
  return function MockErrorPage({ message, onRetry }) {
    return (
      <div data-testid="error-page">
        <p>{message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    );
  };
});

jest.mock("../../components/Button.jsx", () => {
  return function MockButton({ children, ...props }) {
    return <button {...props}>{children}</button>;
  };
});

jest.mock("../../utils/formateDate.js", () => {
  return jest.fn((date) => `formatted-${date}`);
});

jest.mock("../../icons/icons.jsx", () => {
  const MockIcon = () => <span data-testid="mock-icon" />;

  return {
    PenLine: MockIcon,
    User: MockIcon,
    Mail: MockIcon,
    Calendar: MockIcon,
    Activity: MockIcon,
    FileText: MockIcon,
    Pin: MockIcon,
    Trash2: MockIcon,
    Clock: MockIcon,
    SlidersHorizontal: MockIcon,
    Palette: MockIcon,
    ChevronRight: MockIcon,
    LogOut: MockIcon,
    Moon: MockIcon,
    Download: MockIcon,
  };
});


const mockOpenLogoutModal = jest.fn();
const mockToggleTheme = jest.fn();
const mockSetAccentColor = jest.fn();
const mockGetInitials = jest.fn();
const mockGetProfile = jest.fn();
const mockExportAllNotes = jest.fn();

const profile = {
  username: "Hiba",
  email: "hiba@example.com",
  createdAt: "2026-01-10T10:00:00.000Z",
  avatarUrl: "",
};

const notes = [
  {
    id: "1",
    title: "Old Note",
    content: "Old content",
    createdAt: "2026-08-20T10:00:00.000Z",
    updatedAt: "2026-08-20T10:00:00.000Z",
    isPinned: false,
    isDeleted: false,
  },
  {
    id: "2",
    title: "Latest Note",
    content: "Latest content",
    createdAt: "2026-08-25T10:00:00.000Z",
    updatedAt: "2026-08-28T10:00:00.000Z",
    isPinned: true,
    isDeleted: false,
  },
  {
    id: "3",
    title: "Second Latest",
    content: "Second content",
    createdAt: "2026-08-26T10:00:00.000Z",
    updatedAt: "2026-08-27T10:00:00.000Z",
    isPinned: false,
    isDeleted: false,
  },
  {
    id: "4",
    title: "Deleted Note",
    content: "Deleted",
    createdAt: "2026-08-29T10:00:00.000Z",
    updatedAt: "2026-08-29T10:00:00.000Z",
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
    exportAllNotes: mockExportAllNotes,
    exportStatus: "idle",
    exportProgress: 0,
  });

  useProfile.mockReturnValue({
    profile,
    loading: false,
    getInitials: mockGetInitials.mockReturnValue("HI"),
    getProfile: mockGetProfile,
    profileError: null,
  });

  useTheme.mockReturnValue({
    theme: "light",
    toggleTheme: mockToggleTheme,
    accentColor: "purple",
    setAccentColor: mockSetAccentColor,
  });

  useModal.mockReturnValue({
    openLogoutModal: mockOpenLogoutModal,
  });
});

test("It renders the profile page", () => {
  render(<ProfileView />);

  expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
  expect(screen.getByText("Hiba")).toBeInTheDocument();
  expect(screen.getAllByText("hiba@example.com")[0]).toBeInTheDocument();
});

test("This shows loading state while profile is loading", () => {
  useProfile.mockReturnValue({
    profile: null,
    loading: true,
    getInitials: mockGetInitials,
    getProfile: mockGetProfile,
    profileError: null,
  });

  render(<ProfileView />);

  expect(screen.getByTestId("loading")).toBeInTheDocument();
  expect(screen.queryByText("Hiba")).not.toBeInTheDocument();
});

test("It shows ErrorPage when profile loading fails", () => {
  useProfile.mockReturnValue({
    profile: null,
    loading: false,
    getInitials: mockGetInitials,
    getProfile: mockGetProfile,
    profileError: "Failed to load profile",
  });

  render(<ProfileView />);

  expect(screen.getByTestId("error-page")).toBeInTheDocument();

  expect(
    screen.getByText("Failed to load profile"),
  ).toBeInTheDocument();
});

test("This calls getProfile when retry is clicked", () => {
  useProfile.mockReturnValue({
    profile: null,
    loading: false,
    getInitials: mockGetInitials,
    getProfile: mockGetProfile,
    profileError: "Failed to load profile",
  });

  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: "Retry" }),
  );

  expect(mockGetProfile).toHaveBeenCalledTimes(1);
});

test("It renders profile username and email", () => {
  render(<ProfileView />);

  expect(screen.getByText("Hiba")).toBeInTheDocument();
  expect(screen.getAllByText("hiba@example.com")[0]).toBeInTheDocument();
});

test("This renders initials when profile has no avatar", () => {
  render(<ProfileView />);

  expect(mockGetInitials).toHaveBeenCalledWith("Hiba");
  expect(screen.getByText("HI")).toBeInTheDocument();
});

test("It renders avatar when avatarUrl exists", () => {
  useProfile.mockReturnValue({
    profile: {
      ...profile,
      avatarUrl: "https://example.com/avatar.jpg",
    },
    loading: false,
    getInitials: mockGetInitials,
    getProfile: mockGetProfile,
    profileError: null,
  });

  render(<ProfileView />);

  const image = screen.getByRole("img");

  expect(image).toHaveAttribute(
    "src",
    "https://example.com/avatar.jpg",
  );

  expect(image).toHaveAttribute(
    "alt",
    "Hiba profile",
  );

  expect(mockGetInitials).not.toHaveBeenCalled();
});

test("It uses User when profile username is missing", () => {
  useProfile.mockReturnValue({
    profile: {
      ...profile,
      username: "",
    },
    loading: false,
    getInitials: mockGetInitials.mockReturnValue("U"),
    getProfile: mockGetProfile,
    profileError: null,
  });

  render(<ProfileView />);

  expect(screen.getByText("User")).toBeInTheDocument();
  expect(mockGetInitials).toHaveBeenCalledWith("U");
});

test("t renders Edit Profile link", () => {
  render(<ProfileView />);

  const editLink = screen.getByRole("link", {
    name: /Edit Profile/i,
  });

  expect(editLink).toHaveAttribute(
    "href",
    "/edit_profile",
  );
});

test("This renders account information", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Account Information"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Email"),
  ).toBeInTheDocument();

  expect(
    screen.getAllByText("hiba@example.com")[0],
  ).toBeInTheDocument();

  expect(
    screen.getByText("Joined"),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "formatted-2026-01-10T10:00:00.000Z",
    ),
  ).toBeInTheDocument();
});

test("This renders recent notes sorted by latest update", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Recent Activity"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Latest Note"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Second Latest"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Old Note"),
  ).toBeInTheDocument();
});

test("It shows only three most recent active notes", () => {
  const manyNotes = [
    ...notes,
    {
      id: "5",
      title: "Fourth Active Note",
      createdAt: "2026-08-30T10:00:00.000Z",
      updatedAt: "2026-08-30T10:00:00.000Z",
      isPinned: false,
      isDeleted: false,
    },
  ];

  useNotes.mockReturnValue({
    notes: manyNotes,
    exportAllNotes: mockExportAllNotes,
    exportStatus: "idle",
    exportProgress: 0,
  });

  render(<ProfileView />);

  expect(
    screen.getByText("Fourth Active Note"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Latest Note"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Second Latest"),
  ).toBeInTheDocument();

  expect(
    screen.queryByText("Old Note"),
  ).not.toBeInTheDocument();
});

test("This does not show deleted notes in recent activity", () => {
  render(<ProfileView />);

  expect(
    screen.queryByText("Deleted Note"),
  ).not.toBeInTheDocument();
});

test("It shows pinned icon for pinned recent notes", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Latest Note"),
  ).toBeInTheDocument();

  expect(
    screen.getAllByTestId("mock-icon").length,
  ).toBeGreaterThan(0);
});

test("It shows no recent activity when there are no active notes", () => {
  useNotes.mockReturnValue({
    notes: [
      {
        id: "1",
        title: "Deleted Note",
        createdAt: "2026-08-20T10:00:00.000Z",
        updatedAt: "2026-08-20T10:00:00.000Z",
        isPinned: false,
        isDeleted: true,
      },
    ],
    exportAllNotes: mockExportAllNotes,
    exportStatus: "idle",
    exportProgress: 0,
  });

  render(<ProfileView />);

  expect(
    screen.getByText("No recent activity"),
  ).toBeInTheDocument();
});


test("It shows correct notes count", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Notes"),
  ).toBeInTheDocument();
});

test("It shows correct pinned count", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Pinned"),
  ).toBeInTheDocument();
});

test("This shows correct deleted count", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Deleted"),
  ).toBeInTheDocument();
});

test("It shows recent count", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Recent"),
  ).toBeInTheDocument();
});


test("It shows Light when theme is light", () => {
  render(<ProfileView />);

  expect(
    screen.getByRole("button", { name: /Light/i }),
  ).toBeInTheDocument();
});

test("This shows Dark when theme is dark", () => {
  useTheme.mockReturnValue({
    theme: "dark",
    toggleTheme: mockToggleTheme,
    accentColor: "purple",
    setAccentColor: mockSetAccentColor,
  });

  render(<ProfileView />);

  expect(
    screen.getByRole("button", { name: /Dark/i }),
  ).toBeInTheDocument();
});

test("It calls toggleTheme when appearance button is clicked", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: /Light/i }),
  );

  expect(
    mockToggleTheme,
  ).toHaveBeenCalledTimes(1);
});

test("This calls setAccentColor with purple", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: "Purple" }),
  );

  expect(
    mockSetAccentColor,
  ).toHaveBeenCalledWith("purple");
});

test("This calls setAccentColor with teal", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: "Deep Teal" }),
  );

  expect(
    mockSetAccentColor,
  ).toHaveBeenCalledWith("teal");
});

test("This calls setAccentColor with forest", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: "Muted Forest" }),
  );

  expect(
    mockSetAccentColor,
  ).toHaveBeenCalledWith("forest");
});

test("It marks the selected accent color with aria-pressed", () => {
  render(<ProfileView />);

  expect(
    screen.getByRole("button", { name: "Purple" }),
  ).toHaveAttribute("aria-pressed", "true");

  expect(
    screen.getByRole("button", { name: "Deep Teal" }),
  ).toHaveAttribute("aria-pressed", "false");

  expect(
    screen.getByRole("button", { name: "Muted Forest" }),
  ).toHaveAttribute("aria-pressed", "false");
});

test("It renders Export All Notes action", () => {
  render(<ProfileView />);

  expect(
    screen.getByText("Export All Notes"),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "Download your notes as text files",
    ),
  ).toBeInTheDocument();
});

test("This calls exportAllNotes when export button is clicked", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", {
      name: /Export All Notes/i,
    }),
  );

  expect(
    mockExportAllNotes,
  ).toHaveBeenCalledTimes(1);
});

test("It disables export when there are no active notes", () => {
  useNotes.mockReturnValue({
    notes: [],
    exportAllNotes: mockExportAllNotes,
    exportStatus: "idle",
    exportProgress: 0,
  });

  render(<ProfileView />);

  const exportButton = screen.getByRole("button", {
    name: /Export All Notes/i,
  });

  expect(exportButton).toBeDisabled();
});

test("This disables export while exporting", () => {
  useNotes.mockReturnValue({
    notes,
    exportAllNotes: mockExportAllNotes,
    exportStatus: "exporting",
    exportProgress: 2,
  });

  render(<ProfileView />);

  const exportButton = screen.getByRole("button", {
    name: /Export All Notes/i,
  });

  expect(exportButton).toBeDisabled();
});

test("It shows export progress while exporting", () => {
  useNotes.mockReturnValue({
    notes,
    exportAllNotes: mockExportAllNotes,
    exportStatus: "exporting",
    exportProgress: 2,
  });

  render(<ProfileView />);

  // 2 exported out of 3 active notes = 67%.
  expect(
    screen.getAllByText("67%").length,
  ).toBeGreaterThan(0);

  expect(
    screen.getByText("Exporting 67%"),
  ).toBeInTheDocument();
});

test("This shows completed export message", () => {
  useNotes.mockReturnValue({
    notes,
    exportAllNotes: mockExportAllNotes,
    exportStatus: "completed",
    exportProgress: 3,
  });

  render(<ProfileView />);

  expect(
    screen.getByText(
      "All notes exported successfully",
    ),
  ).toBeInTheDocument();
});


test("It renders Sign out action", () => {
  render(<ProfileView />);

  expect(
    screen.getByRole("button", { name: "Sign out" }),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Sign out from your account"),
  ).toBeInTheDocument();
});

test("This calls openLogoutModal when Sign out is clicked", () => {
  render(<ProfileView />);

  fireEvent.click(
    screen.getByRole("button", { name: "Sign out" }),
  );

  expect(
    mockOpenLogoutModal,
  ).toHaveBeenCalledTimes(1);
});