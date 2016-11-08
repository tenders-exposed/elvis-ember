import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  application: Ember.inject.controller(),

  validations: {
    password: {
      presence: true
    },
    current_password: {
      presence: true
    },
    password_confirmation: {
      presence: true
    }
  },
  isDisabled: 'disabled',
  isDisabledCheck: Ember.observer('password', 'current_password', 'password_confirmation', function() {
    let self = this;
    this.validate().then(() => {
      if (self.get('password') === self.get('password_confirmation')) {
        self.set('isDisabled', '');
      }
    }).catch(() => {
      self.set('isDisabled', 'disabled');
    });
  }),

  // @todo: the list of countries with autocomplete
  countries: [
    {
      id: 'UK',
      key: 'UK',
      text: 'United Kingdom'
    },
    {
      id: 'RO',
      key: 'RO',
      text: 'Romania'
    },
    {
      id: 'ND',
      key: 'ND',
      text: 'Netherlands'
    },
    {
      id: 'SL',
      key: 'SL',
      text: 'Slovakia'
    },
    {
      id: 'PL',
      key: 'PL',
      text: 'Poland'
    }

  ],
  selectedCountry: '',

  actions: {
    onSelectEvent(value) {
      this.set('model.country', value);
    }
  }
});
