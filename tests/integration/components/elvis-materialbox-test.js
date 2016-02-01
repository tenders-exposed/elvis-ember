import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('elvis-materialbox', 'Integration | Component | elvis materialbox', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{elvis-materialbox}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#elvis-materialbox}}
      template block text
    {{/elvis-materialbox}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
