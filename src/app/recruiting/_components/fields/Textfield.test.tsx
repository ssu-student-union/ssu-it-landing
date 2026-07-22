import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textfield } from "./Textfield";

describe("Textfield", () => {
  it("입력 시 onChange를 호출한다", async () => {
    const onChange = vi.fn();
    render(<Textfield value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("submitted 상태에서 error가 있으면 에러 메시지를 보여준다", () => {
    render(
      <Textfield value="" onChange={vi.fn()} error="필수예요." submitted />,
    );
    expect(screen.getByText("필수예요.")).toBeInTheDocument();
  });

  it("submitted가 아니고 아직 blur하지 않았으면 에러를 숨긴다", () => {
    render(<Textfield value="" onChange={vi.fn()} error="필수예요." />);
    expect(screen.queryByText("필수예요.")).not.toBeInTheDocument();
  });

  it("maxLength가 있으면 글자 수 카운터를 보여준다", () => {
    render(<Textfield value="abc" onChange={vi.fn()} maxLength={10} />);
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("label을 지정하면 렌더링한다", () => {
    render(<Textfield value="" onChange={vi.fn()} label="이름" />);
    expect(screen.getByText("이름")).toBeInTheDocument();
  });
});
