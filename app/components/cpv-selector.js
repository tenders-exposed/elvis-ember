import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  selectedCodes: [],
  refresh: true,
  table: {},

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
    let cpvs = this.get('cpvs');
    _.map(_.groupBy(cpvs, (obj) => obj.id[0]), (group) => {
      group = _.sortBy(group, 'id');
      _.map(group, (obj) => {
        let patternBase = obj.id.replace(/0+$/, '').slice(0, -1);
        let parent = {id: '#'};
        const matcher = (o) => o.id.match(new RegExp(`^${patternBase}0+$`));
        while (patternBase.length > 0 && parent.id === '#') {
          let found = _.findLast(group, matcher);
          if (found) {
            parent = found;
            break;
          }
          patternBase = patternBase.slice(0, -1);
        }
        obj.parent = String(parent.id);
        obj.state = {opened: false};
        obj.name = `${obj.text}`;
      });
    });

  let count = (obj) =>{
      if(obj.count) {
        return obj.count;
      } else {
        return _.sumBy(
          cpvs,
          function(cpv){
            if(cpv.id === obj.id) {
              return cpv.doc_count;
            }
            if (cpv.parent === obj.id ) {
              return count(cpv);
            }
          }
        );
      }
    }
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
    toggleModal() {
      this.get('targetObject').send('toggleCpvModal');
    },
  }
});
