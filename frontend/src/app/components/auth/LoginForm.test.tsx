import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("../../AppContext", () => ({
  useAppContext: () => ({
    updateToken: vi.fn(),
    token: null,
  }),
}));

vi.mock("@/app/hooks/useSWRMutation", () => ({
  useSWRMutationHook: () => ({
    isMutating: false,
    trigger: vi.fn(),
    error: null,
  }),
}));

describe("LoginForm tests", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the login form", () => {
    render(<LoginForm />);

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
  });

  it("has a login button", () => {
    render(<LoginForm />);

    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();
  });
});
