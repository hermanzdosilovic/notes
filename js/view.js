$(document).ready(function() {
  document.title = Storage.getCookie("NoteTitle") || "Markdown Notes";
  Cloud.load(function(content) {
    renderPreview(content, $("#preview")[0]);
  }, function() {
    showError("Error", "Note not found!");
  });
});
