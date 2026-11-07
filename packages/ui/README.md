# @ha-plus/ui

Small Home Assistant-native UI building blocks for HA+ integrations.
No runtime dependencies or globally registered custom elements.

## Use

Install the versioned `ha-plus-ui-VERSION.tgz` asset from
[GitHub releases](https://github.com/zvikarp/ha-plus-packages/releases).
Bundle the imports into the integration's frontend with a tool such as esbuild.

```js
import { themeStyles, button, panelHeader, notice } from '@ha-plus/ui';

shadowRoot.append(
  Object.assign(document.createElement('style'), { textContent: themeStyles }),
  panelHeader('HA+ App', { hass, narrow }),
  notice('Loading…', 'loading'),
  button('Refresh', refresh),
);
```

Include `themeStyles` once in each consuming shadow root before app-specific
styles. It inherits Home Assistant's current CSS variables, including custom
themes and live light/dark changes. Fallbacks allow standalone previews. Layout
rules use logical properties for RTL and provide 44px action targets and visible
keyboard focus. Keep feature-specific layouts and state in the application.

## Exports

- `themeStyles` provides typography, HA cards, buttons, inputs, selectors, dialogs,
  notices and panel layout. Use `.primary`, `.danger` or `.icon-button` for action
  variants and `.ha-plus-content` for the responsive main content area. Supply
  accessible names for icon-only buttons. Cards have no forced padding.
- `el(tag, text?, className?)` creates an element using safe text content.
- `icon(name)` creates HA's `ha-icon`. Label its surrounding control.
- `button(text, handler, disabled = false, className?)` creates a non-submitting
  native button. Native disabled behavior blocks activation.
- `textField(label, { name, required = false, maxLength, disabled = false })`
  returns `{ field, input }` for a native labeled text input with form validation.
- `dropdown(key, label, options, value, change, disabled)` creates a themed
  select-only combobox with a visible label and listbox. Options contain `value`
  and `label`. It supports arrows, Home, End, Escape and closing on focus exit.
  Update the caller's selected value and rerender after `change(value)`.
- `panelHeader(title, { hass, narrow, actions = [] })` creates a panel header
  using HA's sidebar menu button. Pass updated HA state when rerendering.
- `notice(message, kind = 'status')` creates a live status message. Supported
  kinds are `status`, `loading`, `empty` and `error`.
- `confirmDialog(host, { title, message, confirmLabel = 'Confirm', cancelLabel =
  'Cancel' })` returns a promise resolving to true only for explicit confirmation.
  The host needs an attached shadow root containing `themeStyles`. Native dialog
  owns focus trapping, Escape and focus restoration. Supplied text is never HTML.
  Keep the host attached and preserve the dialog while awaiting confirmation.

The native `ha-card`, `ha-icon` and `ha-menu-button` elements are owned by Home
Assistant and must be available in the host frontend. They are isolated here to
make HA compatibility updates small. Standalone apps need their own theme bridge
and component adapter. No React or MUI runtime is included.
