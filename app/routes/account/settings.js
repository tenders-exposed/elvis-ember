import Ember from 'ember';


export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  actions: {
    settings(model){
      console.log("model", model);
    },
    deviseSendReset(current_password, password, password_confirmation){
      let self = this;
      const email = this.controller.get('model.email');
      const token = this.controller.get('model.token');
      const data =  `{"user": {"email": "${email}", "current_password": "${current_password}", "password": "${password}", "password_confirmation": "${password_confirmation}"}}`;
      console.log("data",data);
      this.get('ajax').put('/users', {
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
        (response)=>{
          self.notifications.clearAll();
          self.notifications.success('Done! Please check your inbox.', {
            autoClear: true
          });
          console.log("Response: ", response);
        }, (response)=>{
          self.notifications.clearAll();
          console.log(response);
          /*_.forEach(response.errors, (error, index) => {
            error.forEach((v) => {
              self.notifications.error(`Error: ${index } ${v}`);
            });
          });*/
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
