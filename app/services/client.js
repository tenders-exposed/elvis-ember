import Ember from 'ember';
import Service from '@ember/service';

const { Logger } = Ember;

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
      'CurrentResolution',
      'Device',
      'DeviceType',
      'DeviceVendor',
      // 'ScreenPrint',
      // 'DeviceXDPI',
      // 'DeviceYDPI',
      // 'Plugins',
      // 'JavaVersion',
      // 'Fonts',
      // 'TimeZone',
      // 'Language',
      'CPU'
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
