import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    json.data.attributes.user = {
      id: json.data.attributes.id,
      email: json.data.attributes.email,
      token: json.data.attributes.token
    };

    delete json.data.attributes.id;
    delete json.data.attributes.email;
    delete json.data.attributes.token;

    return json;
  }
});
