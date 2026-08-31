import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutModal from "../../components/modal/LogoutModal";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../config/api";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../config/api", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("../../components/modal/Modal", () => {
  return function MockModal({ isOpen, onClose, titleId, children }) {
    if (!isOpen) {
      return null;
    }

    return (
      <div data-testid="modal">
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
        >
          Close
        </button>

        <div id={titleId}>{children}</div>
      </div>
    );
  };
});

jest.mock("../../components/Button", () => {
  return function MockButton({ children, onClick, ...props }) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock("../../icons/icons", () => ({
  LogOut: (props) => (
    <span data-testid="logout-icon" {...props} />
  ),
}));

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockCloseLogoutModal = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  useNavigate.mockReturnValue(mockNavigate);

  useAuth.mockReturnValue({
    logout: mockLogout,
  });

  useModal.mockReturnValue({
    showLogoutModal: true,
    closeLogoutModal: mockCloseLogoutModal,
  });
});

test("It renders logout modal when it is open", () => {
  render(<LogoutModal />);

  expect(screen.getByTestId("modal")).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: "Log Out" }),
  ).toBeInTheDocument();

expect(
  screen.getByText(
    /Are you sure you want to sign out/,
  ),
).toBeInTheDocument();

expect(
  screen.getByText(
    /You'll need to sign in again to access your notes/,
  ),
).toBeInTheDocument();

  expect(
    screen.getByTestId("logout-icon"),
  ).toBeInTheDocument();
});

test("It does not render modal when it is closed", () => {
  useModal.mockReturnValue({
    showLogoutModal: false,
    closeLogoutModal: mockCloseLogoutModal,
  });

  render(<LogoutModal />);

  expect(
    screen.queryByTestId("modal"),
  ).not.toBeInTheDocument();
});

test("It closes the modal when Cancel is clicked", () => {
  render(<LogoutModal />);

  fireEvent.click(
    screen.getByRole("button", { name: "Cancel" }),
  );

  expect(mockCloseLogoutModal).toHaveBeenCalledTimes(1);
});

test("It closes the modal when the modal close button is clicked", () => {
  render(<LogoutModal />);

  fireEvent.click(
    screen.getByRole("button", { name: "Close modal" }),
  );

  expect(mockCloseLogoutModal).toHaveBeenCalledTimes(1);
});

test("It logs out successfully and navigates to login", async () => {
  apiFetch.mockResolvedValue({
    ok: true,
  });

  render(<LogoutModal />);

  fireEvent.click(
    screen.getByRole("button", { name: "Log Out" }),
  );

  await waitFor(() => {
    expect(apiFetch).toHaveBeenCalledWith(
      "/api/auth/logout",
      {
        method: "POST",
      },
    );
  });

  expect(mockLogout).toHaveBeenCalledTimes(1);
  expect(mockCloseLogoutModal).toHaveBeenCalledTimes(1);

  expect(mockNavigate).toHaveBeenCalledWith(
    "/login",
    { replace: true },
  );
});

test("It does not logout or navigate when logout request fails", async () => {
  apiFetch.mockResolvedValue({
    ok: false,
  });

  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  render(<LogoutModal />);

  fireEvent.click(
    screen.getByRole("button", { name: "Log Out" }),
  );

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Logout error:",
      expect.any(Error),
    );
  });

  expect(mockLogout).not.toHaveBeenCalled();
  expect(mockCloseLogoutModal).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();

  consoleErrorSpy.mockRestore();
});

test("It handles API error when logout request throws", async () => {
  const error = new Error("Network error");

  apiFetch.mockRejectedValue(error);

  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  render(<LogoutModal />);

  fireEvent.click(
    screen.getByRole("button", { name: "Log Out" }),
  );

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Logout error:",
      error,
    );
  });

  expect(mockLogout).not.toHaveBeenCalled();
  expect(mockCloseLogoutModal).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalled();

  consoleErrorSpy.mockRestore();
});
