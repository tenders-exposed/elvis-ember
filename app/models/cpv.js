import DS from 'ember-data';

export default DS.Model.extend({
  plain_code: DS.attr(),
  name: DS.attr(),
  checked: DS.attr('string', {defaultValue: ''}),

  checkbox: Ember.computed('checked', function() {
    // let checked = this.get('checked');
    // let plain_code = this.get('plain_code');
    return 'checked';
    // return `
    //   <input type="checkbox" ${checked} id="${plain_code}" />B
    //   <label for="${plain_code}">&nbsp;</label>
    // `;
  })
});
