import Ember from 'ember';

export default Ember.Component.extend({
  //search word
  search: "",
  //field Name to search
  searchField: "",
  //label for search input placeholder
  searchLabel: "find...",
  //the content to revert to after a search was performed
  defaultContent: {},
  //table content
  content: {},

  //the action to send to the controller after a click on a table-row
  action: "",
  tableContent: {},
  //columns for the table = {fieldName: "LabelName", ....}
  fields: {},
  //class for data-table element
  class: "",

  //reset all variables regarding search if search input has no value
  contentObserver: Ember.observer('search', function () {
    console.log('search = ', this.get('search'));
    if(!this.get('search')) {
      this.set('searchField', '');
      this.set('searchLabel', '');
      this.set('content', this.get('defaultContent'));
    }
  }),
  // sort - a property passed from data-table
  sortTable: Ember.observer('sort',function () {
    let order = _.startsWith(this.get('sort'), '-') ? 'asc' : 'desc';
    let field = _.trimStart(this.get('sort'), '-');
    console.log('field ',field);

    let ordered = _.orderBy(this.get('content'),field, order);
    this.set('content', ordered);
  }),

  didInsertElement(){
    this.set('content', this.get('tableContent'));
    this.set('defaultContent', this.get('tableContent'));
  },

  actions: {
    selectRow(selection){
      this.sendAction('action', selection);
    },

    //set the search field/label for search input
    searchColumn(label, field){
      this.set('searchField', field);
      this.set('searchLabel', `find ${label}...`);
    },

    /*
    search table
    - everything transformed in lowercase
    - if/else a column was set to search into
    - reset the content of the table with the new searched one
     */
    searchTable(){
      const searchField = this.get('searchField');
      const searchWord = _.toLower(_.toString(this.get('search')));
      const self = this;

      let content = _.filter(this.get('defaultContent'), function (o) {
        let match = false;
        if(!searchField) {
          _.forEach(self.get('fields'), function(value, fieldName) {
            const fieldValue = _.toLower(_.toString(o[fieldName]));
            match = match || fieldValue.indexOf(searchWord) >= 0;
            //console.log('fieldName = '+ fieldName + ' field Value = ' + fieldValue + ' match = ' + fieldValue.indexOf(searchWord));
          });
        } else {
          const fieldValue = _.toLower(_.toString(o[searchField]));
          match = fieldValue.indexOf(searchWord) >= 0;
        }
        return match;
      });

      //set the new filtered content
      this.set('content', content);
    }
  }
});
