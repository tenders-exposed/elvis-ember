import Ember from 'ember';
//node_modules/ember-data-table/addon/components/th-sortable.js
import ThSortable from 'ember-data-table/components/th-sortable';

export default ThSortable.extend({
  actions:{
    search(label, field){
      console.log("search Column ", label);
      this.sendAction('action', label, field);

    }
  }
});
