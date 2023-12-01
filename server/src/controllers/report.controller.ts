import { RequestHandler, Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();
async function _getAllFiles(dir: string) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let fileStatsArray: {
      size: number;
      name: string;
      type: string;
      path: string;
      created: Date;
      modified: Date;
    }[] = [];
    for (const file of files) {
      const filePath = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        fileStatsArray = fileStatsArray.concat(await _getAllFiles(filePath));
      } else {
        const stat = await fs.stat(filePath);
        const fileType = file.name.match(/.*\.(\w*)$/)?.[1] || '';
        fileStatsArray.push({
          path: dir,
          size: stat.size,
          name: file.name,
          type: fileType.toUpperCase(),
          created: stat.birthtime,
          modified: stat.mtime,
        });
      }
    }
  
    return fileStatsArray;
  } catch (e) {
    return [];
  }
}
export const getReport: RequestHandler = async (req, res) => {
  const { path = "", type = "" } = req.query;
  const pathStr = path.toString();

  try {
    // Check if the path is valid
    await fs.access(pathStr);
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: "Invalid Directory" });
    return;
  }

  const stats = await _getAllFiles(pathStr);
  const total = stats.length;
  const countsPerType: { [key: string]: number } = {};
  for (const stat of stats) {
    countsPerType[stat.type] = (countsPerType[stat.type] || 0) + 1;
  }
  const files = stats
    .filter((stat) => !type || stat.type === type)
    .slice(0, 100);

  res.json({
    total,
    countsPerType,
    files,
  });
};

router.get("/", getReport);

export default router;
