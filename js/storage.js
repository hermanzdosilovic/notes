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

Storage.getCookie = function(key) {
  var value = undefined;
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split("=");
    if (cookie[0] === key) {
      value = cookie[1];
      break;
    }
  }
  return value;
};
