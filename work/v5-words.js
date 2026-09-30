'use strict';
const { V5A } = require('./v5-a.js');
const { V5B } = require('./v5-b.js');
const { V5C } = require('./v5-c.js');
const { V5D } = require('./v5-d.js');
const { V5E } = require('./v5-e.js');
const { V5F } = require('./v5-f.js');
const V5NEW = [].concat(V5A, V5B, V5C, V5D, V5E, V5F);
module.exports = { V5NEW };