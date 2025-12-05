const https = require("https");
const fs = require("fs");
const app = require("./server"); // tu app Express

const options = {
    key: fs.readFileSync("cert-key.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("ca.pem")
};

https.createServer(options, app).listen(3443, () => {
    console.log("🚀 HTTPS activado en https://localhost:3443");
});
