export interface Technology {
  name: string;
  /** Short monogram rendered inside the badge tile. */
  mark: string;
}

export const TECHNOLOGIES: Technology[] = [
  { name: "Next.js", mark: "N" },
  { name: "React", mark: "Re" },
  { name: "Node.js", mark: "Nd" },
  { name: "Python", mark: "Py" },
  { name: "Tailwind CSS", mark: "Tw" },
  { name: "PostgreSQL", mark: "Pg" },
  { name: "MongoDB", mark: "Mo" },
  { name: "Flutter", mark: "Fl" },
  { name: "TypeScript", mark: "Ts" },
  { name: "Docker", mark: "Dk" },
  { name: "AWS", mark: "Aw" },
  { name: "Firebase", mark: "Fb" },
  { name: "Vue.js", mark: "Vu" },
  { name: "Angular", mark: "An" },
  { name: "PHP", mark: "Php" },
  { name: "Laravel", mark: "La" },
  { name: "MySQL", mark: "My" },
  { name: "Supabase", mark: "Sb" },
  { name: "Three.js", mark: "3js" },
];
