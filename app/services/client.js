import Ember from 'ember';

export default Ember.Service.extend({

  init() {
    let _this = this;
    let client = new ClientJS();

    let properties = [
      // 'Fingerprint',
      'UserAgent',
      'Browser',
      'BrowserVersion',
      'BrowserMajorVersion',
      'Engine',
      'EngineVersion',
      'OS',
      'OSVersion',
      // 'Device',
      // 'DeviceType',
      // 'DeviceVendor',
      // 'CPU',
      // 'ScreenPrint',
      // 'CurrentResolution',
      // 'DeviceXDPI',
      // 'DeviceYDPI',
      // 'Plugins',
      // 'JavaVersion',
      // 'Fonts',
      // 'TimeZone',
      // 'Language',
    ];

    properties.forEach((p) => {
      _this.set(
        p.toLowerCase(),
        eval(`client.get${p}()`)
      );
    });
  }
});
