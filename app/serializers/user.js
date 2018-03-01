import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  // primaryKey: 'Authorization'
  //   serialize() {
  //     let json = this._super(...arguments);
  //
  //     let attributes = [
  //       'id',
  //       'email',
  //       'password',
  //       'token',
  //       'password_confirmation',
  //       'country',
  //       'name'
  //     ];
  //
  //     json.user = {};
  //
  //     attributes.forEach((v) => {
  //       json.user[v] = json[v];
  //       delete json[v];
  //     });
  //
  //     return json;
  //   }
});
