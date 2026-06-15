(() => {
  if (window.__readableMarkLoaded) {
    return;
  }

  window.__readableMarkLoaded = true;

  const ROOT_ID = "readable-mark-root";
  const DEFAULT_SETTINGS = {
    theme: "light",
    width: "standard",
    type: "editorial",
    size: "default",
    code: "normal"
  };
  const SETTINGS_KEY = "readableMarkSettings";
  const ALLOWED_TAGS = new Set([
    "a",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "em",
    "figcaption",
    "figure",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "ul"
  ]);

  let currentArticle = null;
  let currentSettings = { ...DEFAULT_SETTINGS };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message)
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isActive()) {
      closeReader();
    }
  });

  async function handleMessage(message) {
    if (message.type === "READABLE_MARK_TOGGLE") {
      if (isActive()) {
        closeReader();
        return { ok: true, active: false };
      }

      await openReader();
      return { ok: true, active: true };
    }

    if (message.type === "READABLE_MARK_APPLY_SETTINGS") {
      currentSettings = normalizeSettings({ ...DEFAULT_SETTINGS, ...(message.settings || {}) });
      persistSettings(currentSettings);
      applySettings(currentSettings);
      return { ok: true, active: isActive() };
    }

    if (message.type === "READABLE_MARK_COPY_MARKDOWN") {
      if (!currentArticle) {
        currentArticle = extractArticle();
      }
      const copied = await copyMarkdown(currentArticle);
      return { ok: true, copied };
    }

    if (message.type === "READABLE_MARK_GET_STATUS") {
      currentSettings = await loadSettings();
      return { ok: true, active: isActive(), settings: currentSettings };
    }

    return { ok: false };
  }

  async function openReader() {
    currentSettings = await loadSettings();
    renderLoading(currentSettings);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    currentArticle = extractArticle();
    renderArticle(currentArticle, currentSettings);
  }

  function closeReader() {
    const root = document.getElementById(ROOT_ID);
    root?.remove();
    document.documentElement.classList.remove("readable-mark-page-lock");
  }

  function isActive() {
    return Boolean(document.getElementById(ROOT_ID));
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.local.get(SETTINGS_KEY);
      return normalizeSettings({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) });
    } catch (_error) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  async function persistSettings(settings) {
    try {
      await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
    } catch (_error) {
      // Storage can fail in unusual extension contexts; the live UI should still update.
    }
  }

  function extractArticle() {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText && selectedText.length > 300) {
      return articleFromSelection(selectedText);
    }

    const candidate = findBestCandidate();
    const article = {
      title: getTitle(candidate),
      subtitle: getMetaContent("description") || getMetaProperty("og:description"),
      author: getMetaContent("author") || getBySelector("[rel='author'], .author, .byline"),
      date: getDate(candidate),
      site: location.hostname.replace(/^www\./, ""),
      url: location.href
    };
    const content = sanitizeCandidate(candidate, article);
    article.content = content;

    if (!content.textContent.trim() || content.textContent.trim().length < 160) {
      return articleFromFailure();
    }

    return article;
  }

  function articleFromSelection(text) {
    const content = document.createElement("div");
    text.split(/\n{2,}/).forEach((chunk) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = chunk.trim();
      content.append(paragraph);
    });

    return {
      title: getDocumentTitle(),
      subtitle: "Formatted from selected text.",
      author: "",
      date: "",
      site: location.hostname.replace(/^www\./, ""),
      url: location.href,
      content
    };
  }

  function articleFromFailure() {
    const content = document.createElement("div");
    const paragraph = document.createElement("p");
    paragraph.textContent = "Could not find a readable article. Try selecting text, then run Reader again.";
    content.append(paragraph);

    return {
      title: "No readable article found",
      subtitle: "",
      author: "",
      date: "",
      site: location.hostname.replace(/^www\./, ""),
      url: location.href,
      content
    };
  }

  function findBestCandidate() {
    const selectors = [
      "article",
      "main",
      "[role='main']",
      ".article",
      ".post",
      ".entry",
      ".entry-content",
      ".post-content",
      ".article-content",
      ".content",
      "#content"
    ];
    const candidates = [...document.querySelectorAll(selectors.join(","))]
      .filter((node) => !node.closest(`#${ROOT_ID}`));

    if (!candidates.length) {
      candidates.push(...[...document.body.children].filter((node) => !isLikelyChrome(node)));
    }

    let best = document.body;
    let bestScore = 0;

    candidates.forEach((candidate) => {
      const text = normalizedText(candidate);
      const textLength = text.length;
      if (textLength < 120) {
        return;
      }

      const paragraphs = candidate.querySelectorAll("p").length;
      const headings = candidate.querySelectorAll("h1,h2,h3").length;
      const codeBlocks = candidate.querySelectorAll("pre,code").length;
      const images = candidate.querySelectorAll("img").length;
      const linkPenalty = getLinkDensity(candidate) * textLength * 0.7;
      const score = textLength + paragraphs * 120 + headings * 80 + codeBlocks * 90 + images * 25 - linkPenalty;

      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    });

    return best;
  }

  function sanitizeCandidate(candidate, metadata = {}) {
    const clone = candidate.cloneNode(true);

    clone.querySelectorAll([
      "script",
      "style",
      "noscript",
      "iframe",
      "svg",
      "canvas",
      "video",
      "audio",
      "form",
      "input",
      "button",
      "nav",
      "aside",
      "footer",
      "[role='navigation']",
      "[role='banner']",
      "[role='contentinfo']",
      ".ad",
      ".ads",
      ".advertisement",
      ".cookie",
      ".comments",
      ".newsletter",
      ".social",
      ".share",
      ".related",
      ".sidebar",
      "time",
      ".byline",
      ".author",
      "[rel='author']",
      ".date",
      ".published",
      ".timestamp"
    ].join(",")).forEach((node) => node.remove());

    [...clone.querySelectorAll("*")].forEach((node) => {
      const tag = node.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        node.replaceWith(...node.childNodes);
        return;
      }

      [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));

      if (tag === "a") {
        const href = node.href || node.getAttribute("href");
        if (href) {
          node.setAttribute("href", new URL(href, location.href).href);
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noreferrer");
        }
      }

      if (tag === "img") {
        const source = node.currentSrc || node.src || node.getAttribute("src");
        if (source) {
          node.setAttribute("src", new URL(source, location.href).href);
        }
        node.setAttribute("alt", node.alt || "");
        node.setAttribute("loading", "lazy");
      }
    });

    const firstHeading = clone.querySelector("h1");
    if (firstHeading) {
      firstHeading.remove();
    }
    removeDuplicateMetadata(clone, metadata);

    pruneEmptyNodes(clone);
    return clone;
  }

  function removeDuplicateMetadata(root, metadata) {
    const targets = [
      metadata.author,
      metadata.author ? `By ${metadata.author}` : "",
      metadata.date
    ].filter(Boolean).map(normalizeComparableText);

    [...root.querySelectorAll("p,div,span,strong,b")].forEach((node) => {
      const text = normalizeComparableText(node.textContent);
      if (!text) {
        return;
      }

      const isDuplicateText = targets.includes(text);
      const isDuplicateDate = metadata.date && isSameReadableDate(text, metadata.date);
      const isDuplicateByline = metadata.author && text === normalizeComparableText(`By ${metadata.author}`);

      if (isDuplicateText || isDuplicateDate || isDuplicateByline) {
        node.remove();
      }
    });
  }

  function pruneEmptyNodes(root) {
    [...root.querySelectorAll("p,li,blockquote,h1,h2,h3,h4,h5,h6")].forEach((node) => {
      if (!node.textContent.trim() && !node.querySelector("img")) {
        node.remove();
      }
    });
  }

  function renderLoading(settings) {
    closeReader();
    document.documentElement.classList.add("readable-mark-page-lock");

    const root = createRoot(settings);
    root.innerHTML = `
      <div class="rm-loading">
        <p class="rm-kicker">~/ricecooker/article</p>
        <h1>Parsing article...</h1>
        <pre>Extracting main content...
Removing page noise...
Formatting text...</pre>
      </div>
    `;
    document.documentElement.append(root);
  }

  function renderArticle(article, settings) {
    const root = createRoot(settings);
    const previousRoot = document.getElementById(ROOT_ID);
    const contentSlot = document.createElement("div");
    contentSlot.className = "rm-content";
    contentSlot.append(article.content);
    const metaLine = [article.author ? `By ${article.author}` : "", article.date].filter(Boolean).join(" · ");

    root.innerHTML = `
      <header class="rm-toolbar">
        <div class="rm-brand">
          <span class="rm-logotype"><span class="rm-logotype-action">Read w/</span> <span class="rm-logotype-name">ricecooker</span></span>
          <small>~/ricecooker/article</small>
        </div>
        <nav class="rm-controls" aria-label="Reader controls">
          ${selectMarkup("width", "Width", ["narrow", "standard", "wide"], settings.width)}
          ${selectMarkup("type", "Type", ["editorial", "mono"], settings.type)}
          ${selectMarkup("size", "Size", ["small", "default", "large"], settings.size)}
          ${selectMarkup("theme", "Theme", ["light", "dark"], settings.theme)}
          ${selectMarkup("code", "Code", ["normal", "contrast"], settings.code)}
          <button class="rm-copy" type="button">Copy MD</button>
          <button class="rm-exit" type="button" aria-label="Exit reader">Exit</button>
        </nav>
      </header>
      <div class="rm-frame">
        <article class="rm-article">
          <p class="rm-kicker">${escapeHtml(article.site || "Reader")}</p>
          <h1>${escapeHtml(article.title)}</h1>
          ${article.subtitle ? `<p class="rm-subtitle">${escapeHtml(article.subtitle)}</p>` : ""}
          ${metaLine ? `<p class="rm-meta">${escapeHtml(metaLine)}</p>` : ""}
        </article>
      </div>
    `;

    root.querySelector(".rm-article").append(contentSlot);
    previousRoot?.replaceWith(root);
    document.documentElement.classList.add("readable-mark-page-lock");
    bindReaderControls(root);
  }

  function createRoot(settings) {
    const root = document.createElement("section");
    root.id = ROOT_ID;
    root.setAttribute("aria-label", "ricecooker reader view");
    applySettings(settings, root);
    return root;
  }

  function bindReaderControls(root) {
    root.querySelector(".rm-exit").addEventListener("click", closeReader);
    root.querySelector(".rm-copy").addEventListener("click", async () => {
      const button = root.querySelector(".rm-copy");
      const copied = await copyMarkdown(currentArticle);
      button.textContent = copied ? "Copied" : "Copy failed";
      window.setTimeout(() => {
        button.textContent = "Copy MD";
      }, 1400);
    });

    root.querySelectorAll("select[data-setting]").forEach((select) => {
      select.addEventListener("change", async () => {
        currentSettings = {
          ...currentSettings,
          [select.dataset.setting]: select.value
        };
        await persistSettings(currentSettings);
        applySettings(currentSettings);
      });
    });
  }

  function applySettings(settings, root = document.getElementById(ROOT_ID)) {
    if (!root) {
      return;
    }

    root.className = [
      `rm-theme-${settings.theme}`,
      `rm-width-${settings.width}`,
      `rm-type-${settings.type}`,
      `rm-size-${settings.size}`,
      `rm-code-${settings.code}`
    ].join(" ");
  }

  function normalizeSettings(settings) {
    const normalized = { ...settings };

    if (normalized.theme === "paper") {
      normalized.theme = "light";
    }

    if (normalized.theme === "ink" || normalized.theme === "terminal") {
      normalized.theme = "dark";
    }

    return normalized;
  }

  function selectMarkup(setting, label, options, value) {
    const optionMarkup = options
      .map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${labelize(option)}</option>`)
      .join("");
    return `
      <label>
        <span>${label}</span>
        <select data-setting="${setting}">
          ${optionMarkup}
        </select>
      </label>
    `;
  }

  async function copyMarkdown(article) {
    if (!article) {
      return false;
    }

    const markdown = articleToMarkdown(article);

    try {
      await navigator.clipboard.writeText(markdown);
      return true;
    } catch (_error) {
      const textarea = document.createElement("textarea");
      textarea.value = markdown;
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    }
  }

  function articleToMarkdown(article) {
    const lines = [`# ${article.title}`, ""];

    if (article.author || article.date || article.url) {
      lines.push([
        article.author ? `Author: ${article.author}` : "",
        article.date ? `Date: ${article.date}` : "",
        article.url ? `Source: ${article.url}` : ""
      ].filter(Boolean).join(" | "));
      lines.push("");
    }

    walkMarkdown(article.content, lines);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function walkMarkdown(node, lines) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          lines.push(text, "");
        }
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const tag = child.tagName.toLowerCase();
      const text = child.textContent.trim();

      if (/^h[1-6]$/.test(tag)) {
        lines.push(`${"#".repeat(Number(tag[1]))} ${text}`, "");
      } else if (tag === "p") {
        lines.push(inlineMarkdown(child), "");
      } else if (tag === "blockquote") {
        lines.push(...text.split("\n").map((line) => `> ${line}`), "");
      } else if (tag === "pre") {
        lines.push("```", child.textContent.trim(), "```", "");
      } else if (tag === "ul" || tag === "ol") {
        [...child.children].forEach((item, index) => {
          const marker = tag === "ol" ? `${index + 1}.` : "-";
          lines.push(`${marker} ${item.textContent.trim()}`);
        });
        lines.push("");
      } else if (tag === "img") {
        lines.push(`![${child.alt || ""}](${child.src})`, "");
      } else {
        walkMarkdown(child, lines);
      }
    });
  }

  function inlineMarkdown(node) {
    return [...node.childNodes].map((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return child.textContent;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }

      const tag = child.tagName.toLowerCase();
      const text = child.textContent;
      if (tag === "a") {
        return `[${text}](${child.href})`;
      }
      if (tag === "strong" || tag === "b") {
        return `**${text}**`;
      }
      if (tag === "em" || tag === "i") {
        return `_${text}_`;
      }
      if (tag === "code") {
        return `\`${text}\``;
      }
      return text;
    }).join("").trim();
  }

  function getTitle(candidate) {
    const candidateTitle = candidate.querySelector("h1")?.textContent.trim();
    return getMetaProperty("og:title") || candidateTitle || getDocumentTitle();
  }

  function getDocumentTitle() {
    return (document.title || "Untitled article").replace(/\s+[-|]\s+.*$/, "").trim();
  }

  function getDate(candidate) {
    const datetime = candidate.querySelector("time")?.getAttribute("datetime") ||
      document.querySelector("time")?.getAttribute("datetime") ||
      getMetaContent("article:published_time") ||
      getMetaProperty("article:published_time");

    if (!datetime) {
      return getBySelector(".date, .published, .timestamp");
    }

    const parsed = new Date(datetime);
    return Number.isNaN(parsed.getTime()) ? datetime : parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function getMetaContent(name) {
    return document.querySelector(`meta[name='${name}'], meta[name='${name.toLowerCase()}']`)?.content?.trim() || "";
  }

  function getMetaProperty(property) {
    return document.querySelector(`meta[property='${property}']`)?.content?.trim() || "";
  }

  function getBySelector(selector) {
    return document.querySelector(selector)?.textContent.trim().replace(/\s+/g, " ") || "";
  }

  function normalizedText(node) {
    return (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function normalizeComparableText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/[.,;:]+$/g, "")
      .trim()
      .toLowerCase();
  }

  function isSameReadableDate(left, right) {
    const leftDate = new Date(left);
    const rightDate = new Date(right);

    if (Number.isNaN(leftDate.getTime()) || Number.isNaN(rightDate.getTime())) {
      return false;
    }

    return leftDate.toDateString() === rightDate.toDateString();
  }

  function getLinkDensity(node) {
    const textLength = normalizedText(node).length || 1;
    const linkLength = [...node.querySelectorAll("a")]
      .reduce((total, link) => total + normalizedText(link).length, 0);
    return linkLength / textLength;
  }

  function isLikelyChrome(node) {
    return /^(nav|header|footer|aside|form)$/i.test(node.tagName) ||
      /nav|menu|sidebar|footer|header|cookie|modal|popup/i.test(node.className || "");
  }

  function labelize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();
