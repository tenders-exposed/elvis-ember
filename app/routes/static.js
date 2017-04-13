import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params, transition) {
    let model = params;
    return model;
  },
  renderTemplate(controller, model) {
    this.render(`partials/static/${model.target}`, {
      controller: controller
    });
  }
});
