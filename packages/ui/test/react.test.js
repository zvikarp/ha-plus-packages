import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { HaPreferencesProvider, useLocalizer, useHaPreferences } from '../src/react.js';
import { PageLoading, PageMessage, PageHeader } from '../src/react-mui.js';

test('React preferences follow live HA profiles and clean up the subscription', async () => {
  const { window } = new JSDOM('<!doctype html><home-assistant></home-assistant><div id="root"></div>');
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.querySelector('home-assistant');
  host.hass = { locale: { language: 'en', number_format: 'comma_decimal' } };
  let sync, cleared;
  window.setInterval = callback => { sync = callback; return 42; };
  window.clearInterval = id => { cleared = id; };
  const messages = { count: '{count} devices' };
  function Content() {
    const t = useLocalizer(messages);
    const settings = useHaPreferences();
    return createElement('p', null, `${settings.direction} ${t('count', { count: 1234 })}`);
  }
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(createElement(HaPreferencesProvider, null, createElement(Content))));
  assert.equal(document.querySelector('p').textContent, 'ltr 1,234 devices');
  host.hass.locale = { language: 'he', number_format: 'decimal_comma' };
  await act(async () => sync());
  assert.equal(document.documentElement.dir, 'rtl');
  assert.equal(document.documentElement.lang, 'he');
  assert.equal(document.querySelector('p').textContent, 'rtl 1.234 devices');
  await act(async () => root.unmount());
  assert.equal(cleared, 42);
  delete globalThis.document;
  delete globalThis.window;
});

test('shared React states render standalone with accessible loading, error and headings', () => {
  assert.match(renderToStaticMarkup(createElement(PageLoading, {})), /aria-busy="true"/);
  assert.match(renderToStaticMarkup(createElement(PageMessage, { title: 'Unavailable', message: 'Retry', kind: 'error' })), /role="alert"/);
  assert.match(renderToStaticMarkup(createElement(PageHeader, { title: 'Bridges' })), /<h1/);
});
