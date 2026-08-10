const {
  withNativeFederation,
  share
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'fitlab-shell',

  shared: {
    ...share({
      '@angular/core': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      },
      '@angular/common': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      },
      '@angular/common/http': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      },
      '@angular/router': {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      },
      rxjs: {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      }
    })
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    '@angular/common/http/locales/extra',
    '@angular/common/http/locales/global',
    '@angular/common/http/http',
    '@angular/common/http/upgrade'
  ]
});
