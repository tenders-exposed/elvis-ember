import Ember from 'ember';

export default Ember.Component.extend({
  search: "",
  searchField: "",
  searchLabel: "find...",
  defaultContent: {no: 'content'},

  contentObserver: Ember.observer('search', function () {
    console.log('search = ', this.get('search'));
    if(!this.get('search')) {
      this.set('searchField', '');
      this.set('searchLabel', '');
      this.set('content', this.get('defaultContent'));
    }
  }),

  sortTable: Ember.observer('sort',function () {
    let order = _.startsWith(this.get('sort'), '-') ? 'asc' : 'desc';
    let field = _.trimStart(this.get('sort'), '_-');
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

    searchColumn(label, field){
      this.set('searchField', field);
      this.set('searchLabel', `find ${label}...`);
    },

    searchTable(){
      const searchField = this.get('searchField');
      const searchWord = _.toLower(_.toString(this.get('search')));
      let self = this;

      let content = _.filter(this.get('defaultContent'), function (o) {
        let match = false;
        //if no column has been selected search all columns
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
