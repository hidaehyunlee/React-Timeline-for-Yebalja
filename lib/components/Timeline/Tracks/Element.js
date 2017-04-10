'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Basic = require('../../Elements/Basic');

var _Basic2 = _interopRequireDefault(_Basic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Element = function Element(_ref) {
  var time = _ref.time,
      parentStyle = _ref.parentStyle,
      style = _ref.style,
      id = _ref.id,
      title = _ref.title,
      start = _ref.start,
      end = _ref.end;

  console.log('style', style);
  console.log('parentStyle', parentStyle);
  return _react2.default.createElement(
    'div',
    {
      key: id,
      className: 'track__element',
      style: time.toStyleLeftAndWidth(start, end)
    },
    _react2.default.createElement(_Basic2.default, { title: title, style: (0, _extends3.default)({}, parentStyle, style) })
  );
};

Element.propTypes = {
  time: _react.PropTypes.shape({}).isRequired,
  parentStyle: _react.PropTypes.shape({}),
  style: _react.PropTypes.shape({}),
  id: _react.PropTypes.string.isRequired,
  title: _react.PropTypes.string,
  start: _react.PropTypes.instanceOf(Date),
  end: _react.PropTypes.instanceOf(Date)
};

exports.default = Element;
module.exports = exports['default'];