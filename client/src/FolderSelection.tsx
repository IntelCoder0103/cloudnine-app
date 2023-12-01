import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
interface IFolderSelectionProps{
  defaultPath: string;
}
const FolderSelection = ({ defaultPath }: IFolderSelectionProps) => {
  const [folderPath, setFolderPath] = useState<string>(defaultPath);
  // const location = useLocation();
  const navigate = useNavigate();
  // const path = new URLSearchParams(location.search).get('path') || '';

  // useEffect(() => {
  //   setFolderPath(decodeURIComponent(path));
  // }, [path]);

  const handleFolderPathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFolderPath(event.target.value);
  };

  const handleSubmit = () => {
    navigate(`/?path=${encodeURIComponent(folderPath)}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key == 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="m-4">
      <div className="flex">
        <input
          type="text"
          value={folderPath}
          onChange={handleFolderPathChange}
          placeholder="Input your path here."
          className="p-4 outline-none rounded-s-xl flex-grow"
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-slate-600 text-white p-4 cursor-pointer rounded-e-xl"
          onClick={handleSubmit}
        >
          Get Report
        </button>
      </div>
    </div>
  );
};

export default FolderSelection;
