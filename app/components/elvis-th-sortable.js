import ThSortable from 'ember-data-table/components/th-sortable';

export default ThSortable.extend({
  actions: {
    search(label, field) {
      this.sendAction('action', label, field);
    }
  }
});
