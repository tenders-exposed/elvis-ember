import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  serialize() {
    let json = this._super(...arguments);

    let attributes = [
      'email',
      'password',
      'password_confirmation'
    ];

    Object.keys(json).forEach((k) => {
      if (!attributes.includes(k)) {
        delete json[k];
      }
    });

    return json;
  }
});
