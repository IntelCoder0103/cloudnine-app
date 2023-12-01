import * as React from "react";
import { ReportFile } from "./Report";

export interface IReportTableProps {
  files: ReportFile[];
}

export function formatFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`;
}

export default function ReportTable(props: IReportTableProps) {
  const { files } = props;
  return (
    <div className="h-[720px] overflow-auto w-full">
      <table className="flex-1 border border-separate" cellPadding={6}>
        <thead>
          <tr className="font-semibold bg-white sticky top-0">
            <td className="">Name</td>
            <td>Path</td>
            <td>Size</td>
            <td>Type</td>
            <td>Created At</td>
            <td>Modified At</td>
          </tr>
        </thead>
        <tbody>
          {files?.map((file, index) => (
            <tr className=" odd:bg-slate-100 even:bg-slate-50" key={index}>
              <td>{file.name}</td>
              <td>{file.path}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>{file.type}</td>
              <td className="text-sm">{file.created}</td>
              <td className="text-sm">{file.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
