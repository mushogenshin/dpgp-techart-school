'use strict';

/**
 * version-control controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::version-control.version-control');
