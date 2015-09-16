ng-flat-datepicker
===

Lightweight Angular.js datepicker directive built with Moment.js.

![ng-flat-datepicker screenshot](http://i.imgur.com/m9Aawf2.png)

## Demo

[See demo](http://remiawe.github.io/ng-flat-datepicker/)

## Features
* Custom ng-model date format: custom string or js date
* Min date / Max date
* Allow/disallow future date selection
* Quick selection of month and year
* Locale aware (Angular and Moment locale)

## Requirements
* Angularjs >=1.2
* Moment.js

## Installation

1. `npm install --save ng-flat-datepicker`
2. Link `/dist/ng-flat-datepicker.js`and `/dist/ng-flat-datepicker.css`
3. Add the module `'ngFlatDatepicker'` as dependency of your angular module.

## Usage

This is an attribute only directive.

```html
<input type="text" ng-model="date" ng-flat-datepicker>
```

```html
<button ng-model="date" ng-flat-datepicker>Pick a date</button>
```

## Options

### Attributes:
* `datepicker-config`: **Object** - The datepicker's config object.

```html
<input type="text" ng-model="date" datepicker-config="yourCustomConf" ng-flat-datepicker>Pick a date</button>
```

### Config object properties:

* `dateFormat`: **String** - The Moment.js format of the date in the `ng-model`. Fallback to js date Object if no format is given. Eg: `'DD/MM/YYYY'`.
* `minDate`: **Object** - The minimum selectable date. Must be a Moment Date Object.
* `maxDate`: **Object** - The maximum selectable date. Must be a Moment Date Object.
* `allowFuture`: **Boolean** - Maximum selectable date is tomorrow

### Locale
Default locale is english but you can load any locale of your choice (Angular and Moment), the datepicker use the currents locales.

## Contributions
Just install the dev dependencies and start a `gulp watch`

## Credits
Design: [YannickAWE](https://github.com/YannickAWE)
