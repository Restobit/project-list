import { Project } from "../../ts/interfaces";

export type CardInfoProps = {
  showCardInfo: boolean;
  handleCloseShowInfo: () => void;
  project: Project;
};
