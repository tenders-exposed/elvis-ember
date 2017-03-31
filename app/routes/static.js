import Ember from 'ember';

const { Route } = Ember;
export default Route.extend({
  model(params, transition) {
    let model = {};
    model.partialUrl = transition.intent.url;
    return model;
  }
});