import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import UserMenu from "../../pages/Dashboard/components/UserMenu.jsx";
import { useModal } from "../../context/ModalContext";


jest.mock("../../context/ModalContext", () => ({
  useModal: jest.fn(),
}));

const mockOpenLogoutModal = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  useModal.mockReturnValue({
    openLogoutModal: mockOpenLogoutModal,
  });
});

test("renders user name and email", () => {
  render(
    <MemoryRouter>
      <UserMenu />
    </MemoryRouter>,
  );

  expect(screen.getByText("Hiba")).toBeInTheDocument();
  expect(screen.getByText("hibaexp@gmail.com")).toBeInTheDocument();
});


test("renders Profile link", () => {
  render(
    <MemoryRouter>
      <UserMenu />
    </MemoryRouter>,
  );

  const profileLink = screen.getByRole("link", {
    name: "Profile",
  });

  expect(profileLink).toBeInTheDocument();
  expect(profileLink).toHaveAttribute(
    "href",
    "/profile",
  );
});


test("renders Logout button", () => {
  render(
    <MemoryRouter>
      <UserMenu />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("button", {
      name: "Logout",
    }),
  ).toBeInTheDocument();
});


test("calls openLogoutModal when Logout is clicked", () => {
  render(
    <MemoryRouter>
      <UserMenu />
    </MemoryRouter>,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Logout",
    }),
  );

  expect(mockOpenLogoutModal).toHaveBeenCalledTimes(1);
});
