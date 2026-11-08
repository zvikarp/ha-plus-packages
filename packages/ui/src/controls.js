import { appStyles } from "./styles.js";

export const controlStyles = `${appStyles}

  .surface {
    display: block;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius,12px);
    background: var(--ha-card-background,var(--card-background-color));
    padding: 20px;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .heading {
    flex: 1;
    min-width: 0;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
    overflow-wrap: anywhere;
  }

  p {
    margin: 6px 0;
    color: var(--secondary-text-color);
    line-height: 1.5;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    margin-top: 6px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--disabled-text-color);
  }

  .dot.on {
    background: var(--primary-color);
  }

  .power {
    height: 48px;
    width: 48px;
    padding: 12px;
    flex-shrink: 0;
  }

  .power svg {
    width: 24px;
    height: 24px;
  }

  .primary,.power.on {
    background: var(--primary-color);
    color: var(--text-primary-color,#fff);
  }

  .controls {
    border-top: 1px solid var(--divider-color);
    margin-top: 20px;
    padding-top: 20px;
  }

  .label {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .hint {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.5;
  }

  input[type=range] {
    width: 100%;
    min-height: 44px;
    accent-color: var(--primary-color);
    margin: 0;
  }

  .swatches,.effects {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .swatch {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border: 3px solid transparent;
    box-shadow: inset 0 0 0 1px #0003;
    padding: 0;
  }

  .swatch[aria-pressed=true] {
    outline: 2px solid var(--primary-text-color);
    outline-offset: 3px;
  }

  .effect[aria-pressed=true] {
    background: var(--primary-color);
    color: var(--text-primary-color,#fff);
  }

  .footer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    justify-content: space-between;
  }

  .footer a {
    font-size: 13px;
    padding: 10px 0;
    min-height: 44px;
  }

  .error {
    margin-top: 16px;
    color: var(--error-color);
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .empty {
    text-align: center;
    padding: 32px 16px;
  }

  .empty h2 {
    margin-bottom: 8px;
  }

  @media (max-width:360px) {
    .surface {
      padding: 18px;
    }
    .swatches {
      gap: 8px;
    }
    h2 {
      font-size: 18px;
    }
  }

  main {
    max-width: 1000px;
    margin: auto;
    padding: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(min(100%,280px),1fr));
    gap: 16px;
    align-items: start;
  }

  .intro {
    margin: 0 0 24px;
  }

  .eyebrow {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin: 0 0 8px;
    color: var(--secondary-text-color);
  }

  .action-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 10px 16px;
    border-radius: 999px;
    white-space: nowrap;
    text-decoration: none;
  }

  .action-link.primary {
    background: var(--primary-color);
    color: var(--text-primary-color,#fff);
  }

  @media (max-width:480px) {
    main {
      padding: 16px;
    }
  }
`;

export function colorSwatch(button, rgb) {
  if (
    !Array.isArray(rgb) ||
    rgb.length !== 3 ||
    !rgb.every(
      (channel) => Number.isFinite(channel) && channel >= 0 && channel <= 255,
    )
  ) {
    throw new TypeError(
      "A color preset requires three RGB channels between 0 and 255",
    );
  }
  button.style.backgroundColor = `rgb(${rgb.join(",")})`;
}

export const remoteEditorStyles = `${appStyles}
  :host { display: block; min-width: 0; }
  .remote-editor { display: flex; flex-direction: column; gap: 20px; }
  .remote-editor ha-form { display: block; }
  .remote-command-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .remote-command { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 88px; width: 100%; padding: 12px 8px; border: 1px solid var(--divider-color); border-radius: 8px; background: var(--card-background-color); color: var(--primary-text-color); font: inherit; cursor: pointer; overflow-wrap: anywhere; }
  .remote-command:focus-visible, .remote-command[aria-pressed=true] { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .remote-command small { color: var(--secondary-text-color); }
  .remote-command[data-required=true] small { font-weight: 600; }
  .remote-command[data-learned=true] { border-color: var(--success-color, #43a047); }
  .remote-command:disabled { opacity: .6; cursor: default; }
  .remote-command-color { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--divider-color); }
  .remote-editor-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; }
  .remote-command-details { border-block: 1px solid var(--divider-color); padding-block: 16px; display: flex; flex-direction: column; gap: 16px; }
  @media (max-width: 450px) { .remote-command-grid { gap: 8px; grid-template-columns: repeat(3, minmax(0, 1fr)); } }
`;
