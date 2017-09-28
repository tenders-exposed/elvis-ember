import Ember from 'ember';

const { Component, observer } = Ember;

export default Component.extend({
  // search word
  search: '',
  // field Name to search
  searchField: '',
  // label for search input placeholder
  searchLabel: 'find...',
  // the content to revert to after a search was performed
  defaultContent: {},
  // table content
  content: {},

  // the action to send to the controller after a click on a table-row
  action: '',
  tableContent: {},
  // columns for the table = {fieldName: "LabelName", ....}
  fields: {},
  // class for data-table element
  class: '',

  sortBy: '',
  orderBy: 'asc',

  // reset all variables regarding search if search input has no value
  contentObserver: observer('search', function() {
    if (!this.get('search')) {
      this.set('searchField', '');
      this.set('searchLabel', '');
      this.set('content', this.get('defaultContent'));
    }
  }),

  didUpdateAttrs() {
    this.set('content', this.get('tableContent'));
    this.set('defaultContent', this.get('tableContent'));
  },

  didReceiveAttrs() {
    this.set('content', this.get('tableContent'));
    this.set('defaultContent', this.get('tableContent'));
  },

  actions: {
    changeSortOrder() {
      let orderBy = this.get('orderBy') === 'asc' ? 'desc' : 'asc';
      this.set('orderBy', orderBy);
      if (this.get('sortBy')) {
        let sortBy = this.get('sortBy');
        if (sortBy === 'value') {
          sortBy = 'unformattedValue';
        }
        let ordered = _.orderBy(this.get('content'), sortBy, orderBy);
        this.set('content', ordered);
      }
    },
    sortTable(sortBy) {
      this.set('sortBy', sortBy);
      if (sortBy === 'value') {
        sortBy = 'unformattedValue';
      }
      let ordered = _.orderBy(this.get('content'), sortBy, this.get('orderBy'));
      this.set('content', ordered);

    },

    selectRow(selection) {
      this.sendAction('action', selection);
    },

    // set the search field/label for search input
    searchColumn(label, field) {
      this.set('searchField', field);
      this.set('searchLabel', `find ${label}...`);
    },

    /*
    search table
    - everything transformed in lowercase
    - if/else a column was set to search into
    - reset the content of the table with the new searched one
     */
    searchTable() {
      let searchField = this.get('searchField');
      let searchWord = _.toLower(_.toString(this.get('search')));
      let self = this;

      let mkRegex = (str) => {
        let ex = str.replace('*', '.*')
          .replace('?', '.{0,1}');
        return new RegExp(`^.*${ex}.*$`, 'gi');
      };

      let content = _.filter(self.get('defaultContent'), (o) => {
        let match = false;
        if (!searchField) {
          _.forEach(self.get('fields'), (value, fieldName) => {
            let fieldValue = _.toLower(_.toString(o[fieldName]));
            match = match || fieldValue.match(mkRegex(searchWord));
          });
        } else {
          let fieldValue = _.toLower(_.toString(o[searchField]));
          match = match || fieldValue.match(mkRegex(searchWord));
        }
        return match;
      });
      // set the new filtered content
      this.set('content', content);
    }
  }
});
