import ElvisJstree from 'ember-cli-jstree/components/ember-jstree';
import { get } from '@ember/object';

export default ElvisJstree.extend({
  renderNo: 1,
  didRender() {
    let renderNo = this.get('renderNo');
    if (renderNo == 2 || renderNo == 3) {
      this.sendAction('action', renderNo);
    }
    this.set('renderNo', renderNo + 1);
  }
});