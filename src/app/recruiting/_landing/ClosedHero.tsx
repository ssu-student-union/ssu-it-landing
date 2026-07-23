"use client";

import { type FormEvent, useState } from "react";
import { Button } from "../../../common/Button";
import { closedNotice } from "./content";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/**
 * 지원 기간이 아닐 때 Hero 자리를 대체하는 마감 안내. 우주 배경 없이 일반
 * 섹션으로 렌더되며, 다음 기수 알림 이메일을 Notion 별도 DB에 저장한다.
 */
export const ClosedHero = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
        className="mx-auto mt-8 flex max-w-md gap-2"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={closedNotice.emailPlaceholder}
          disabled={status === "submitting"}
          className="flex-1 rounded-xl border border-inactive px-4 py-2.5 text-ink placeholder:text-inactive"
        />
        <Button gradient type="submit" disabled={status === "submitting"}>
          {closedNotice.submitLabel}
        </Button>
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
