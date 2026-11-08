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
  Pass `returnFocus` when disabling the trigger while awaiting confirmation.
  The promise resolves after HA releases the dialog focus trap.

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

## Collections and control surfaces

`collectionStyles` combines the shared theme with native-HA collection navigation,
item rows, metadata forms, responsive master/detail layouts and native dialogs.
`controlStyles` provides HA cards, sliders, preset swatches, status indicators
and a responsive control dashboard. Both exports are complete shadow-root
stylesheets. Applications supply markup and behavior without local CSS.

`actionButton`, `iconButton`, `nativeTextField` and `nativeForm` wrap HA-owned
controls, including supported modern and legacy generations.
`colorSwatch(button, rgb)` validates three RGB channels in the range 0–255 and
applies a preset color inside the shared styling layer.

`iframePanelStyles` provides the HA sidebar wrapper for an embedded application.

## React and MUI

Import `createAppTheme`, `muiStyles`, `inlineStyles`, `brandLinkStyles` and
`globalStyles` from `@ha-plus/ui/mui`. The optional adapter uses the consuming
application's MUI 7 installation. It owns component overrides, reusable layout
styles, QR presentation, brand sizing and the RJSF nested-array compatibility
rule. Compose the exported styles through MUI's `sx` API and supplied inline
style objects. Keep style definitions in the shared package.

`@ha-plus/ui/ha-theme` exports `defaultHaTheme`, `readHaTheme`,
`startHaThemeSync` and the `HaTheme` type. It synchronizes inherited HA theme
variables for same-origin iframes, follows theme changes and cleans up its timer.
Cross-origin and standalone contexts use local theme values and fallbacks.

## Bundled attribution

Run `ha-plus-ui-licenses OUTPUT_DIRECTORY` during integration builds. This copies
the package's MIT license, Apache license and attribution notice into the output
for distribution with bundled code. For Vite builds, copy them into `public`
before building so they are included in the standalone frontend too.

## Home Assistant workflows and preferences

Call `loadNativeComponents(host)` on direct panel entry before rendering HA forms.
The package selects registered HA buttons, fields, menus and dialogs, with
standalone fallbacks. Pass `hass` as the last argument to `dropdown` to use an
HA select form. `loadNativeSlider(host)` loads HA’s number-selector slider for direct IR entry.
`nativeSlider` separates drag previews from release commits. Use `focusControl`
when restoring focus through HA’s nested selector controls.

Use `showMoreInfo(host, entityId)`, `integrationUrl(domain)` and `navigate` for HA
entity and integration workflows. `showToast` uses HA notifications, and
`setActionState` supplies pending and success feedback. Keep permission checks in
the app and backend.

`applyPreferences`, `formatNumber`, `formatDateTime`, `formatEntityState` and
`relativeCalendarDate` follow the HA profile and configured timezone. Date-only
values retain their calendar date. Unit-bearing states use HA's entity formatter.
`localize` uses HA common labels and app catalogs. App catalogs currently contain
English. `localizeSchema` translates schema titles and descriptions using
`schema.<English text>` keys while preserving data keys and enum values.

React consumers can import the typed `@ha-plus/ui/ha` helpers and wrap their app in
`HaPreferencesProvider` from `@ha-plus/ui/react`. `useHaPreferences` and
`useLocalizer` follow live profile changes. `@ha-plus/ui/react-mui` provides
`PageHeader`, `PageLoading`, `PageMessage` and `RetryButton` using the shared MUI
styles. React and MUI are optional peers supplied by the consuming app.
