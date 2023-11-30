const path = require("path");

const buildNextEslintCommand = (filenames) =>
  `yarn next:lint --fix --file ${filenames
    .map((f) => path.relative(path.join("packages", "app"), f))
    .join(" --file ")}`;

const checkTypesNextCommand = () => "yarn next:check-types";

module.exports = {
  "packages/app/**/*.{ts,tsx}": [buildNextEslintCommand, checkTypesNextCommand],
};
