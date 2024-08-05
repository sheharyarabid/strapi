'use strict';

/**
 * custom-api service
 */

// src/api/custom-api/services/custom-api.js
module.exports = {
    async getNodes() {
      try {
        const nodes = await strapi.entityService.findMany('api::tree.tree', {
          populate: { parent: true },
        });
  
        console.log(nodes);
        // Transform data into a tree structure
        const map = new Map();
  
        nodes.forEach(node => {
          map.set(node.id, { ...node, children: [] });
        });
  
        const tree = [];
  
        map.forEach(node => {
          if (node.parent) {
            const parent = map.get(node.parent.id);
            if (parent) {
              parent.children.push(node);
            }
          } else {
            tree.push(node);
          }
        });
  
        return tree;
      } catch (err) {
        throw new Error('Error fetching nodes');
      }
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
  