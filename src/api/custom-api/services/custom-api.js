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

  async update(ctx) {
    const { id } = ctx.params;
    await strapi.entityService.update('api::tree.tree', id, ctx.request.body);
    return { message: `Node Updated: ID: ${id}` };
  },

  async delete(ctx) {
    const { id } = ctx.params;
    await strapi.entityService.delete('api::tree.tree', id);
    return { message: `Node deleted: ID: ${id}` };
  },
};
