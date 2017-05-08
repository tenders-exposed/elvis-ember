import Ember from 'ember';

const { Service } = Ember;
const rootCodes = [
  {
    id: '09000000',
    number_digits: 2,
    text: 'Petroleum products, fuel, electricity and other sources of energy'
  },
  {
    id: '38000000',
    number_digits: 2,
    text: 'Laboratory, optical and precision equipments (excl. glasses)'
  },
  {
    id: '43000000',
    number_digits: 2,
    text: 'Machinery for mining, quarrying, construction equipment'
  },
  {
    id: '14000000',
    number_digits: 2,
    text: 'Mining, basic metals and related products'
  },
  {
    id: '75000000',
    number_digits: 2,
    text: 'Administration, defence and social security services'
  },
  {
    id: '19000000',
    number_digits: 2,
    text: 'Leather and textile fabrics, plastic and rubber materials'
  },
  {
    id: '98000000',
    number_digits: 2,
    text: 'Other community, social and personal services'
  },
  {
    id: '30000000',
    number_digits: 0,
    text: 'Office and computing machinery, equipment and supplies except furniture and software packages'
  },
  {
    id: '22000000',
    number_digits: 2,
    text: 'Printed matter and related products'
  },
  {
    id: '72000000',
    number_digits: 2,
    text: 'IT services: consulting, software development, Internet and support'
  },
  {
    id: '63000000',
    number_digits: 2,
    text: 'Supporting and auxiliary transport services; travel agencies services'
  },
  {
    id: '31000000',
    number_digits: 2,
    text: 'Electrical machinery, apparatus, equipment and consumables; lighting'
  },
  {
    id: '35000000',
    number_digits: 2,
    text: 'Security, fire-fighting, police and defence equipment'
  },
  {
    id: '64000000',
    number_digits: 2,
    text: 'Postal and telecommunications services'
  },
  {
    id: '41000000',
    number_digits: 2,
    text: 'Collected and purified water'
  },
  {
    id: '76000000',
    number_digits: 2,
    text: 'Services related to the oil and gas industry'
  },
  {
    id: '42000000',
    number_digits: 2,
    text: 'Industrial machinery'
  },
  {
    id: '15000000',
    number_digits: 2,
    text: 'Food, beverages, tobacco and related products'
  },
  {
    id: '90000000',
    number_digits: 0,
    text: 'Sewage, refuse, cleaning and environmental services'
  },
  {
    id: '60000000',
    number_digits: 0,
    text: 'Transport services (excl. Waste transport)'
  },
  {
    id: '92000000',
    number_digits: 2,
    text: 'Recreational, cultural and sporting services'
  },
  {
    id: '37000000',
    number_digits: 2,
    text: 'Musical instruments, sport goods, games, toys, handicraft, art materials and accessories'
  },
  {
    id: '32000000',
    number_digits: 2,
    text: 'Radio, television, communication, telecommunication and related equipment'
  },
  {
    id: '33000000',
    number_digits: 2,
    text: 'Medical equipments, pharmaceuticals and personal care products'
  },
  {
    id: '71000000',
    number_digits: 2,
    text: 'Architectural, construction, engineering and inspection services'
  },
  {
    id: '55000000',
    number_digits: 2,
    text: 'Hotel, restaurant and retail trade services'
  },
  {
    id: '51000000',
    number_digits: 2,
    text: 'Installation services (except software)'
  },
  {
    id: '66000000',
    number_digits: 2,
    text: 'Financial and insurance services'
  },
  {
    id: '80000000',
    number_digits: 0,
    text: 'Education and training services'
  },
  {
    id: '18000000',
    number_digits: 2,
    text: 'Clothing, footwear, luggage articles and accessories'
  },
  {
    id: '50000000',
    number_digits: 0,
    text: 'Repair and maintenance services'
  },
  {
    id: '34000000',
    number_digits: 2,
    text: 'Transport equipment and auxiliary products to transportation'
  },
  {
    id: '24000000',
    number_digits: 2,
    text: 'Chemical products'
  },
  {
    id: '73000000',
    number_digits: 2,
    text: 'Research and development services and related consultancy services'
  },
  {
    id: '70000000',
    number_digits: 0,
    text: 'Real estate services'
  },
  {
    id: '85000000',
    number_digits: 2,
    text: 'Health and social work services'
  },
  {
    id: '77000000',
    number_digits: 2,
    text: 'Agricultural, forestry, horticultural, aquacultural and apicultural services'
  },
  {
    id: '48000000',
    number_digits: 2,
    text: 'Software package and information systems'
  },
  {
    id: '65000000',
    number_digits: 2,
    text: 'Public utilities'
  },
  {
    id: '44000000',
    number_digits: 2,
    text: 'Construction structures and materials; auxiliary products to construction (except electric apparatus)'
  },
  {
    id: '79000000',
    number_digits: 2,
    text: 'Business services: law, marketing, consulting, recruitment, printing and security'
  },
  {
    id: '45000000',
    number_digits: 2,
    text: 'Construction work'
  },
  {
    id: '16000000',
    number_digits: 2,
    text: 'Agricultural machinery'
  },
  {
    id: '03000000',
    number_digits: 2,
    text: 'Agricultural, farming, fishing, forestry and related products'
  },
  {
    id: '39000000',
    number_digits: 2,
    text: 'Furniture (incl. office furniture), furnishings, domestic appliances (excl. lighting) and cleaning products'
  }
];

export default Service.extend({

  getCode(id) {
    let result = this.get('data').find((code) => code.id === id);
    result.doc_count = 0;
    result.parent = '#';
    return result;
  },

  init() {
    this.set('data', rootCodes);
  }
});
