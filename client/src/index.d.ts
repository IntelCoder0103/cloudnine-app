type ReportFile = {
  path: string;
  name: string;
  size: number;
  created: string;
  modified: string;
  type: string;
};
type ReportResponse = {
  total: number;
  countsPerType: { [key: string]: number };
  files: ReportFile[];
};
