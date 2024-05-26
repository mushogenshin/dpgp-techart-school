'use strict';

/**
 * game-engine controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::game-engine.game-engine');
