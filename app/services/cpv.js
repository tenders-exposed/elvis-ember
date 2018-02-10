import Ember from 'ember';
import Service from '@ember/service';

const { Logger } = Ember;
const rootCodes = [
  {
    id: '09000000',
    xNumberDigits: 2,
    xName: 'Petroleum products, fuel, electricity and other sources of energy'
  },
  {
    id: '38000000',
    xNumberDigits: 2,
    xName: 'Laboratory, optical and precision equipments (excl. glasses)'
  },
  {
    id: '43000000',
    xNumberDigits: 2,
    xName: 'Machinery for mining, quarrying, construction equipment'
  },
  {
    id: '14000000',
    xNumberDigits: 2,
    xName: 'Mining, basic metals and related products'
  },
  {
    id: '75000000',
    xNumberDigits: 2,
    xName: 'Administration, defence and social security services'
  },
  {
    id: '19000000',
    xNumberDigits: 2,
    xName: 'Leather and textile fabrics, plastic and rubber materials'
  },
  {
    id: '98000000',
    xNumberDigits: 2,
    xName: 'Other community, social and personal services'
  },
  {
    id: '30000000',
    xNumberDigits: 0,
    xName: 'Office and computing machinery, equipment and supplies except furniture and software packages'
  },
  {
    id: '22000000',
    xNumberDigits: 2,
    xName: 'Printed matter and related products'
  },
  {
    id: '72000000',
    xNumberDigits: 2,
    xName: 'IT services: consulting, software development, Internet and support'
  },
  {
    id: '63000000',
    xNumberDigits: 2,
    xName: 'Supporting and auxiliary transport services; travel agencies services'
  },
  {
    id: '31000000',
    xNumberDigits: 2,
    xName: 'Electrical machinery, apparatus, equipment and consumables; lighting'
  },
  {
    id: '35000000',
    xNumberDigits: 2,
    xName: 'Security, fire-fighting, police and defence equipment'
  },
  {
    id: '64000000',
    xNumberDigits: 2,
    xName: 'Postal and telecommunications services'
  },
  {
    id: '41000000',
    xNumberDigits: 2,
    xName: 'Collected and purified water'
  },
  {
    id: '76000000',
    xNumberDigits: 2,
    xName: 'Services related to the oil and gas industry'
  },
  {
    id: '42000000',
    xNumberDigits: 2,
    xName: 'Industrial machinery'
  },
  {
    id: '15000000',
    xNumberDigits: 2,
    xName: 'Food, beverages, tobacco and related products'
  },
  {
    id: '90000000',
    xNumberDigits: 0,
    xName: 'Sewage, refuse, cleaning and environmental services'
  },
  {
    id: '60000000',
    xNumberDigits: 0,
    xName: 'Transport services (excl. Waste transport)'
  },
  {
    id: '92000000',
    xNumberDigits: 2,
    xName: 'Recreational, cultural and sporting services'
  },
  {
    id: '37000000',
    xNumberDigits: 2,
    xName: 'Musical instruments, sport goods, games, toys, handicraft, art materials and accessories'
  },
  {
    id: '32000000',
    xNumberDigits: 2,
    xName: 'Radio, television, communication, telecommunication and related equipment'
  },
  {
    id: '33000000',
    xNumberDigits: 2,
    xName: 'Medical equipments, pharmaceuticals and personal care products'
  },
  {
    id: '71000000',
    xNumberDigits: 2,
    xName: 'Architectural, construction, engineering and inspection services'
  },
  {
    id: '55000000',
    xNumberDigits: 2,
    xName: 'Hotel, restaurant and retail trade services'
  },
  {
    id: '51000000',
    xNumberDigits: 2,
    xName: 'Installation services (except software)'
  },
  {
    id: '66000000',
    xNumberDigits: 2,
    xName: 'Financial and insurance services'
  },
  {
    id: '80000000',
    xNumberDigits: 0,
    xName: 'Education and training services'
  },
  {
    id: '18000000',
    xNumberDigits: 2,
    xName: 'Clothing, footwear, luggage articles and accessories'
  },
  {
    id: '50000000',
    xNumberDigits: 0,
    xName: 'Repair and maintenance services'
  },
  {
    id: '34000000',
    xNumberDigits: 2,
    xName: 'Transport equipment and auxiliary products to transportation'
  },
  {
    id: '24000000',
    xNumberDigits: 2,
    xName: 'Chemical products'
  },
  {
    id: '73000000',
    xNumberDigits: 2,
    xName: 'Research and development services and related consultancy services'
  },
  {
    id: '70000000',
    xNumberDigits: 0,
    xName: 'Real estate services'
  },
  {
    id: '85000000',
    xNumberDigits: 2,
    xName: 'Health and social work services'
  },
  {
    id: '77000000',
    xNumberDigits: 2,
    xName: 'Agricultural, forestry, horticultural, aquacultural and apicultural services'
  },
  {
    id: '48000000',
    xNumberDigits: 2,
    xName: 'Software package and information systems'
  },
  {
    id: '65000000',
    xNumberDigits: 2,
    xName: 'Public utilities'
  },
  {
    id: '44000000',
    xNumberDigits: 2,
    xName: 'Construction structures and materials; auxiliary products to construction (except electric apparatus)'
  },
  {
    id: '79000000',
    xNumberDigits: 2,
    xName: 'Business services: law, marketing, consulting, recruitment, printing and security'
  },
  {
    id: '45000000',
    xNumberDigits: 2,
    xName: 'Construction work'
  },
  {
    id: '16000000',
    xNumberDigits: 2,
    xName: 'Agricultural machinery'
  },
  {
    id: '03000000',
    xNumberDigits: 2,
    xName: 'Agricultural, farming, fishing, forestry and related products'
  },
  {
    id: '39000000',
    xNumberDigits: 2,
    xName: 'Furniture (incl. office furniture), furnishings, domestic appliances (excl. lighting) and cleaning products'
  }
];

export default Service.extend({

  getCode(id) {
    let result = this.get('data').find((code) => code.id === id);
    if (!result) {
      Logger.warn(`No result for ${id}`);
      return { id, xName: null };
    }
    //result.doc_count = 0;
    result.parent = '#';
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
