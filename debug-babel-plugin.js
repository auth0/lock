module.exports = function myDebugPlugin() {
  return {
    visitor: {
      Program(path, state) {
        console.log("Babel processing file:", state.filename);
      }
    }
  };
};
