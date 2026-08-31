import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  ThemeProvider,
  useTheme,
} from "../../context/ThemeContext";

function TestConsumer() {
  const {
    theme,
    setTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
  } = useTheme();

  return (
    <div>
      <div data-testid="theme">
        {theme}
      </div>

      <div data-testid="accent-color">
        {accentColor}
      </div>

      <button onClick={toggleTheme}>
        Toggle Theme
      </button>

      <button
        onClick={() => setTheme("dark")}
      >
        Set Dark
      </button>

      <button
        onClick={() => setTheme("light")}
      >
        Set Light
      </button>

      <button
        onClick={() => setAccentColor("blue")}
      >
        Set Blue Accent
      </button>

      <button
        onClick={() => setAccentColor("green")}
      >
        Set Green Accent
      </button>
    </div>
  );
}
function renderContext() {
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>,
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();

    document.documentElement.className = "";
    document.documentElement.removeAttribute(
      "data-accent",
    );
  });

  afterEach(() => {
    localStorage.clear();

    document.documentElement.className = "";
    document.documentElement.removeAttribute(
      "data-accent",
    );
  });
  test("uses light theme by default when no theme is stored", async () => {
    renderContext();

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("light");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(false);
    });
  });

  test("uses purple accent color by default when no accent color is stored", async () => {
    renderContext();

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("purple");

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("purple");
    });
  });

  test("loads stored theme from localStorage", async () => {
    localStorage.setItem("theme", "dark");

    renderContext();
    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);
    });
  });

  test("loads stored accent color from localStorage", async () => {
    localStorage.setItem(
      "accentColor",
      "blue",
    );

    renderContext();

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("blue");

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");
    });
  });

  test("loads both stored theme and accent color from localStorage", async () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem(
      "accentColor",
      "green",
    );

    renderContext();

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("green");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);

      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("green");
    });
  });

  test("adds dark class when theme is dark", async () => {
    localStorage.setItem("theme", "dark");

    renderContext();

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);
    });
  });

  test("does not add dark class when theme is light", async () => {
    localStorage.setItem("theme", "light");

    renderContext();
    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(false);
    });
  });

  test("sets data-accent attribute on document root", async () => {
    localStorage.setItem(
      "accentColor",
      "blue",
    );

    renderContext();

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");
    });
  });

  test("saves initial theme to localStorage", async () => {
    renderContext();

    await waitFor(() => {
      expect(
        localStorage.getItem("theme"),
      ).toBe("light");
    });
  });

  test("saves initial accent color to localStorage", async () => {
    renderContext();

    await waitFor(() => {
      expect(
        localStorage.getItem("accentColor"),
      ).toBe("purple");
    });
  });

  test("saves stored preferences back to localStorage", async () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem(
      "accentColor",
      "blue",
    );

    renderContext();
    await waitFor(() => {
      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");

      expect(
        localStorage.getItem("accentColor"),
      ).toBe("blue");
    });
  });

  test("toggleTheme changes light theme to dark", async () => {
    localStorage.setItem("theme", "light");

    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle Theme",
      }),
    );

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);

      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");
    });
  });

  test("toggleTheme changes dark theme to light", async () => {
    localStorage.setItem("theme", "dark");

    renderContext();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Toggle Theme",
      }),
    );

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("light");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(false);

      expect(
        localStorage.getItem("theme"),
      ).toBe("light");
    });
  });

  test("toggleTheme can switch themes multiple times", async () => {
    renderContext();

    const toggleButton =
      screen.getByRole("button", {
        name: "Toggle Theme",
      });

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("light");

    fireEvent.click(toggleButton);

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    fireEvent.click(toggleButton);
    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("light");

    fireEvent.click(toggleButton);

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    await waitFor(() => {
      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");
    });
  });

  test("setTheme changes theme to dark", async () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Dark",
      }),
    );
    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);

      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");
    });
  });

  test("setTheme changes theme to light", async () => {
    localStorage.setItem("theme", "dark");

    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Light",
      }),
    );

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("light");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(false);

      expect(
        localStorage.getItem("theme"),
      ).toBe("light");
    });
  });

  test("setAccentColor changes accent color to blue", async () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Blue Accent",
      }),
    );
    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("blue");

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");
      expect(
        localStorage.getItem("accentColor"),
      ).toBe("blue");
    });
  });

  test("setAccentColor changes accent color to green", async () => {
    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Green Accent",
      }),
    );

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("green");

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("green");

      expect(
        localStorage.getItem("accentColor"),
      ).toBe("green");
    });
  });

  test("changing theme preserves the selected accent color", async () => {
    localStorage.setItem(
      "accentColor",
      "blue",
    );

    renderContext();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Dark",
      }),
    );

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("blue");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");

      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");

      expect(
        localStorage.getItem("accentColor"),
      ).toBe("blue");
    });
  });

  test("changing accent color preserves the selected theme", async () => {
    localStorage.setItem("theme", "dark");

    renderContext();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Blue Accent",
      }),
    );

    expect(
      screen.getByTestId("theme"),
    ).toHaveTextContent("dark");

    expect(
      screen.getByTestId("accent-color"),
    ).toHaveTextContent("blue");

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");

      expect(
        localStorage.getItem("theme"),
      ).toBe("dark");
   expect(
        localStorage.getItem("accentColor"),
      ).toBe("blue");
    });
  });

  test("updates document root whenever theme changes", async () => {
    renderContext();

    expect(
      document.documentElement.classList.contains(
        "dark",
      ),
    ).toBe(false);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Dark",
      }),
    );

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(true);
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Light",
      }),
    );

    await waitFor(() => {
      expect(
        document.documentElement.classList.contains(
          "dark",
        ),
      ).toBe(false);
    });
  });

  test("updates document root whenever accent color changes", async () => {
    renderContext();

    expect(
      document.documentElement.getAttribute(
        "data-accent",
      ),
    ).toBe("purple");
    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Blue Accent",
      }),
    );

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("blue");
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Set Green Accent",
      }),
    );

    await waitFor(() => {
      expect(
        document.documentElement.getAttribute(
          "data-accent",
        ),
      ).toBe("green");
    });
  });

  test("provides all expected theme context values", () => {
    function ContextValueConsumer() {
      const context = useTheme();

      return (
        <div>
          <div data-testid="has-theme">
            {typeof context.theme}
          </div>

          <div data-testid="has-set-theme">
            {typeof context.setTheme}
          </div>
          <div data-testid="has-toggle-theme">
            {typeof context.toggleTheme}
          </div>

          <div data-testid="has-accent-color">
            {typeof context.accentColor}
          </div>

          <div data-testid="has-set-accent-color">
            {typeof context.setAccentColor}
          </div>
        </div>
      );
    }
    render(
      <ThemeProvider>
        <ContextValueConsumer />
      </ThemeProvider>,
    );

    expect(
      screen.getByTestId("has-theme"),
    ).toHaveTextContent("string");

    expect(
      screen.getByTestId("has-set-theme"),
    ).toHaveTextContent("function");

    expect(
      screen.getByTestId("has-toggle-theme"),
    ).toHaveTextContent("function");

    expect(
      screen.getByTestId("has-accent-color"),
    ).toHaveTextContent("string");

    expect(
      screen.getByTestId("has-set-accent-color"),
    ).toHaveTextContent("function");
  });
});
