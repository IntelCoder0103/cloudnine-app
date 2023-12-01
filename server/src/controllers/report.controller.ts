import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();
async function getAllFiles(dir: string) {
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
        fileStatsArray = fileStatsArray.concat(await getAllFiles(filePath));
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
router.get("/", async (req, res) => {
  let { path = "", type = "" } = req.query;
  path = path.toString();

  try {
    // Check if the path is valid
    await fs.access(path);
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: "Invalid Directory" });
    return;
  }

  const stats = await getAllFiles(path);
  const total = stats.length;
  const countsPerType: { [key: string]: number } = {};
  for (const stat of stats) {
    countsPerType[stat.type] = (countsPerType[stat.type] || 0) + 1;
  }
  const files = stats.filter(stat => !type || stat.type === type).slice(0, 100);

  res.json({
    total,
    countsPerType,
    files,
  });
});

export default router;
