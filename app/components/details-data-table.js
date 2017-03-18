import Ember from 'ember';

const { Component, observer, $ } = Ember;

export default Component.extend({
  // sort - a property passed from data-table
  sortTable: observer('sort', () => {
    let order = _.startsWith(this.get('sort'), '-') ? 'asc' : 'desc';
    let field = _.trimStart(this.get('sort'), '-');

    let ordered = _.orderBy(this.get('content'), field, order);
    this.set('content', ordered);
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
