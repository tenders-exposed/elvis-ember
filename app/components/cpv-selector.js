import Ember from 'ember';

const { Component, computed, observer, inject } = Ember;

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
    this.createTree3();
  }),

  flattenCpvs(cpvs) {
    _.each(cpvs, function(value, key, array) {
      array[key] = _.toArray(value);
    });
  },

  init() {
    this._super();
    this.createTree3();
  },

  createTree3() {
    let cpvs = _.sortBy(
      _.cloneDeep(this.get('cpvs')),
      ['id']
    );
    let tree = [];
    let missingCodes = [];

    // let divisions = [];
    // _.filter(cpvs, (cpv) => cpv.number_digits <= 2)
    //   .map((node) => {
    //     node.division = node.id.slice(0, 2);
    //     node.root = true;
    //     divisions.push(node.division);
    //   });

    // let divisions = _.filter(cpvs, (cpv) => cpv.number_digits <= 2)
    //     .map((node) => node.id.slice(0, node.number_digits || 1));
    // let groups = _.filter(cpvs, (cpv) => cpv.number_digits == 3)
    //     .map((node) => node.id.slice(0, 3));
    // let classes = _.filter(cpvs, (cpv) => cpv.number_digits == 4)
    //     .map((node) => node.id.slice(0, 4));

    // console.log(divisions);

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
          console.warn(`Cannot compute division for ${id}`, cpv);
          result.parent = '#';
        } else {
          if (!cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`)) {
            console.warn('Trying to get division', cpvDivision);
            missingCodes.push(result.parent);
          }
        }
        // if (!cpvDivision) {
        //   console.warn(`Cannot compute division for ${id}`, cpv);
        //   result.parent = '#';
        // } else {
        //   // if (!cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`)) {
        //   let regex = `${cpvDivision}0+$`;
        //   if (!cpvs.find((cpv) => cpv.id.match(new RegExp(regex, 'g')))) {
        //     missingCodes.push(result.parent);
        //   }
        // }
        break;

      case 4:
      default:
        // First attempt to find a CPV group (level 2, 3 digits)
        cpvGroup = id.slice(0, 3);
        parent = cpvs.find((cpv) => cpv.id == `${cpvGroup}00000`);
        if (parent) {
          result.parent = parent.id;
          break;
        }

        // If we're here, we're looking for a major division
        cpvDivision = this.get('cpvService').getDivisions().find(
          (div) => div == id.slice(0, 2)
        );
        if (!cpvDivision) {
          console.warn(`Cannot find division ${cpvDivision} for ${id}`, cpv);
          result.parent = '#';
        } else {
          // if (!cpvs.find((cpv) => cpv.id == `${cpvDivision}000000`)) {
          result.parent = `${cpvDivision}000000`;
          regex = `${cpvDivision}0+$`;
          if (!cpvs.find((c) => c.id.match(new RegExp(regex, 'g'))) ||
              !cpvs.find((c) => c.id == result.parent)) {
            missingCodes.push(result.parent);
          }
        }
        break;
      }

      tree.push(result);
    });

    missingCodes = _.uniq(missingCodes);
    console.log('missing', missingCodes);
    missingCodes.map((missingCode) => tree.push(
      this.get('cpvService')
        .getCode(missingCode)
    ));

    // Tree health check!
    tree.map((node) => {
      if (!tree.find((n) => n.id == node.parent) && node.parent !== '#') {
        console.error(`Parent with id ${node.parent} is missing!`, cpvs.find((n) => n.id == node.id));
      }
    });
    console.log('Got past checking missing codes');

    // console.table(tree);
    this.set('tree', tree);
  },

  collectChildren(node, cpvs) {
    let division = node.id.slice(0, 2);

    return _.filter(cpvs, (cpv) => cpv.id.indexOf(division) === 0);
  },

  createTree2() {
    let cpvs = _.sortBy(this.get('cpvs'), ['id']);
    let tree = [];

    let lastparent2, lastparent3;

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

      if (number_digits == 0 || number_digits == 2) {
        result.parent = '#';
        lastparent2 = cpv.id;
      } else if (number_digits == 3) {
        result.parent = lastparent2 ?
          lastparent2 :
          '#';
        lastparent3 = cpv.id;
      } else if (number_digits >= 4) {
        result.parent = lastparent3 ?
          lastparent3 :
          '#';
      } else {
        result.parent = '#';
      }

      tree.push(result);
    });

    tree.map((cpv) => {
      console.log('getting count for ', cpv.id);
      cpv.subtreeCount = this.getChildrenCount(cpv.id);
      cpv.text = '<span class="details"><small>';
      cpv.text += `${cpv.id} (${cpv.count} / ${cpv.subtreeCount})`;
      cpv.text += `</small><br><div>${cpv.name}</div></span>`;
    });

    // console.log(tree);
    this.set('tree', tree);
  },

  getChildrenCount(nodeId) {
    let tree = this.get('tree');
    let children = _.filter(tree, { 'parent': nodeId });
    console.log('nodeId is ', nodeId);
    console.log('children are ', children);
    let sum = 0;

    if (children) {
      children.map((child) => this.getChildrenCount(child.id));
    } else {
      sum = _.sumBy(children, (child) => child.count);
    }

    return sum;
  },

  createTree() {
    let cpvs = this.get('cpvs');
    _.map(_.groupBy(cpvs, (obj) => obj.id[0]), (group) => {
      group = _.sortBy(group, 'id');
      _.map(group, (obj) => {
        let patternBase = obj.id.replace(/0+$/, '').slice(0, -1);
        let parent = { id: '#' };
        let matcher = (o) => o.id.match(new RegExp(`^${patternBase}0+$`));
        while (patternBase.length > 0 && parent.id === '#') {
          let found = _.findLast(group, matcher);
          if (found) {
            parent = found;
            break;
          }
          patternBase = patternBase.slice(0, -1);
        }
        obj.parent = String(parent.id);
        obj.state = { opened: false };
        obj.name = `${obj.text}`;
      });
    });

    let count = (obj) => {
      if (obj.count) {
        return obj.count;
      } else {
        return _.sumBy(
          cpvs,
          (cpv) => {
            if (cpv.id === obj.id) {
              return cpv.doc_count;
            } else if (cpv.parent === obj.id) {
              return count(cpv);
            } else {
              return 0;
            }
          }
        );
      }
    };

    _.map(cpvs, (obj) =>    {
      obj.count = count(obj);
      obj.text = `<span class="details">
                    <small>
                        ${obj.id} ( ${obj.count} / ${obj.doc_count})
                    </small>
                    <br>
                    <div>
                      ${obj.text}
                    </div>
                  </span>
                  `;
    });
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
