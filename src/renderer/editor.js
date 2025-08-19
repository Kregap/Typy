// Listen for set-markdown-text from main process to replace text and switch to preview mode
if (
  window.electronAPI &&
  typeof window.electronAPI.onSetMarkdownText === "function"
) {
  window.electronAPI.onSetMarkdownText(function (sampleText) {
    if (window.typoraLite && typeof window.typoraLite.setText === "function") {
      window.typoraLite.setText(sampleText);
      window.typoraLite.hideCursor && window.typoraLite.hideCursor();
    }
  });
}

// Editor logic for Typora Lite
window.typoraLite = (function () {
  let text = (window.initialLines && window.initialLines.join("\n")) || "";
  let cursorHidden = true; // Start in preview mode
  let workarea;

  let globalFontSize = 1.1; // em, global font size for zoom
  function render() {
    workarea.innerHTML = "";
    if (!cursorHidden) {
      // Edit mode: show textarea
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.className = "edit-area";
      textarea.style.width = "100%";
      textarea.style.height = "100vh";
      textarea.style.fontSize = globalFontSize + "em";
      textarea.addEventListener("input", _e => {
        text = textarea.value;
      });
      textarea.addEventListener("keydown", e => {
        if (e.key === "Escape") {
          cursorHidden = true;
          render();
          e.preventDefault();
        }
      });
      textarea.addEventListener("wheel", e => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            globalFontSize = Math.min(globalFontSize + 0.1, 3);
          }
          if (e.deltaY > 0) {
            globalFontSize = Math.max(globalFontSize - 0.1, 0.5);
          }
          textarea.style.fontSize = globalFontSize + "em";
        }
      });
      setTimeout(() => textarea.focus(), 0);
      workarea.appendChild(textarea);
    } else {
      // Preview mode: show rendered markdown
      const div = document.createElement("div");
      div.className = "preview-area";
      if (text.trim() === "") {
        div.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;width:100vw;">
           <span style="color:#888;opacity:0.4;font-size:1.15em;text-align:center;">Press <b>Shift&nbsp;+&nbsp;/</b> to open the help popup</span>
         </div>`;
      } else {
        div.style.padding = "0"; /* Remove padding to avoid extra space */
        div.style.boxSizing = "border-box";
        div.style.minHeight = "auto";

        // Create the content div first to measure its height
        const contentDiv = document.createElement("div");
        contentDiv.style.width = "fit-content";
        contentDiv.style.margin = "0 auto";
        contentDiv.style.padding = "0.5em";
        contentDiv.innerHTML = marked.parse(text);

        // Temporarily add to DOM to measure
        div.appendChild(contentDiv);
        const contentHeight = contentDiv.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Remove the temporary div
        div.removeChild(contentDiv);

        // If content is shorter than viewport, center it vertically
        if (contentHeight < viewportHeight) {
          div.style.display = "grid";
          div.style.placeItems = "center";
          div.style.minHeight = "100vh";
        }

        div.innerHTML = `<div style="width:fit-content;margin:0px auto;padding:0px 8px;">${marked.parse(text)}</div>`;
      }
      // Add a global mousedown handler to always switch to edit mode on left click
      function globalPreviewToEditHandler(e) {
        if (cursorHidden && e.button === 0 && !e.ctrlKey) {
          cursorHidden = false;
          render();
          setTimeout(() => {
            const textarea = document.querySelector(".edit-area");
            if (textarea) {
              textarea.selectionStart = textarea.selectionEnd =
                textarea.value.length;
              textarea.focus();
            }
          }, 0);
        }
      }
      document.addEventListener("mousedown", globalPreviewToEditHandler);
      // Remove the handler when leaving preview mode
      setTimeout(() => {
        if (!cursorHidden)
          document.removeEventListener("mousedown", globalPreviewToEditHandler);
      }, 0);
      div.style.fontSize = globalFontSize * 0.86 + "em";
      div.addEventListener("wheel", e => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            globalFontSize = Math.min(globalFontSize + 0.1, 3);
          }
          if (e.deltaY > 0) {
            globalFontSize = Math.max(globalFontSize - 0.1, 0.5);
          }
          div.style.fontSize = globalFontSize * 0.86 + "em";
        }
      });
      workarea.appendChild(div);
    }
  }
  function focusInput() {
    if (cursorHidden) return;
    const textarea = document.querySelector(".edit-area");
    if (textarea) textarea.focus();
  }
  function setWorkarea(el) {
    workarea = el;
  }
  function getText() {
    return text;
  }
  function setText(newText) {
    text = newText;
    render();
  }
  function setGlobalFontSize(newSize) {
    globalFontSize = newSize;
    render();
  }
  function showCursor() {
    cursorHidden = false;
    render();
    setTimeout(focusInput, 0);
  }
  function hideCursor() {
    cursorHidden = true;
    render();
  }
  function handleKeydown(e) {
    // Show thank you popup on Shift + /
    if (e.key === "?" && e.shiftKey) {
      if (window.electronAPI && window.electronAPI.showThankYou) {
        window.electronAPI.showThankYou();
        e.preventDefault();
        return;
      }
    }
    // Escape to preview mode
    if (e.key === "Escape" && !cursorHidden) {
      cursorHidden = true;
      render();
    }
  }
  function handleMousedown(e) {
    if (e.ctrlKey && e.button === 0 && window.electronAPI) {
      window.electronAPI.closeApp();
      return true;
    }
    if (!e.ctrlKey && e.button === 2) {
      cursorHidden = true;
      render();
      return true;
    }
    if (e.ctrlKey && e.button === 2) {
      return false;
    }
    return false;
  }
  return {
    setWorkarea,
    render,
    focusInput,
    getText,
    setText,
    setGlobalFontSize,
    showCursor,
    hideCursor,
    handleKeydown,
    handleMousedown
  };
})();
