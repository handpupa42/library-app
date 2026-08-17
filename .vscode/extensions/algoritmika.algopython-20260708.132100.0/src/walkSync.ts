import * as fs from 'fs';
import * as path from 'path';

export const walkSync = (dir: string, callback: (filePath: string, stats: fs.Stats) => void) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath, stats);
    }
  });
};
