/*! Adapted from HA+ Matter Hub. Licensed under Apache-2.0. See ha-plus-ui.NOTICE and ha-plus-ui.LICENSE-APACHE-2.0 in the distribution. */
export const iframePanelStyles = `
  :host {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: var(--header-height, 56px) minmax(0, 1fr);
    min-width: 0;
    min-height: 0;
  }

  header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    font: 500 20px var(--primary-font-family, Roboto, sans-serif);
    background: var(--app-header-background-color);
    color: var(--app-header-text-color);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  header img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  header span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .version {
    font-size: 12px;
    font-weight: 400;
    opacity: .7;
    margin-right: 16px;
  }

  iframe {
    display: block;
    border: 0;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  @media (max-width: 400px) {
    header {
      gap: 8px;
      font-size: 18px;
    }
  }
`;
