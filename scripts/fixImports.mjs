import { promises as fs } from "fs";

fs.readdir("./lib")
    .then((files) => {
        files.forEach(async (file) => {
            if (file.endsWith(".js")) {
                const filePath = `./lib/${file}`;

                fs.readFile(filePath)
                    .then((file) => {
                        file = file.toString();

                        file = file.replace(/\.default/gm, "");

                        fs.writeFile(filePath, file);
                    });
            }
        })
    });
