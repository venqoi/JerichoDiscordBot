const fileSystem = require("fs");
const path = require("path");

class solidCaches {
  static async __internalErrorManager(
    rawError = "New Error has been Spotted",
    filters = {}
  ) {
    if (rawError && typeof rawError === "string")
      rawError = new Error(rawError);
    rawError.message = `\n  (:) raw Error Message: ${
      rawError.message
    }\n  (:) Category: ${
      filters?.category ?? "Not-Mentioned"
    }\n  (:) Date and Time: ${new Date()}`;
    return void solidCaches.__fileFunctions(rawError);
  }

  static __fileFunctions(error = new Error()) {
    try {
      console.log(
        `🛢️ - New Error Message has been Cached -> /../resources/__solidCaches/__errorLogs.txt`
      );
      if (!error?.message) return undefined;
      if (
        !fileSystem.existsSync(
          path.join(__dirname, "/../resources/__solidCaches")
        )
      )
        fileSystem.mkdirSync(
          path.join(__dirname, "/../resources/__solidCaches")
        );
      const __cacheLocation = path.join(
        __dirname,
        "/../resources/__solidCaches",
        "/__errorLogs.txt"
      );
      if (!__cacheLocation) return undefined;
      if (!fileSystem.existsSync(__cacheLocation)) {
        fileSystem.writeFileSync(
          __cacheLocation,
          `${new Date()} | ` +
            `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
              error?.stack ?? "Unknown-Stack"
            }`
        );
      } else if (
        (fileSystem.readFileSync(__cacheLocation)?.length ?? 0) < 500000
      ) {
        fileSystem.appendFileSync(
          __cacheLocation,
          `${
            (fileSystem.readFileSync(__cacheLocation)?.length ?? 0) > 100
              ? "\n\n"
              : ""
          }${new Date()} | ` +
            `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
              error?.stack ?? "Unknown-Stack"
            }`,
          "utf8"
        );
      } else {
        fileSystem.writeFileSync(
          __cacheLocation,
          `${new Date()} | ` +
            `\n ErrorMessage: ${error?.message ?? `${error}`}\n ErrorStack: ${
              error?.stack ?? "Unknown-Stack"
            }`
        );
      }
      return true;
    } catch {
      return undefined
    }
  }
}
module.exports = solidCaches;
