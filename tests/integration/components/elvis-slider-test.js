import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('elvis-slider', 'Integration | Component | elvis slider', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{elvis-slider}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#elvis-slider}}
      template block text
    {{/elvis-slider}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
