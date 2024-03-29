'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordStrength = function () {
  function PasswordStrength(opts) {
    _classCallCheck(this, PasswordStrength);

    if (!opts) {
      console.error('[password-strength-verificaiton] no passwordConfig,passwordPolicy inject');
      opts = _config2.default;
      console.error('[password-strength-verificaiton] use config: ' + JSON.stringify(opts));
    } else {
      Object.assign(_config2.default, opts);
    }

    this.lang = _lang2.default;
    var _opts = opts,
        passwordFactor = _opts.passwordFactor,
        passwordFactorRules = _opts.passwordFactorRules,
        passwordPolicy = _opts.passwordPolicy,
        language = _opts.language;

    this.passwordFactor = passwordFactor || _config2.default.passwordFactor;
    this.passwordPolicy = passwordPolicy || _config2.default.passwordPolicy;
    this.passwordFactorRules = passwordFactorRules || _config2.default.passwordFactorRules;
    this.language = language || _config2.default.language;
    this.rules = _rules2.default;
  }

  _createClass(PasswordStrength, [{
    key: 'setLanguage',

    /**
     * set error message language, Default provided language：cn en, you can use setLanguage() to change your language , and use mergeLanguage() to add your lang.
     * @param {String}} language cn en ...
     */
    value: function setLanguage(language) {
      if (_lang2.default[language]) {
        this.language = language;
      }
    }
    /**
     * support to add your language like {jp:{invalidArguments:'パラメータエラー'}}
     */

  }, {
    key: 'mergeLanguage',
    value: function mergeLanguage(data) {
      if ((0, _utils.isPlainObject)(data)) {
        Object.assign(this.lang, data);
      }
    }
    // custom exclusion rules,if you want to do it 

  }, {
    key: 'mergeRules',
    value: function mergeRules(data) {
      if ((0, _utils.isPlainObject)(data)) {
        Object.assign(this.rules, data);
      }
    }
  }, {
    key: 'validate',
    value: function validate(val) {
      if (!val) {
        return this.msg.error.invalidArguments;
      }
      try {
        this.validatePolicy(val);
        this.validateFactors(val);
      } catch (err) {
        return err;
      }
      return true;
    }
  }, {
    key: 'getValidFactor',
    value: function getValidFactor() {
      var _this = this;

      return Object.keys(this.passwordFactor).filter(function (key) {
        return _this.passwordFactor[key];
      });
    }
  }, {
    key: 'validateFactors',
    value: function validateFactors(val) {
      var _this2 = this;

      // validate factor
      var validateFactors = this.getValidFactor();
      validateFactors.forEach(function (factor) {
        var str = _this2.passwordFactorRules[factor] || _this2.passwordFactorRules[factor + 'Rules'];

        if (!str) {
          throw {
            message: _this2.msg.error.invalidRule,
            factor: factor,
            val: val
          };
        }
        // ignoreCase condition
        var condition = _this2.passwordPolicy.ignoreCase ? 'i' : '';
        var reg = void 0;
        if (str instanceof RegExp) {
          reg = str;
        } else {
          reg = new RegExp('[' + str + ']', condition);
        }

        if (!reg.test(val)) {
          // eslint-disable-next-line no-throw-literal
          throw {
            message: _this2.msg.error[factor] || _this2.msg.error.unknown,
            factor: factor,
            val: val
          };
        }
      });
      // validate password factor
      if (this.passwordPolicy.lockInFactor) {
        var factors = Object.keys(this.passwordFactor);
        var commonFactorReg = new RegExp('[' + factors.map(function (factor) {
          return _this2.passwordFactorRules[factor];
        }).join('') + ']', 'g');
        var specialReg = this.passwordFactorRules.specialSymbolsRules;

        var commonFactorCount = val.match(commonFactorReg);
        var specialCount = val.match(specialReg);
        if ((commonFactorCount ? commonFactorCount.length : 0) + (specialCount ? specialCount.length : 0) !== val.length) {
          throw {
            message: this.msg.error.outOfRange + ',only allow ' + factors.map(function (factor) {
              return _this2.msg.word[factor];
            }).join(','),
            val: val
          };
        }
      }
    }
    /**
     * filter policy , see ./config.passwordPolicy
     * @param {String} val validate argument
     */

  }, {
    key: 'validatePolicy',
    value: function validatePolicy(val) {
      // validate min limit
      var _passwordPolicy = this.passwordPolicy,
          minLength = _passwordPolicy.minLength,
          maxLength = _passwordPolicy.maxLength;

      if (minLength && val.length < minLength) {
        throw {
          message: this.msg.error['minLength'],
          factor: 'minLength',
          minLength: minLength,
          val: val
        };
      }
      // validate max limit
      if (maxLength && val.length > maxLength) {
        throw {
          message: this.msg.error['maxLength'],
          factor: 'maxLength',
          maxLength: maxLength,
          val: val
        };
      }
      // validate exclusion rule
      this.validateExclusion(val);
    }
    /**
     * Regular rules to exclude by default， just like domain/website/email...
     */

  }, {
    key: 'validateExclusion',
    value: function validateExclusion(val) {
      var _this3 = this;

      var exclusion = this.passwordPolicy.exclusion;

      if ([].concat(exclusion).length) {
        exclusion.forEach(function (factor) {
          if (_rules2.default[factor]) {
            if (_rules2.default[factor].test(val)) {
              throw {
                message: _this3.msg.error[factor],
                factor: factor,
                val: val
              };
            }
          } else {
            console.error('[password-strength-verificaiton] nivalid exclusion rule , ' + factor);
          }
        });
      }
    }
  }, {
    key: 'msg',
    get: function get() {
      return this.lang[this.language];
    }
  }]);

  return PasswordStrength;
}();

exports.default = PasswordStrength;