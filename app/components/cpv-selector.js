import Ember from 'ember';

const { Component, Logger, computed, observer, inject } = Ember;

export default Component.extend({
  cpvService: inject.service('cpv'),
  classNames: ['cpv-selector'],
  classNameBindings: ['visible:visible:hide'],
  refresh: true,
  table: {},
  showSelected: false,
  searchTerm: '',
  searchTree: '',
  isDisabled: computed('searchTerm.length', function() {
    if (this.get('searchTerm.length') > 4) {
      return false;
    } else {
      this.set('searchTree', '');
      return true;
    }
  }),

  treeObserver: observer('cpvs', function() {
    this.createTree();
  }),

  flattenCpvs(cpvs) {
    _.each(cpvs, function(value, key, array) {
      array[key] = _.toArray(value);
    });
  },

  init() {
    this._super();
    this.createTree();
  },

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

    this.get('benchmark').store('performance.cpvs.count', 1234);
    this.set('tree', tree);
  },

  collectChildren(node, cpvs) {
    let division = node.id.slice(0, 2);

    return _.filter(cpvs, (cpv) => cpv.id.indexOf(division) === 0);
  },

  actions: {
    toggleSelectedCodesModal() {
      this.toggleProperty('showSelected');
    },
    toggleModal() {
      this.sendAction();
    },
    searchCpv() {
      this.set('searchTree', this.get('searchTerm'));
    }
  }
});
