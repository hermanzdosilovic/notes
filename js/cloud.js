var PB_URL = "https://pb.dosilovic.com";

function encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function decode(bytes) {
  var escaped = escape(atob(bytes));
  try {
    return decodeURIComponent(escaped);
  } catch {
    return unescape(escaped);
  }
}

function Cloud() {
}

Cloud.load = function(successCallback, errorCallback) {
  $.ajax({
    url: PB_URL + "/" + getIdFromURI(),
    type: "GET",
    success: function(data, textStatus, jqXHR) {
      successCallback(decode(data["note"] || ""));
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorCallback();
    }
  });
};

Cloud.save = function(content, successCallback, errorCallback) {
  var content = JSON.stringify({
    note: encode(content)
  });
  var filename = "note.json";
  var data = {
    content: content,
    filename: filename
  };

  $.ajax({
    url: PB_URL,
    type: "POST",
    async: true,
    headers: {
      "Accept": "application/json"
    },
    data: data,
    xhrFields: {
      withCredentials: true
    },
    success: function(data, textStatus, jqXHR) {
      successCallback(data["short"]);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorCallback();
    }
  });
};

