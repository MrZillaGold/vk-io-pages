import { promises as fs } from "fs";

import tsconfig from "../tsconfig.json";

const OUT_DIR = tsconfig.compilerOptions.outDir;
const LIB_DIR = "./lib";

await fs.readdir("./lib")
    .then((files) => {
        files.forEach(async (file) => {
            if (file.endsWith(".js")) {
                const filePath = `${LIB_DIR}/${file}`;

                fs.readFile(filePath)
                    .then((file) => {
                        file = file.toString();

                        file = file.replace(/\.default/gm, "");

                        fs.writeFile(filePath, file);
                    });
            }
        })
    });

await fs.rmdir(`./${OUT_DIR}`, { recursive: true });
