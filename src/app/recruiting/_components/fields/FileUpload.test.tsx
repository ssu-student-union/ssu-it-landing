import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileUpload } from "./FileUpload";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // biome-ignore lint/performance/noImgElement: 테스트 목업이라 next/image 최적화가 필요 없다
    <img alt="" {...props} />
  ),
}));
vi.mock("../../../../assets/icons/upload.svg", () => ({
  default: "upload-icon-stub",
}));

describe("FileUpload", () => {
  it("파일을 선택하면 onChange를 호출한다", async () => {
    const onChange = vi.fn();
    render(<FileUpload file={null} onChange={onChange} />);
    const file = new File(["content"], "portfolio.pdf", {
      type: "application/pdf",
    });
    const input = document.querySelector('input[type="file"]');
    if (!input) throw new Error("file input not found");
    await userEvent.upload(input as HTMLInputElement, file);
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it("파일이 있으면 파일명과 삭제 버튼을 보여준다", () => {
    const file = new File(["content"], "portfolio.pdf");
    render(<FileUpload file={file} onChange={vi.fn()} />);
    expect(screen.getByText("portfolio.pdf")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("삭제 버튼을 누르면 onChange(null)을 호출한다", async () => {
    const onChange = vi.fn();
    const file = new File(["content"], "portfolio.pdf");
    render(<FileUpload file={file} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "삭제" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("maxSize가 있으면 파일 크기 대비 제한을 함께 보여준다", () => {
    const file = new File(["content"], "portfolio.pdf");
    render(
      <FileUpload file={file} onChange={vi.fn()} maxSize={20 * 1024 * 1024} />,
    );
    expect(screen.getByText(/20MB/)).toBeInTheDocument();
  });
});
