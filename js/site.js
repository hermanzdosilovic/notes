var mathjaxCache = {};

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
  breaks: false,
  linkify: true
});
md.inline.ruler.enable([
  'ins',
  'mark',
  'sub',
  'sup'
]);

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

    if (suffixDollarCount == 0) {
      return false;
    } else if (checkMode) {
      return true;
    }

    var dollars = Math.min(Math.min(2, prefixDollarCount), Math.min(2, suffixDollarCount));
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
      var tag = displayMode ? "$$" : "$";
      var innerHTML = mathjaxCache[tag + content.trim() + tag];

      if (innerHTML == undefined) {
        return `<span class="math">${tag}${content}${tag}</span>`;
      }

      return `<span class="cached-math">${innerHTML}</span>`;
    }
  };
});

function getIdFromURI() {
   return location.search.substr(1).trim() || Storage.getCookie("NoteId");
}

function renderPreview(noteContent, targetElement) {
  targetElement.innerHTML = md.render(noteContent);

  var mathElements = targetElement.getElementsByClassName("math");
  for (var i = 0; i < mathElements.length; i++) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, mathElements[i], [function(mathElement) {
      var scriptElement = mathElement.getElementsByTagName("script")[0];
      if (scriptElement == undefined) {
        return;
      }
      var tag = scriptElement.type == "math/tex" ? "$" : "$$";
      var content = scriptElement.innerHTML.trim();
      mathjaxCache[tag + content + tag] = mathElement.innerHTML;
    }, mathElements[i]]]);
  }
}

function showError(header, content) {
  var modal = $("#message-modal");
  var modalHeader = $("#message-modal .header");
  var modalContent = $("#message-modal .content");

  modalHeader.html(header);
  modalContent.html(content);

  modal.modal("show");
}
