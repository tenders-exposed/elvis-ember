import Ember from 'ember';

const {
  Controller,
  inject,
  computed,
  run,
  A,
  $,
  Logger
} = Ember;

const { Object: EmberObject, observer } = Ember;

export default Controller.extend({
  ajax: inject.service(),
  cpvService: inject.service('cpv'),

  selectedCodes: A([]),

  query: new EmberObject({
    'nodes': 'count',
    'edges': 'count',
    'rawCountries': A([]),
    'countries': A([]),
    'years': A([2004, 2010]),
    'cpvs': A([])
  }),

  countries: [],

  countriesStatus: computed('query.countries', function() {
    if (this.get('query.countries').length > 0) {
      return 'completed';
    } else {
      return 'current';
    }
  }),
  yearsStatus: computed('query.countries', function() {
    if (this.get('query.countries').length > 0) {
      return 'completed';
    } else {
      return 'disabled';
    }
  }),
  cpvsStatus: computed('query.{countries,years}', function() {
    if (this.get('query.years').length > 0 && this.get('query.countries').length > 0) {
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
  submitStatus: computed('selectedCodes', 'query.{nodes,edges}', function() {
    if (this.get('selectedCodes') && this.get('query.nodes') && this.get('query.edges')) {
      return '';
    } else {
      return 'disabled';
    }
  }),

  rangeDisableClass: '',
  rangeIsDisabled: computed('query.countries', function() {
    let countries = this.get('query.countries');
    if (countries.length > 0) {
      return false;
    } else {
      return true;
    }
  }),

  // queryObserver: observer('query.countries', function() {
  //   let query = this.get('query');
  //   Logger.info('Observing countries...', query.countries);
  //   if (query.countries.length > 0) {
  //     this.set('wizardStatus.countries', 'completed');
  //     this.set('wizardStatus.years', 'current');
  //     this.set('rangeDisableClass', '');
  //   } else {
  //     this.set('rangeDisableClass', 'disable-range');
  //     this.set('wizardStatus.countries', 'current');
  //     this.set('wizardStatus.years', 'disabled');
  //   }
  // }),

  yearsStart: [],
  yearsRange: computed('years', function() {
    let years = this.get('years');
    let yearMin = _.minBy(years, 'id').id;
    let yearMax = _.maxBy(years, 'id').id;
    let yearsRange = { 'min': yearMin, 'max': yearMax };

    this.set('yearsStart', [yearMin, yearMax]);
    this.send('rangeChangeAction', [yearMin, yearMax]);

    return yearsRange;
  }),

  treeObserver: observer('cpvs', function() {
    this.createTree();
  }),

  network: {},

  jsTreeConfig: {
    core: {
      'worker': false,
      'themes': {
        'url': '/assets/photonui/style.css',
        'name': 'photonui',
        'theme': 'photonui'
      }
    },
    plugins: 'checkbox, search',
    searchOptions: { 'show_only_matches': true },
    checkbox: {
      'three_state': false,
      'cascade': ''
    }
  },
  cpvSearchTerm: '',
  cpvSearchTree: '',

  createTree() {
    let cpvs = _.sortBy(
      _.cloneDeep(this.get('cpvs')),
      ['id']
    );
    let tree = [];
    let missingCodes = [];

    cpvs.map((cpv) => {
      let {
        number_digits,
        id,
        doc_count,
        text
      } = cpv;
      let result = {};

      result.id = id;
      result.count = doc_count;
      result.name = text;
      result.state = { opened: false };
      result.text = '<span class="details"><small>';
      result.text += `${id} (${doc_count} / 0)`;
      result.text += `</small><br><div>${text}</div></span>`;

      let parent, cpvGroup, cpvDivision, regex;

      switch (number_digits) {
      case null:
        result.parent = '#';
        break;

      case 0:
      case 2:
        result.parent = '#';
        break;

      case 3:
        cpvDivision = id.slice(0, 2);
        // parent = cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`);
        result.parent = `${cpvDivision}000000`;
        if (!cpvDivision) {
          Logger.warn(`Cannot compute division for ${id}`, cpv);
          result.parent = '#';
        } else {
          if (!cpvs.find((cpv) => cpv.id === `${cpvDivision}000000`)) {
            Logger.warn('Trying to get division', cpvDivision);
            missingCodes.push(result.parent);
          }
        }
        break;

      case 4:
      default:
        // First attempt to find a CPV group (level 2, 3 digits)
        cpvGroup = id.slice(0, 3);
        parent = cpvs.find((cpv) => cpv.id === `${cpvGroup}00000`);
        if (parent) {
          result.parent = parent.id;
          break;
        }

        // If we're here, we're looking for a major division
        cpvDivision = this.get('cpvService').getDivisions().find(
          (div) => div === id.slice(0, 2)
        );
        if (!cpvDivision) {
          Logger.warn(`Cannot find division ${cpvDivision} for ${id}`, cpv);
          result.parent = '#';
        } else {
          // if (!cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`)) {
          result.parent = `${cpvDivision}000000`;
          regex = `${cpvDivision}0+$`;
          if (!cpvs.find((c) => c.id.match(new RegExp(regex, 'g'))) ||
              !cpvs.find((c) => c.id === result.parent)) {
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

    this.set('tree', tree);
  },

  prepareQuery() {
    let self = this;
    self.get('selectedCodes').forEach((v) => {
      self.get('query.cpvs').push(v.id);
    });
  },

  actions: {
    onSelectEvent(value) {
      this.set('query.countries', []);
      value.forEach((v) => {
        this.get('query.countries').push(v.id);
      });

      let options = this.get('query.countries').length && `{
        "query": {
            "countries": ["${this.get('query.countries').join('", "')}"]
        }
      }`;
      this.get('ajax')
          .post('/contracts/years', { data: options, headers: { 'Content-Type': 'application/json' } })
          .then((data) => {
            this.set('years', data.search.results);
          });
    },

    rangeSlideAction(value) {
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
    },
    rangeChangeAction(value) {
      let self = this;
      let countries = this.get('query.countries');

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

      if (countries.length > 0) {
        let options = `{
        "query": {
            "countries": ["${self.get('query.countries').join('", "')}"],
            "years": [${self.get('query.years').join(', ')}]
        }
      }`;
        this.get('ajax')
          .post('/contracts/cpvs', { data: options, headers: { 'Content-Type': 'application/json' } })
          .then((data) => {
            self.set('cpvs', data.search.results);
          });
      }
    },

    submitQuery() {
      let self = this;

      self.notifications.info('This is probably going to take a while...', {
        autoClear: false
      });

      self.set('isLoading', true);
      self.prepareQuery();

      this.get('store').createRecord('network', {
        options: {
          nodes: this.get('query.nodes'),
          edges: this.get('query.edges')
        },
        query: {
          cpvs: this.get('query.cpvs').uniq(),
          countries: this.get('query.countries').uniq(),
          years: this.get('query.years').uniq()
        }
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
