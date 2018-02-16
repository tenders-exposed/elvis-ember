import Ember from 'ember';
import Service from '@ember/service';
import { inject as service } from '@ember/service';

const { Logger } = Ember;
const template = {
  version: '',    // frontend version
  created_at: '', // measurement timestamp

  network: {
    id: '',       // ID of the network
    contracts: 0, // contracts count (obtained in CPV selector)
    nodes: 0,     // number of nodes
    edges: 0      // number of edges
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
      window: ''  // e.g. '1000x600'
    },
    device: {
      type: '',   // e.g. 'Smartphone'
      name: ''    // e.g. 'iThing'
    },
    misc: ''      // Serialized object (JSON) with misc data, if needed
  },

  performance: {
    cpvs: {
      count: 0,      // CPVs count
      loadTime: 0,   // time between CPV request and response
      treeRender: 0  // time to render the CPV tree
    },
    network: {
      save: 0,            // time between network request and response
      iterationsTime: 0,  // time to stabilize
      iterationsCount: 0, // iterations to stabilize
      renderTime: 0       // time to render (whether stabilized or not)
    }
  }
};

export default Service.extend({
  ajax: service(),
  me: service(),
  endpoint: '/performance_stats',
  options: {},
  data: {},

  init() {
    this.reset();
    // Logger.info('data', this.get('data'));
  },

  reset() {
    this.set('data',  template);
  },

  store(item, value) {
    this.set(`data.${item}`, value);
    // Logger.info(`${item}: ${value}`);
  },

  storeMultiple(items) {
    Object.keys(items).forEach((item) => {
      this.store(item, items[item]);
    });
  },

  fakeSave() {
    // Logger.info('Performance data saved: ', this.get('data'));
    this.reset();
    // Logger.info('Performance data was reset');
  },

  save() {
    // Logger.info('Saving performance data: ', this.get('data'));
    let endpoint = this.get('endpoint');
    let options = this.get('options');
    options.data = JSON.stringify({
      'performance_stats': this.get('data')
    });
    this.get('ajax')
      .post(endpoint, options)
      .then((response) => {
        // Logger.info('Sent payload, got response', response);
        this.reset();
        // Logger.info('Performance data was reset');
      });
  }
});
