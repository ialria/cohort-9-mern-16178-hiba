import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import {
  ProfileProvider,
  useProfile,
} from "../../context/ProfileContext";

import { apiFetch } from "../../config/api";

jest.mock("../../config/api", () => ({
  apiFetch: jest.fn(),
}));

function TestConsumer() {
  const {
    profile,
    loading,
    getProfile,
    updateProfile,
    getInitials,
    profileError,
  } = useProfile();
  return (
    <div>
      <div data-testid="profile">
        {profile ? JSON.stringify(profile) : ""}
      </div>

      <div data-testid="loading">
        {loading ? "true" : "false"}
      </div>

      <div data-testid="profile-error">
        {profileError || ""}
      </div>

      <div data-testid="initials-one">
        {getInitials("Hiba")}
      </div>

      <div data-testid="initials-two">
        {getInitials("Hiba Khan")}
      </div>

      <div data-testid="initials-three">
        {getInitials("Hiba Noor Khan")}
      </div>

      <div data-testid="initials-whitespace">
        {getInitials("   Hiba    Khan   ")}
      </div>

      <div data-testid="initials-empty">
        {getInitials()}
      </div>
      <button
        onClick={() =>
          getProfile().catch(() => {})
        }
      >
        Get Profile
      </button>

      <button
        onClick={() =>
          updateProfile({
            username: "Updated User",
            bio: "Updated bio",
          }).catch(() => {})
        }
      >
        Update Profile
      </button>
    </div>
  );
}
function renderContext() {
  return render(
    <ProfileProvider>
      <TestConsumer />
    </ProfileProvider>,
  );
}

function response(
  data = {},
  ok = true,
  status = 200,
) {
  return {
    ok,
    status,
    json: async () => data,
  };
}
describe("ProfileContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    apiFetch.mockResolvedValue(
      response({
        id: 1,
        username: "Hiba",
        email: "hiba@example.com",
        bio: "My bio",
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the provider with initial loading state", () => {
    renderContext();
    expect(
      screen.getByTestId("loading"),
    ).toHaveTextContent("true");
  });

  test("fetches profile automatically when provider mounts", async () => {
    const profile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "My bio",
    };

    apiFetch.mockResolvedValueOnce(
      response(profile),
    );

    renderContext();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/profile",
      );
    });
    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("profile").textContent,
        ),
      ).toEqual(profile);
    });
  });

  test("sets loading to false after successfully fetching profile", async () => {
    const profile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "My bio",
    };
    apiFetch.mockResolvedValueOnce(
      response(profile),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("loading"),
      ).toHaveTextContent("false");
    });
  });

  test("clears profile error after successful profile fetch", async () => {
    const profile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "My bio",
    };

   apiFetch.mockResolvedValueOnce(
      response(profile),
    );
    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent("");
    });
  });
  test("sets error when getProfile fails with backend message", async () => {
    apiFetch.mockResolvedValueOnce(
      response(
        {
          message: "Failed to load profile",
        },
        false,
        500,
      ),
    );
    renderContext();
    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent(
        "Failed to load profile",
      );
    });
  });
  test("sets profile to null when getProfile fails", async () => {
    apiFetch.mockResolvedValueOnce(
      response(
        {
          message: "Failed to load profile",
        },
        false,
        500,
      ),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile"),
      ).toHaveTextContent("");
    });
  });

  test("sets loading to false when getProfile fails", async () => {
    apiFetch.mockResolvedValueOnce(
      response(
        {
          message: "Failed to load profile",
        },
        false,
        500,
      ),
    );

    renderContext();
    await waitFor(() => {
      expect(
        screen.getByTestId("loading"),
      ).toHaveTextContent("false");
    });
  });

  test("uses fallback error when profile response has no message", async () => {
    apiFetch.mockResolvedValueOnce(
      response({}, false, 500),
    );

    renderContext();
    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent(
        "Error! Failed to fetch profile",
      );
    });
  });

  test("handles invalid or empty profile response", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => null,
    });

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent(
        "Error! Failed to fetch profile",
      );
    });
  });
  test("handles profile JSON parsing failure", async () => {
    apiFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent(
        "Error! Failed to fetch profile",
      );
    });
  });
  test("getProfile can be called manually", async () => {
    const initialProfile = {
      id: 1,
      username: "Initial User",
      email: "initial@example.com",
      bio: "Initial bio",
    };

    const updatedProfile = {
      id: 1,
      username: "Updated User",
      email: "updated@example.com",
      bio: "Updated bio",
    };

    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce(
        response(updatedProfile),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile"),
      ).toHaveTextContent("Initial User");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Get Profile",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("profile"),
      ).toHaveTextContent("Updated User");
    });

    expect(apiFetch).toHaveBeenCalledTimes(2);

    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/profile",
    );
  });

  test("updates profile successfully", async () => {
    const initialProfile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "Old bio",
    };

    const updatedProfile = {
      id: 1,
      username: "Updated User",
      email: "hiba@example.com",
      bio: "Updated bio",
    };

    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce(
        response(updatedProfile),
      );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile"),
      ).toHaveTextContent("Hiba");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Profile",
      }),
    );

    await waitFor(() => {
      expect(
        JSON.parse(
          screen.getByTestId("profile").textContent,
        ),
      ).toEqual(updatedProfile);
    });
    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      "/api/profile",
      {
        method: "PUT",
        body: JSON.stringify({
          username: "Updated User",
          bio: "Updated bio",
        }),
      },
    );
  });
  test("returns updated profile from updateProfile", async () => {
    const initialProfile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "Old bio",
    };

    const updatedProfile = {
      id: 1,
      username: "Updated User",
      email: "hiba@example.com",
      bio: "Updated bio",
    };

    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce(
        response(updatedProfile),
      );

    let returnedProfile;
    function ReturnValueConsumer() {
      const {
        updateProfile,
      } = useProfile();

      return (
        <button
          onClick={async () => {
            returnedProfile =
              await updateProfile({
                username: "Updated User",
                bio: "Updated bio",
              });
          }}
        >
          Update And Return
        </button>
      );
    }

    render(
      <ProfileProvider>
        <ReturnValueConsumer />
      </ProfileProvider>,
    );
    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Update And Return",
        }),
      );
    });

    expect(returnedProfile).toEqual(
      updatedProfile,
    );
  });

  test("throws backend error when updateProfile fails", async () => {
    const initialProfile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "Old bio",
    };

    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce(
        response(
          {
            message: "Username already exists",
          },
          false,
          400,
        ),
      );

    let caughtError;

    function UpdateErrorConsumer() {
      const {
        updateProfile,
      } = useProfile();

      return (
        <button
          onClick={async () => {
            try {
              await updateProfile({
                username: "Existing User",
                bio: "Bio",
              });
            } catch (error) {
              caughtError = error;
            }
          }}
        >
          Update Profile Error
        </button>
      );
    }
    render(
      <ProfileProvider>
        <UpdateErrorConsumer />
      </ProfileProvider>,
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Update Profile Error",
        }),
      );
    });

    await waitFor(() => {
      expect(caughtError).toEqual(
        new Error("Username already exists"),
      );
    });
  });

  test("throws fallback error when updateProfile response is invalid", async () => {
    const initialProfile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "Old bio",
    };
    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => null,
      });

    let caughtError;

    function UpdateInvalidResponseConsumer() {
      const {
        updateProfile,
      } = useProfile();
      return (
        <button
          onClick={async () => {
            try {
              await updateProfile({
                username: "Updated User",
                bio: "Bio",
              });
            } catch (error) {
              caughtError = error;
            }
          }}
        >
          Update Invalid Response
        </button>
      );
    }

    render(
      <ProfileProvider>
        <UpdateInvalidResponseConsumer />
      </ProfileProvider>,
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Update Invalid Response",
        }),
      );
    });
    await waitFor(() => {
      expect(caughtError).toEqual(
        new Error(
          "Error! Failed to update profile",
        ),
      );
    });
  });

  test("throws fallback error when updateProfile JSON parsing fails", async () => {
    const initialProfile = {
      id: 1,
      username: "Hiba",
      email: "hiba@example.com",
      bio: "Old bio",
    };

    apiFetch
      .mockResolvedValueOnce(
        response(initialProfile),
      )
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

    let caughtError;
    function UpdateJsonErrorConsumer() {
      const {
        updateProfile,
      } = useProfile();

      return (
        <button
          onClick={async () => {
            try {
              await updateProfile({
                username: "Updated User",
                bio: "Bio",
              });
            } catch (error) {
              caughtError = error;
            }
          }}
        >
          Update JSON Error
        </button>
      );
    }

    render(
      <ProfileProvider>
        <UpdateJsonErrorConsumer />
      </ProfileProvider>,
    );

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(1);
    });
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Update JSON Error",
        }),
      );
    });

    await waitFor(() => {
      expect(caughtError).toEqual(
        new Error(
          "Error! Failed to update profile",
        ),
      );
    });
  });

  test("getInitials returns one initial for a single name", () => {
    renderContext();

    expect(
      screen.getByTestId("initials-one"),
    ).toHaveTextContent("H");
  });
  test("getInitials returns two initials for two names", () => {
    renderContext();

    expect(
      screen.getByTestId("initials-two"),
    ).toHaveTextContent("HK");
  });

  test("getInitials returns only the first two initials for multiple names", () => {
    renderContext();

    expect(
      screen.getByTestId("initials-three"),
    ).toHaveTextContent("HN");
  });

  test("getInitials trims whitespace and handles multiple spaces", () => {
    renderContext();

    expect(
      screen.getByTestId("initials-whitespace"),
    ).toHaveTextContent("HK");
  });

  test("getInitials returns empty string when username is empty", () => {
    renderContext();

    expect(
      screen.getByTestId("initials-empty"),
    ).toHaveTextContent("");
  });
  test("getInitials converts initials to uppercase", () => {
    function InitialsConsumer() {
      const { getInitials } = useProfile();

      return (
        <div data-testid="lowercase-initials">
          {getInitials("hiba khan")}
        </div>
      );
    }

    render(
      <ProfileProvider>
        <InitialsConsumer />
      </ProfileProvider>,
    );

 expect(
      screen.getByTestId("lowercase-initials"),
    ).toHaveTextContent("HK");
  });

  test("profileError is cleared when getProfile starts", async () => {
    apiFetch
      .mockResolvedValueOnce(
        response(
          {
            message: "First request failed",
          },
          false,
          500,
        ),
      )
      .mockResolvedValueOnce(
        response({
          id: 1,
          username: "Hiba",
          email: "hiba@example.com",
          bio: "Bio",
        }),
      );
    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent(
        "First request failed",
      );
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Get Profile",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("profile-error"),
      ).toHaveTextContent("");
    });
  });
  test("loading becomes true when getProfile is called", async () => {
    let resolveProfile;

    apiFetch.mockReset();

    apiFetch.mockResolvedValueOnce(
      response({
        id: 1,
        username: "Hiba",
      }),
    );

    renderContext();

    await waitFor(() => {
      expect(
        screen.getByTestId("loading"),
      ).toHaveTextContent("false");
    });

    apiFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "Get Profile",
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("loading"),
      ).toHaveTextContent("true");
    });

    await act(async () => {
      resolveProfile(
        response({
          id: 1,
          username: "Updated",
        }),
      );
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("loading"),
      ).toHaveTextContent("false");
    });
  });
});
