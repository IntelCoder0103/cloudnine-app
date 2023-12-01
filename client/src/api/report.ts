const BASE_API = "http://localhost:3001/report";

export const fetchReport = async (path: string, selectedType: string) => {
  const res = await fetch(`${BASE_API}?path=${path}&type=${selectedType}`);

  if (res.status !== 200) throw Error("Invalid Request");
  
  return (await res.json()) as ReportResponse;
};
