import type { TeamRole } from "../../../../data/projects";

type ProjectTeamProps = {
  team: TeamRole[];
};

export const ProjectTeam = ({ team }: ProjectTeamProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[1.25rem] border border-[#cdc4c4] p-6 sm:gap-5 sm:p-8 lg:p-10">
      <h2 className="font-bold text-xl text-white sm:text-2xl lg:text-2xl min-[1440px]:text-[1.75rem]">
        팀 소개
      </h2>
      <div className="flex flex-col gap-3 sm:gap-4">
        {team.map((member) => (
          <div key={`${member.role}-${member.name}`}>
            <p className="font-bold text-base text-white sm:text-lg lg:text-lg min-[1440px]:text-xl">
              {member.role} {member.name}
            </p>
            <p className="text-sm text-[#cccccc] sm:text-base">
              {member.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
