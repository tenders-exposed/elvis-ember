import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('elvis-th-sortable', 'Integration | Component | elvis th sortable', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{elvis-th-sortable}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#elvis-th-sortable}}
      template block text
    {{/elvis-th-sortable}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
