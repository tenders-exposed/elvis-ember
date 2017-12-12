import Ember from 'ember';

const { Component, computed, observer, $ } = Ember;

export default Component.extend({
  tableContent: computed('content', function() {
    return this.get('content');
  }),
  tableSort: computed('sort', function() {
    return this.get('sort');
  }),
  // sort - a property passed from data-table
  sortTable: observer('tableSort', () => {
    let sort = this.get('tableSort');
    let content = this.get('tableContent');

    let order = _.startsWith(sort, '-') ? 'asc' : 'desc';
    let field = _.trimStart(sort, '-');

    let ordered = _.orderBy(content, field, order);
    this.set('tableContent', ordered);
  }),
  didInsertElement() {
    $('.show-more').bind('click', function() {
      let parent = $(this).parents('.more-contracts');
      parent.find('.rest-contracts').removeClass('hide');
      parent.find('.hide-contracts').removeClass('hide');
      parent.find('.show-contracts').addClass('hide');
    });
    $('.hide-contracts').bind('click', function() {
      let parent = $(this).parents('.more-contracts');
      parent.find('.rest-contracts').addClass('hide');
      $(this).addClass('hide');
      parent.find('.show-contracts').removeClass('hide');
    });
  }
});
