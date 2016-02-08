import Ember from 'ember';
import localforage from 'ember-local-forage';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  columns: [
    {
      "propertyName": "plain_code",
      "title": "Code"
    }
  ],
  actions: {
    toggleModal() {
      this.get('targetObject').send('toggleModal');
    },
    selectCpv(code) {
      console.log('Selected ', code);
      // console.log('Controller ', this.get('cpvs'));
      let item = this.get('cpvs').filter((value) => {
        if (value.plain_code === code) {
          value.checked = 'checked';
          return true;
        } else { return false; }
      })[0];
      console.log('Item: ', item.name);
      console.log('Checked: ', item.checked);

      this.get('checkedItems').push(code);

      console.log(this.get('checkedItems'));

      // item.selected === false && item.selected = true || item.selected = false;
      // if (item.checked !== 'checked') {
      //   item.checked = 'checked';
      //   return;
      // }
    }
  }
});
