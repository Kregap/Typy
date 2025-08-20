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

  let editFontSize = 1.1; // em, font size for edit mode
  let previewFontSize = 1.1; // em, font size for preview mode
  function render() {
    workarea.innerHTML = "";
    if (!cursorHidden) {
      // Edit mode: create container and textarea
      const container = document.createElement("div");
      container.className = "edit-container";

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.className = "edit-area";
      textarea.style.fontSize = editFontSize + "em";

      // Auto-resize function for both width and height
      function autoResize() {
        // Reset dimensions to measure content
        textarea.style.width = "20px";
        textarea.style.height = "0";

        // Create temporary element to measure content
        const temp = document.createElement("div");
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.style.whiteSpace = "pre";
        temp.style.font = window.getComputedStyle(textarea).font;
        temp.style.padding = window.getComputedStyle(textarea).padding;
        temp.style.boxSizing = "border-box";

        // Find the longest line for width calculation
        const lines = textarea.value.split("\n");
        let maxWidth = 0;

        lines.forEach(line => {
          temp.textContent = line || " ";
          document.body.appendChild(temp);
          const lineWidth = temp.offsetWidth;
          maxWidth = Math.max(maxWidth, lineWidth);
          document.body.removeChild(temp);
        });

        // Calculate new dimensions with constraints (matching preview mode limits)
        const containerWidth = window.innerWidth; // Full viewport width like preview mode
        const newWidth = Math.max(Math.min(maxWidth + 20, containerWidth), 20); // Constrain to viewport width

        // Apply width first
        textarea.style.width = newWidth + "px";

        // Now calculate height based on actual content (including wrapped text)
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = window.innerHeight; // Full viewport height like preview mode
        const newHeight = Math.max(Math.min(scrollHeight, maxHeight), 0); // Constrain to viewport height, minimum 0

        // Apply final height
        textarea.style.height = newHeight + "px";
      }

      textarea.addEventListener("input", _e => {
        text = textarea.value;
        autoResize(); // Adjust dimensions based on content
        // Trigger continuous updates by re-rendering preview if needed
        if (
          window.typoraLite &&
          typeof window.typoraLite.updatePreview === "function"
        ) {
          window.typoraLite.updatePreview();
        }
      });

      // Initial resize
      setTimeout(autoResize, 0);

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
            editFontSize = Math.min(editFontSize + 0.1, 3);
          }
          if (e.deltaY > 0) {
            editFontSize = Math.max(editFontSize - 0.1, 0.5);
          }
          textarea.style.fontSize = editFontSize + "em";
          autoResize(); // Recalculate size after font size change
        }
      });

      // Add textarea to container, then container to workarea
      container.appendChild(textarea);
      workarea.appendChild(container);
      setTimeout(() => textarea.focus(), 0);
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
      div.style.fontSize = previewFontSize * 0.86 + "em";
      div.addEventListener("wheel", e => {
        if (e.ctrlKey) {
          e.preventDefault();
          if (e.deltaY < 0) {
            previewFontSize = Math.min(previewFontSize + 0.1, 3);
          }
          if (e.deltaY > 0) {
            previewFontSize = Math.max(previewFontSize - 0.1, 0.5);
          }
          div.style.fontSize = previewFontSize * 0.86 + "em";
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
    // This function is kept for backward compatibility
    // It now sets both edit and preview font sizes
    editFontSize = newSize;
    previewFontSize = newSize;
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

  function updatePreview() {
    // This function can be used for continuous updates if needed
    // Currently the input event handler updates the text variable directly
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
    handleMousedown,
    updatePreview
  };
})();
