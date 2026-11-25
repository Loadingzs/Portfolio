const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('script carrega sem depender de um botão de download com ID específico', () => {
  const source = fs.readFileSync(path.join(__dirname, '../static/js/script.js'), 'utf8');
  const documentEvents = [];
  const windowEvents = [];
  const context = {
    document: {
      addEventListener: event => documentEvents.push(event),
      getElementById: () => null,
    },
    window: { addEventListener: event => windowEvents.push(event) },
    console: { log() {}, warn() {}, error() {} },
  };

  assert.doesNotThrow(() => vm.runInNewContext(source, context));
  assert.ok(documentEvents.includes('DOMContentLoaded'));
  assert.ok(windowEvents.includes('load'));
  assert.equal(typeof context.window.PortfolioApp.toggleTheme, 'function');
});
