'use strict';


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

  async getNodesPage(page, level) {
    try {
      const nodes = await strapi.entityService.findMany('api::tree.tree', {
        start: page * 10,
        _limit: 10,
        parent: level === 0 ? null : level,
      });
      return nodes;
    } catch (err) {
      throw new Error('Error fetching nodes');
    }
  },

  async update(ctx) {
   const {id} = ctx.params;
    await strapi.entityService.update('api::tree.tree', id, ctx.request.body);
    return { message: `Node deleted: ID: ${id}` };
  },

  async delete(ctx) {
    const { id } = ctx.params;
    await strapi.entityService.delete('api::tree.tree', id);
    return { message: `Node deleted: ID: ${id}` };
  },

 
};
