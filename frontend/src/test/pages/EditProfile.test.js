import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfile from "../../pages/Dashboard/views/EditProfile.jsx";
import { useProfile } from "../../context/ProfileContext";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";

jest.mock("../../context/ProfileContext", () => ({
  useProfile: jest.fn(),
}));

jest.mock("../../context/SidebarContext", () => ({
  useSidebar: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../layouts/SidebarLayout", () => {
  return function MockSidebarLayout() {
    return <div data-testid="sidebar-layout" />;
  };
});

jest.mock("../../components/Button.jsx", () => {
  return function MockButton({
    children,
    onClick,
    type = "button",
    disabled,
  }) {
    return (
      <button type={type} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  };
});

jest.mock("../../icons/icons.jsx", () => ({
  Menu: () => <span data-testid="menu-icon" />,
  Camera: () => <span data-testid="camera-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
}));

describe("EditProfile", () => {
  const mockUpdateProfile = jest.fn();
  const mockNavigate = jest.fn();
  const mockSetDrawerOpen = jest.fn();

  const profile = {
    username: "Test",
    bio: "My original bio",
    email: "test@example.com",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useSidebar.mockReturnValue({
      setDrawerOpen: mockSetDrawerOpen,
    });

    useProfile.mockReturnValue({
      profile,
      updateProfile: mockUpdateProfile,
      loading: false,
    });

    // mock navigation
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("It renders the edit profile page", () => {
    render(<EditProfile />);

    expect(
      screen.getAllByText("Edit Profile").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText(
        "Upload your profile information and preferences.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  test("It loads username and bio from the profile", () => {
    render(<EditProfile />);

    expect(screen.getByLabelText("User Name")).toHaveValue("Test");

    expect(screen.getByLabelText("Bio")).toHaveValue(
      "My original bio",
    );
  });

  test("This shows the registered email as disabled", () => {
    render(<EditProfile />);

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toHaveValue("test@example.com");
    expect(emailInput).toBeDisabled();
  });

  test("It updates username when the user types", () => {
    render(<EditProfile />);

    const usernameInput = screen.getByLabelText("User Name");

    fireEvent.change(usernameInput, {
      target: {
        value: "NewUsername",
      },
    });

    expect(usernameInput).toHaveValue("NewUsername");
  });

  test("It updates bio when the user types", () => {
    render(<EditProfile />);

    const bioInput = screen.getByLabelText("Bio");

    fireEvent.change(bioInput, {
      target: {
        value: "This is my new bio.",
      },
    });

    expect(bioInput).toHaveValue("This is my new bio.");
  });

  test("This shows validation error when username is empty", async () => {
    render(<EditProfile />);

    const usernameInput = screen.getByLabelText("User Name");

    fireEvent.change(usernameInput, {
      target: {
        value: "   ",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Username is required."),
    ).toBeInTheDocument();

    expect(mockUpdateProfile).not.toHaveBeenCalled();

    // navigation-not happen
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("This calls updateProfile with the updated username and bio", async () => {
    mockUpdateProfile.mockResolvedValueOnce({});

    render(<EditProfile />);

    fireEvent.change(screen.getByLabelText("User Name"), {
      target: {
        value: "  NewUsername  ",
      },
    });

    fireEvent.change(screen.getByLabelText("Bio"), {
      target: {
        value: "New bio",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      username: "NewUsername",
      bio: "New bio",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("It navigates to profile after successfully saving", async () => {
    mockUpdateProfile.mockResolvedValueOnce({});

    render(<EditProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("This shows Saving while profile is being updated", async () => {
    let resolveUpdate;

    mockUpdateProfile.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<EditProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByRole("button", { name: "Saving..." }),
    ).toBeInTheDocument();

    // Finish the pending update
    resolveUpdate({});

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("This shows the error returned by updateProfile", async () => {
    mockUpdateProfile.mockRejectedValueOnce(
      new Error("Failed to update profile."),
    );

    render(<EditProfile />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Failed to update profile."),
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("It opens the image file picker when Change profile picture is clicked", () => {
    render(<EditProfile />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    );

    const clickSpy = jest
      .spyOn(fileInput, "click")
      .mockImplementation(() => {});

    fireEvent.click(
      screen.getByRole("button", {
        name: "Change profile picture",
      }),
    );

    expect(clickSpy).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
  });

  test("It rejects an unsupported image type", () => {
    render(<EditProfile />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    );

    const invalidFile = new File(
      ["invalid"],
      "document.pdf",
      {
        type: "application/pdf",
      },
    );

    fireEvent.change(fileInput, {
      target: {
        files: [invalidFile],
      },
    });

    expect(
      screen.getByText("Please select a JPG or PNG image."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Save" }),
    ).toBeEnabled();
  });

  test("This rejects an image larger than 2MB", () => {
    render(<EditProfile />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    );

    // create a file larger than 2MB
    const largeContent = new Uint8Array(
      2 * 1024 * 1024 + 1,
    );

    const largeFile = new File(
      [largeContent],
      "large-image.jpg",
      {
        type: "image/jpeg",
      },
    );

    fireEvent.change(fileInput, {
      target: {
        files: [largeFile],
      },
    });

    expect(
      screen.getByText("Image must be smaller than 2MB."),
    ).toBeInTheDocument();
  });

  test("accepts a valid JPG image", async () => {
    render(<EditProfile />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    );

    const validFile = new File(
      ["image-data"],
      "profile.jpg",
      {
        type: "image/jpeg",
      },
    );

    // mock FileReader
    const mockReader = {
      result: "data:image/jpeg;base64,test-image",
      readAsDataURL: jest.fn(),
      onloadend: null,
    };

    global.FileReader = jest
      .fn()
      .mockImplementation(() => mockReader);

    fireEvent.change(fileInput, {
      target: {
        files: [validFile],
      },
    });

    mockReader.onloadend();

    await waitFor(() => {
      expect(
        screen.getByAltText("Profile"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Remove" }),
    ).toBeInTheDocument();
  });

  test("This removes the selected profile image", async () => {
    render(<EditProfile />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    );

    const validFile = new File(
      ["image-data"],
      "profile.jpg",
      {
        type: "image/jpeg",
      },
    );

    const mockReader = {
      result: "data:image/jpeg;base64,test-image",
      readAsDataURL: jest.fn(),
      onloadend: null,
    };

    global.FileReader = jest
      .fn()
      .mockImplementation(() => mockReader);

    fireEvent.change(fileInput, {
      target: {
        files: [validFile],
      },
    });

    mockReader.onloadend();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Remove" }),
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Remove" }),
    );

    expect(
      screen.queryByAltText("Profile"),
    ).not.toBeInTheDocument();

    expect(fileInput.value).toBe("");
  });

  test("It opens the mobile sidebar drawer", () => {
    render(<EditProfile />);

    const menuButton = screen
      .getByTestId("menu-icon")
      .closest("button");

    fireEvent.click(menuButton);

    expect(mockSetDrawerOpen).toHaveBeenCalledWith(true);
  });

  test("It disables Save button while profile context is loading", () => {
    useProfile.mockReturnValue({
      profile,
      updateProfile: mockUpdateProfile,
      loading: true,
    });

    render(<EditProfile />);

    expect(
      screen.getByRole("button", { name: "Save" }),
    ).toBeDisabled();
  });
});