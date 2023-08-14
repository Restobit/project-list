export type ProjectData = {
  projectName: string;
  title?: string;
};

export type ProjectFormProps = ProjectData & {
  updateFields: (fields: Partial<ProjectData>) => void;
};
