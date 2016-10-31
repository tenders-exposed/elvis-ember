import Ember from 'ember';
import EmberValidations from 'ember-validations';
//import Validator from 'ember-model-validator/mixins/model-validator';

export default Ember.Controller.extend(EmberValidations,{
  needs: ['application'],

  validations: {
    password:{
      presence: true
    },
    current_password:{
      presence: true
    },
    password_confirmation: {
      presence: true
    }
  },
  isDisabled: "disabled",
  isDisabledCheck: Ember.observer('password', 'current_password','password_confirmation',function() {
    let self = this;
    this.validate().then(() =>{
      if(self.get('password') === self.get('password_confirmation')){
        self.set('isDisabled', "");
      }
    }).catch(() =>{
      self.set('isDisabled', "disabled");
    });
  }),

  countries: [
    {
      id: "UK",
      key: "UK",
      text: "United Kingdom"
    },
    {
      id: "RO",
      key: "RO",
      text: "Romania"
    },
    {
      id: "ND",
      key: "ND",
      text: "Netherlands"
    },
    {
      id: "SL",
      key: "SL",
      text: "Slovakia"
    },
    {
      id: "PL",
      key: "PL",
      text: "Poland"
    }

  ],
  selectedCountry: '',

  actions:{
    onSelectEvent(value){
      this.set('model.country', value);
    }
  }
});
