import Ember from 'ember';

const { Service, Logger, inject } = Ember;

export default Service.extend({
  benchmark: inject.service(),

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

    this.get('benchmark').storeMultiple({
      'client.os.name': this.get('os'),
      'client.os.version': this.get('osversion'),
      'client.browser.name': this.get('browser'),
      // 'client.browser.version': `${this.get('browsermajorversion')}.${this.get('browserminorversion')}`,
      'client.browser.version': this.get('engine'),
      'client.resolution.window': this.get('windowsize'),
      'client.device.type': this.get('devicetype'),
      'client.device.name': this.get('devicevendor'),
      'client.misc': JSON.stringify({
        engine: {
          name: this.get('engine'),
          version: this.get('engineversion')
        }
      }),
    });
  }
});
