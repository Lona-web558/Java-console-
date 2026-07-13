const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});



app.get("/api/runtimes", (req, res) => {
    res.json([
        {
            language: "java",
            version: "local"
        }
    ]);
});

app.post("/api/execute", async (req, res) => {
    const { files = [], stdin = "" } = req.body;

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "javaide-"));

    try {

        for (const file of files) {
            await fs.writeFile(
                path.join(tempDir, file.name),
                file.content,
                "utf8"
            );
        }

        const compile = await runProcess(
            "javac",
            files.map(f => f.name),
            tempDir
        );

        if (compile.code !== 0) {
            return res.json({
                compile: {
                    stdout: compile.stdout,
                    stderr: compile.stderr
                }
            });
        }

        const mainFile =
            files.find(f => f.name === "Main.java") || files[0];

        const className = path.basename(mainFile.name, ".java");

        const run = await runProcess(
            "java",
            [className],
            tempDir,
            stdin
        );

        res.json({
            run: {
                stdout: run.stdout,
                stderr: run.stderr,
                code: run.code
            }
        });

    } catch (err) {

        res.status(500).json({
            run: {
                stdout: "",
                stderr: err.toString(),
                code: 1
            }
        });

    } finally {

        await fs.rm(tempDir, {
            recursive: true,
            force: true
        });

    }
});

function runProcess(command, args, cwd, stdin = "") {

    return new Promise(resolve => {

        const proc = spawn(command, args, { cwd });

        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", d => stdout += d.toString());
        proc.stderr.on("data", d => stderr += d.toString());

        proc.on("close", code => {
            resolve({
                stdout,
                stderr,
                code
            });
        });

        if (stdin) {
            proc.stdin.write(stdin);
        }

        proc.stdin.end();

    });

}

app.listen(PORT, () => {
    console.log(`Java IDE server running on http://localhost:${PORT}`);
});
