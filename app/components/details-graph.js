import Ember from 'ember';
import numeral from 'numeral';

const { Component, $ } = Ember;

export default Component.extend({
  contracts: '',
  renderGraphic() {
    // console.log('contracts1', this.get('contracts'));
    if (this.get('contracts')) {
      let graphItems = [];
      // console.log('contracts-details-graph', this.get('contracts'));
      // group contracts is years/months
      let sortedContracts = _.groupBy(this.get('contracts'), (element) => {
        return element.award.date.x_year;
      });
      _.forEach(sortedContracts, (value, year) => {
        if (year !== 'null') {
          sortedContracts[year] = _.groupBy(sortedContracts[year], (element) => {
            return element.award.date.x_month;
          });
          _.forEach(sortedContracts[year], (contractsList, month) => {
            let date = `${year}-${month}-01`;
            let end = `${year}-${month}-29`;
            let count = contractsList.length;
            let sum = _.sumBy(contractsList, (o) => {
              return o.award.value.x_amount_eur;
            });
            graphItems.push({ x: date, y: count, group: 0, end, sum, year, month });
            graphItems.push({ x: date, y: sum, group: 1, end, count, year, month });
          });
        }
      });

      this.set('sortedContracts', sortedContracts);
      // console.log('graphItems', graphItems);
      // min - max Count & sum of contracts
      let minDate = _.minBy(graphItems, (o) => {
        return o.x;
      });
      let maxDate = _.maxBy(graphItems, (o) => {
        return o.x;
      });

      let maxCount = _.maxBy(graphItems, (o) => {
        if (o.group === 0) {
          return o.y;
        }
      });
      let maxSum = _.maxBy(graphItems, (o) => {
        if (o.group === 1) {
          return o.y;
        }
      });

      let minCount = _.minBy(graphItems, (o) => {
        if (o.group === 0) {
          return o.y;
        }
      });
      let minSum = _.minBy(graphItems, (o) => {
        if (o.group === 1) {
          return o.y;
        }
      });

      let statistics = { exists: false };
      // let sortedProcurers = {};
      // @todo: since the query for suppliers/procurers does not retrieve only the contracts from the range years this cannot be done

      // console.log('route', this.get('route'));
      /*if (this.get('route') === 'suppliers') {
        // frequent procurer & biggest amount
        // console.log('contracts2', this.get('contracts'));
        sortedProcurers = _.groupBy(this.get('contracts'), (element) => {
          return element.procuring_entity.x_slug_id;
        });
        let procurersContracts = [];
        // console.log('sortedProcurers', sortedProcurers);
        _.forEach(sortedProcurers, (value, id) => {
          let sum = _.sumBy(value, (o) => {
            return o.award.value.x_amount_eur;
          });
          let count = value.length;
          procurersContracts.push({ id, sum, count });
        });

        let maxIncome = _.maxBy(procurersContracts, (o) => {
          return o.sum;
        });
        let maxFrequency = _.maxBy(procurersContracts, (o) => {
          return o.count;
        });

        if (maxFrequency.count > 0) {
          statistics.exists = true;
          if (typeof statistics.node === 'undefined') {
            statistics.node = {};
          }
          statistics.node.most_frequent = {
            id: sortedProcurers[maxFrequency.id][0].procuring_entity.x_slug_id,
            node_name: sortedProcurers[maxFrequency.id][0].procuring_entity.name,
            sum: maxFrequency.sum,
            count: maxFrequency.count
          };
        }
        if (maxIncome.sum > 0) {
          statistics.exists = true;
          if (typeof statistics.node === 'undefined') {
            statistics.node = {};
          }
          statistics.node.highest_income = {
            id: sortedProcurers[maxIncome.id][0].procuring_entity.x_slug_id,
            node_name: sortedProcurers[maxIncome.id][0].procuring_entity.name,
            sum: maxIncome.sum,
            count: maxIncome.count
          };
        }
      }*/

      // if there is a difference between max and min
      if (maxSum.y > minSum.y) {
        statistics.exists = true;
        statistics.month_income = {
          highest: {
            year: maxSum.year,
            month: maxSum.month,
            sum: maxSum.y,
            count: maxSum.count
          },
          lowest: {
            year: minSum.year,
            month: minSum.month,
            sum: minSum.y,
            count: minSum.count
          }
        };
      }
      if (maxCount.y > minCount.y) {
        statistics.exists = true;
        statistics.month_frequency = {
          highest: {
            year: maxCount.year,
            month: maxCount.month,
            count: maxCount.y,
            sum: maxCount.sum
          },
          lowest: {
            year: minCount.year,
            month: minCount.month,
            count: minCount.y,
            sum: minCount.sum
          }
        };
      }

      this.set('statistics', statistics);
      // console.log('statistics', statistics);
      // console.log('sortedProcurers', sortedProcurers);
      $('#contracts-stat').html('');
      let container = $('#contracts-stat').get(0);
      // eslint-disable-next-line no-undef
      let groups = new vis.DataSet();
      groups.add({ id: 0, content: 'group0' });
      groups.add({ id: 1, content: 'group1', options: { yAxisOrientation: 'right' } });

      let items = graphItems;
      // eslint-disable-next-line no-undef
      let dataset = new vis.DataSet(items);
      let options = {
        style: 'bar',
        barChart: { width: 50, align: 'right', sideBySide: true }, // align: left, center, right
        drawPoints: true,
        clickToUse: true,
        height: '300px',
        dataAxis: {
          left: {
            range: { min: 0, max: maxCount.y },
            title: { text: 'COUNT' }
          },
          right: {
            range: { min: 0, max: maxSum.y },
            format: (value) => {
              let formatedValue = numeral(value).format('0,0[.]00 a').toUpperCase();
              return formatedValue;
            },
            title: { text: 'SUM' }
          },
          icons: true
        },
        orientation: 'top',
        start: minDate.x,
        end: maxDate.x,
        zoomMin: 20000000000
      };
      // eslint-disable-next-line no-undef
      let graph2d = new vis.Graph2d(container, items, groups, options);

      let self = this;
      let onClickGrph = (properties) => {
        let year = properties.time.getFullYear();
        let month = properties.time.getMonth() + 1;
        // console.log('year ', year);
        // console.log('month ', month);
        // console.log('sortedContracts', sortedContracts);
        let trueMonth = 0;
        let monthContract = 0;
        let check = false;
        _.forEach(sortedContracts[year], (contractList, monthContract) => {
          if (monthContract <= month) {
            trueMonth = monthContract; check = true;
          }
          // console.log('month' , monthContract);
          // console.log('true2' , trueMonth);
        });
        // if no month was found then the lastone will be taken
        if (!check) {
          trueMonth = monthContract;
          // console.log('trueMonth - notChecked', trueMonth);
        }
        // console.log('trueMonth', trueMonth);
        // console.log('sortedContracts', sortedContracts[year][trueMonth]);
        if (sortedContracts[year][trueMonth].length > 0) {
          self.set('showContracts', true);
          self.set('filteredContracts', sortedContracts[year][trueMonth]);
          self.set('labelFilteredContracts', '');
          self.set('dateFilteredContracts', `01-${trueMonth}-${year}`);
        }
      };
      graph2d.on('click', onClickGrph);
    }
  },

  didUpdateAttrs() {
    this.renderGraphic();
  },
  didInsertElement() {
    this.renderGraphic();
  },
  actions: {
    close() {
      this.set('showContracts', false);
    },
    showContractsMonthly(year, month, label) {
      this.set('showContracts', true);
      this.set('filteredContracts', this.get('sortedContracts')[year][month]);
      this.set('labelFilteredContracts', `${label} ${month} ${year}`);
      this.set('dateFilteredContracts', `01-${month}-${year}`);
    }
  }
});