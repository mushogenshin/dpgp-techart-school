'use strict';

/**
 * game-engine router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::game-engine.game-engine');
