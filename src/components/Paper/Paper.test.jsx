import { render } from "@testing-library/react";
import Paper from "./Paper";

describe("Paper", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <Paper>
        <span>Test Content</span>
      </Paper>
    );

    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const { container } = render(
      <Paper className="custom-class">
        <span>Test Content</span>
      </Paper>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies default level correctly", () => {
    const { container } = render(
      <Paper>
        <span>Test Content</span>
      </Paper>
    );

    expect(container.firstChild).toHaveClass("shadow-md");
  });

  it("applies custom level correctly", () => {
    const { container } = render(
      <Paper level="lg">
        <span>Test Content</span>
      </Paper>
    );

    expect(container.firstChild).toHaveClass("shadow-lg");
  });
});
