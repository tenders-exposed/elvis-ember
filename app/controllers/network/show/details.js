import Ember from 'ember';

export default Ember.Controller.extend({
  me: Ember.inject.service(),
  ajax: Ember.inject.service(),

  networkInput: false,
  fields: {
    "suppliers": { id: "ID" , label: "Name", flags: " ", value: "Value"},
    "relationships": { fromLabel: "Procurer", toLabel: "Supplier", flags: " ", value: "Value"}
  },

  sidebarTabs: [
    { id: 'suppliers', title: 'Suppliers' },
    { id: 'procurers', title: 'Procurers' },
    { id: 'relationships', title: 'Relationships' }
  ],
  activeTab: 'suppliers',

  gridOptions: {
    suppliers: {},
    procurers: {},
    relationships: {}
  },

  onFilterChanged(value) {
    console.log(value);
    this.gridOptions.api.setQuickFilter(value);
  },

  actions: {
    closeDetails(networkId) {
      this.transitionToRoute('network.show', networkId);
    },

    changeTab(tab) {
      this.set('activeTab', tab);
    },

    nodeRowClick(selection){
      this.get('network').moveTo(selection.id);
      this.get('network').network.selectNodes([selection.id]);
      this.set('network.selectedNodes', [selection.id]);
      console.log('selectedNodes ', this.get('network').selectedNodes);
    },

    edgeRowClick(selection){
      this.network.network.fit({
        nodes: [selection.from, selection.to],
        animation: true
      });
      this.network.network.selectEdges([selection.id]);
    },
    toggleInput(){
      this.toggleProperty('networkInput');
      return false;
    },
    saveNetworkName(){
      let networkName = this.get('model.name');
      let networkId = this.get('model.id');
      let token = this.get("me.data.authentication_token");
      let email = this.get("me.data.email");

      let data = `{"network": { "name": "${networkName}"}}`;
      let self = this;

      this.get('ajax')
        .put(`/networks/${networkId}`, {
          data,
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': `${email}`,
            'X-User-Token': `${token}`
          }
        }).then(
          (response)=>{
            console.log("response ", response);
            if (this.get('session.isAuthenticated')) {
              self.get('notifications').clearAll();
              self.get('notifications').success('Done!', {autoClear: true});
              this.send('toggleInput');
            } else {
              self.get('notifications').error(`Error: Please login to save your network!`);
            }
          },(response) => {
            self.get('notifications').clearAll();
            console.log(response);
             _.forEach(response.errors, (error, index) => {
               self.get('notifications').error(`Error: ${index } ${error.title}`);
             });
          });
    }
  }
});
