import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  serialize(snapshot, options) {
    let json = this._super(...arguments);

    let attributes = [
      'id',
      'email',
      'password',
      'token',
      'password_confirmation',
      'country',
      'name'
    ];

    json.user = {};

    attributes.forEach((v) => {
      json.user[v] = json[v];
      delete json[v];
    });

    console.log(json);

    return json;
  }
});
