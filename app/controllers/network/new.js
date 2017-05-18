import Ember from 'ember';

const {
  Controller,
  inject,
  computed,
  run,
  Object,
  A,
  $,
  Logger
} = Ember;

export default Controller.extend({
  ajax: inject.service(),

  cpvModalIsOpen: false,
  selectedCodesModalIsOpen: false,
  optionsModalIsOpen: false,

  selectedCodes: A([]),

  query: new Object({
    'nodes': 'count',
    'edges': 'count',
    'rawCountries': A([]),
    'countries': A([]),
    'years': A([2004, 2010]),
    'cpvs': A([])
  }),

  countries: [],

  rangeDisableClass: '',
  rangeIsDisabled: computed('query.countries', function() {
    let countries = this.get('query.countries');
    if (countries.length > 0) {
      this.set('rangeDisableClass', '');
      return false;
    } else {
      this.set('rangeDisableClass', 'disable-range');
      return true;
    }
  }),

  yearsStart: [],
  yearsRange: computed('years', function() {
    let years = this.get('years');
    let yearMin = _.minBy(years, 'id').id;
    let yearMax = _.maxBy(years, 'id').id;
    let yearsRange = { 'min': yearMin, 'max': yearMax };

    this.set('yearsStart', [yearMin, yearMax]);
    this.send('slidingAction', [yearMin, yearMax]);

    return yearsRange;
  }),

  height: window.innerHeight - 200,

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
  searchTerm: '',

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

    slidingAction(value) {
      this.set('query.years', []);
      this.get('query.years').push(value[0]);
      this.get('query.years').push(value[1]);
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
      this.set('query.years', _.range(this.get('query.years')[0], ++this.get('query.years')[1]));
    },

    toggleCpvModal() {
      $('.cpv-modal-open').css('pointer-events', 'none');
      let self = this;
      let fixtures = `{
        "query": {
            "countries": ["UK"],
            "years": [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010]
        }
      }`;
      let options = `{
        "query": {
            "countries": ["${self.get('query.countries').join('", "')}"],
            "years": [${self.get('query.years').join(', ')}]
        }
      }`;
      this.toggleProperty('cpvModalIsOpen');
      this.get('ajax')
        .post('/contracts/cpvs', { data: options, headers: { 'Content-Type': 'application/json' } })
        .then((data) => {
          self.set('cpvs', data.search.results);
          $('.cpv-modal-open').css('pointer-events', 'inherit');
        });
    },

    toggleSelectedCodesModal() {
      this.toggleProperty('selectedCodesModalIsOpen');
    },

    toggleOptionsModal() {
      this.toggleProperty('optionsModalIsOpen');
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
    }
  }
});