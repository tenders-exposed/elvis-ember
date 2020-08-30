import Ember from 'ember';

import Controller from '@ember/controller';
import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';
import { run } from '@ember/runloop';
import { A } from '@ember/array';
import EmberObject from '@ember/object';

const { Logger } = Ember;

export default Controller.extend({
  ajax: service(),
  cpvService: service('cpv'),

  wizardData: [
    { 'step_id': '1', 'header_label': 'Countries','hasAction': true },
    { 'step_id': '2', 'header_label': 'Actors','hasAction': true },
    { 'step_id': '3', 'header_label': 'Years','hasAction': true },
    { 'step_id': '4', 'header_label': 'Markets','hasAction': true },
    { 'step_id': '5', 'header_label': 'Settings','hasAction': true }
  ],
  useRoundedNav: true,
  customButtonLabels: {
    'nextLabel': 'Next',
    'finishLabel': 'Launch Network',
    'cancelLabel': 'Cancel',
    'prevLabel': 'Back'
  },
  wizardShowNextStep: true,

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
    years: false,
    cpvs: true
  },
  shouldUpdate: {
    'years': false,
    'cpvs': false
  },

  loadAllMarkets: false,

  sizeType: [
    { 'type': 'numberOfWinningBids', 'label': 'number of winning Bids' },
    { 'type': 'amountOfMoneyExchanged', 'label': 'amount of money' }
  ],
  countries: [],
  autocompleteActorsOptions: [],
  wizardSteps:  {
    'countriesStatus': 'current',
    'actorsStatus': 'disabled',
    'yearsStatus': 'disabled',
    'cpvsStatus': 'disabled',
    'optionsStatus': 'disabled'
  },

  network: {},

  // years rande-slide
  // rangeDisableClass: '',
  rangeIsDisabled: computed('query.{countries,actors}', function() {
    let countries = this.get('query.countries');
    let actors = this.get('query.actors');
    if (countries.length > 0 || actors.length > 0) {
      return false;
    } else {
      return true;
    }
  }),
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
    this.send('rangeChangeAction', [yearMin, yearMax]);

    return yearsRange;
  }),
  yearsStart: computed('yearsRange', function() {
    let yearsRange = this.get('yearsRange');
    return [ yearsRange.min, yearsRange.max ];
  }),

  // cpvs selected
  treeObserver: observer('cpvs', function() {
    if (this.get('cpvs').length > 0) {
      this.createTree();
    }
  }),
  selectedCodesObserver: observer('selectedCodes', function() {
    this.set(
      'selectedCodesCount',
      _.sumBy(this.get('selectedCodes'), function(o) {
        return o.original.count;
      })
    );
  }),
  cpvsIsDisabled: false,
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
    checkbox: {
      'three_state': false,
      'cascade': 'down'
    }
  },
  cpvSearchTerm: '',
  cpvSearchTree: '',
  networkLoading: false,
  allCpvs:[],
  allCpvSelected: false,

  createTree() {
    // reset selected codes
    this.set('selectedCodesCount', 0);
    this.set('selectedCodes', A([]));

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
    missingCodes.map((missingCode) => {
      let code = this.get('cpvService').getCode(missingCode);
      //code.state = { opened: false, selected: true };
      tree.push(code);
    });

    this.set('tree', tree);
    this.set('loading.cpvs', false);
    this.set('shouldUpdate.cpvs', false);

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
        this.set('shouldUpdate.years', false);
        // reset cpvs when other years are loaded
        this.set('cpvsIsDisabled', false);
        // this.resetCpvs();
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
        });
    }
  },

  wizardStepChanged(wizardStep) {
    // should reset everything if it transition to this roote.
    let stepId = wizardStep.step_id;
    let nextStep = () => {
      later(() => {
        this.set('wizardShowNextStep', true);
      }, 100);
    };

    let actions = {

      '1': () => {
        // next actors
        if (this.get('query.countries').length > 0) {
          this.set('wizardErrorMessage', false);
        }
        nextStep();
      },

      '2': () => {
        if (this.get('query.actors').length > 0) {
          this.set('wizardSteps.actorsStatus', 'completed');
        }

        // years
        let loadingYears = this.get('loading.years');
        let wizardErrorMessage = false;
        let wizardShowNextStep = true;

        if (!this.get('rangeIsDisabled')) {
          nextStep();

          if (this.get('shouldUpdate.years')) {
            loadingYears = true;
            this.fetchYears();
          }
        } else {
          wizardErrorMessage = 'You must select at least one country or one actor';
          wizardShowNextStep = false;
        }

        this.setProperties({
          wizardErrorMessage,
          wizardShowNextStep,
          wizardSteps: { yearsStatus: 'current' },
          loading: { years: loadingYears }
        });
      },

      '3': () => {
        // cpvs
        nextStep();
        this.setProperties({
          wizardSteps: {
            yearsStatus: 'completed',
            cpvsStatus: 'current'
          }
        });

        if (this.get('shouldUpdate.cpvs')) {
          if (this.get('jsTree')) {
            this.get('jsTree').destroy();
            this.resetCpvs();
          }
          this.fetchCpvs();
        }
      },

      '4': () => {
        // settings
        let wizardErrorMessage = false;
        let wizardShowNextStep = true;

        if (this.get('loadAllMarkets')) {
          nextStep();

        } else if (this.get('selectedCodesCount')) {

          nextStep();
        } else {
          wizardErrorMessage = "If you don't choose any market, all the tenders will be selected. This may result in a slow network.";
          wizardShowNextStep = false;
        }

        this.setProperties({
          wizardSteps: {
            cpvsStatus: 'completed',
            optionsStatus: 'current'
          },
          wizardErrorMessage,
          wizardShowNextStep
        });
      },

      '5': () => {
        nextStep();
      }
    };

    actions[stepId]();
  },

  actions: {
    didInsertJsTree(renderNo) {
      if (renderNo == 2) {
        this.set('allCpvSelected', true);
        this.get('jsTree').send('selectAll');
      } else {
        //@todo: it should work
        this.get('jsTree').send('closeAll');
      }
    },

    selectAllCpvs() {
      this.set('allCpvSelected', true);
      this.get('jsTree').send('selectAll');
      this.get('jsTree').send('closeAll');
    },

    deselectAllCpvs() {
      this.set('allCpvSelected', false);
      this.get('jsTree').send('deselectAll');
      this.get('jsTree').send('closeAll');
    },

    wizardStepChanged(wizardStep) {
      this.wizardStepChanged(wizardStep);
    },

    proceedAnyway(wizardStep) {
      this.set('loadAllMarkets', true);
      this.wizardStepChanged({ 'step_id': wizardStep });
    },

    // Step1 : Select Countries
    onCountrySelect(selectedCountryId) {
      // check if the country is selected
      // if selected add selected class else remove selected class
      // retrieve all the selected countries and add them to the query.countries
      this.setProperties({
        shouldUpdate: {
          years: true,
          cpvs: true
        }
      });

      let self = this;
      let jQcountryOption = $(`ul.wizard-countries #${selectedCountryId}`);
      if (jQcountryOption.hasClass('selected')) {
        jQcountryOption.removeClass('selected');
      } else {
        jQcountryOption.addClass('selected');
      }

      this.set('query.countries', []);
      $('ul.wizard-countries li.selected').each(function() {
        let countryId = $(this).attr('id');
        self.get('query.countries').push(countryId);
      });

      if (this.get('query.actors').length > 0 && !this.get('checkActors')) {
        this.set('checkActors', true);
      }
    },

    // Step2:
    onAutocompleteSelectEvent(value) {
      /*this.set('shouldUpdate.years', true);
      this.set('shouldUpdate.cpvs', true);*/
      this.setProperties({
        shouldUpdate: {
          years: true,
          cpvs: true
        }
      });
      this.set('query.actors', []);
      let self = this;
      _.each(value, (v) => {
        self.get('query.actors').push(v.id);
      });
    },

    actorTermChanged(queryTerm) {
      // remove leading and trailing whitespace
      queryTerm = _.trim(queryTerm);
      if (!queryTerm.length) {
        this.set('autocompleteActorsOptions', []);

      }
      if (queryTerm.length > 2) {
        let countries = this.get('query.countries');
        let options = {};
        if (countries.length > 0) {
          options.countries = countries;
        }

        if (queryTerm) {
          options.name = queryTerm;
        }

        return this.get('ajax')
          .request('/tenders/actors',
                {
                  data: options,
                  headers: { 'Content-Type': 'application/json' }
                })
          .then((data) => {
            let autocompleteActorsOptions = [];
            _.each(data.actors, (actor) => {
              if (this.get('query.actors').length > 0) {
                if (_.indexOf(this.get('query.actors'), actor.id) < 0) {
                  autocompleteActorsOptions.push(actor);
                }
              } else {
                autocompleteActorsOptions = data.actors;
              }
            });
            this.set('autocompleteActorsOptions', autocompleteActorsOptions);
          });
      }
    },

    rangeSlideAction(value) {
      // on click change the status
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
    },
    rangeChangeAction(value) {
      // destroy the tree, if any
      this.set('query.years', []);
      this.get('query.years').push(value[0]);
      this.get('query.years').push(value[1]);
      run.scheduleOnce('afterRender', function() {
        $('span.left-year').text(value[0]);
        $('span.right-year').text(value[1]);
      });
      this.set('query.years', _.range(this.get('query.years')[0], ++this.get('query.years')[1]));
      let years = this.get('query.years');
      this.set('queryYearsRange', { 'min': _.min(years), 'max': _.max(years) });
      this.set('cpvsIsDisabled', false);
      this.set('shouldUpdate.cpvs', true);
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
      self.set('networkLoading', true);

      this.get('store').createRecord('network', {
        name: self.get('name'),
        settings: {
          nodeSize: this.get('query.nodes'),
          edgeSize: this.get('query.edges')
        },
        query
      }).save().then((data) => {
        self.set('isLoading', false);
        self.set('networkLoading', false);
        self.toggleProperty('optionsModalIsOpen');
        self.transitionToRoute('network.show', data.id);
      }).catch((data) => {
        // TODO: Catch the actual reason sent by the API (for some reason it's not pulled in, will check later)
        Logger.error(`Error: ${data}`);
        self.set('isLoading', false);
        self.set('networkLoading', false);
        self.notifications.clearAll();
        self.notifications.error('This should not be happening. Please send us an email at tech@tenders.exposed', {
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
