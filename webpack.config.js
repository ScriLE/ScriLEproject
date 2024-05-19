const path = require("path");

module.exports = {
  //...

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      app: path.resolve(__dirname, "src"),
      common: path.resolve(__dirname, "app/common/"),
      pages: path.resolve(__dirname, "app/pages/"),
    },
  },
};
