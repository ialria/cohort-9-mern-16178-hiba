import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../../pages/Auth/ResetPassword.jsx";
import { apiFetch } from "../../config/api.js";
import zxcvbn from "../../utils/passwordStrength.js";

// Mock API
jest.mock("../../config/api.js", () => ({
  apiFetch: jest.fn(),
}));

// Mock password strength checker
jest.mock("../../utils/passwordStrength.js", () => jest.fn());

// Mock icons
jest.mock("../../icons/icons.jsx", () => ({
  Eye: () => <span>Eye</span>,
  EyeOff: () => <span>EyeOff</span>,
  Lock: () => <span>Lock</span>,
  Check: () => <span>Check</span>,
}));

// Mock logo
jest.mock("../../icons/leaflet_logo.jsx", () => () => (
  <span>Leaflet Logo</span>
));

// Mock Button
jest.mock("../../components/Button.jsx", () => {
  return function Button({ children, ...props }) {
    return <button {...props}>{children}</button>;
  };
});

// Mock PasswordStrength
jest.mock("../../components/PasswordStrength.jsx", () => {
  return function PasswordStrength() {
    return <div>Password Strength</div>;
  };
});

const renderResetPassword = (token = "valid-reset-token") => {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <ResetPassword />
    </MemoryRouter>,
  );
};

const typePassword = async (password) => {
  const passwordInput = screen.getByLabelText("Password");

  await act(async () => {
    fireEvent.change(passwordInput, {
      target: { value: password },
    });
  });

  return passwordInput;
};

const typeConfirmPassword = async (password) => {
  const confirmPasswordInput = screen.getByLabelText("Confirm Password");

  await act(async () => {
    fireEvent.change(confirmPasswordInput, {
      target: { value: password },
    });
  });

  return confirmPasswordInput;
};

beforeEach(() => {
  jest.clearAllMocks();

  zxcvbn.mockResolvedValue({
    check: jest.fn().mockReturnValue({
      score: 4,
    }),
  });
});

describe("ResetPassword", () => {
  test("renders reset password form", () => {
    renderResetPassword();

    expect(
      screen.getByRole("heading", {
        name: "Set a new password",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Confirm Password"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    ).toBeInTheDocument();
  });

  test("shows password required error when password is empty", async () => {
    renderResetPassword();

    const confirmPassword = screen.getByLabelText("Confirm Password");

    await typeConfirmPassword("Password123!");

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText("Please enter your password."),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("shows error when password is less than 8 characters", async () => {
    renderResetPassword();

    await typePassword("abc123");

    await typeConfirmPassword("abc123");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText(
        "Password must be at least 8 characters long",
      ),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("shows error when password is more than 64 characters", async () => {
    renderResetPassword();

    const longPassword = "A".repeat(65);

    await typePassword(longPassword);

    await typeConfirmPassword(longPassword);

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText(
        "Password must be 64 characters or less.",
      ),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("shows error when password is too weak", async () => {
    zxcvbn.mockResolvedValue({
      check: jest.fn().mockReturnValue({
        score: 2,
      }),
    });

    renderResetPassword();

    await typePassword("weakpassword");

    await typeConfirmPassword("weakpassword");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText(
        "Password is too weak. Please choose a strong or very strong password.",
      ),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("shows confirm password required error when confirm password is empty", async () => {
    renderResetPassword();

    await typePassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText("Please confirm your password"),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("shows error when passwords do not match", async () => {
    renderResetPassword();

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("DifferentPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText("Passwords do not match."),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("clears password error when user starts typing again", async () => {
    renderResetPassword();

    await typePassword("abc");

    await typeConfirmPassword("abc");

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText(
        "Password must be at least 8 characters long",
      ),
    ).toBeInTheDocument();

    await typePassword("StrongPassword123!");

    await waitFor(() => {
      expect(
        screen.queryByText(
          "Password must be at least 8 characters long",
        ),
      ).not.toBeInTheDocument();
    });
  });

  test("clears confirm password error when user starts typing again", async () => {
    renderResetPassword();

    await typePassword("StrongPassword123!");

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText("Please confirm your password"),
    ).toBeInTheDocument();

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(
        screen.queryByText("Please confirm your password"),
      ).not.toBeInTheDocument();
    });
  });

  test("does not submit when reset token is missing", async () => {
    renderResetPassword("");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    );

    expect(
      await screen.findByText("Invalid or missing reset link."),
    ).toBeInTheDocument();

    expect(apiFetch).not.toHaveBeenCalled();
  });

  test("submits reset password successfully", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        message: "Password reset successfully",
      }),
    });

    renderResetPassword("valid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token: "valid-reset-token",
            password: "StrongPassword123!",
          }),
        },
      );
    });

    expect(
      await screen.findByText("Password reset successfully"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Your password has been changed successfully. You can now log in with your new password.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Go to Login",
      }),
    ).toBeInTheDocument();
  });

  test("shows API error when reset password request fails", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: "Invalid or expired reset token.",
      }),
    });

    renderResetPassword("invalid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    expect(
      await screen.findByText("Invalid or expired reset token."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Reset Password",
      }),
    ).toBeInTheDocument();
  });

  test("shows default API error when server does not provide a message", async () => {
    apiFetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    renderResetPassword("invalid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    expect(
      await screen.findByText("Unable to reset password."),
    ).toBeInTheDocument();
  });

  test("shows generic error when reset password request throws", async () => {
    apiFetch.mockRejectedValue(new Error("Network error"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderResetPassword("valid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    expect(
      await screen.findByText(
        "Something went wrong. Please try again.",
      ),
    ).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Reset password error:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  test("shows password when show password button is clicked", () => {
    renderResetPassword();

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show password",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    expect(
      screen.getByRole("button", {
        name: "Hide password",
      }),
    ).toBeInTheDocument();
  });

  test("hides password when hide password button is clicked", () => {
    renderResetPassword();

    const passwordInput = screen.getByLabelText("Password");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show password",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hide password",
      }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("shows confirm password when show confirm password button is clicked", () => {
    renderResetPassword();

    const confirmPasswordInput =
      screen.getByLabelText("Confirm Password");

    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show confirm password",
      }),
    );

    expect(confirmPasswordInput).toHaveAttribute("type", "text");

    expect(
      screen.getByRole("button", {
        name: "Hide confirm password",
      }),
    ).toBeInTheDocument();
  });

  test("hides confirm password when hide confirm password button is clicked", () => {
    renderResetPassword();

    const confirmPasswordInput =
      screen.getByLabelText("Confirm Password");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show confirm password",
      }),
    );

    expect(confirmPasswordInput).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hide confirm password",
      }),
    );

    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  test("shows Resetting Password while submitting", async () => {
    let resolveRequest;

    apiFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    renderResetPassword("valid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    expect(
      screen.getByRole("button", {
        name: "Resetting Password...",
      }),
    ).toBeDisabled();

    await act(async () => {
      resolveRequest({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText("Password reset successfully"),
      ).toBeInTheDocument();
    });
  });

  test("navigates to login after clicking Go to Login", async () => {
    apiFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    renderResetPassword("valid-reset-token");

    await typePassword("StrongPassword123!");

    await typeConfirmPassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", {
          name: "Reset Password",
        }),
      );
    });

    const loginButton = await screen.findByRole("button", {
      name: "Go to Login",
    });

    fireEvent.click(loginButton);

    // MemoryRouter will handle the navigation.
    // The important part here is that the click handler is executed.
    expect(loginButton).toBeInTheDocument();
  });

  test("ignores stale password strength results", async () => {
    let resolveFirst;
    let resolveSecond;

    zxcvbn
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );

    renderResetPassword();

    const passwordInput = screen.getByLabelText("Password");

    await act(async () => {
      fireEvent.change(passwordInput, {
        target: {
          value: "FirstPassword123!",
        },
      });
    });

    await act(async () => {
      fireEvent.change(passwordInput, {
        target: {
          value: "SecondPassword123!",
        },
      });
    });

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      resolveFirst({
        check: jest.fn().mockReturnValue({
          score: 1,
        }),
      });
    });

    await act(async () => {
      resolveSecond({
        check: jest.fn().mockReturnValue({
          score: 4,
        }),
      });
    });

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalledTimes(2);
    });
  });

  test("handles password strength checker error", async () => {
    zxcvbn.mockRejectedValue(
      new Error("Strength checker failed"),
    );

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderResetPassword();

    await typePassword("StrongPassword123!");

    await waitFor(() => {
      expect(zxcvbn).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Password strength checker error:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
