hljs.registerLanguage("text", function () { return {}; });

var md = new Remarkable({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) { }
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) { }

    return "";
  }
});
md.set({
  html: true,
  breaks: false
});

md.use(function (md) {
  md.block.ruler.push("inline-math", function (state, startLine, endLine, silent) {
    debugger
  });
});


















function getIdFromURI() {
  return location.search.substr(1).trim();
}

function renderPreview(noteContent, targetElement) {
  targetElement.innerHTML = md.render(noteContent);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, targetElement]);
}

function showError(header, content) {
  var modal = $("#message-modal");
  var modalHeader = $("#message-modal .header");
  var modalContent = $("#message-modal .content");

  modalHeader.html(header);
  modalContent.html(content);

  modal.modal("show");
}
