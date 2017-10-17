$(document).ready(function() {
  editor = CodeMirror.fromTextArea($("textarea")[0], {
    lineNumbers: true,
    lineWrapping: true,
    keyMap: Storage.get("keyMap") || "default"
  });
  
  editor.on("change", function(instance) {
    renderPreview(instance.getValue(), $("#preview")[0]);
    Storage.set("note", instance.getValue());
  });

  CodeMirror.commands.save = saveNote;

  $(".site-popup").popup({
    inline: true
  });
  $('.ui.checkbox').checkbox({
    onChange: toggleVim
  });
  $("#vimCheckbox").attr("checked", Storage.get("keyMap") == "vim");

  $("body").keydown(function(e) {
    var keyCode = e.keyCode || e.which;
    if (event.ctrlKey && keyCode == 83) { // Ctrl+S
      e.preventDefault();
      saveNote();
    }
  });

  if (getIdFromURI()) {
    loadNote();
  } else {
    editor.setValue(Storage.get("note") || "");
    $("#shareBtn").attr("disabled", true);
  }

  renderPreview(editor.getValue(), $("#preview")[0]);
});

function toggleVim() {
  var keyMap = document.getElementById("vimCheckbox").checked ? "vim" : "default";
  Storage.set("keyMap", keyMap);
  editor.setOption("keyMap", keyMap);
}

function saveNote(callback = function(){}) {
  var saveBtn = $("#saveBtn")[0];
  saveBtn.classList.add("loading"); 

  Cloud.save(editor.getValue(), function(id) {
      saveBtn.classList.remove("loading");
      $("#shareBtn").attr("disabled", false);
      window.history.replaceState(null, null, location.origin + location.pathname + "?" + id);
      callback();
    }, function() {
      saveBtn.classList.remove("loading");
      showError("Error", "Cannot save your note!");
  });
}

function loadNote() {
  Cloud.load(function(content) {
    editor.setValue(content);
  }, function() {
      window.history.replaceState(null, null, location.origin + location.pathname);
      showError("Error", "Note not found!");
      editor.setValue(Storage.get("note") || "");
  });
}

function downloadNote() {
  download(editor.getValue(), "note.md", "text/plain");
}

function shareNote() {
  window.open(location.href.substr(0, location.href.lastIndexOf("/") + 1) + "view.html?" + getIdFromURI(), "_blank");
}
