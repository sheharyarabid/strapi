
module.exports = {

  async get(ctx) {
    try {
      const data = await strapi.service('api::custom-api.custom-api').getNodes();
      console.log('Data:', data);
      return ctx.send(data);
    } catch (error) {
      ctx.send({ message: `we got error ${error.message}` });
    }
  },
  async getPage(ctx) {
    try {
      // Extract query parameters with default values
      const page = parseInt(ctx.query.page, 10) || 0;
      const level = parseInt(ctx.query.level, 10) || 0;
      
      // Fetch data using the service
      const data = await strapi.service('api::custom-api.custom-api').getNodes(page, level);

      // Return the data
      return ctx.send(data);
    } catch (error) {
      ctx.throw(500, `Error: ${error.message}`);
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
          return ctx.badRequest('Invalid parent');
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
  },

  // async filter(ctx) {
  //   try {
  //     const { key } = ctx.query;
  
  //     if (!key) {
  //       return ctx.badRequest('Missing required field: key');
  //     }
  
  //     // Fetch nodes and ancestors based on the key
  //     const { data } = await strapi.service('api::custom-api.custom-api').getNodesByFilter(key);
  
  //     // Return the hierarchical data
  //     return ctx.send({ data });
  //   } catch (error) {
  //     console.error('Error filtering data:', error);
  //     return ctx.internalServerError('An error occurred while filtering data.');
  //   }
  // }
  
  async filter(ctx) {
    try {
      // Extract filtering criteria from query parameters
      const { filter } = ctx.query;
      // Construct the query options
      const queryOptions = {
        populate: { parent: true }, // Ensure the 'node' relation is populated
        ...(filter && { filters: { node: { $containsi: filter } } }), // Apply filter if provided
      };

      // Fetch the nodes data with parent relations populated
      const nodes = await strapi.entityService.findMany(
        "api::tree.tree",
        queryOptions
      );
      console.log(nodes);

      // Create a set to store all relevant nodes, including ancestors
      const allNodes = new Set();

      // Recursive function to gather all ancestor nodes
      const gatherAncestors = async (parent) => {
        if (parent && !allNodes.has(parent.id)) {
          allNodes.add(parent.id);
          if (parent.parent) {
            // Fetch parent node details
            const parentNode = await strapi.entityService.findOne(
              "api::tree.tree",
              parent.parent.id,
              { populate: { parent: true } } // Ensure parent relation is populated
            );
            if (parentNode) {
              await gatherAncestors(parentNode); // Recursively gather ancestors
            }
          }
        }
      };

      // Process each node to gather its ancestors
      await Promise.all(nodes.map((node) => gatherAncestors(node)));

      // Fetch all relevant nodes, including ancestors
      const allRelevantNodes = await strapi.entityService.findMany(
        "api::tree.tree",
        {
          filters: { id: { $in: Array.from(allNodes) } }, // Filter nodes by gathered IDs
          populate: { parent: true }, // Ensure all nodes' relations are populated
        }
      );

      // Send the fetched nodes with their relations as response
      ctx.body = { nodes: allRelevantNodes };
    } catch (error) {
      strapi.log.error("Error fetching data:", error); // Log any error that occurs
      ctx.status = 500; // Set status code to 500 for server errors
      ctx.body = { error: "Failed to fetch data" }; // Send error response
    }
  }
  
  

  
};