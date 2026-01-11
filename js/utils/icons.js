/**
 * SVG Icon System - Replaces Iconify with local SVG sprites
 * Load this script to convert all .iconify spans to inline SVGs
 */
(function () {
  // Icon mapping from Iconify data-icon to local symbol IDs
  const iconMap = {
    "iconoir:search": "icon-search",
    "mdi:facebook": "icon-facebook",
    "mdi:youtube": "icon-youtube",
    "ic:baseline-tiktok": "icon-tiktok",
    "mdi:email": "icon-email",
    "simple-icons:zalo": "icon-zalo",
    "mdi:home": "icon-home",
    "mdi:arrow-left": "icon-arrow-left",
    "mdi:calendar": "icon-calendar",
    "mdi:bookmark": "icon-bookmark",
    "mdi:currency-usd": "icon-currency-usd",
    "mdi:map-marker": "icon-map-marker",
    "ic:outline-email": "icon-outline-email",
    "ic:outline-phone": "icon-outline-phone",
    "mdi:twitter": "icon-twitter",
    "mdi:linkedin": "icon-linkedin",
    "mdi:phone": "icon-phone",
    "mdi:facebook-messenger": "icon-messenger",
    "mdi:robot": "icon-robot",
    "mdi:chat": "icon-chat",
    "mdi:close": "icon-close",
    "mdi:refresh": "icon-refresh",
  };

  let spriteLoaded = false;

  // Load SVG sprite into document
  function loadSvgSprite() {
    if (spriteLoaded) return Promise.resolve();

    return fetch("/assets/svg/icons.svg")
      .then((response) => response.text())
      .then((svgContent) => {
        const div = document.createElement("div");
        div.style.display = "none";
        div.id = "svg-sprite-container";
        div.innerHTML = svgContent;
        document.body.insertBefore(div, document.body.firstChild);
        spriteLoaded = true;
      });
  }

  // Replace all iconify spans with inline SVGs
  function replaceIcons() {
    const iconElements = document.querySelectorAll(".iconify[data-icon]");

    iconElements.forEach((el) => {
      const iconName = el.getAttribute("data-icon");
      const symbolId = iconMap[iconName];

      if (symbolId) {
        const width = el.getAttribute("data-width") || "24";
        const height = el.getAttribute("data-height") || "24";

        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("aria-hidden", "true");

        // Copy classes from original element
        const currentClass = el.getAttribute("class");
        if (currentClass) {
          svg.setAttribute("class", currentClass.replace("iconify", "").trim());
        }

        const use = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use"
        );
        use.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          "#" + symbolId
        );
        svg.appendChild(use);

        el.parentNode.replaceChild(svg, el);
      }
    });
  }

  // Expose globally for use after dynamic content loads
  window.IconSystem = {
    replace: function() {
      loadSvgSprite().then(replaceIcons);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadSvgSprite().then(replaceIcons);
    });
  } else {
    loadSvgSprite().then(replaceIcons);
  }
})();
