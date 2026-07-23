import type { KeyValue } from "../content";

type KeyValueRowProps = KeyValue & {
  /**
   * 타임라인처럼 이 행의 점에서 다음 행의 점까지 세로선을 잇는다(마지막 항목은 false).
   * 행 간격은 flex gap이 아니라 각 행의 아래 패딩(pb)으로 줘야 `h-[calc(100%-…)]`가
   * 다음 점을 정확히 향한다.
   */
  connector?: boolean;
  className?: string;
};

/**
 * 불릿 + 라벨 / 값 행. 점을 절대배치해 라벨과 값이 같은 왼쪽 여백(pl-6)에서 시작하도록 맞춘다.
 * 모바일은 라벨·값을 세로로, sm+는 한 줄로 흘린다. 괄호 보조는 tone에 따라 muted/emphasis로 렌더.
 * `connector`를 켜면 모집 일정 타임라인처럼 점끼리 잇는(점에서 0.75rem 띄운) 세로선을 그린다.
 */
export const KeyValueRow = ({
  label,
  value,
  aside,
  dimmed,
  connector,
  className,
}: KeyValueRowProps) => (
  <li
    className={`relative flex flex-col gap-2 pl-6 sm:flex-row sm:items-baseline ${
      className ?? ""
    }`}
  >
    <span
      aria-hidden="true"
      className="absolute top-2 left-2 size-1.25 rounded-full bg-ink sm:top-2.5 lg:top-3"
    />
    {connector && (
      // 점 중심(left 0.5rem+반지름, top 점상단+반지름)에서 위·아래로 0.75rem씩 띄운 선분.
      <span
        aria-hidden="true"
        className="absolute top-[calc(1.25rem+2.5px)] left-2.5 h-[calc(100%-1.5rem)] w-px bg-line sm:top-[calc(1.375rem+2.5px)] lg:top-[calc(1.5rem+2.5px)]"
      />
    )}
    <span className="whitespace-nowrap font-bold text-base text-ink sm:text-lg lg:text-xl">
      {label}
    </span>
    <span
      className={`font-medium text-base sm:text-lg lg:text-xl ${
        dimmed ? "text-inactive" : "text-ink"
      }`}
    >
      {value}
      {aside && (
        <span
          className={
            aside.tone === "muted" ? "font-light text-muted" : "font-bold"
          }
        >
          {" "}
          {aside.text}
        </span>
      )}
    </span>
  </li>
);
