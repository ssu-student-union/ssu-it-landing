import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO_OUT } from "../../_lib/ui";

type QuestionSectionProps = {
  /** DOM id. `field-${스키마 키}` 형태로 준다 — `useFormState`(`_lib/hooks/useFormState.ts`)의 스크롤-투-에러가 이 값으로 필드를 찾는다. */
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  callout?: ReactNode;
  children?: ReactNode;
  /** 현재 이 문항을 보여줄지 여부. 토글 시 높이/투명도가 애니메이션된다. */
  visible?: boolean;
  /** mount 시에도 진입 애니메이션을 재생할지. 페이지 로드부터 보이는 문항은 `false`(기본값), 상호작용 후에야 트리에 나타나는 문항은 `true`로 넘긴다. */
  animateOnMount?: boolean;
  className?: string;
};

/** 문항을 감싸는 구조 컴포넌트. 번호는 부모 `QuestionList`가 리셋하는 CSS counter에서 나오고, `visible`에 따라 등장/퇴장을 애니메이션한다. */
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
    className={`text-ink [counter-increment:question] ${
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
          <div
            className={`flex items-start py-8 sm:py-10 ${title ? "gap-2 ps-2 sm:gap-3 sm:ps-3" : ""}`}
          >
            {title && (
              <span
                aria-hidden="true"
                className="shrink-0 font-medium text-xl before:content-[counter(question)'.'] sm:text-2xl md:text-[1.875rem]"
              />
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <p className="font-medium text-xl sm:text-2xl md:text-[1.875rem]">
                  {title}
                </p>
              )}
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
