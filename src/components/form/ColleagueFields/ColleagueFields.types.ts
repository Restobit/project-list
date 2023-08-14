export type Colleague = {
  name: string;
  position: string;
};

export type ColleaguesData = {
  colleagues: Colleague[];
};

export type ColleagueFieldsProps = ColleaguesData & {
  updateFields: (fields: Partial<ColleaguesData>) => void;
};
