"use client";

import { type FormEvent, useState } from "react";
import { z } from "zod";
import { CtaButton } from "../../../common/CtaButton";
import { Textfield } from "../_components/fields";
import { closedNotice } from "./content";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아니에요.");

/**
 * 지원 기간이 아닐 때 Hero 자리를 대체하는 마감 안내. 우주 배경 없이 일반
 * 섹션으로 렌더되며, 다음 기수 알림 이메일을 Notion 별도 DB에 저장한다.
 */
export const ClosedHero = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const emailResult = emailSchema.safeParse(email);
  const emailError = emailResult.success
    ? undefined
    : emailResult.error.issues[0]?.message;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!emailResult.success) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/recruiting/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="w-full px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      <h1 className="font-bold text-3xl leading-snug sm:text-5xl">
        <span className="bg-gradient-to-r from-[#299ed8] to-[#165372] bg-clip-text text-transparent">
          {closedNotice.headlineLines[0]}
        </span>
        <br />
        {closedNotice.headlineLines[1]}
      </h1>
      <p className="mt-4 font-semibold text-ink text-lg sm:text-xl">
        {closedNotice.nextRoundLabel}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-md items-start gap-2"
      >
        <Textfield
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={closedNotice.emailPlaceholder}
          disabled={status === "submitting"}
          error={emailError}
          submitted={submitted}
          className="min-w-0 flex-1 text-left"
        />
        <CtaButton type="submit" disabled={status === "submitting"}>
          {closedNotice.submitLabel}
        </CtaButton>
      </form>

      {status === "success" && (
        <p className="mt-3 text-brand text-sm">신청이 완료됐어요!</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-red-500 text-sm">
          신청에 실패했어요. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </section>
  );
};
