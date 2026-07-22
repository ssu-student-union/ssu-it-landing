import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FieldConfig } from "../../_lib/schema";
import { FormRenderer } from "./FormRenderer";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // biome-ignore lint/performance/noImgElement: 테스트 목업이라 next/image 최적화가 필요 없다
    <img alt="" {...props} />
  ),
}));
vi.mock("../../../../assets/icons/upload.svg", () => ({
  default: "upload-icon-stub",
}));

const fileField: FieldConfig = {
  type: "file",
  key: "portfolioFile",
  sharedErrorKey: "portfolioLink",
};

function renderFileField(errors: Partial<Record<string, string[]>>) {
  return render(
    <FormRenderer<Record<string, unknown>>
      fields={[fileField]}
      values={{}}
      errors={errors}
      submitted
      fieldError={(key) => errors[key]?.[0]}
      setValues={() => {}}
    />,
  );
}

describe("FormRenderer — file 필드의 sharedErrorKey", () => {
  it("자체 에러가 없고 sharedErrorKey 쪽에 에러가 있으면 그 메시지를 보여준다", () => {
    renderFileField({
      portfolioLink: ["포트폴리오 링크 또는 파일 중 하나는 필수예요."],
    });
    expect(
      screen.getByText("포트폴리오 링크 또는 파일 중 하나는 필수예요."),
    ).toBeInTheDocument();
  });

  it("자체 에러가 있으면 sharedErrorKey보다 우선한다", () => {
    renderFileField({
      portfolioFile: ["파일 크기는 20MB를 초과할 수 없어요."],
      portfolioLink: ["포트폴리오 링크 또는 파일 중 하나는 필수예요."],
    });
    expect(
      screen.getByText("파일 크기는 20MB를 초과할 수 없어요."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("포트폴리오 링크 또는 파일 중 하나는 필수예요."),
    ).not.toBeInTheDocument();
  });

  it("둘 다 에러가 없으면 에러 문구가 없다", () => {
    renderFileField({});
    expect(screen.getByText("파일 업로드")).toBeInTheDocument();
    expect(
      screen.queryByText("포트폴리오 링크 또는 파일 중 하나는 필수예요."),
    ).not.toBeInTheDocument();
  });
});
