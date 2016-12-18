import Ember from 'ember';

export default Ember.Route.extend({
  me: Ember.inject.service(),
  ajax: Ember.inject.service(),

  beforeModel(transition) {
    //console.log("transition", transition);
    let history = transition.handlerInfos;
    let lenght = history.length;
    let back = history[lenght-3];
    this.set("back", back.name)
    console.log("back transition", this.get("back"));
  },

  setupController(controller, model){
    let queryShow = this.controllerFor("network.show").get("model.query");
    console.log("queryshow ", queryShow);

    let countries = queryShow.countries;
    let years     = queryShow.years;
    let token = this.get("me.data.authentication_token");
    let email = this.get("me.data.email");

    let firstYear = _.head(years);
    let lastYear = _.last(years);
    //console.log("firstYear", firstYear);

    //not working bad request
    let query = `{ "query": {"procuring_entities": [${model.id}], "countries": ["${countries}"], "years": [${years}] }}`;

    //let query = `{ "query": {"suppliers": [${model.id}]}}`;
    let self = this;
    console.log("query" ,query);

    this.get('ajax')
      .post("/contracts/suppliers_details", {
        data: query,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': `${email}`,
          'X-User-Token': `${token}`
        }
      }).then(
      (data)=>{
        console.log("response ", data);
        controller.set("model", data.search.results[0]);
        controller.set("model.firstYear", firstYear);
        controller.set("model.lastYear", lastYear);

      },(response) => {
        self.get('notifications').clearAll();
        console.log(response);
        _.forEach(response.errors, (error, index) => {
          self.get('notifications').error(`Error: ${index } ${error.title}`);
        });
      });
  },

  actions: {
    goback(){
      console.log("go back with", this.get("back"));
      this.transitionTo(this.get("back"));
    }
  }
});
