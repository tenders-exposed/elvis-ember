import Ember from 'ember';
import WithComputedSizeMixin from 'ember-computed-size/mixins/with-computed-size';

export default Ember.View.extend(WithComputedSizeMixin, {
  initializeNetwork() {
    let container = document.getElementById('visjs-network');
    let data = {
      nodes: this.get('controller.nodes'),
      edges: this.get('controller.edges')
    };
    let options = this.get('controller.options');
    return new vis.Network(container, data, options);
  },
  didInsertElement() {
    this._super();
    this.initializeNetwork();
    // Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  }
  //  afterRenderEvent : function(){
  //    $(document).ready(function(){
  //      resizeDetails();
  //      $("div#network-container").parent().height(self.innerHeight);
  //    });
  //    $(window).resize(function() {
  //      resizeDetails();
  //      $("div#network-container").parent().height(self.innerHeight);
  //    });
  //  }
});
