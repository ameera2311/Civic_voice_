const { spawn } = require("child_process");

function predictDepartment(text) {
  return new Promise((resolve, reject) => {

    const python = spawn("python", [
      "ml_models/predict.py",
      text
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    python.on("close", () => {
      try {
        const parsed = JSON.parse(result);
        resolve(parsed.category);
      } catch (error) {
        reject(error);
      }
    });

  });
}

module.exports = predictDepartment;