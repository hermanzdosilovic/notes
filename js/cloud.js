function Cloud() {
}

Cloud.load = function(successCallback, errorCallback) {
  $.ajax({
    url: "https://ptpb.pw/" + getIdFromURI(),
    type: "GET",
    success: function(data, textStatus, jqXHR) {
      successCallback(decodeURIComponent(escape(atob(data["note"] || ""))));
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorCallback();
    }
  });
};

Cloud.save = function(content, successCallback, errorCallback) {
  var content = JSON.stringify({
    note: btoa(unescape(encodeURIComponent(content)))
  });
  var filename = "note.json";
  var data = {
    content: content,
    filename: filename
  };
  
  $.ajax({
    url: "https://ptpb.pw",
    type: "POST",
    async: true,
    headers: {
      "Accept": "application/json"
    },
    data: data,
    success: function(data, textStatus, jqXHR) {
      successCallback(data["long"]);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      errorCallback();
    }
  });
};

