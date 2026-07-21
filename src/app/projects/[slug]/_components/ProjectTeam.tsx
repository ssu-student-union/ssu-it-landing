import Image from "next/image";
import teamIcon from "../../../../assets/icons/team.svg";
import type { TeamRole } from "../../../../data/projects";

type ProjectTeamProps = {
  team: TeamRole[];
};

export const ProjectTeam = ({ team }: ProjectTeamProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.25rem] border border-[#cdc4c4] p-6 sm:gap-5 sm:p-8 lg:p-10 min-[1440px]:p-16">
      <div className="flex items-center gap-2 sm:gap-3 min-[1440px]:gap-0.5">
        <Image
          src={teamIcon}
          alt=""
          width={70}
          height={70}
          className="h-10 w-auto min-[1440px]:h-[4.375rem]"
        />
        <h2 className="font-bold text-xl text-white sm:text-2xl lg:text-2xl min-[1440px]:text-[2.625rem]">
          팀 소개
        </h2>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4 min-[1440px]:gap-5">
        {team.map((member) => {
          const hasMultipleNames = member.name.includes(",");

          return (
            <div key={`${member.role}-${member.name}`}>
              {hasMultipleNames ? (
                <>
                  <p className="font-bold text-base text-white sm:text-lg lg:text-lg min-[1440px]:text-[1.875rem]">
                    {member.role}
                  </p>
                  <p className="font-bold text-sm text-white sm:text-base lg:text-base min-[1440px]:text-2xl">
                    {member.name}
                  </p>
                </>
              ) : (
                <p className="font-bold text-base text-white sm:text-lg lg:text-lg min-[1440px]:text-[1.75rem]">
                  {member.role} {member.name}
                </p>
              )}
              <p className="whitespace-pre-line text-sm text-[#cccccc] sm:text-base min-[1440px]:text-2xl">
                {member.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
