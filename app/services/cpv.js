import Ember from 'ember';
import Service from '@ember/service';

const { Logger } = Ember;
const rootCodes = [
  {
    id: '09000000',
    xNumberDigits: 2,
    name: 'Petroleum products, fuel, electricity and other sources of energy'
  },
  {
    id: '38000000',
    xNumberDigits: 2,
    name: 'Laboratory, optical and precision equipments (excl. glasses)'
  },
  {
    id: '43000000',
    xNumberDigits: 2,
    name: 'Machinery for mining, quarrying, construction equipment'
  },
  {
    id: '14000000',
    xNumberDigits: 2,
    name: 'Mining, basic metals and related products'
  },
  {
    id: '75000000',
    xNumberDigits: 2,
    name: 'Administration, defence and social security services'
  },
  {
    id: '19000000',
    xNumberDigits: 2,
    name: 'Leather and textile fabrics, plastic and rubber materials'
  },
  {
    id: '98000000',
    xNumberDigits: 2,
    name: 'Other community, social and personal services'
  },
  {
    id: '30000000',
    xNumberDigits: 0,
    name: 'Office and computing machinery, equipment and supplies except furniture and software packages'
  },
  {
    id: '22000000',
    xNumberDigits: 2,
    name: 'Printed matter and related products'
  },
  {
    id: '72000000',
    xNumberDigits: 2,
    name: 'IT services: consulting, software development, Internet and support'
  },
  {
    id: '63000000',
    xNumberDigits: 2,
    name: 'Supporting and auxiliary transport services; travel agencies services'
  },
  {
    id: '31000000',
    xNumberDigits: 2,
    name: 'Electrical machinery, apparatus, equipment and consumables; lighting'
  },
  {
    id: '35000000',
    xNumberDigits: 2,
    name: 'Security, fire-fighting, police and defence equipment'
  },
  {
    id: '64000000',
    xNumberDigits: 2,
    name: 'Postal and telecommunications services'
  },
  {
    id: '41000000',
    xNumberDigits: 2,
    name: 'Collected and purified water'
  },
  {
    id: '76000000',
    xNumberDigits: 2,
    name: 'Services related to the oil and gas industry'
  },
  {
    id: '42000000',
    xNumberDigits: 2,
    name: 'Industrial machinery'
  },
  {
    id: '15000000',
    xNumberDigits: 2,
    name: 'Food, beverages, tobacco and related products'
  },
  {
    id: '90000000',
    xNumberDigits: 0,
    name: 'Sewage, refuse, cleaning and environmental services'
  },
  {
    id: '60000000',
    xNumberDigits: 0,
    name: 'Transport services (excl. Waste transport)'
  },
  {
    id: '92000000',
    xNumberDigits: 2,
    name: 'Recreational, cultural and sporting services'
  },
  {
    id: '37000000',
    xNumberDigits: 2,
    name: 'Musical instruments, sport goods, games, toys, handicraft, art materials and accessories'
  },
  {
    id: '32000000',
    xNumberDigits: 2,
    name: 'Radio, television, communication, telecommunication and related equipment'
  },
  {
    id: '33000000',
    xNumberDigits: 2,
    name: 'Medical equipments, pharmaceuticals and personal care products'
  },
  {
    id: '71000000',
    xNumberDigits: 2,
    name: 'Architectural, construction, engineering and inspection services'
  },
  {
    id: '55000000',
    xNumberDigits: 2,
    name: 'Hotel, restaurant and retail trade services'
  },
  {
    id: '51000000',
    xNumberDigits: 2,
    name: 'Installation services (except software)'
  },
  {
    id: '66000000',
    xNumberDigits: 2,
    name: 'Financial and insurance services'
  },
  {
    id: '80000000',
    xNumberDigits: 0,
    name: 'Education and training services'
  },
  {
    id: '18000000',
    xNumberDigits: 2,
    name: 'Clothing, footwear, luggage articles and accessories'
  },
  {
    id: '50000000',
    xNumberDigits: 0,
    name: 'Repair and maintenance services'
  },
  {
    id: '34000000',
    xNumberDigits: 2,
    name: 'Transport equipment and auxiliary products to transportation'
  },
  {
    id: '24000000',
    xNumberDigits: 2,
    name: 'Chemical products'
  },
  {
    id: '73000000',
    xNumberDigits: 2,
    name: 'Research and development services and related consultancy services'
  },
  {
    id: '70000000',
    xNumberDigits: 0,
    name: 'Real estate services'
  },
  {
    id: '85000000',
    xNumberDigits: 2,
    name: 'Health and social work services'
  },
  {
    id: '77000000',
    xNumberDigits: 2,
    name: 'Agricultural, forestry, horticultural, aquacultural and apicultural services'
  },
  {
    id: '48000000',
    xNumberDigits: 2,
    name: 'Software package and information systems'
  },
  {
    id: '65000000',
    xNumberDigits: 2,
    name: 'Public utilities'
  },
  {
    id: '44000000',
    xNumberDigits: 2,
    name: 'Construction structures and materials; auxiliary products to construction (except electric apparatus)'
  },
  {
    id: '79000000',
    xNumberDigits: 2,
    name: 'Business services: law, marketing, consulting, recruitment, printing and security'
  },
  {
    id: '45000000',
    xNumberDigits: 2,
    name: 'Construction work'
  },
  {
    id: '16000000',
    xNumberDigits: 2,
    name: 'Agricultural machinery'
  },
  {
    id: '03000000',
    xNumberDigits: 2,
    name: 'Agricultural, farming, fishing, forestry and related products'
  },
  {
    id: '39000000',
    xNumberDigits: 2,
    name: 'Furniture (incl. office furniture), furnishings, domestic appliances (excl. lighting) and cleaning products'
  }
];

export default Service.extend({

  getCode(id) {
    let result = this.get('data').find((code) => code.id === id);
    if (!result) {
      Logger.warn(`No result for ${id}`);
      return { id, name: null };
    }
    //result.doc_count = 0;
    result.parent = '#';
    // result.count = doc_count;
    result.state = { opened: false };
    result.text = '<div class="details">';
    result.text += `<div class="cpv-title">${result.name}</div>`;
    result.text += `<div class="cpv-code">${result.id} </div>`;
    result.text += `</div>`;
    return result;
  },

  getDivisions() {
    return this.get('data').map(
      (cpv) => cpv.id.slice(0, cpv.xNumberDigits || 2)
    ).sort().reverse();
  },

  init() {
    this.set('data', rootCodes);
  }
});
