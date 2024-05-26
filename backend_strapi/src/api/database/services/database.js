'use strict';

/**
 * database service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::database.database');
