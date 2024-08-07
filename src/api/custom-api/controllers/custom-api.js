
module.exports = {

  async get(ctx) {
    try {
      const data = await strapi.service('api::custom-api.custom-api').getNodes();
      ctx.send(data);
    } catch (error) {
      ctx.send({ message: `we got error ${error.message}` });
    }
  },

  async create(ctx) {
    try {
      const { node, parent } = ctx.request.body;
      // Validate that node is provided
      if (!node) {
        return ctx.badRequest('Missing required field: node');
      }

      // Check if parent is provided and is a number (assuming IDs are numbers)
      let parentId = null;
      if (parent) {
        parentId = parseInt(parent, 10);
        if (isNaN(parentId)) {
          return ctx.badRequest('Invalid parent ID');
        }

        // Optionally, check if the parent ID exists in the database
        const parentNode = await strapi.entityService.findOne('api::tree.tree', parentId);
        if (!parentNode) {
          return ctx.badRequest('Parent node does not exist');
        }
      }

      // Create the new node
      const createdEntity = await strapi.entityService.create('api::tree.tree', {
        data: {
          node,
          parent: parentId ? parentId : null,
        },
      });

      // Publish the newly created entity
      await strapi.entityService.update('api::tree.tree', createdEntity.id, {
        data: { publishedAt: new Date() }
      });

      return ctx.send(createdEntity);
    } catch (err) {
      console.error('Error creating node:', err);
      return ctx.badRequest('An error occurred while creating the node.', {
        error: err.message,
        details: err.details,
      });
    }
  },




  async update(ctx) {
    const { id } = ctx.params;
    const { node, parent } = ctx.request.body;
  
    console.log('Updating node with ID:', id);
    console.log('Node data:', node);
    console.log('Parent ID:', parent);
  
    try {
      // Validate the input data
      if (!node) {
        return ctx.badRequest('Missing required field: node');
      }
  
      let parentId = null;
      if (parent) {
        parentId = parseInt(parent, 10);
        if (isNaN(parentId)) {
          return ctx.badRequest('Invalid parent ID');
        }
  
        // Optionally, check if the parent ID exists in the database
        const parentNode = await strapi.entityService.findOne('api::tree.tree', parentId);
        if (!parentNode) {
          return ctx.badRequest('Parent node does not exist');
        }
      }
  
      // Update the node
      const updatedNode = await strapi.entityService.update('api::tree.tree', id, {
        data: {
          node,
          parent: parentId ? parentId : null,
        },
      });
      const response = {
        ...updatedNode,
        parentId: parentId
      };
      return ctx.send(response);
    } catch (error) {
      console.error('Error updating node:', error);
      return ctx.internalServerError('Failed to update node', {
        error: error.message,
        details: error.details,
      });
    }
  },

  async delete(ctx) {
    const { id } = ctx.params;
    // Recursive function to delete children
    async function deleteChildren(parentId) {
      // Get all children of the current parent node
      const children = await strapi.entityService.findMany('api::tree.tree', {
        filters: { parent: parentId },
      });
      // Delete each child node recursively
      for (const child of children) {
        await deleteChildren(child.id); // Recursively delete child nodes
        await strapi.entityService.delete('api::tree.tree', child.id); // Delete the child node
      }
    }
    // Start with deleting children of the node
    await deleteChildren(id);
    // Delete the parent node
    await strapi.entityService.delete('api::tree.tree', id);
    return { message: 'Node and its children deleted' };
  }
};