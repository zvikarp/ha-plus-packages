import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { button, el, icon, textField, dropdown, panelHeader, notice, confirmDialog, themeStyles } from '../src/index.js';

function setup() {
  const { window } = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual:true });
  globalThis.document = window.document;
  return window;
}

test('elements treat content as text and buttons never submit surrounding forms', () => {
  setup();
  const node = el('p', '<img src=x onerror=alert(1)>');
  assert.equal(node.children.length, 0);
  let clicks = 0;
  const control = button('Apply', () => clicks++);
  assert.equal(control.type, 'button');
  control.click();
  assert.equal(clicks, 1);
  control.disabled = true;
  control.click();
  assert.equal(clicks, 1);
  assert.equal(icon('mdi:home').getAttribute('icon'), 'mdi:home');
});

test('selector supports selection, arrows, Home, End, Escape, Tab exit and disabled state', () => {
  const window = setup();
  const changes = [];
  const options = [{ value:1, label:'One' }, { value:2, label:'Two' }, { value:3, label:'Three' }];
  const field = dropdown('mode', 'Mode', options, 2, value => changes.push(value), false);
  document.body.append(field);
  const trigger = field.querySelector('[role=combobox]');
  const choices = [...field.querySelectorAll('[role=option]')];
  const key = (node, key) => node.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles:true, cancelable:true }));
  trigger.click();
  assert.equal(document.activeElement, choices[1]);
  key(choices[1], 'End');
  assert.equal(document.activeElement, choices[2]);
  key(choices[2], 'ArrowDown');
  assert.equal(document.activeElement, choices[0]);
  key(choices[0], 'ArrowUp');
  assert.equal(document.activeElement, choices[2]);
  key(choices[2], 'Home');
  assert.equal(document.activeElement, choices[0]);
  key(choices[0], 'Escape');
  assert.equal(document.activeElement, trigger);
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  trigger.click();
  choices[2].click();
  assert.deepEqual(changes, [3]);
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  trigger.click();
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(field.querySelector('[role=listbox]').hidden, true);
  const disabled = dropdown('mode', 'Mode', options, 1, () => assert.fail('Disabled selector changed'), true);
  document.body.append(disabled);
  disabled.querySelector('button').click();
  assert.equal(disabled.querySelector('[role=listbox]').hidden, true);
});

test('selectors have unique accessible labels and empty options are safe', () => {
  const window = setup();
  const first = dropdown('a', 'First', [], null, () => {}, false);
  const second = dropdown('b', 'Second', [], null, () => {}, false);
  document.body.append(first, second);
  assert.notEqual(first.querySelector('span').id, second.querySelector('span').id);
  const trigger = first.querySelector('button');
  assert.equal(trigger.getAttribute('aria-labelledby'), first.querySelector('span').id);
  trigger.dispatchEvent(new window.KeyboardEvent('keydown', { key:'ArrowDown', bubbles:true }));
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
});

test('panel header passes HA state to its native sidebar control', () => {
  setup();
  const hass = { states:{} };
  const refresh = button('Refresh', () => {});
  const header = panelHeader('HA+ Modes', { hass, narrow:true, actions:[refresh] });
  assert.equal(header.querySelector('ha-menu-button').hass, hass);
  assert.equal(header.querySelector('ha-menu-button').narrow, true);
  assert.equal(header.querySelector('h1').textContent, 'HA+ Modes');
  assert.equal(header.lastChild, refresh);
});

test('loading, empty and error notices expose accessible status', () => {
  setup();
  assert.equal(notice('Loading', 'loading').getAttribute('aria-busy'), 'true');
  assert.equal(notice('No plants', 'empty').getAttribute('role'), 'status');
  assert.equal(notice('Failed', 'error').getAttribute('role'), 'alert');
  assert.throws(() => notice('Oops', 'unsupported'), TypeError);
});

test('dialog resolves only explicit confirmation, cleans up and safely renders supplied text', async () => {
  const window = setup();
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  const host = document.createElement('div');
  host.attachShadow({ mode:'open' });
  document.body.append(host);
  for (const [value, expected] of [['cancel', false], ['', false], ['confirm', true]]) {
    const pending = confirmDialog(host, { title:'Confirm?', message:'<b>Untrusted plant name</b>' });
    const dialog = host.shadowRoot.querySelector('dialog');
    assert.equal(dialog.querySelector('b'), null);
    assert.equal(dialog.querySelector('button').autofocus, true);
    assert.equal(dialog.querySelector('form').method, 'dialog');
    dialog.returnValue = value;
    dialog.dispatchEvent(new window.Event('close'));
    assert.equal(await pending, expected);
    assert.equal(host.shadowRoot.querySelector('dialog'), null);
  }
  window.HTMLDialogElement.prototype.showModal = () => { throw new Error('Cannot open'); };
  await assert.rejects(confirmDialog(host, { title:'Confirm?', message:'Test' }), /Cannot open/);
  assert.equal(host.shadowRoot.querySelector('dialog'), null);
});

test('theme styles inherit HA tokens and support narrow screens, RTL and visible keyboard focus', () => {
  assert.match(themeStyles, /var\(--primary-color/);
  assert.match(themeStyles, /var\(--ha-card-background/);
  assert.match(themeStyles, /var\(--primary-font-family/);
  assert.match(themeStyles, /inset-inline:0/);
  assert.match(themeStyles, /focus-visible/);
  assert.match(themeStyles, /min-height:44px/);
  assert.match(themeStyles, /max-width:calc\(100% - 32px\)/);
});

test('text fields expose native labels, constraints, disabled state and safe text', () => {
  setup();
  const { field, input } = textField('<Group>', { name:'group', required:true, maxLength:80, disabled:true });
  document.body.append(field);
  assert.equal(input.labels[0], field);
  assert.equal(input.name, 'group');
  assert.equal(input.required, true);
  assert.equal(input.maxLength, 80);
  assert.equal(input.disabled, true);
  assert.equal(field.querySelector('span').textContent, '<Group>');
  assert.equal(field.querySelector('group'), null);
});

test('app stylesheet owns responsive layouts, semantic tones and reduced-motion feedback', async () => {
  const { appStyles } = await import('../src/index.js');
  assert.ok(appStyles.startsWith(themeStyles));
  for (const name of ['ha-plus-form-grid', 'ha-plus-card-grid', 'ha-plus-detail-card', 'ha-plus-stats', 'ha-plus-table', 'ha-plus-feedback']) {
    assert.ok(appStyles.includes(`.${name}`), `Missing shared pattern ${name}`);
  }
  assert.match(appStyles, /\[data-tone=success\]/);
  assert.match(appStyles, /\[data-tone=warning\]/);
  assert.match(appStyles, /\[data-tone=error\]/);
  assert.match(appStyles, /@container \(max-width: 420px\)/);
  assert.match(appStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(appStyles, /animation: none/);
  assert.doesNotMatch(appStyles, /\.water|\.overdue|\.needs_attention|modes_plus|plant_care_plus/);
});

test('native HA helpers support modern and legacy controls, forms and color presets', async () => {
  const window = setup();
  globalThis.customElements = window.customElements;
  const { actionButton, iconButton, nativeTextField, nativeForm, colorSwatch } = await import('../src/index.js');
  let calls = 0;
  const legacy = actionButton('Delete', () => calls++, false, 'danger');
  assert.equal(legacy.localName, 'mwc-button');
  assert.ok(legacy.classList.contains('destructive'));
  window.customElements.define('ha-button', class extends window.HTMLElement {});
  const modern = actionButton('Save', () => calls++, true, 'accent');
  assert.equal(modern.localName, 'ha-button');
  assert.equal(modern.appearance, 'accent');
  modern.click();
  assert.equal(calls, 0);
  modern.disabled = false;
  modern.click();
  assert.equal(calls, 1);
  assert.equal(iconButton('Refresh', 'mdi:refresh', () => {}).label, 'Refresh');
  let draft;
  const field = nativeTextField('Name', 'Before', value => { draft = value; });
  field.value = 'After';
  field.dispatchEvent(new window.Event('input'));
  assert.equal(draft, 'After');
  const form = nativeForm({}, [], {}, value => { draft = value; });
  form.dispatchEvent(new window.CustomEvent('value-changed', { detail:{ value:{ name:'Test' } } }));
  assert.deepEqual(draft, { name:'Test' });
  const swatch = document.createElement('button');
  colorSwatch(swatch, [255, 90, 80]);
  assert.equal(swatch.style.backgroundColor, 'rgb(255, 90, 80)');
  for (const invalid of [null, [], [256, 0, 0], [0, -1, 0], [0, NaN, 0], ['0', 0, 0]]) {
    assert.throws(() => colorSwatch(swatch, invalid), TypeError);
  }
});
