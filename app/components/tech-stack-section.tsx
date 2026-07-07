import { TechStackCard } from "./tech-stack-card";

const techStacks = [
  "Go",
  "TypeScript",
  "Node.js",
  "Python",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "Linux",
  "Bash Scripting",
  "React",
  "Next.js",
];

export function TechStackSection() {
  return (
    <div className="chip-cloud">
      {techStacks.map((tech) => (
        <TechStackCard key={tech} name={tech} />
      ))}
    </div>
  );
}
