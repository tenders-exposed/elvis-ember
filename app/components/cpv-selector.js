import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  selectedCodes: [],
  refresh: true,
  table: {},

  flattenCpvs(cpvs) {
    _.each(cpvs, function(value, key, array) {
      array[key] = _.toArray(value);
    });
  },

  didInsertElement() {
    // TODO: This should probably be refactored into smaller bits
    let self = this;

    this.flattenCpvs(self.get('cpvs'));

    self.set('table', Ember.$('#cpv-table').DataTable({
      data: self.get('cpvs'),
      columns: [
        { title: 'Count' },
        { title: 'Description' },
        { title: 'Code' },
      ],
      language: {
        emptyTable: '<p class="text-center">No CPV codes available for the selected <b>countries</b> and <b>years</b>.</p>'
      },
      info: false,
      paging: false,
      scrollY: '60vh',
      scrollCollapse: true,
      createdRow(row, data) {
        Ember.$(row).attr('title', data[1]);
        Ember.$(row).attr('id', `tr-${data[2]}`);
        if (Ember.$.grep(self.get('selectedCodes'),
                         (obj) => {
                           return obj.id === data[0];
                         }).length > 0
        ) {
          Ember.$(row).addClass('hide');
        }
      }
    }));

    Ember.$('#cpv-table tbody').on('click', 'tr', function() {
      self.set('refresh', false);
      Ember.$(this).toggleClass('hide');

      self.get('selectedCodes').pushObject(
        {
          id: Ember.$(this).attr('id').substr(3),
          text: Ember.$(this).attr('title')
        }
      );
      self.get('query.cpvs').push(Ember.$(this).attr('id').substr(3).replace(/0*$/g, ''));

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
  },

  actions: {

    toggleModal() {
      this.get('targetObject').send('toggleCpvModal');
    },

    selectCpv(id) {
      let item;
      [item] = this.get('cpvs').filter((value) => {
        if (value.id === id) {
          value.checked = 'checked';
          return true;
        } else {
          return false;
        }
      });

      this.get('selectedCodes').pushObject(id);
    }
  }
});
