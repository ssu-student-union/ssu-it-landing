"use client";

import Image from "next/image";
import { useState } from "react";
import chevronWhiteIcon from "../../../assets/icons/chevron_white.svg";
import { PROJECTS } from "../../../data/projects";
import { ProjectCard } from "./ProjectCard";

const ITEMS_PER_PAGE = 4;

export const ProjectList = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(PROJECTS.length / ITEMS_PER_PAGE));
  const visibleProjects = PROJECTS.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );

  const goPrev = () => setPage((prev) => Math.max(0, prev - 1));
  const goNext = () => setPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-10 sm:gap-14 lg:gap-16">
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:gap-x-14">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      <div className="flex items-center gap-6 sm:gap-8">
        <button
          type="button"
          onClick={goPrev}
          disabled={page === 0}
          aria-label="이전 페이지"
          className="disabled:opacity-30"
        >
          <Image
            src={chevronWhiteIcon}
            alt=""
            width={11}
            height={20}
            className="rotate-180 cursor-pointer"
          />
        </button>

        <div className="flex items-center gap-6 sm:gap-8">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={`page-${index + 1}`}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`${index + 1} 페이지`}
              aria-current={page === index}
              className={
                page === index
                  ? "flex size-6 items-center justify-center rounded-full bg-[#ededed] font-bold text-[#454a4d] text-sm sm:size-7 sm:text-lg lg:size-7 lg:text-lg 1440:size-7 1440:text-xl"
                  : "font-bold text-sm text-white sm:text-lg lg:text-lg 1440:text-xl"
              }
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={page === totalPages - 1}
          aria-label="다음 페이지"
          className="disabled:opacity-30"
        >
          <Image
            src={chevronWhiteIcon}
            alt=""
            width={11}
            height={20}
            className="cursor-pointer"
          />
        </button>
      </div>
    </div>
  );
};
