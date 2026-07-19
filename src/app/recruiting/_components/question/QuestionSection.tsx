import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO_OUT } from "../../_lib/ui";

type QuestionSectionProps = {
  /**
   * DOM id. 관례상 `field-${스키마 키}` 형태로 준다. `useFormState`의
   * 스크롤-투-에러(`_lib/useFormState.ts`)가 zod `fieldErrors`의 키로
   * `document.getElementById(\`field-${key}\`)`를 찾기 때문에, 이 값이
   * 해당 스키마 필드명과 정확히 일치하지 않으면 자동 스크롤이 조용히
   * 동작하지 않는다.
   */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  callout?: ReactNode;
  children?: ReactNode;
  /** 현재 이 문항을 보여줄지 여부. 토글 시 높이/투명도가 애니메이션된다. */
  visible?: boolean;
  /**
   * 이 인스턴스가 처음 mount될 때도 진입 애니메이션을 재생할지 여부.
   * 기본값 `false`는 Step1처럼 페이지 로드 시점부터 항상 보이는 문항이
   * 로드와 동시에 애니메이션되는 걸 막기 위함이다. 사용자 상호작용 이후에야
   * 트리에 처음 나타나는 문항(예: `QuestionRenderer`로 렌더링되는 Step2의
   * 부서별 문항)은 mount 자체가 곧 "등장"이므로 `true`로 넘겨야 한다.
   */
  animateOnMount?: boolean;
  className?: string;
};

/**
 * 리크루팅 폼의 모든 문항이 공통으로 감싸는 구조 컴포넌트. 번호가 매겨진
 * `<li>`를 렌더링하고(번호 자체는 prop이 아니라 부모 `QuestionList`가
 * 리셋하는 CSS counter에서 나옴) `visible`에 따라 등장/퇴장을 애니메이션한다.
 */
export const QuestionSection = ({
  id,
  title,
  description,
  callout,
  children,
  visible = true,
  animateOnMount = false,
  className,
}: QuestionSectionProps) => (
  <li
    id={id}
    className={`text-black [counter-increment:question] ${
      visible ? "" : "border-t-0!"
    } ${className ?? ""}`}
  >
    <AnimatePresence initial={!animateOnMount}>
      {visible && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_EXPO_OUT }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-2 py-8 ps-2 sm:gap-3 sm:py-10 sm:ps-3">
            <span
              aria-hidden="true"
              className="shrink-0 font-medium text-xl before:content-[counter(question)'.'] sm:text-2xl md:text-[1.875rem]"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xl sm:text-2xl md:text-[1.875rem]">
                {title}
              </p>
              {description && (
                <div className="mt-4 text-muted text-sm leading-relaxed sm:mt-6 sm:text-xl">
                  {description}
                </div>
              )}
              {children && <div className="mt-6 sm:mt-8">{children}</div>}
              {callout && (
                <div className="mt-8 rounded-xl bg-surface p-5 text-sm leading-relaxed sm:mt-10 sm:p-8 sm:text-xl">
                  {callout}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </li>
);
