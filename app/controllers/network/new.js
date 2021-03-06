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
  selectedCodesCount: 0,

  query: new EmberObject({
    'nodeSize': 'numberOfWinningBids',
    'edgeSize': 'numberOfWinningBids',
    'rawCountries': A([]),
    'rawActors': A([]),
    'actors': A([]),
    'countries': A([]),
    'years': A([2004, 2010]),
    'cpvs': A([]),
    'edges': 'numberOfWinningBids',
    'nodes': 'numberOfWinningBids'
  }),

  loading: {
    years: true,
    cpvs: true
  },

  countries: [],
  autocompleteActorsOptions: [],
  countActors: 0,

  countriesStatus: computed('query.countries', function() {
    if (this.get('query.countries').length > 0) {
      return 'completed';
    } else {
      return 'current';
    }
  }),
  yearsStatus: computed('query.{countries,actors}', function() {
    if (!this.get('loadingYears') &&
    (this.get('query.countries').length > 0 || this.get('query.actors').length > 0)) {
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

  cpvsIsDisabled: false,

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

  selectedCodesObserver: observer('selectedCodes', function() {
    this.set(
      'selectedCodesCount',
      _.sumBy(this.get('selectedCodes'), function(o) {
        return o.original.count;
      })
    );
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
    plugins: 'checkbox, search, sort',
    searchOptions: { 'show_only_matches': true },
    // sort: function(a, b){
    //   a1 = this.get_node(a);
    //   b1 = this.get_node(b);
    //   return (a1.xNumberBids > b1.xNumberBids) ? 1 : -1;
    // },
    checkbox: {
      'three_state': false,
      'cascade': 'down'
    }
  },
  cpvSearchTerm: '',
  cpvSearchTree: '',

  createTree() {
    // reset selected codes
    this.set('selectedCodesCount', 0);
    this.set('selectedCodes', A([]));

    // let treeTimer = performance.now();
    let cpvs = _.sortBy(
      _.cloneDeep(this.get('cpvs')),
      ['code']
    );
    let tree = [];
    let missingCodes = [];

    cpvs.map((cpv) => {
      let {
        xNumberDigits,
        xNumberBids,
        code,
        xName
      } = cpv;
      let result = {};

      result.id = code;
      result.count = xNumberBids;
      result.name = xName;
      result.state = { opened: false };
      result.text = '<div class="details">';
      result.text += `<div class="cpv-title">${xName} <small><code>[${xNumberBids}]</code></small></div>`;
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

    // treeTimer = performance.now() - treeTimer;
    this.set('tree', tree);
    this.set('loading.cpvs', false);

    // // Tree health check!
    // tree.map((node) => {
    //   if (!tree.find((n) => n.id == node.parent) && node.parent !== '#') {
    //     Logger.error(`Parent with id ${node.parent} is missing!`, cpvs.find((n) => n.id == node.id));
    //   }
    // });

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
      options.buyers = _.map(buyers, (p) => p.x_slug_id);
    }
    if (bidders.length > 0) {
      options.bidders = _.map(bidders, (s) => s.x_slug_id);
    }

    this.get('ajax')
      .request('/tenders/years', {
        data: options,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((data) => {
        let { years } = data;
        this.set('years', years);
        this.set('loading.years', false);
        // reset cpvs when other years are loaded
        this.set('cpvsIsDisabled', false);
        this.resetCpvs();
      });
  },
  resetCpvs() {
    this.set('cpvs', []);

    if (this.get('selectedCodes').length > 0) {
      // this.set('loading.cpvs', true);
      this.set('selectedCodes', []);
      // this.set('loading.cpvs', false);
    }
  },

  fetchCpvs() {
    this.set('loading.cpvs', true);
    this.set('cpvsIsDisabled', true);
    // let requestTimer = performance.now();

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
      options.countries = _.join(countries, ',');
    }
    if (buyers.length > 0) {
      options.buyers = _.join(_.map(buyers, (p) => p.id), ',');
    }
    if (bidders.length > 0) {
      options.bidders = _.join(_.map(bidders, (s) => s.id), ',');
    }
    if (years.length > 0) {
      // options.query.years = [2005,2006];
      options.years = _.join(years, ',');
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
          self.set('cpvs', data.cpvs);
          // self.set('loading.cpvs', false);
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
    },
    onAutocompleteSelectEvent(value) {

      this.set('query.actors', []);
      let self = this;
      let count = 0;
      _.each(value, (v) => {
        self.get('query.actors').push(v.id);
        count++;
      });

      this.set('countActors', count);
      this.fetchYears();
    },
    actorTermChanged(queryTerm) {
      // let query = queryTerm || '';
      // let limit = 10;
      if (!queryTerm.length) {
        this.set('autocompleteActorsOptions', []);

      }
      if (queryTerm.length > 1) {

        let countries = this.get('query.countries');
        // let options = { limit: 15 };
        let options = {};
        if (countries.length > 0) {
          options.countries = countries;
        }

        if (queryTerm) {
          options.name = queryTerm;
        }

        // let host =`${ENV.APP.apiHost}/${ENV.APP.apiNamespace}`;
        return this.get('ajax')
          .request('/tenders/actors',
                {
                  data: options,
                  headers: { 'Content-Type': 'application/json' }
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
      if (this.get('yearsStatus') == 'completed') {
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

        // console.log('fetchCpvs rangeChangeAction');
        // this.fetchCpvs();
        this.set('cpvsIsDisabled', false);
        this.resetCpvs();
      }
    },

    loadCpvs() {
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

      $('.wizard-legend').fadeIn();
      $('.wizard .ember-select-guru').fadeOut();
      window.scrollTo(0, 0);

      /*self.notifications.info('This is probably going to take a while...', {
        autoClear: false
      });*/

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

      this.get('store').createRecord('network', {
        name: self.get('name'),
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
