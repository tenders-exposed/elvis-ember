import Controller from '@ember/controller';
import EmberValidations from 'ember-validations';

export default Controller.extend(EmberValidations, {
  queryParams: ['t'],
  t: null,
  validations: {
    email: {
      presence: { message: 'the field cannot be blank' }
    }
  }

});
