'use strict';

/**
 * version-control service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::version-control.version-control');
