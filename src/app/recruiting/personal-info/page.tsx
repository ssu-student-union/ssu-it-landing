"use client";

import { useRouter } from "next/navigation";
import {
  formatInterviewDate,
  formatSlotLabel,
  INTERVIEW_DATES,
  INTERVIEW_PERIOD_MAX,
  INTERVIEW_PERIOD_MIN,
  isWeekendDate,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../data/recruitingSchedule";
import {
  gradeLevels,
  gradeSemesters,
  personalInfoConsent,
} from "../../../data/recruitingStepOne";
import {
  Button,
  Checkbox,
  Table,
  Textfield,
  TimeRangeList,
} from "../_components/fields";
import {
  FieldError,
  QuestionList,
  QuestionSection,
} from "../_components/question";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { type StepOneFormData, stepOneSchema } from "./schema";

const weekdayInterviewDates = INTERVIEW_DATES.filter((d) => !isWeekendDate(d));
const weekendInterviewDates = INTERVIEW_DATES.filter(isWeekendDate);

type Availability = Partial<Record<string, string[]>>;

const toggleSlot = (
  selection: Availability,
  day: string,
  slot: string,
  checked: boolean,
): Availability => {
  const current = selection[day] ?? [];
  const next = checked
    ? [...current, slot]
    : current.filter((item) => item !== slot);
  return { ...selection, [day]: next };
};

const initialValues: StepOneFormData = {
  agree: false,
  name: "",
  studentId: "",
  phone: "",
  college: "",
  department: "",
  grade: "",
  interviewAvailability: {},
  noAvailableTime: false,
  otherTime: [],
};

export default function RecruitingStepOnePage() {
  const router = useRouter();
  const {
    values,
    setField,
    setValues,
    errors,
    submitted,
    fieldError,
    validate,
  } = useFormState(
    () => stepOneSchema,
    initialValues,
    RECRUITING_STORAGE_KEYS.stepOne,
  );

  const handleNext = () => {
    if (validate().success) {
      router.push("/recruiting/motivation");
    }
  };

  // 시간대 선택과 "가능한 시간이 없음"은 상호배타적: 시간을 고르면 "없음"이
  // 자동으로 풀리고, "없음"을 체크하면 골라둔 시간이 전부 지워진다.
  const handleSlotChange = (day: string, slot: string, checked: boolean) =>
    setValues((prev) => ({
      ...prev,
      interviewAvailability: toggleSlot(
        prev.interviewAvailability,
        day,
        slot,
        checked,
      ),
      noAvailableTime: checked ? false : prev.noAvailableTime,
    }));

  const handleNoAvailableTimeChange = (checked: boolean) =>
    setValues((prev) => ({
      ...prev,
      noAvailableTime: checked,
      interviewAvailability: checked ? {} : prev.interviewAvailability,
      otherTime: checked ? prev.otherTime : [],
    }));

  return (
    <StepLayout currentStep={1} title="1. 개인정보 동의 및 작성">
      <div className="rounded-xl bg-surface p-5 text-black text-base leading-relaxed sm:p-8 sm:text-lg">
        <p className="font-semibold">{personalInfoConsent.heading}</p>
        <div className="mt-4 flex flex-col gap-1">
          {personalInfoConsent.body}
        </div>
      </div>

      <div id="field-agree">
        <Checkbox
          label="위 내용에 동의합니다."
          checked={values.agree}
          error={Boolean(fieldError("agree"))}
          onChange={(e) => setField("agree", e.target.checked)}
        />
        <div className="mt-2">
          <FieldError message={fieldError("agree")} />
        </div>
      </div>

      <QuestionList>
        <QuestionSection id="field-name" title="이름을 작성해주세요.">
          <Textfield
            value={values.name}
            onChange={(v) => setField("name", v)}
            placeholder="김숭실"
            error={errors.name?.[0]}
            submitted={submitted}
          />
        </QuestionSection>
        <QuestionSection id="field-studentId" title="학번을 작성해주세요.">
          <Textfield
            value={values.studentId}
            onChange={(v) => setField("studentId", v)}
            placeholder="20240000"
            error={errors.studentId?.[0]}
            submitted={submitted}
          />
        </QuestionSection>
        <QuestionSection id="field-phone" title="전화번호를 작성해주세요.">
          <Textfield
            value={values.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="010-1234-5678"
            error={errors.phone?.[0]}
            submitted={submitted}
          />
        </QuestionSection>
        <QuestionSection id="field-college" title="소속 단과대학을 적어주세요.">
          <Textfield
            value={values.college}
            onChange={(v) => setField("college", v)}
            placeholder="사회과학대학"
            error={errors.college?.[0]}
            submitted={submitted}
          />
        </QuestionSection>
        <QuestionSection
          id="field-department"
          title="소속 학과(부)를 작성해주세요."
        >
          <Textfield
            value={values.department}
            onChange={(v) => setField("department", v)}
            placeholder="글로벌미디어학부, 법학과"
            error={errors.department?.[0]}
            submitted={submitted}
          />
        </QuestionSection>
        <QuestionSection id="field-grade" title="학년을 선택해주세요.">
          <Table
            variant="radio"
            name="grade"
            columns={gradeSemesters}
            error={Boolean(fieldError("grade"))}
            rows={gradeLevels.map((level) => ({
              id: level,
              label: level,
              cells: gradeSemesters.map((semester) => {
                const cellValue = `${level}-${semester}`;
                return {
                  id: cellValue,
                  "aria-label": `${level} ${semester}`,
                  checked: values.grade === cellValue,
                  onChange: () => setField("grade", cellValue),
                };
              }),
            }))}
          />
          <div className="mt-2">
            <FieldError message={fieldError("grade")} />
          </div>
        </QuestionSection>
        <QuestionSection
          id="field-interviewAvailability"
          title="면접 가능한 시간을 선택해주세요."
        >
          <Table
            cornerLabel="평일"
            error={Boolean(fieldError("interviewAvailability"))}
            columns={WEEKDAY_SLOT_START_TIMES.map(formatSlotLabel)}
            rows={weekdayInterviewDates.map((day) => ({
              id: day,
              label: formatInterviewDate(day),
              cells: WEEKDAY_SLOT_START_TIMES.map((slot) => ({
                id: `${day}-${slot}`,
                "aria-label": `${formatInterviewDate(day)} ${slot}`,
                checked: (values.interviewAvailability[day] ?? []).includes(
                  slot,
                ),
                disabled: values.noAvailableTime,
                onChange: (checked: boolean) =>
                  handleSlotChange(day, slot, checked),
              })),
            }))}
          />
          <Table
            cornerLabel="주말"
            className="mt-8"
            error={Boolean(fieldError("interviewAvailability"))}
            columns={WEEKEND_SLOT_START_TIMES.map(formatSlotLabel)}
            rows={weekendInterviewDates.map((day) => ({
              id: day,
              label: formatInterviewDate(day),
              cells: WEEKEND_SLOT_START_TIMES.map((slot) => ({
                id: `${day}-${slot}`,
                "aria-label": `${formatInterviewDate(day)} ${slot}`,
                checked: (values.interviewAvailability[day] ?? []).includes(
                  slot,
                ),
                disabled: values.noAvailableTime,
                onChange: (checked: boolean) =>
                  handleSlotChange(day, slot, checked),
              })),
            }))}
          />
          <Checkbox
            label="가능한 시간이 없음"
            checked={values.noAvailableTime}
            onChange={(e) => handleNoAvailableTimeChange(e.target.checked)}
            className="mt-4"
          />
          <div className="mt-2">
            <FieldError message={fieldError("interviewAvailability")} />
          </div>
        </QuestionSection>
        <QuestionSection
          id="field-otherTime"
          visible={values.noAvailableTime}
          title="위에서 가능한 시간이 없다고 체크한 경우, 면접 가능한 일자 및 시간을 작성해주세요. (대면 기준)"
        >
          <TimeRangeList
            value={values.otherTime}
            onChange={(v) => setField("otherTime", v)}
            min={INTERVIEW_PERIOD_MIN}
            max={INTERVIEW_PERIOD_MAX}
            error={fieldError("otherTime")}
            submitted={submitted}
          />
        </QuestionSection>
      </QuestionList>

      <div className="flex items-center justify-end gap-4">
        <Button icon="next" onClick={handleNext}>
          다음
        </Button>
      </div>
    </StepLayout>
  );
}
