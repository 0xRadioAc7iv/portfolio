import type { ReactElement } from "react";
import {
  SiDocker,
  SiGnubash,
  SiGo,
  SiLinux,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

type TechStackCardProps = {
  name: string;
};

export const techIconMap: Record<string, ReactElement> = {
  TypeScript: <SiTypescript />,
  Go: <SiGo />,
  Python: <SiPython />,
  Docker: <SiDocker />,
  "Next.js": <SiNextdotjs />,
  "Node.js": <SiNodedotjs />,
  NestJS: <SiNestjs />,
  React: <SiReact />,
  Redis: <SiRedis />,
  PostgreSQL: <SiPostgresql />,
  AWS: <FaAws />,
  Linux: <SiLinux />,
  "Bash Scripting": <SiGnubash />,
};

export function TechStackCard({ name }: TechStackCardProps) {
  return (
    <div className="chip">
      <span className="text-sm text-[color:var(--ink)]">
        {techIconMap[name]}
      </span>
      <span>{name}</span>
    </div>
  );
}
