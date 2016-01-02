import Ember from 'ember';
import WithComputedSizeMixin from 'ember-computed-size/mixins/with-computed-size';

export default Ember.View.extend(WithComputedSizeMixin, {
  //  didInsertElement : function(){
  //    this._super();
  //    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  //  },
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
