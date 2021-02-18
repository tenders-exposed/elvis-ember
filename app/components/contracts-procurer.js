import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  actions: {
    redirectLink(link) {
      window.open(link);
    }
  }
});
