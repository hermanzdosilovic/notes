$(document).ready(function() {
  Cloud.load(function(content) {
    renderPreview(content, $("#preview")[0]);
  }, function() {
    showError("Error", "Note not found!");
  });
});
