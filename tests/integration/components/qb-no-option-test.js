import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('qb-no-option', 'Integration | Component | qb no option', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{qb-no-option}}`);

  assert.equal(this.$().text().trim(), 'Loading...');

  // Template block usage:
  this.render(hbs`
    {{#qb-no-option}}
    {{/qb-no-option}}
  `);

  assert.equal(this.$().text().trim(), 'Loading...');
});
