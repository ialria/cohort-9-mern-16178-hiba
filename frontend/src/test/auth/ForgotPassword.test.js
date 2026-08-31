import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"; 
import { MemoryRouter } from "react-router-dom"; 
import ForgotPassword from "../../pages/Auth/ForgotPassword.jsx"; 
import { apiFetch } from "../../config/api.js"; 
 
// jest.fn() creates a fake func 
jest.mock("../../config/api.js", () => ({ 
  apiFetch: jest.fn(), 
})); 
 
const renderForgotPassword = () => { 
  return render( 
    <MemoryRouter> 
      <ForgotPassword /> 
    </MemoryRouter>, 
  ); 
}; 
 
describe("ForgotPassword", () => { 
  beforeEach(() => { 
    jest.clearAllMocks(); 
    jest.useRealTimers(); 
  }); 
 
  // testing starts 
 
  it("should render the forgot password form", () => { 
    // first we render the component 
    renderForgotPassword(); 
 
    expect( 
      screen.getByText("Forgot Password?"), 
    ).toBeInTheDocument(); 
    expect( 
      screen.getByLabelText("Email"), 
    ).toBeInTheDocument(); 
    expect( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ).toBeInTheDocument(); 
 
    expect( 
      screen.getByRole("link", { name: "Back to Login" }), 
    ).toBeInTheDocument(); 
  }); 
 
  it("This should show a validation error when the form is submitted empty", async () => { 
    renderForgotPassword(); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    expect( 
      await screen.findByText("Please enter your email."), 
    ).toBeInTheDocument(); 
 
    // invalid data should stop request 
    expect(apiFetch).not.toHaveBeenCalled(); 
  }); 
 

it("should show an error when resending the email fails", async () => {
  jest.useFakeTimers();

  apiFetch
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Reset email sent",
      }),
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        message: "Unable to resend email",
      }),
    });

  renderForgotPassword();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Send Reset Link" }),
  );

  await waitFor(() => {
    expect(
      screen.getByText("Check your email"),
    ).toBeInTheDocument();
  });

  await act(async () => {
    jest.advanceTimersByTime(60000);
  });

  expect(
    screen.getByRole("button", { name: "Resend email" }),
  ).toBeEnabled();

  await act(async () => {
    fireEvent.click(
      screen.getByRole("button", { name: "Resend email" }),
    );
  });

  expect(
    await screen.findByText("Unable to resend email"),
  ).toBeInTheDocument();
});

it("This should show a general error when resending fails due to a request error", async () => {
  jest.useFakeTimers();

  apiFetch
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        message: "Reset email sent",
      }),
    })
    .mockRejectedValueOnce(new Error("Network error"));

  renderForgotPassword();

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Send Reset Link" }),
  );

  await waitFor(() => {
    expect(
      screen.getByText("Check your email"),
    ).toBeInTheDocument();
  });

  await act(async () => {
    jest.advanceTimersByTime(60000);
  });

  expect(
    screen.getByRole("button", { name: "Resend email" }),
  ).toBeEnabled();

  await act(async () => {
    fireEvent.click(
      screen.getByRole("button", { name: "Resend email" }),
    );
  });

  expect(
    await screen.findByText(
      "Something went wrong. Please try again.",
    ),
  ).toBeInTheDocument();
});

 
  it("This should clear the email error when the user starts typing again", async () => { 
    renderForgotPassword(); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    expect( 
      await screen.findByText("Please enter your email."), 
    ).toBeInTheDocument(); 
 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    // clears the old email error when the user edits the field 
    expect( 
      screen.queryByText("Please enter your email."), 
    ).not.toBeInTheDocument(); 
  }); 
 
  // valid data and then we mock the API call 
  it("This should call the forgot password API with valid form data", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: true, 
      status: 200, 
      json: async () => ({ 
        message: "Reset email sent", 
      }), 
    }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    await waitFor(() => { 
      expect(apiFetch).toHaveBeenCalledWith( 
        "/api/auth/forgot-password", 
        expect.objectContaining({ 
          method: "POST", 
        }), 
      ); 
    }); 
 
    // checking the actual data sent to the backend 
    const requestOptions = apiFetch.mock.calls[0][1]; 
 
    expect(JSON.parse(requestOptions.body)).toEqual({ 
      email: "test@example.com", 
    }); 
  }); 
 
  it("This should show the email sent confirmation after a successful request", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: true, 
      status: 200, 
      json: async () => ({ 
        message: "Reset email sent", 
      }), 
    }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    // wait because handleSubmit and sendResetEmail are async 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
 
    expect( 
      screen.getByText("test@example.com"), 
    ).toBeInTheDocument(); 
    expect( 
      screen.getByText("The reset link will expire in 15 minutes."), 
    ).toBeInTheDocument(); 
  }); 
 
  it("should show the resend button with a cooldown after a successful request", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: true, 
      status: 200, 
      json: async () => ({ 
        message: "Reset email sent", 
      }), 
    }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
 
    // After sending, the component starts a 60 second resend cooldown 
    expect( 
      screen.getByRole("button", { 
        name: "Resend email in 60s", 
      }), 
    ).toBeDisabled(); 
  }); 
 
  it("This should show an error when the email is rejected by the server", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: false, 
      status: 409, 
      json: async () => ({ 
        message: "Email is not registered", 
      }), 
    }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
 
    expect( 
      await screen.findByText("Email is not registered"), 
    ).toBeInTheDocument(); 
    expect( 
      screen.getByText("Forgot Password?"), 
    ).toBeInTheDocument(); 
  }); 
 
  it("This should show a general error when the server returns an error", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: false, 
      status: 500, 
      json: async () => ({ 
        message: "Something went wrong", 
      }), 
    }); 
    renderForgotPassword(); 
 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
 
    expect( 
      await screen.findByText("Something went wrong"), 
    ).toBeInTheDocument(); 
  }); 
 
  it("This should show a general error when the request fails", async () => { 
    apiFetch.mockRejectedValue(new Error("Network error")); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
 
    expect( 
      await screen.findByText("Something went wrong. Please try again."), 
    ).toBeInTheDocument(); 
  }); 
 
  it("It should disable the submit button while the request is being sent", async () => { 
    // Promise stays pending so we can check the loading state 
    let resolveRequest; 
 
    apiFetch.mockReturnValue( 
      new Promise((resolve) => { 
        resolveRequest = resolve; 
      }), 
    ); 
    renderForgotPassword(); 
 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
 
    expect( 
      screen.getByRole("button", { name: "Sending..." }), 
    ).toBeDisabled(); 
 
    // finish -pending request 
    await act(async () => { 
      resolveRequest({ 
        ok: true, 
        status: 200, 
        json: async () => ({ 
          message: "Reset email sent", 
        }), 
      }); 
    }); 
  }); 
 
  it("This should resend the reset email after the cooldown expires", async () => { 
    jest.useFakeTimers(); 
    apiFetch.mockResolvedValue({ 
      ok: true, 
      status: 200, 
      json: async () => ({ 
        message: "Reset email sent", 
      }), 
    }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
 
    expect(apiFetch).toHaveBeenCalledTimes(1); 
 
    // setInterval -60 second cooldown down 
    act(() => { 
      jest.advanceTimersByTime(60000); 
    }); 
 
    expect( 
      screen.getByRole("button", { name: "Resend email" }), 
    ).toBeEnabled(); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Resend email" }), 
    ); 
 
    await waitFor(() => { 
      expect(apiFetch).toHaveBeenCalledTimes(2); 
    }); 
  }); 
 
  it("This should not resend the email while the cooldown is active", async () => { 
    apiFetch.mockResolvedValue({ 
      ok: true, 
      status: 200, 
      json: async () => ({ 
        message: "Reset email sent", 
      }), 
    }); 
    renderForgotPassword(); 
 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
 
    expect(apiFetch).toHaveBeenCalledTimes(1); 
 
   const resendButton = screen.getByRole("button", { 
      name: "Resend email in 60s", 
    }); 
 
    expect(resendButton).toBeDisabled(); 
 
    // disabled -not create another API request 
    fireEvent.click(resendButton); 
 
    expect(apiFetch).toHaveBeenCalledTimes(1); 
  }); 
 
  it("This should show an error when resending the email fails", async () => { 
    jest.useFakeTimers(); 
 
    apiFetch 
      .mockResolvedValueOnce({ 
        ok: true, 
        status: 200, 
        json: async () => ({ 
          message: "Reset email sent", 
        }), 
      }) 
      .mockResolvedValueOnce({ 
        ok: false, 
        status: 500, 
        json: async () => ({ 
          message: "Unable to resend email", 
        }), 
      }); 
 
    renderForgotPassword(); 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
 
    act(() => { 
      jest.advanceTimersByTime(60000); 
    }); 
 
    expect( 
      screen.getByRole("button", { name: "Resend email" }), 
    ).toBeEnabled(); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Resend email" }), 
    ); 
    expect( 
      await screen.findByText("Unable to resend email"), 
    ).toBeInTheDocument(); 
  }); 
 
  it("This should show a general error when resending fails due to a request error", async () => { 
    jest.useFakeTimers(); 
 
    apiFetch 
      .mockResolvedValueOnce({ 
        ok: true, 
        status: 200, 
        json: async () => ({ 
          message: "Reset email sent", 
        }), 
      }) 
      .mockRejectedValueOnce(new Error("Network error")); 
    renderForgotPassword(); 
 
    fireEvent.change(screen.getByLabelText("Email"), { 
      target: { value: "test@example.com" }, 
    }); 
    fireEvent.click( 
      screen.getByRole("button", { name: "Send Reset Link" }), 
    ); 
 
    await waitFor(() => { 
      expect( 
        screen.getByText("Check your email"), 
      ).toBeInTheDocument(); 
    }); 
    act(() => { 
      jest.advanceTimersByTime(60000); 
    }); 
 
    expect( 
      screen.getByRole("button", { name: "Resend email" }), 
    ).toBeEnabled(); 
 
    fireEvent.click( 
      screen.getByRole("button", { name: "Resend email" }), 
    ); 
    expect( 
      await screen.findByText("Something went wrong. Please try again."), 
    ).toBeInTheDocument(); 
  }); 
 
  it("This should have a link back to the login page", () => { 
    renderForgotPassword(); 
    const loginLink = screen.getByRole("link", { 
      name: "Back to Login", 
    }); 
 
    expect(loginLink).toHaveAttribute("href", "/login"); 
  }); 
});

