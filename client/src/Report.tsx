import * as React from "react";
import FolderSelection from "./FolderSelection";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import {
  Chart,
  GoogleChartWrapper,
  ReactGoogleChartEvent,
} from "react-google-charts";
import ReportTable from "./ReportTable";

export interface IReportProps {}

const BASE_API = "http://localhost:3001/report";

export type ReportFile = {
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

const fetchReport = async (path: string, selectedType: string) => {
  const res = await fetch(`${BASE_API}?path=${path}&type=${selectedType}`);
  if (res.status !== 200) throw Error("Invalid Request");
  return (await res.json()) as ReportResponse;
};

export default function Report(props: IReportProps) {
  const location = useLocation();
  const path = new URLSearchParams(location.search).get("path") || "";
  const [selectedType, setSelectedType] = React.useState("");

  React.useEffect(() => {
    setSelectedType('');
  }, [path]);

  const { isFetching, isError, data } = useQuery(
    ["reports", path, selectedType],
    () => fetchReport(path, selectedType),
    {
      enabled: Boolean(path),
    }
  );
  const { total = 0, countsPerType = {}, files = [] } = data || {};
  const chartData = [
    ["Counts", "Counts Per Type"],
    ...Object.entries(countsPerType),
  ];

  const handleSelect = (chart: GoogleChartWrapper) => {
    const selection = chart.getChart().getSelection();
    if (selection.length <= 0) {
      setSelectedType("");
      return;
    }
    const { row } = selection[0];
    const [type] = chartData[row + 1];
    setSelectedType(type);
  };
  const chartEvents: ReactGoogleChartEvent[] = [
    {
      eventName: "select",
      callback: ({ chartWrapper }) => handleSelect(chartWrapper),
    },
  ];
  return (
    <div>
      <div className="p-4  bg-slate-800 shadow-lg">
        <FolderSelection defaultPath={path} />
      </div>
      <div className="container pt-8 m-auto">
        {isFetching && <div className="text-slate-500 center">Loading...</div>}
        {isError && (
          <div className="text-red-500 center">Error: Invalid Path</div>
        )}
        {!isFetching && !isError && (
          <div className="flex gap-8">
            <div className="w-[30rem]">
              <div className="text-lg">Found<span className="text-green-500 font-semibold"> {total} </span>files</div>
              <Chart
                chartType="PieChart"
                data={chartData}
                width="100%"
                height={300}
                options={{
                  title: "Counts per type",
                }}
                chartEvents={chartEvents}
              />
              <Chart
                chartType="BarChart"
                data={chartData}
                width="100%"
                height={400}
                options={{
                  title: "Counts per type",
                  legend: {
                    position: "bottom",
                  },
                }}
                chartEvents={chartEvents}
              />
            </div>
            <div className="flex-1">
              <div className="text-2xl mb-4">
                {selectedType ? countsPerType[selectedType] : total}{' '}
                <span className="text-blue-500">{selectedType}</span> files{' '}
                <span className="text-base text-gray-400">
                  (showing {files.length} files)
                </span>
              </div>
              <ReportTable files={files} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
