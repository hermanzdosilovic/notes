function getIdFromURI() {
  return location.search.substr(1).trim();
}

function renderPreview(noteContent, targetElement) {
  markjax(noteContent, targetElement, {
      sanitize: false,
      gfm: true
  });
}

function showError(header, content) {
  var modal = $("#message-modal");
  var modalHeader = $("#message-modal .header");
  var modalContent = $("#message-modal .content");

  modalHeader.html(header);
  modalContent.html(content);

  modal.modal("show");
}
