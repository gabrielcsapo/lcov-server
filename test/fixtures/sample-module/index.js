module.exports = function Dictionary() {
  const dictionary = {};
  return {
    dictionary,
    get: (key) => {
      return dictionary[key];
    },
    set: (key, value) => {
      dictionary[key] = value;
    }
  };
};
