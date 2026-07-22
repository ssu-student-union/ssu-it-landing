"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "./analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean>;
};

/**
 * next/link를 감싸 클릭 시 GA4 이벤트를 발화하는 클라이언트 leaf 컴포넌트.
 */
export const TrackedLink = ({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackedLinkProps) => {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e);
      }}
    />
  );
};
