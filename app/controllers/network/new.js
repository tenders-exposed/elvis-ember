// import ENV from '../config/environment';
import Ember from 'ember';

import Controller from '@ember/controller';
import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

const { Logger } = Ember;

export default Controller.extend({
  ajax: service(),
  cpvService: service('cpv'),

  selectedCodes: A([]),

  query: new EmberObject({
    'nodes': 'count',
    'edges': 'count',
    'rawCountries': A([]),
    'rawActors': A([]),
    'actors': A([]),
    'countries': A([]),
    'years': A([2004, 2010]),
    'cpvs': A([])
  }),

  loading: {
    years: false,
    cpvs: false
  },

  countries: [],
  autocompleteActorsOptions: [],

  countriesStatus: computed('query.countries', function() {
    if (this.get('query.countries').length > 0) {
      return 'completed';
    } else {
      return 'current';
    }
  }),
  yearsStatus: computed('query.{countries,actors}', function() {
    if (this.get('query.countries').length > 0 || this.get('query.actors').length > 0) {
      return 'completed';
    } else {
      return 'disabled';
    }
  }),
  cpvsStatus: computed('query.{countries,years}', function() {
    if (this.get('query.years').length > 0 &&
        (this.get('query.countries').length > 0) || this.get('query.actors').length > 0) {
      return 'current';
    } else if (this.get('query.cpvs').length > 0) {
      return 'completed';
    } else {
      return 'disabled';
    }
  }),
  optionsStatus: computed('selectedCodes', function() {
    if (this.get('selectedCodes').length > 0) {
      return 'current';
    } else {
      return 'disabled';
    }
  }),
  submitIsDisabled: computed('selectedCodes', function() {
    if (this.get('selectedCodes').length > 0) {
      return false;
    } else {
      return true;
    }
  }),

  rangeDisableClass: '',
  rangeIsDisabled: computed('query.{countries,actors}', function() {
    let countries = this.get('query.countries');
    let actors = this.get('query.actors');
    if (countries.length > 0 || actors.length > 0) {
      return false;
    } else {
      return true;
    }
  }),

  yearsStart: [],
  yearsRange: computed('years', function() {
    let years = this.get('years');
    let yearMin = _.min(years);
    let yearMax = _.max(years);

    // hacking the range so we won't crash the slider
    // see https://github.com/leongersen/noUiSlider/issues/676 for more
    if (yearMin === yearMax) {
      yearMin -= 1;
    }
    let yearsRange = { 'min': yearMin, 'max': yearMax };

    this.set('yearsStart', [yearMin, yearMax]);
    this.send('rangeChangeAction', [yearMin, yearMax]);

    return yearsRange;
  }),

  treeObserver: observer('cpvs', function() {
    this.createTree();
  }),
  
  selectedCodesObserver: observer('selectedCodes', function () {
    console.log('observer selectedCodes', this.get('selectedCodes'));
  }),

  network: {},

  jsTreeConfig: {
    core: {
      'worker': false,
      'themes': {
        // 'url': '/assets/photonui/style.css',
        'name': 'elvis',
        'theme': 'elvis'
      }
    },
    plugins: 'checkbox, search',
    searchOptions: { 'show_only_matches': true },
    checkbox: {
      'three_state': false,
      'cascade': 'down'
    }
  },
  cpvSearchTerm: '',
  cpvSearchTree: '',

  createTree() {
    /*
    * cpvs: [
     {
     code: "79713000",
     xName: "Guard services",
     xNumberDigits: 5
     },...]

     vs
     {
     "doc_count": 1714,
     "text": "Pharmaceutical products",
     "number_digits": 3,
     "id": "33600000"
     },
     */
    let treeTimer = performance.now();
    let cpvs = _.sortBy(
      _.cloneDeep(this.get('cpvs')),
      ['code']
    );
    let tree = [];
    let missingCodes = [];

    cpvs.map((cpv) => {
      let {
        xNumberDigits,
        code,
        xName
      } = cpv;
      let result = {};

      result.id = code;
      //result.count = doc_count;
      result.name = xName;
      result.state = { opened: false };
      result.text = '<div class="details">';
      result.text += `<div class="cpv-title">${xName}</div>`;
      result.text += `<div class="cpv-code">${code} </div>`;
      result.text += `</div>`;

      let parent, cpvGroup, cpvDivision, regex;

      switch (xNumberDigits) {
      case null:
        result.parent = '#';
        break;

      case 0:
      case 2:
        result.parent = '#';
        break;

      case 3:
        cpvDivision = code.slice(0, 2);
        // parent = cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`);
        result.parent = `${cpvDivision}000000`;
        if (!cpvDivision) {
          Logger.warn(`Cannot compute division for ${code}`, cpv);
          result.parent = '#';
        } else {
          if (!cpvs.find((cpv) => cpv.code === `${cpvDivision}000000`)) {
            Logger.warn('Trying to get division', cpvDivision);
            missingCodes.push(result.parent);
          }
        }
        break;

      case 4:
      default:
        // First attempt to find a CPV group (level 2, 3 digits)
        cpvGroup = code.slice(0, 3);
        parent = cpvs.find((cpv) => cpv.code === `${cpvGroup}00000`);
        if (parent) {
          result.parent = parent.code;
          break;
        }

        // If we're here, we're looking for a major division
        cpvDivision = this.get('cpvService').getDivisions().find(
          (div) => div === code.slice(0, 2)
        );
        if (!cpvDivision) {
          Logger.warn(`Cannot find division ${cpvDivision} for ${code}`, cpv);
          result.parent = '#';
        } else {
          // if (!cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`)) {
          result.parent = `${cpvDivision}000000`;
          regex = `${cpvDivision}0+$`;
          if (!cpvs.find((c) => c.code.match(new RegExp(regex, 'g'))) ||
              !cpvs.find((c) => c.code === result.parent)) {
            missingCodes.push(result.parent);
          }
        }
        break;
    }

      tree.push(result);
    });

    missingCodes = _.uniq(missingCodes);
    missingCodes.map((missingCode) => tree.push(
      this.get('cpvService')
        .getCode(missingCode)
    ));

    // // Tree health check!
    // tree.map((node) => {
    //   if (!tree.find((n) => n.id == node.parent) && node.parent !== '#') {
    //     Logger.error(`Parent with id ${node.parent} is missing!`, cpvs.find((n) => n.id == node.id));
    //   }
    // });

    treeTimer = performance.now() - treeTimer;
    this.get('benchmark').store('performance.cpvs.count', cpvs.count);
    this.get('benchmark').store('performance.cpvs.treeRender', treeTimer);
    this.set('tree', tree);
    console.log('formated tree', tree);
  },

  prepareQuery() {
    let self = this;
    self.get('selectedCodes').forEach((v) => {
      self.get('query.cpvs').push(v.id);
    });
  },

  fetchYears() {
    this.set('loading.years', true);

    let countries = this.get('query.countries');
    let rawActors = this.get('query.rawActors');
    let suppliers = _.filter(
      rawActors,
      (actor) => (actor.type === 'supplier')
    );
    let procurers = _.filter(
      rawActors,
      (actor) => (actor.type === 'procurer')
    );
    let options = {};
    if (countries.length > 0) {
      options.countries = countries;
    }
    if (procurers.length > 0) {
      options.procuring_entities = _.map(procurers, (p) => p.x_slug_id);
    }
    if (suppliers.length > 0) {
      options.suppliers = _.map(suppliers, (s) => s.x_slug_id);
    }
    this.get('ajax')
      .request('/tenders/years', {
        data: options,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((data) => {
        // console.log('fetchYears', data);
        let years = data.years;
        this.set('years', years);
        this.set('loading.years', false);
        if (this.get('selectedCodes').length > 0) {
          this.set('loading.cpvs', true);
          this.set('selectedCodes', []);
          this.set('loading.cpvs', false);
        }
      });
  },
  fetchCpvs() {
    this.set('loading.cpvs', true);
    let requestTimer = performance.now();

    let self = this;
    let countries = this.get('query.countries');
    let rawActors = this.get('query.rawActors');
    let actors = this.get('query.actors');
    let years = this.get('query.years');
    let bidders = _.filter(
      rawActors,
      (actor) => (actor.type === 'bidder')
    );
    let buyers = _.filter(
      rawActors,
      (actor) => (actor.type === 'buyer')
    );

    let options = {};
    if (countries.length > 0) {
      options.countries = countries;
    }
    if (buyers.length > 0) {
      options.buyers = _.map(buyers, (p) => p.id);
    }
    if (bidders.length > 0) {
      options.bidders = _.map(bidders, (s) => s.id);
    }
    if (years.length > 0) {
      //options.query.years = [2005,2006];
      options.years = years;
    }

    if (countries.length > 0 || actors.length > 0) {
      self.get('ajax')
        .request('/tenders/cpvs', {
          data: options,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((data) => {
          console.log('fetchCpvs', data);
          self.set('cpvs', data.cpvs);
          self.set('loading.cpvs', false);
          self.get('benchmark').store('performance.cpvs.loadTime', (performance.now() - requestTimer));
        });
    }
  },

  actions: {
    onCountrySelectEvent(value) {
      this.set('query.countries', []);
      value.forEach((v) => {
        this.get('query.countries').push(v.code);
      });
      this.fetchYears();
      this.fetchCpvs();
    },
    onAutocompleteSelectEvent(value) {
      this.set('query.actors', []);
      value.forEach((v) => {
        this.get('query.actors').push(v.id);
      });
      this.fetchYears();
    },
    actorTermChanged(queryTerm) {
      //let query = queryTerm || '';
      //let limit = 10;
      if(queryTerm.length > 1) {

        let countries = this.get('query.countries');
        let options = {};
        if (countries.length > 0) {
          options.countries = countries;
        }

        if(queryTerm) {
          options.name = queryTerm;
        }

        // let host =`${ENV.APP.apiHost}/${ENV.APP.apiNamespace}`;
        return this.get('ajax')
          .request('/tenders/actors',
                {
                  data: options,
                  headers: {'Content-Type': 'application/json'}
                })
          .then((data) => {
            this.set('autocompleteActorsOptions', data.actors);
          });
      }

    },

    rangeSlideAction(value) {
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
    },
    rangeChangeAction(value) {
      // destroy the tree, if any
      if (this.get('jsTree')) {
        this.get('jsTree').destroy();
      }

      this.set('query.years', []);
      this.get('query.years').push(value[0]);
      this.get('query.years').push(value[1]);
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
      this.set('query.years', _.range(this.get('query.years')[0], ++this.get('query.years')[1]));

      this.fetchCpvs();
    },

    submitQuery() {
      let self = this;
      let countries = this.get('query.countries');
      let rawActors = this.get('query.rawActors');
      let cpvs = this.get('query.cpvs');
      let years = this.get('query.years');

      let bidders = _.filter(
        rawActors,
        (actor) => (actor.type === 'bidder')
      );
      let buyers = _.filter(
        rawActors,
        (actor) => (actor.type === 'buyer')
      );

      self.notifications.info('This is probably going to take a while...', {
        autoClear: false
      });

      self.set('isLoading', true);
      self.prepareQuery();

      let query = {
        cpvs: cpvs.uniq(),
        years: years.uniq()
      };

      if (countries && countries.length > 0) {
        query.countries = countries.uniq();
      }
      if (buyers.length > 0) {
        query.buyers = _.map(buyers, (p) => p.id);
      }
      if (bidders.length > 0) {
        query.bidders = _.map(bidders, (s) => s.id);
      }
      console.log('submitQuery', query);

      this.get('store').createRecord('network', {
        settings: {
          nodeSize: this.get('query.nodes'),
          edgeSize: this.get('query.edges')
        },
        query
      }).save().then((data) => {
        // self.send('finished');
        // self.transitionToRoute('network.show', data.id)
        self.set('isLoading', false);
        self.toggleProperty('optionsModalIsOpen');
        self.transitionToRoute('network.show', data.id);
      }).catch((data) => {
        // TODO: Catch the actual reason sent by the API (for some reason it's not pulled in, will check later)
        Logger.error(`Error: ${data}`);
        self.set('isLoading', false);
        self.notifications.clearAll();
        self.notifications.error('You need to <a href="/">sign in</a> or <a href="/">sign up</a> before continuing.', {
          htmlContent: true,
          autoClear: false
        });
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
    },
    searchCpv() {
      this.set('cpvSearchTree', this.get('cpvSearchTerm'));
    }
  }
});
