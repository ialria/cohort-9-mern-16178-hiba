import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "../../pages/Auth/SingupForm.jsx";
import { apiFetch } from "../../config/api.js";
import confetti from "canvas-confetti";
import zxcvbn from "../../utils/passwordStrength.js";

// jest.fn() creates a fake sunction that Jest can watch and control
jest.mock("../../config/api.js", () => ({
  apiFetch: jest.fn(),
}));

jest.mock("canvas-confetti", () => jest.fn());

jest.mock("../../utils/passwordStrength.js", () => ({
  __esModule: true, //this passwordStrength has a default export that zxcvbn
  default: jest.fn(),
}));

const renderSignupForm = () => {
  return render( //fake test browser so can do interaction
    <MemoryRouter>
        {/* to keep routing info in memory */}
      <SignupForm />
    </MemoryRouter>,
  );
};

const fillValidForm = async () => {
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "Test User" },
  });

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "StrongPassword123!" },
  });

  // Wait for the async password strength check to finish
  await waitFor(() => {
    expect(screen.getByText("Very strong")).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "StrongPassword123!" },
  });
};

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // checks password strength
    zxcvbn.mockResolvedValue({
      check: () => ({
        score: 4,
      }),
    });
  });

  it("should render the signup form", () => {
    // first we render element
    renderSignupForm();
    expect(
      screen.getByText("Create your account"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Username"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Password"),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Confirm Password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });

//   testing starts
  it("should show validation errors when the form is submitted empty", async () => {
    renderSignupForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );
    expect(
      await screen.findByText("Please enter your username."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter your email."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter your password."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please confirm your password"),
    ).toBeInTheDocument();

    // Invalid data should stop the  request
    expect(apiFetch).not.toHaveBeenCalled();
  });


  it("should show an error for an invalid email", async () => {
    renderSignupForm();
    // get element and then mock value in it
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });

    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    // shows expected behaviour of form
    expect(
      await screen.findByText("Please enter a valid email"),
    ).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should show an error when passwords do not match", async () => {
    renderSignupForm();

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongPassword123!" },
    });

    // Wait for the async password strength check to finish
    await waitFor(() => {
      expect(screen.getByText("Very strong")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "DifferentPassword123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should show an error when the password is too short", async () => {
    renderSignupForm();
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "Test User" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "1234567" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "1234567" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );
    expect(
      await screen.findByText(
        "Password must be at least 8 characters long",
      ),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  it("should show the password when the show password button is clicked", () => {
    renderSignupForm();

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", { name: "Show password" }),
    );
    expect(passwordInput).toHaveAttribute("type", "text");
  });

//   all valid data and then we mock api call then
  it("should call the signup API with valid form data", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        message: "Account created",
      }),
    });

    renderSignupForm();

    await fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/auth/signup",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    // signup data sent to the backend.
    const requestOptions = apiFetch.mock.calls[0][1];

    expect(JSON.parse(requestOptions.body)).toEqual({
      username: "Test User",
      email: "test@example.com",
      password: "StrongPassword123!",
    });
  });

  it("should show an error when the email is already registered", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({
        message: "Email is already registered",
      }),
    });

    renderSignupForm();

    await fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(
      await screen.findByText("Email is already registered"),
    ).toBeInTheDocument();
  });



  it("should show a general error when signup fails", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        message: "Something went wrong",
      }),
    });

    renderSignupForm();

    await fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(
      await screen.findByText("Something went wrong"),
    ).toBeInTheDocument();
  });

  it("should complete registration when signup is successful", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        message: "Account created",
      }),
    });

    renderSignupForm();

    await fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    //have to wait because handleSubmit is async
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Account created" }),
      ).toBeInTheDocument();
    });

    // successful registration- my confetti then
    expect(confetti).toHaveBeenCalled();
  });
});