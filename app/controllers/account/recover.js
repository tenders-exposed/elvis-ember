import Ember from 'ember';
import EmberValidations from 'ember-validations';

const { Controller } = Ember;

export default Controller.extend(EmberValidations, {
  queryParams: ['t'],
  t: null,
  validations: {
    email: {
      presence: { message: 'the field cannot be blank' },
      format: {
        with: /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
        message: 'your email is not the correct format'
      }
    }
  }

});
