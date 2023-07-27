const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    const pathname = req.url

    if (pathname === "/IncomingWebServicePortBinding") {
    }
});
server.listen(7832)
