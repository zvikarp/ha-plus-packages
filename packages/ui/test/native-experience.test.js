import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { preferences, formatNumber, formatDateTime, relativeCalendarDate, localize, dropdown, nativeSlider, showMoreInfo, showToast, navigate, overflowMenu, confirmDialog } from '../src/index.js';

function setup(tags = []) {
  const { window } = new JSDOM('<!doctype html><body></body>', { url: 'https://ha.example/', pretendToBeVisual: true });
  globalThis.document = window.document;
  globalThis.window = window;
  globalThis.customElements = window.customElements;
  for (const tag of tags) window.customElements.define(tag, class extends window.HTMLElement {});
  return window;
}

test('HA profile controls number formats, dates, time, timezone, direction and units', () => {
  const hass = { locale: { language: 'en', number_format: 'decimal_comma', date_format: 'DMY', time_format: '24' }, config: { time_zone: 'America/Los_Angeles', unit_system: { temperature: '°C' } } };
  assert.equal(formatNumber(hass, 1234.5), '1.234,5');
  assert.equal(formatDateTime(hass, '2026-11-07'), '7 Nov 2026');
  assert.match(formatDateTime(hass, '2026-11-07T18:00:00Z'), /10:00/);
  assert.equal(preferences(hass).hour12, false);
  assert.equal(preferences(hass).unitSystem.temperature, '°C');
  hass.locale = { language: 'he', number_format: 'none', time_format: '12' };
  assert.equal(preferences(hass).direction, 'rtl');
  assert.equal(formatNumber(hass, 1234), '1234');
  assert.equal(preferences(hass).hour12, true);
});

test('calendar relative dates count local calendar days across DST', () => {
  const hass = { locale: { language: 'en' }, config: { time_zone: 'America/New_York' } };
  assert.equal(relativeCalendarDate(hass, '2026-03-08T17:00:00Z', Date.parse('2026-03-09T16:00:00Z')), '1 day ago');
  assert.equal(formatDateTime(hass, 'invalid'), '—');
});

test('common labels use HA translations and app text stays in the English catalog', () => {
  const hass = { localize: key => key === 'ui.common.save' ? 'Native save' : undefined };
  assert.equal(localize(hass, {}, 'common.save'), 'Native save');
  assert.equal(localize(hass, { plants: '{count} plants' }, 'plants', { count: 2 }), '2 plants');
});

test('native selectors preserve numeric values and disable the form', () => {
  const view = setup(['ha-form']);
  let selected;
  const field = dropdown('duration', 'Duration', [{ value: 30, label: '30 minutes' }], 30, value => { selected = value; }, false, {});
  field.dispatchEvent(new view.CustomEvent('value-changed', { detail: { value: { selected: '0' } } }));
  assert.equal(selected, 30);
  assert.equal(field.schema[0].selector.select.options[0].value, '0');
});

test('slider previews without commands and commits once on release', () => {
  const view = setup(['ha-control-slider']);
  const previews = [], changes = [];
  const control = nativeSlider({ label: 'Brightness', value: 10, preview: n => previews.push(n), change: n => changes.push(n) });
  const emit = (type, value) => control.dispatchEvent(new view.CustomEvent(type, { detail: { value } }));
  emit('slider-moved', 20);
  emit('slider-moved', 30);
  assert.deepEqual(changes, []);
  emit('value-changed', 30);
  emit('value-changed', 30);
  emit('value-changed', 101);
  control.disabled = true;
  emit('value-changed', 40);
  assert.deepEqual(previews, [20, 30]);
  assert.deepEqual(changes, [30]);
});

test('modern overflow routes only enabled actions', () => {
  const view = setup(['ha-dropdown', 'ha-dropdown-item']);
  const calls = [];
  const menu = overflowMenu([{ label: 'Settings', run: () => calls.push(1) }, { label: 'Unavailable', disabled: true, run: () => calls.push(2) }]);
  for (const value of ['0', '1']) menu.dispatchEvent(new view.CustomEvent('wa-select', { detail: { item: { value } } }));
  assert.equal(menu.firstChild.slot, 'trigger');
  assert.deepEqual(calls, [1]);
});

test('HA events and navigation use local hosts and reject external paths', () => {
  setup();
  const host = document.createElement('div');
  let entityId, message;
  host.addEventListener('hass-more-info', event => { entityId = event.detail.entityId; });
  host.addEventListener('hass-notification', event => { message = event.detail.message; });
  assert.equal(showMoreInfo(host, 'light.kitchen'), true);
  assert.equal(showMoreInfo(host, '../config'), false);
  showToast(host, 'Saved');
  assert.equal(entityId, 'light.kitchen');
  assert.equal(message, 'Saved');
  assert.throws(() => navigate(host, '//external.example'), TypeError);
  navigate(host, '/config/integrations');
  assert.equal(window.location.pathname, '/config/integrations');
});

test('native confirmation cancels safely and restores focus', async () => {
  const view = setup(['ha-dialog']);
  const host = document.createElement('div');
  host.attachShadow({ mode: 'open' });
  const trigger = document.createElement('button');
  host.shadowRoot.append(trigger);
  document.body.append(host);
  trigger.focus();
  const result = confirmDialog(host, { title: 'Water?', message: 'Record watering?' });
  const dialog = host.shadowRoot.querySelector('ha-dialog');
  dialog.dispatchEvent(new view.CustomEvent('closed'));
  assert.equal(await result, false);
  await new Promise(setImmediate);
  assert.equal(host.shadowRoot.activeElement, trigger);
});

test('removing a native confirmation host resolves cancellation', async () => {
  setup(['ha-dialog']);
  const host = document.createElement('div');
  host.attachShadow({ mode: 'open' });
  document.body.append(host);
  const result = confirmDialog(host, { title: 'Water?', message: 'Confirm?' });
  host.remove();
  assert.equal(await result, false);
});

test('schema translation preserves enum values and data keys', async () => {
  const { localizeSchema } = await import('../src/localize.js');
  const schema = { title: 'Bridge', properties: { name: { title: 'Name', enum: ['Name'] } } };
  const translated = localizeSchema(undefined, schema, { 'schema.Name': 'Display name' });
  assert.equal(translated.properties.name.title, 'Display name');
  assert.deepEqual(translated.properties.name.enum, ['Name']);
  assert.equal(schema.properties.name.title, 'Name');
});


test('empty native selections retain a nonempty HA value and block disabled changes', () => {
  const view = setup(['ha-form']);
  const changes = [];
  const field = dropdown('mode', 'Mode', [{ value: '', label: 'None' }], '', value => changes.push(value), false, {});
  assert.equal(field.data.selected, '0');
  assert.equal(field.schema[0].required, true);
  field.dispatchEvent(new view.CustomEvent('value-changed', { detail: { value: { selected: '0' } } }));
  field.disabled = true;
  field.dispatchEvent(new view.CustomEvent('value-changed', { detail: { value: { selected: '0' } } }));
  assert.deepEqual(changes, ['']);
});

test('focus restoration reaches the focusable control in nested HA selectors', async () => {
  setup(['ha-form', 'ha-selector', 'ha-selector-select', 'ha-select', 'ha-picker-field']);
  const { focusControl } = await import('../src/native.js');
  const form = document.createElement('ha-form');
  const selector = document.createElement('ha-selector');
  const select = document.createElement('ha-selector-select');
  const input = document.createElement('input');
  form.attachShadow({ mode: 'open' }).append(selector);
  selector.attachShadow({ mode: 'open' }).append(select);
  const dropdown = document.createElement('ha-select');
  const picker = document.createElement('ha-picker-field');
  select.attachShadow({ mode: 'open' }).append(dropdown);
  dropdown.attachShadow({ mode: 'open' }).append(picker);
  picker.attachShadow({ mode: 'open' }).append(input);
  document.body.append(form);
  await focusControl(form);
  assert.equal(picker.shadowRoot.activeElement, input);
});

test('HA standard sliders preserve release-only commits across older versions', () => {
  const view = setup(['ha-slider']);
  const changes = [];
  const slider = nativeSlider({ label: 'Brightness', value: 10, change: value => changes.push(value) });
  assert.equal(slider.localName, 'ha-slider');
  slider.value = 25;
  slider.dispatchEvent(new view.Event('input'));
  assert.deepEqual(changes, []);
  slider.dispatchEvent(new view.Event('change'));
  assert.deepEqual(changes, [25]);
});


test('confirmation restores an explicitly supplied control after the caller reenables it', async () => {
  const view = setup(['ha-dialog']);
  view.customElements.define('ha-button', class extends view.HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).append(document.createElement('button'));
    }
  });
  const host = document.createElement('div');
  host.attachShadow({ mode: 'open' });
  const trigger = document.createElement('ha-button');
  trigger.disabled = true;
  host.shadowRoot.append(trigger);
  document.body.append(host);
  const result = confirmDialog(host, { title: 'Water?', message: 'Record?', returnFocus: trigger });
  host.shadowRoot.querySelector('ha-dialog [slot="secondaryAction"]').click();
  assert.equal(await result, false);
  trigger.disabled = false;
  await new Promise(setImmediate);
  assert.equal(trigger.shadowRoot.activeElement.localName, 'button');
});
