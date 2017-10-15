function Storage() {
}

Storage.set = function(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (ignorable) {
  }
};

Storage.get = function(key) {
  try {
    return localStorage.getItem(key);
  } catch (ignorable) {
    return null;
  }
};
