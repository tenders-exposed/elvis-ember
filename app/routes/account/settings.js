import Ember from 'ember';


export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  actions: {
    settings(model){
      console.log("model", model);
    },
    deviseSendReset(current_password, password, password_confirmation){
      const email = this.controller.get('model.email');
      const token = this.controller.get('model.token');
      const data =  `{"user": {"email": "${email}", "current_password": "${current_password}", "password": "${password}", "password_confirmation": "${password_confirmation}"}}`;
      this.get('ajax').patch('/users', {
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `'${email}'`,
          'X-User-Token': `'${token}'`
        }
      })
        .then((response)=>{
           console.log("Response: ", response);
        }, (response)=>{
          console.log("Response: ", response);
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
