import Ember from 'ember';

export default Ember.Component.extend({
  // sort - a property passed from data-table
  sortTable: Ember.observer('sort',function () {
    let order = _.startsWith(this.get('sort'), '-') ? 'asc' : 'desc';
    let field = _.trimStart(this.get('sort'), '-');
    //console.log('field ',field);

    let ordered = _.orderBy(this.get('content'),field, order);
    this.set('content', ordered);
  })
});
