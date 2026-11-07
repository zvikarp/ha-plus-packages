# @ha-plus/ui

Small Home Assistant-native UI building blocks for HA+ integrations.
No runtime dependencies or globally registered custom elements.

## Use

Install the versioned `ha-plus-ui-VERSION.tgz` asset from
[GitHub releases](https://github.com/zvikarp/ha-plus-packages/releases).
Bundle the imports into the integration's frontend with a tool such as esbuild.

```js
import { appStyles, button, panelHeader, notice } from '@ha-plus/ui';

shadowRoot.append(
  Object.assign(document.createElement('style'), { textContent: appStyles }),
  panelHeader('HA+ App', { hass, narrow }),
  notice('Loading…', 'loading'),
  button('Refresh', refresh),
);
```

Include `appStyles` once in each consuming shadow root. All visual styling belongs
in this package. Apps compose the shared presentation classes and retain their
markup, state and event handlers. Add shared patterns here when a new layout is
needed. Apps must not add CSS rules, style attributes or style-property writes.

The stylesheet inherits Home Assistant's current CSS variables, including custom
themes and live light/dark changes. Fallbacks allow standalone previews. Layout
rules use logical properties for RTL and provide 44px action targets, visible
keyboard focus and reduced-motion support for action feedback.

## Exports

- `appStyles` includes `themeStyles` and the complete shared presentation system
  described below. Use this stylesheet for HA+ apps.

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

## Shared presentation classes

Use these classes with semantic HTML or Home Assistant elements. They are shared
across apps and contain all layout, spacing, typography and state styling.

| Pattern | Classes |
| --- | --- |
| Main content and section cards | `ha-plus-content`, `ha-plus-padded-card` |
| Rows and card grids | `ha-plus-row`, `ha-plus-card-grid` |
| Form layout and creation form | `ha-plus-form-grid`, `ha-plus-create` |
| Grouped cards and values | `ha-plus-group` with optional `active`, `ha-plus-value` |
| Chips | `ha-plus-chips`, `ha-plus-chip` with optional `active` |
| Detail rows | `ha-plus-detail-row` |
| Compact card layout | `ha-plus-compact`, `ha-plus-compact-content` |
| Detail card and header | `ha-plus-detail-card`, `ha-plus-card-header` |
| Avatar | `ha-plus-avatar` |
| Status and description | `ha-plus-status`, `ha-plus-description` |
| Statistics | `ha-plus-stats`, `ha-plus-stat`, `ha-plus-stat-label`, `ha-plus-stat-value` |
| Card actions and toolbar | `ha-plus-card-actions`, `ha-plus-toolbar` |
| Scrollable table and text action | `ha-plus-table`, `ha-plus-text-button` |
| Secondary text and messages | `ha-plus-muted`, `ha-plus-message` |
| Action feedback | `primary ha-plus-feedback` with `success` after completion |

Map domain states to `data-tone="success"`, `data-tone="warning"` or
`data-tone="error"` for semantic colors. Domain state names belong to the app.
The toolbar styles native buttons using `aria-pressed` for selection. Table
checkboxes retain native behavior. Card grids use the same 280px minimum in all
apps. Statistic grids use one column below a 420px container width.

All consuming shadow hosts establish an inline-size container. Applications may
keep separate classes for querying elements in their own code, but those classes
do not define local styles. The base `themeStyles` export remains available for
existing consumers.
