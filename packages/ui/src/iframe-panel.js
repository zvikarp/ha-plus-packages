import { panelHeaderStyles } from "./styles.js";
/*! Adapted from HA+ Matter Hub. Licensed under Apache-2.0. See ha-plus-ui.NOTICE and ha-plus-ui.LICENSE-APACHE-2.0 in the distribution. */
export const iframePanelStyles = `${panelHeaderStyles}
  :host {
    position: relative;
    width: 100%;
    height: 100dvh;
    box-sizing: border-box;
    overflow: hidden;
    display: grid;
    grid-template-rows: var(--header-height, 56px) minmax(0, 1fr);
    min-width: 0;
    min-height: 0;
  }

  iframe {
    display: block;
    border: 0;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

`;
