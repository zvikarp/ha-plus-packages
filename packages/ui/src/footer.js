import { el } from "./dom.js";

export const footerStyles = `
  .ha-plus-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin-top: auto;
    padding: 4px 16px;
    border-top: 1px solid var(--divider-color, #e0e0e0);
    color: var(--secondary-text-color, #727272);
    font: 14px var(--ha-font-family-body, var(--primary-font-family, Roboto, sans-serif));
  }
  .ha-plus-footer a { color: var(--primary-color, #03a9f4); text-decoration: none; min-height: 32px; display: inline-flex; align-items: center; }
  .ha-plus-footer a:hover { text-decoration: underline; }
  .ha-plus-footer a:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 4px; }
  .ha-plus-page-body { display: flex; flex-direction: column; min-height: calc(100dvh - var(--header-height, 56px)); }
  .ha-plus-page-body > main { flex: 1; width: 100%; box-sizing: border-box; }
`;

export function appFooter({ githubUrl, documentationUrl, version } = {}) {
  const footer = el("footer", undefined, "ha-plus-footer");
  footer.append(el("style", footerStyles));
  for (const [label, href] of [["GitHub", githubUrl], ["Documentation", documentationUrl]]) {
    if (!href) continue;
    const link = el("a", label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    footer.append(link);
  }
  const number = el("span", version ? `v${String(version).replace(/^v/, "")}` : "");
  number.dataset.version = "";
  footer.append(number);
  return footer;
}
