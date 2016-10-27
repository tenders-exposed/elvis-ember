import Ember from 'ember';


export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  actions: {
    settings(model){
      console.log("model",model);
    },
    deviseSendReset(password, password_confirmation){
      let email= this.controller.get('model.email');
      let data=  {"user": { "email": email, "password": password,"password_confirmation": password_confirmation}};
      this.get('ajax').post('/users/password', {data: data,headers: { 'Content-Type': 'application/json' } })
        .then((response)=>{
           console.log("Response: ",response);
        }, (response)=>{
          console.log("Response: ",response);
        });

    }
  },

  activate() {
    this.notifications.clearAll();
    this.notifications.warning('Warning, this page contains unfinished features!', {
      autoClear: true,
      clearDuration: 10000
    });
  }
});
