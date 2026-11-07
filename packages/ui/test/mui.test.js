import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultHaTheme, readHaTheme, startHaThemeSync } from '../src/ha-theme.js';
import { createAppTheme, muiStyles, inlineStyles, brandLinkStyles, globalStyles } from '../src/mui.js';

test('MUI adapter preserves HA theme colors, card tokens and action sizes', () => {
  const theme = createAppTheme({ ...defaultHaTheme, mode:'dark', primary:'rgb(20, 150, 210)', backgroundDefault:'rgb(17, 17, 17)' });
  assert.equal(theme.palette.mode, 'dark');
  assert.equal(theme.palette.primary.main, 'rgb(20, 150, 210)');
  assert.equal(theme.palette.background.default, 'rgb(17, 17, 17)');
  assert.equal(theme.components.MuiButton.defaultProps.disableElevation, true);
  assert.match(theme.components.MuiCard.styleOverrides.root.boxShadow, /--ha-card-box-shadow/);
  assert.equal(muiStyles.iconAction.width, 44);
  assert.equal(inlineStyles.qrSurface.background, 'white');
  assert.equal(brandLinkStyles(true).justifyContent, 'flex-start');
  assert.equal(brandLinkStyles(false).justifyContent, 'center');
  assert.ok(Object.keys(globalStyles).some(selector => selector.includes('rjsf-field-array')));
});

test('theme bridge reads standalone defaults without an HA parent', () => {
  assert.deepEqual(readHaTheme(), defaultHaTheme);
});
