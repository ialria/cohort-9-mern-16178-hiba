import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../../pages/Auth/LoginForm.jsx";
import { apiFetch } from "../../config/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

jest.mock("../../config/api.js", () => ({
  apiFetch: jest.fn(),
}));

// mock authCon so we can test
jest.mock("../../context/AuthContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const mockSetUser = jest.fn();
const mockNavigate = jest.fn();

// react-router-dom navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderLoginForm = (initialEntries = ["/login"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <LoginForm />
    </MemoryRouter>,
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // setUser from AuthContext
    useAuth.mockReturnValue({
      setUser: mockSetUser,
    });
  });

  it("should render the login form", () => {
    renderLoginForm();

    expect(
      screen.getByText("Welcome back"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Password"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Log in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Forgot password?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create an account"),
    ).toBeInTheDocument();
  });

  // testing starts
  it("should show validation errors when the form is submitted empty", async () => {
    renderLoginForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    expect(
      await screen.findByText("Please enter your email."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter your password."),
    ).toBeInTheDocument();
    // Invalid data should stop the request
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should show an error for an invalid email", async () => {
    renderLoginForm();
    // get element and then mock value in it
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    // shows expected behaviour of form
    expect(
      await screen.findByText("Please enter a valid email"),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should show an error when the password is too short", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "1234567" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    expect(
      await screen.findByText(
        "Password must be at least 8 characters long",
      ),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });
  it("should show the password when the show password button is clicked", () => {
    renderLoginForm();

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type","password");
    fireEvent.click(
      screen.getByRole("button", { name: "Show password" }),
    );

 expect(passwordInput).toHaveAttribute("type", "text");
  });

  // all valid data and then we mock api call then
  it("should call the login API with valid form data", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Login successful",
        user: {
          id: 1,
          username: "Test User",
          email: "test@example.com",
        },
      }),
    });

    renderLoginForm();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    // login data sent to the backend
    const requestOptions = apiFetch.mock.calls[0][1];

    expect(JSON.parse(requestOptions.body)).toEqual({
      email: "test@example.com",
      password: "StrongPassword123!",
    });
  });

  it("should show an error when login credentials are invalid", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        message: "Invalid email or password.",
      }),
    });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "WrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Invalid email or password.");

    // setUser should not be called when login fails
    expect(mockSetUser).not.toHaveBeenCalled();

    // user should not be redirected when login fails
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show a general error when login fails", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        message: "Something went wrong",
      }),
    });

    renderLoginForm();

  fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Something went wrong");

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  it("should show an error when the login request fails", async () => {
    apiFetch.mockRejectedValue(
      new Error("Network error"),
    );
    renderLoginForm();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Something went wrong. Please try again.",
    );
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  it("should complete login when login is successful", async () => {
    const user = {
      id: 1,
      username: "Test User",
      email: "test@example.com",
    };
    apiFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Login successful",
        user,
      }),
    });
    renderLoginForm();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
  fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );

    // wait-handleSubmit is async
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(user);
    });
    // successful login->dashboard
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to the original page after successful login", async () => {
    const user = {
      id: 1,
      username: "Test User",
      email: "test@example.com",
    };
    apiFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Login successful",
        user,
      }),
    });

    renderLoginForm([
      {
        pathname: "/login",
        state: {
          from: "/favourites",
        },
      },
    ]);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(user);
    });

    // user return to page they wanted
    expect(mockNavigate).toHaveBeenCalledWith("/favourites");
  });

  it("should disable the login button while submitting", async () => {
    // API request pending-isSubmitting --true
    apiFetch.mockReturnValue(
      new Promise(() => {}),
    );

    renderLoginForm();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Log in" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Log in" }),
      ).toBeDisabled();
    });

    // API should have been called once
    expect(apiFetch).toHaveBeenCalledTimes(1);
  });
});

