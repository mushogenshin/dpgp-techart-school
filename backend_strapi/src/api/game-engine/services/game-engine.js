'use strict';

/**
 * game-engine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-engine.game-engine');
