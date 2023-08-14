import { Colleague } from "../components/form/ColleagueFields/ColleagueFields.types";

export interface Project {
  projectName: string;
  title: string;
  colleagues: Colleague[];
  links: { url: string }[];
}
