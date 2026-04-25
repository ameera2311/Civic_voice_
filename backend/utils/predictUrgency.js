const { spawn } = require("child_process");

function predictUrgency(text) {
  return new Promise((resolve, reject) => {

    const py = spawn("python", [
      "ml_models/predict_urgency.py",
      text
    ]);

    let data = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.on("close", () => {
      resolve(JSON.parse(data));
    });

    py.stderr.on("data", (err) => {
      reject(err.toString());
    });

  });
}

module.exports = predictUrgency;