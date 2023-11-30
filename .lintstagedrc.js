const path = require("path");

const buildNextEslintCommand = (filenames) =>
  `yarn next:lint --fix --file ${filenames
    .map((f) => path.relative(path.join("packages", "app"), f))
    .join(" --file ")}`;

const checkTypesNextCommand = () => "yarn next:check-types";
const checkPrettierCommand = () => "yarn prettier:check";

module.exports = {
  "packages/app/**/*.{ts,tsx}": [
    buildNextEslintCommand,
    checkTypesNextCommand,
    checkPrettierCommand,
  ],
};
