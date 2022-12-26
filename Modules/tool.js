const { unlink } = require("node:fs");

const RemoveFile = (path) => {
  try {
    unlink(path, (err) => {
      if (err) throw err;
      console.log("deleted");
    });
  } catch (error) {}
};

module.exports = { RemoveFile };
