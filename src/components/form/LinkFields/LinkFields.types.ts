export type LinkData = {
  links: Link[];
};

export type LinkFieldsProps = LinkData & {
  updateFields: (fields: Partial<LinkData>) => void;
};

export type Link = {
  url: string;
};
