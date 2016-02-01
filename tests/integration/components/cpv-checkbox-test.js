import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cpv-checkbox', 'Integration | Component | cpv checkbox', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{cpv-checkbox}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#cpv-checkbox}}
      template block text
    {{/cpv-checkbox}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
