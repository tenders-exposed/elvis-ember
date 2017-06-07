import Ember from 'ember';

const { Service, Logger } = Ember;
const data = {
  version: '',    // frontend version
  created_at: '', // measurement timestamp

  network: {
    id: '',       // ID of the network
    contracts: 0, // contracts count (obtained in CPV selector)
    nodes: 0,     // number of nodes
    edges: 0,     // number of edges
  },

  client: {
    os: {
      name: '',   // e.g. 'Linux'
      version: '' // e.g. '4.9.1'
    },
    browser: {
      name: '',   // e.g. 'Chrome'
      version: '' // e.g.'50'
    },
    resolution: {
      screen: '', // e.g. '1920x1080'
      window: '', // e.g. '1000x600'
    },
    device: {
      type: '',   // e.g. 'Smartphone'
      name: ''    // e.g. 'iThing'
    },
    misc: '',     // Serialized object (JSON) with misc data, if needed
  },

  performance: {
    cpvs: {
      count: 0,      // CPVs count
      loadTime: 0,   // time between CPV request and response
      treeRender: 0, // time to render the CPV tree
    },
    network: {
      save: 0,            // time between network request and response
      iterationsTime: 0,  // time to stabilize
      iterationsCount: 0, // iterations to stabilize
      renderTime: 0,      // time to render (whether stabilized or not)
    }
  }
};

export default Service.extend({

  init() {
    this.set('data', data);
    Logger.info('data', data);
  }
});
