# Java-console-

JavaConsole

A lightweight browser-based Java editor with syntax highlighting, multiple tabs, file management, and a console interface.

«Note: This project requires a Java execution backend. Browsers cannot compile or run Java code directly.»

---

Features

- Java syntax highlighting
- Multiple file tabs
- Line numbers
- Save and open ".java" files
- Console output
- Standard input ("Scanner" support)
- Ctrl/Cmd + Enter to run
- Responsive interface for desktop and mobile

---

Requirements

Frontend

- Any modern web browser

Backend

- Node.js 18 or newer
- Java Development Kit (JDK 17 or newer)

Verify your installation:

node -v
javac -version
java -version

---

Installation

Install dependencies:

npm install

Start the server:

npm start

The backend will be available at:

http://localhost:3000

---

Configure the Frontend

Replace the runtime endpoint:

fetch("https://emkc.org/api/v2/piston/runtimes")

with:

fetch("http://localhost:3000/api/runtimes")

Replace the execute endpoint:

fetch("https://emkc.org/api/v2/piston/execute", ...)

with:

fetch("http://localhost:3000/api/execute", ...)

---

Running

1. Open the frontend in your browser.
2. Write Java code.
3. (Optional) Enter input for "Scanner".
4. Press Run or Ctrl/Cmd + Enter.
5. Output will appear in the console.

---

Project Structure

project/
│
├── index.html
├── server.js
├── package.json
└── README.md

---

API

GET "/api/runtimes"

Returns available runtimes.

Example response:

[
  {
    "language": "java",
    "version": "local"
  }
]

---

POST "/api/execute"

Request:

{
  "files": [
    {
      "name": "Main.java",
      "content": "public class Main { ... }"
    }
  ],
  "stdin": "Hello"
}

Response:

{
  "run": {
    "stdout": "Program output",
    "stderr": "",
    "code": 0
  }
}

Compile errors return:

{
  "compile": {
    "stdout": "",
    "stderr": "Compilation error..."
  }
}

---

Mobile Users

A mobile browser cannot run "server.js" or compile Java locally.

To use this project on a phone, you must:

- Connect to a backend running on a computer or server, or
- Deploy the backend to a cloud service (Render, Railway, Fly.io, VPS, etc.).

---

License

This project is provided as-is for educational and personal use.
