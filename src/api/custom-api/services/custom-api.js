'use strict';

/**
 * custom-api service
 */

// src/api/custom-api/services/custom-api.js
module.exports = {
    async create(data) {
      // @ts-ignore
      return strapi.query('custom-api').create(data);
    },
  
    async update(params, data) {
      // @ts-ignore
      return strapi.query('custom-api').update(params, data);
    },
  
    async delete(params) {
      // @ts-ignore
      return strapi.query('custom-api').delete(params);
    },
  };
  