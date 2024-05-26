'use strict';

/**
 * dcc service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dcc.dcc');
