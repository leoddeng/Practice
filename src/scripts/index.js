import http from "http";
import { spawn } from "child_process";
import url from "url";
// 保存子进程引用的对象
const childProcesses = {};
const server = http.createServer((req, res) => {
  // 解决跨域问题
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    const { query } = url.parse(req.url, true);
    const { port, type, server } = query;

    if (!port) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Port is required");
      console.log("Port is required");

      return;
    }

    if (type === "close" && childProcesses[port]) {
      childProcesses[port].kill();
      delete childProcesses[port]; // 从对象中移除引用
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Server on port ${port} has been stopped`);
      console.log(`Server on port ${port} has been stopped`);

      return;
    } else if (type === "close" && !childProcesses[port]) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`No server found on port ${port}`);
      console.log(`No server found on port ${port}`);

      return;
    }
    if (type === "start" && childProcesses[port]) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`${port} is already in use`);
      console.log(`${port} is already in use`);

      return;
    }
    // 使用前端传递的 port 启动服务
    const child = spawn("node", [
      `./src/scripts/${server}.js`,
      `--port=${port}`,
    ]);
    childProcesses[port] = child;

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Server started successfully on port ${port}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to start server");
    });

    child.on("error", (error) => {
      console.error(`Error: ${error.message}`);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to start server");
    });
  } else if (req.method === "POST") {
    // 处理 POST 请求
  } else if (req.method === "OPTIONS") {
    // 处理预检请求
    res.writeHead(200);
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(8080, () => {
  console.log("API server running at http://localhost:8080");
});
