"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useRef,
  useState,
} from "react";

type AccordionContextValue = {
  openId: string | null;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

type AccordionProps = {
  children: ReactNode;
  className?: string;
  defaultOpenId?: string;
};

/**
 * 아코디언 그룹. 하나의 아이템이 열리면 나머지는 자동으로 닫힌다.
 * 여러 섹션(FAQ 등)에서 재사용할 수 있도록 레이아웃/스타일은 각 AccordionItem에서 지정한다.
 */
export const Accordion = ({
  children,
  className,
  defaultOpenId,
}: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

type AccordionItemProps = {
  id?: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
};

/**
 * trigger 내부에서 열림 상태에 따라 스타일을 다르게 주고 싶다면(예: 화살표 회전),
 * 버튼에 aria-expanded가 반영되므로 `group-aria-expanded:` variant를 사용하면 된다.
 * (버튼 자체에 group 클래스가 이미 적용되어 있다.)
 */
export const AccordionItem = ({
  id,
  trigger,
  children,
  className,
  triggerClassName,
  panelClassName,
}: AccordionItemProps) => {
  const generatedId = useId();
  const itemId = id ?? generatedId;

  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem은 Accordion 내부에서만 사용할 수 있습니다.");
  }

  const isOpen = context.openId === itemId;
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => context.toggle(itemId)}
        className={`group w-full cursor-pointer text-left ${triggerClassName ?? ""}`}
      >
        {trigger}
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? (panelRef.current?.scrollHeight ?? 1000) : 0,
        }}
      >
        <div ref={panelRef} className={panelClassName}>
          {children}
        </div>
      </div>
    </div>
  );
};
