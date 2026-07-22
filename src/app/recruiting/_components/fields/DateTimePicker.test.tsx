import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateTimePicker } from "./DateTimePicker";

describe("DateTimePicker", () => {
  it("값 변경 시 onChange를 호출한다", () => {
    const onChange = vi.fn();
    render(<DateTimePicker value="" onChange={onChange} />);
    const input = document.querySelector('input[type="datetime-local"]');
    if (!input) throw new Error("datetime input not found");
    fireEvent.change(input, { target: { value: "2026-08-01T19:00" } });
    expect(onChange).toHaveBeenCalledWith("2026-08-01T19:00");
  });

  it("submitted 상태에서 error가 있으면 에러 메시지를 보여준다", () => {
    render(
      <DateTimePicker
        value=""
        onChange={vi.fn()}
        error="시간을 선택해주세요."
        submitted
      />,
    );
    expect(screen.getByText("시간을 선택해주세요.")).toBeInTheDocument();
  });

  it("label을 지정하면 렌더링한다", () => {
    render(<DateTimePicker value="" onChange={vi.fn()} label="면접 시간" />);
    expect(screen.getByText("면접 시간")).toBeInTheDocument();
  });
});
