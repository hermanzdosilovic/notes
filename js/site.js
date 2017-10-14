$(document).ready(function() {
  sourceEditor = CodeMirror($("#editor")[0], {
    lineNumbers: true,
    lineWrapping: true
  });
 
  sourceEditor.on("update", function(instance) {
    markjax(instance.getValue(), $("#preview")[0]);
  });
});
