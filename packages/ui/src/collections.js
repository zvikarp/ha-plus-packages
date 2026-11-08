import { appStyles } from "./styles.js";

export const collectionStyles = `${appStyles}

  :host {
    display: block;
    container-type: inline-size;
    color: var(--primary-text-color);
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif));
    font-size: var(--ha-font-size-m, 14px);
    background: var(--primary-background-color);
  }

  * {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  .layout {
    display: grid;
    grid-template-columns: 256px minmax(0, 1fr);
    min-height: calc(100dvh - var(--header-height, 56px));
  }

  nav {
    padding: 12px 8px;
    border-inline-end: 1px solid var(--divider-color);
    background: var(--sidebar-background-color, var(--card-background-color));
  }

  nav h2 {
    margin: 20px 16px 8px;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
  }

  .list-button {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 56px;
    padding: 8px 16px;
    border: 0;
    border-radius: var(--ha-border-radius-sm, 4px);
    background: transparent;
    color: var(--primary-text-color);
    text-align: start;
    font: inherit;
    cursor: pointer;
  }

  .list-button:hover {
    background: var(--secondary-background-color);
  }

  .list-button.active {
    color: var(--primary-color);
    background: var(--ha-color-fill-primary-quiet-resting, var(--secondary-background-color));
  }

  .list-name {
    flex: 1;
    overflow-wrap: anywhere;
  }

  .list-count {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 12px);
  }

  .list-button:focus-visible, .item-name:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .mobile-lists {
    display: none;
    padding: 16px;
  }

  .content {
    width: 100%;
    max-width: 680px;
    min-width: 0;
    margin: 0 auto;
    padding: 24px;
  }

  ha-card {
    display: block;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 8px 8px 24px;
  }

  .card-header h2 {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 24px;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .list-metadata {
    padding: 0 24px 8px;
  }

  .add {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 16px;
  }

  .add ha-input, .add ha-textfield {
    flex: 1;
    min-width: 0;
  }

  .filters {
    padding: 0 16px 16px;
    border-bottom: 1px solid var(--divider-color);
  }

  .section-title {
    margin: 0;
    padding: 16px 24px 8px;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .group-title {
    margin: 0;
    padding: 12px 24px 4px;
    font-size: 14px;
    font-weight: 500;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 4px 8px;
  }

  .item + .item {
    border-top: 1px solid var(--divider-color);
  }

  .item ha-checkbox {
    flex-shrink: 0;
  }

  .item-body {
    flex: 1;
    min-width: 0;
    padding: 8px 0;
  }

  .item-name {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 16px;
    text-align: start;
    overflow-wrap: anywhere;
    cursor: pointer;
  }

  .completed .item-name {
    text-decoration: line-through;
    color: var(--secondary-text-color);
  }

  .metadata, .details {
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .metadata {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0 12px;
  }

  .metadata ha-icon {
    --mdc-icon-size: 14px;
    margin-inline-end: 4px;
    vertical-align: text-bottom;
  }

  .tag {
    color: var(--primary-color);
  }

  .details {
    white-space: pre-wrap;
  }

  .notice {
    display: block;
    margin: 16px;
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .empty {
    margin: 0;
    padding: 24px;
    color: var(--secondary-text-color);
    line-height: 1.5;
  }

  .empty a {
    color: var(--primary-color);
  }

  .dialog-content {
    padding: 8px 24px 24px;
  }

  .dialog-content ha-form {
    display: block;
  }

  .dialog-content h3 {
    margin: 24px 0 8px;
    font-size: 16px;
    font-weight: 500;
  }

  .dialog-content p {
    line-height: 1.5;
  }

  .dialog-content ha-alert {
    display: block;
    margin-bottom: 16px;
  }

  .muted {
    color: var(--secondary-text-color);
    font-size: 14px;
  }

  .field-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    border-bottom: 1px solid var(--divider-color);
  }

  .field-row .field-description {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .field-row small {
    display: block;
    color: var(--secondary-text-color);
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  ha-dialog {
    --dialog-content-padding: 0;
    --mdc-dialog-min-width: min(560px, calc(100vw - 32px));
    --mdc-dialog-max-width: 560px;
  }

  .destructive {
    --mdc-theme-primary: var(--error-color);
  }

  .compact .toolbar {
    display: none;
  }

  .compact .layout {
    display: block;
    min-height: 0;
  }

  .compact nav {
    display: none;
  }

  .compact .mobile-lists {
    display: block;
    padding: 0 0 12px;
  }

  .compact .content {
    max-width: none;
    padding: 0;
  }

  @container (max-width: 750px) {
    .layout {
      display: block;
    }
    nav {
      display: none;
    }
    .mobile-lists {
      display: block;
    }
    .content {
      padding: 0 16px 24px;
    }
    .card-header {
      padding-inline-start: 16px;
    }
    .card-header h2 {
      font-size: 22px;
    }
    .list-metadata {
      padding-inline: 16px;
    }
  }
`;

