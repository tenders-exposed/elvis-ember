import Ember from 'ember';
import localforage from 'ember-local-forage';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  checkedItems: [],
  refresh: true,
  dataSet: [],
  columns: [
    {
      "propertyName": "plain_code",
      "title": "Code"
    }
  ],
  // init() {
  //   cpvs = this.get('cpvs');
  //   cpvs.map((cpv) => {
  //     this.get('dataSet').push([cpv.plain_code, cpv.name]);
  //   });
  //   console.log('dataSet: ', this.get('dataSet'));
  // },
  didInsertElement() {
    let self = this;
    Ember.$('#cpv-table').DataTable({
      data: this.get('cpvs'),
      columns: [
        {title: "Code"},
        {title: "Description"},
      ],
      info: false,
      paging: false,
      scrollY: "60vh",
      scrollCollapse: true,
      createdRow: function (row, data, index) {
        $(row).attr('id', 'tr-' + data[0]);
        $(row).attr('title', data[1]);
        if ($.grep(self.get('checkedItems'), (obj) => {return obj.code === data[0]}).length > 0) {
          $(row).addClass('hide');
        }
      }
    });
    Ember.$('#cpv-table tbody').on( 'click', 'tr', function () {
      self.set('refresh', false);
      Ember.$(this).toggleClass('hide');

      self.get('checkedItems').push(
        {
          code: $(this).attr('id').substr(3),
          description: $(this).attr('title')
        }
      );

      Ember.run.next(function () {
        self.set('refresh', true);
      });
    });
    Ember.$('div.chip').click(function () {
      self.set('refresh', false);
      let selected = $(this).attr('id').substr(5);
      Ember.$("#tr-"+selected).toggleClass('hide');

      let pos = self.get('checkedItems').map(obj => obj.code).indexOf(selected);
      self.get('checkedItems').splice(pos, 1);

      Ember.run.next(function () {
        self.set('refresh', true);
      });
    });
  },
  didUpdate() {
    let self = this;
    Ember.$('div.chip').click(function () {
      self.set('refresh', false);
      let selected = $(this).attr('id').substr(5);
      Ember.$("#tr-"+selected).toggleClass('hide');

      let pos = self.get('checkedItems').map(obj => obj.code).indexOf(selected);
      self.get('checkedItems').splice(pos, 1);

      Ember.run.next(function () {
        self.set('refresh', true);
      });
    });
  },
  actions: {
    toggleModal() {
      this.get('targetObject').send('toggleModal');
    },
    selectCpv(code) {
      console.log('Selected ', code);
      // console.log('Controller ', this.get('cpvs'));
      let item = this.get('cpvs').filter((value) => {
        if (value.plain_code === code) {
          value.checked = 'checked';
          return true;
        } else { return false; }
      })[0];
      console.log('Item: ', item.name);
      console.log('Checked: ', item.checked);

      this.get('checkedItems').push(code);

      console.log(this.get('checkedItems'));
    }
  }
});
