var cache = {};

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
  md.inline.ruler.push("math", function (state, checkMode) {
    var src = state.src;
    var pos = state.pos;
    var posMax = state.posMax;

    if (src[pos] != "$" || pos + 1 == posMax) {
      return false;
    }

    var isEscaped = function (src, pos) {
      var backslashCount = 0;
      for (var i = pos - 1; i >= 0 && src[i] == "\\"; i--) {
        backslashCount++;
      }

      return backslashCount % 2 == 1 ? true : false;
    }

    if (isEscaped(src, pos)) {
      return false;
    } else if (checkMode) {
      return true;
    }

    var countDollars = function (src, pos, posMax) {
      var dollarCount = 0;
      for (var i = pos; i < posMax && src[i] == "$"; i++) {
        dollarCount++;
      }
      return dollarCount;
    }

    var prefixDollarCount = countDollars(src, pos, posMax);
    var k = pos + prefixDollarCount;
    while (k < posMax) {
      if (src[k] == "$" && !isEscaped(src, k)) {
        break;
      } else {
        k++;
      }
    }

    var suffixDollarCount = countDollars(src, k, posMax);

    var dollars;

    if (suffixDollarCount == 0) {
      return false;
    }

    if (prefixDollarCount == 1 && suffixDollarCount == 0) {
      return false;
    } else if (prefixDollarCount >= 4 && suffixDollarCount == 0) {
      dollars = 2;
    } else if (prefixDollarCount <= 3 && suffixDollarCount == 0) {
      dollars = 1;
    } else { // prefixDollarCount >= 1 && suffixDollarCount >= 1
      dollars = Math.min(Math.min(2, prefixDollarCount), Math.min(2, suffixDollarCount));
    }

    var displayMode = dollars == 2;
    var content = src.slice(pos + dollars, k + suffixDollarCount - dollars);

    if (content.trim().length == 0) {
      return false;
    }

    state.push({
      type: 'math',
      content: {
        text: content,
        displayMode: displayMode
      },
      level: state.level
    });

    state.pos += 2 * dollars + content.length;

    return true;
  });

  md.renderer.rules.math = function (tokens, idx/*, options, env*/) {
    var content = tokens[idx].content.text;
    var displayMode = tokens[idx].content.displayMode;

    try {
      return katex.renderToString(content, {
        displayMode: displayMode
      });
    } catch (err) {
      var openingTag = displayMode ? "$$" : "$";
      var closingTag = displayMode ? "$$" : "$";
      return `<span class="math">${openingTag}${content}${closingTag}</span>`;
    }
  };
});

function getIdFromURI() {
  return location.search.substr(1).trim();
}

function renderPreview(noteContent, targetElement) {
  targetElement.innerHTML = md.render(noteContent);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function showError(header, content) {
  var modal = $("#message-modal");
  var modalHeader = $("#message-modal .header");
  var modalContent = $("#message-modal .content");

  modalHeader.html(header);
  modalContent.html(content);

  modal.modal("show");
}
