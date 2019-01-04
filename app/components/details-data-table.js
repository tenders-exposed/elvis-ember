import Component from '@ember/component';
import $ from 'jquery';
import { computed, observer } from '@ember/object';

export default Component.extend({

  // sort - a property passed from data-table
  sortTable: observer('sort', function() {

    console.log('tring to sort2', this.get('sort'));
    let sort = this.get('sort');
    let content = this.get('content');

    let order = _.startsWith(sort, '-') ? 'asc' : 'desc';
    let field = _.trimStart(sort, '-');

    console.log('content', content);
    console.log('field', field);
    console.log('order', order);
    console.log('field typeof', (typeof content[field]));
    let ordered = _.orderBy(content, field, order);
    this.set('content', ordered);
    console.log('ordered', ordered);
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
