'use strict';

/**
 * version-control router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::version-control.version-control');
