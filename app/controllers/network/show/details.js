import Ember from 'ember';

export default Ember.Controller.extend({
  sidebarTabs: [
    {id: 'suppliers', title: 'Suppliers'},
    {id: 'procurers', title: 'Procurers'},
    {id: 'relationships', title: 'Relationshits'},
  ],
  active: 'suppliers',
  actions: {
    changeTab(tab) {
      this.set("active", tab);
    }
  }
});
