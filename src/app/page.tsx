"use client";

import { useState } from "react";
import { questions } from "../data/questions";
import {
  Button,
  Checkbox,
  Table,
  Textfield,
} from "./recruiting/_components/fields";
import {
  QuestionList,
  QuestionSection,
} from "./recruiting/_components/question";

const departments = ["PM", "Design", "Frontend", "Backend", "HR"];
const days = ["2월 2일 (월)", "2월 3일 (화)", "2월 4일 (수)"];

export default function Home() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState(
    "글자수 제한을 넘겨서 경고가 뜨는지 확인하기 위한 긴 샘플 텍스트입니다.",
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "PM",
  ]);
  const [motivation, setMotivation] = useState("");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  return (
    <main className="flex max-w-xl flex-col gap-8 p-10">
      <Textfield
        label="이름"
        value={name}
        onChange={setName}
        placeholder="홍길동"
      />
      <Textfield
        label="지원 이유 (20자 이내)"
        multiline
        maxLength={20}
        rows={3}
        value={reason}
        onChange={setReason}
      />

      <div className="flex flex-col gap-3">
        <Checkbox label="PM" defaultChecked />
        <Checkbox label="Design" />
        <Checkbox label="Frontend" />
        <Checkbox label="비활성화" disabled />
      </div>

      <div className="flex gap-4">
        <Button icon="prev">이전</Button>
        <Button icon="next">다음</Button>
      </div>
      <Button className="w-fit">완료</Button>

      <QuestionList>
        <QuestionSection
          title={questions[0].title}
          callout={questions[0].callout}
        >
          <div className="flex flex-col gap-3">
            {departments.map((department) => (
              <Checkbox
                key={department}
                label={department}
                checked={selectedDepartments.includes(department)}
                onChange={(e) =>
                  setSelectedDepartments((prev) =>
                    e.target.checked
                      ? [...prev, department]
                      : prev.filter((item) => item !== department),
                  )
                }
              />
            ))}
          </div>
        </QuestionSection>
        <QuestionSection
          title={questions[1].title}
          description={questions[1].description}
        >
          <Textfield
            multiline
            maxLength={500}
            rows={4}
            value={motivation}
            onChange={setMotivation}
          />
        </QuestionSection>
      </QuestionList>

      <Table
        rows={days.map((day) => ({
          id: day,
          label: day,
          cells: [0, 1, 2, 3].map((slot) => {
            const cellId = `${day}-${slot}`;
            return {
              id: cellId,
              "aria-label": `${day} ${slot + 1}번째 시간대`,
              checked: availability[cellId] ?? false,
              onChange: (checked: boolean) =>
                setAvailability((prev) => ({ ...prev, [cellId]: checked })),
            };
          }),
        }))}
      />
    </main>
  );
}
