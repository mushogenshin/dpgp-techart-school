'use strict';

/**
 * database controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::database.database');
