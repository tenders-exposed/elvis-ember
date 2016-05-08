import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  selectedCodes: [],
  refresh: true,
  table: {},

  // dataSet: [],
  // columns: [
  //   {
  //     'propertyName': 'key',
  //     'title': 'Code'
  //   },
  //   {
  //     'propertyName': 'name',
  //     'title': 'Description'
  //   },
  //   {
  //     'propertyName': 'doc_count',
  //     'title': 'Count'
  //   }
  // ],
  
  flattenCpvs(cpvs) {
    _.each(cpvs, function(value, key, array) {
      array[key] = _.toArray(value);
      // [array[key][1], array[key][2]] = [array[key][2], array[key][1]];
    });
  },
  
  didInsertElement() {
    let self = this;

    this.flattenCpvs(self.get('cpvs'));

    self.set('table', Ember.$('#cpv-table').DataTable({
      data: self.get('cpvs'),
      columns: [
        { title: 'Code' },
        { title: 'Count' },
        { title: 'Description' }
      ],
      info: false,
      // paging: false,
      scrollY: '60vh',
      scrollCollapse: true,
      createdRow(row, data) {
        Ember.$(row).attr('id', `tr-${data[0]}`);
        Ember.$(row).attr('title', data[1]);
        if (Ember.$.grep(self.get('selectedCodes'),
                         (obj) => {
                           return obj.code === data[0];
                         }).length > 0
        ) {
          Ember.$(row).addClass('hide');
        }
      }
    }));
    
    Ember.$('#cpv-table tbody').on('click', 'tr', function() {
      self.set('refresh', false);
      Ember.$(this).toggleClass('hide');

      self.get('selectedCodes').push(
        {
          code: Ember.$(this).attr('id').substr(3),
          description: Ember.$(this).attr('title')
        }
      );

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
    
    Ember.$('div.chip').click(function() {
      self.set('refresh', false);
      let selected = Ember.$(this).attr('id').substr(5);
      Ember.$(`#tr-${selected}`).toggleClass('hide');

      let pos = self.get('selectedCodes').map((obj) => obj.code).indexOf(selected);
      self.get('selectedCodes').splice(pos, 1);

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
  },
  
  // willClearRender() {
  //   this.set('table', {});
  // },
  
  didUpdate() {
    let self = this;
    Ember.$('div.chip').click(function() {
      self.set('refresh', false);
      let selected = Ember.$(this).attr('id').substr(5);
      Ember.$(`#tr-${selected}`).toggleClass('hide');

      let pos = self.get('selectedCodes').map((obj) => obj.code).indexOf(selected);
      self.get('selectedCodes').splice(pos, 1);

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
  },
  
  actions: {
    
    toggleModal() {
      this.get('targetObject').send('toggleCpvModal');
    },
    
    selectCpv(code) {
      // console.log('Selected ', code);
      // console.log('Controller ', this.get('cpvs'));
      let item;
      [item] = this.get('cpvs').filter((value) => {
        if (value.key === code) {
          value.checked = 'checked';
          return true;
        } else {
          return false;
        }
      });
      
      this.get('selectedCodes').push(code);
    }
  }
});
