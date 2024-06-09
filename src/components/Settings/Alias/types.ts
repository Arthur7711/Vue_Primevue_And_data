export interface IItem {
  alias: string;
  origins: string[];
}

export interface IProps {
  dataDepartment: IItem[];
  dataPosition: IItem[];
}
