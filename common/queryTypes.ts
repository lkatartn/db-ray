export interface Field<T extends any> {
  name: keyof T;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

export interface QueryResult<T extends any> {
  rows: T[];
  rowCount: number;
  command: string;
  fields: Field<T>[];
}
