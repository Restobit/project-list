import { Project } from "../ts/interfaces";

export const asyncFetchProjects = async (): Promise<Project[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const projects: Project[] = [];
  return projects;
};
