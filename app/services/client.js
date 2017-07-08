import Ember from 'ember';

const { Service, Logger } = Ember;

export default Service.extend({

  init() {
    let _this = this;
    // eslint-disable-next-line no-undef
    let client = new ClientJS();

    if (client) {
      Logger.debug('Client features detection loaded');
    }

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
      'CurrentResolution'
      // 'Device',
      // 'DeviceType',
      // 'DeviceVendor',
      // 'CPU',
      // 'ScreenPrint',
      // 'DeviceXDPI',
      // 'DeviceYDPI',
      // 'Plugins',
      // 'JavaVersion',
      // 'Fonts',
      // 'TimeZone',
      // 'Language',
    ];

    let windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    properties.forEach((p) => {
      _this.set(
        p.toLowerCase(),
        eval(`client.get${p}()`)
      );
    });
    this.set('windowsize', `${windowSize.width}x${windowSize.height}`);
  }
});
