const morgan = require("morgan");
const morganJson = require("morgan-json");

const winstonLogger = require("./logger");

const format = morganJson({
  method: ":method",
  url: ":url",
  status: ":status",
  contentLength: ":res[content-length]",
  responseTime: ":response-time",
});

const stream = {
  write: (message) => {
    const { method, url, status, contentLength, responseTime } =
      JSON.parse(message);

    winstonLogger.info("HTTP Log", {
      timestamp: new Date().toString(),
      method,
      url,
      status: Number(status),
      contentLength,
      responseTime: Number(responseTime),
    });
  },
};

module.exports = morgan(format, { stream });
