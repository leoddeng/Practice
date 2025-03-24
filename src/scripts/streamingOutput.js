import http from "http";
import url from "url";
// 解析命令行参数
const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith("--port="));
const port = portArg ? portArg.split("=")[1] : 3000; // 默认端口为 3000

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { query } = url.parse(req.url, true);
  const { method } = query;
  // 模拟流式返回数据
  const data = ["Hello!", "This", "is", "a", "streamed", "response"];
  if (method === "streaming") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked", // 启用分块传输
    });
    let index = 0;
    const interval = setInterval(() => {
      if (index < data.length) {
        res.write(data[index] + "\n"); // 发送数据块
        index++;
      } else {
        clearInterval(interval);
        res.end(); // 结束响应
      }
    }, 1000); // 每秒发送一个数据块
  } else if (method === "sse") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    let index = 0;
    const interval = setInterval(() => {
      if (index < data.length) {
        res.write(`data: ${data[index]}\n\n`); // 发送数据块
        index++;
      } else {
        res.write("event:finished\n");
        res.write("data:finished\n\n");
        clearInterval(interval);
        res.end(); // 结束响应
      }
    }, 1000);
  }
});

// 启动服务器
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
