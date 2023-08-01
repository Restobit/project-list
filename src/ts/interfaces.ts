export interface Colleague {
  name: string;
  matchId: number;
  position: string;
}

export interface Project {
  id: number;
  name: string;
  title?: string;
  colleagues?: Colleague[];
  link?: string;
}

export interface ProjectFormProps {
  step: number;
  data: Project;
  setProjectFormData: React.Dispatch<React.SetStateAction<Project>>;
}

export interface FormInput {
  matchId: number;
  label: string;
  inputName: string;
}

export interface DynamicFormSettings {
  labelTitle: string;
  inputName: string;
}

export interface DynamicFormProps {
  settings: DynamicFormSettings[];
  data: Project;
  step: number;
  setProjectFormData: React.Dispatch<React.SetStateAction<Project>>;
}
