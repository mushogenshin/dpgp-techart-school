'use strict';

/**
 * math service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::math.math');
