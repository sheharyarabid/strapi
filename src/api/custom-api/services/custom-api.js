'use strict';

const { Children } = require("react");

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
    const { id } = ctx.params;
    await strapi.entityService.update('api::tree.tree', id, ctx.request.body);
    return { message: `Node deleted: ID: ${id}` };
  },

  async delete(ctx) {
    const { id } = ctx.params;
    await strapi.entityService.delete('api::tree.tree', id);
    return { message: `Node deleted: ID: ${id}` };
  },

  // async getNodesByFilter(filterByKey) {
  //   // Step 1: Find nodes that match the filter key
  //   const nodes = await strapi.entityService.findMany('api::tree.tree', {
  //     filters: { node: { $contains: filterByKey } },
  //     populate: { children: true, parent: true } // Ensure children and parent are populated
  //   });
  
  //   console.log('Filtered Nodes:', nodes); // Debugging: log filtered nodes
  
  //   // Step 2: Collect all nodes to build the full hierarchy
  //   const allNodeIds = new Set(nodes.map(node => node.id));
  //   const ancestorsSet = new Set();
  
  //   // Recursive function to retrieve ancestors
  //   const retrieveAncestors = async (node) => {
  //     let currentNode = node;
  //     while (currentNode.parent) {
  //       const parent = await strapi.entityService.findOne('api::tree.tree', currentNode.parent.id, {
  //         populate: { children: true, parent: true }
  //       });
  //       if (!parent) {
  //         throw new Error('Ancestor not found');
  //       }
  //       if (!allNodeIds.has(parent.id)) {
  //         ancestorsSet.add(parent.id);
  //         await retrieveAncestors(parent);
  //       }
  //       currentNode = parent;
  //     }
  //   };
  
  //   // Retrieve ancestors for all nodes that match the filter
  //   await Promise.all(nodes.map(node => retrieveAncestors(node)));
  
  //   // Fetch all unique ancestor nodes
  //   const ancestors = await Promise.all(Array.from(ancestorsSet).map(id =>
  //     strapi.entityService.findOne('api::tree.tree', id, {
  //       populate: { children: true, parent: true }
  //     })
  //   ));
  
  //   console.log('Ancestors:', ancestors); // Debugging: log ancestors
  
  //   // Step 3: Build hierarchical structure
  //   const buildHierarchy = (nodes) => {
  //     const nodeMap = new Map();
  
  //     // Populate node map with nodes
  //     nodes.forEach(node => nodeMap.set(node.id, { ...node, children: [] }));
  
  //     // Helper function to build children recursively
  //     const buildChildren = (node) => {
  //       if (node.children) {
  //         node.children.forEach(child => {
  //           const childNode = nodeMap.get(child.id);
  //           if (childNode) {
  //             const childNodeWithChildren = {
  //               id: childNode.id,
  //               node: childNode.node,
  //               createdAt: childNode.createdAt,
  //               updatedAt: childNode.updatedAt,
  //               publishedAt: childNode.publishedAt,
  //               children: buildChildren(childNode)
  //             };
  //             node.children.push(childNodeWithChildren);
  //           }
  //         });
  //       }
  //       return node.children || [];
  //     };
  
  //     // Build hierarchy
  //     const rootNodes = [];
  //     nodeMap.forEach(node => {
  //       if (node.parent && node.parent.id) {
  //         const parent = nodeMap.get(node.parent.id);
  //         if (parent) {
  //           parent.children.push({
  //             id: node.id,
  //             node: node.node,
  //             createdAt: node.createdAt,
  //             updatedAt: node.updatedAt,
  //             publishedAt: node.publishedAt,
  //             parent: {
  //               node: parent.node,
  //               id: parent.id
  //             },
  //             children: buildChildren(node)
  //           });
  //         }
  //       } else {
  //         rootNodes.push({
  //           id: node.id,
  //           node: node.node,
  //           createdAt: node.createdAt,
  //           updatedAt: node.updatedAt,
  //           publishedAt: node.publishedAt,
  //           parent: {
  //             node: null,
  //             id: null
  //           },
  //           children: null
  //         });
  //       }
  //     });
  
  //     return rootNodes;
  //   };
  
  //   // Combine nodes and ancestors for hierarchical structure
  //   const allNodes = [...nodes, ...ancestors];
  //   const hierarchicalData = buildHierarchy(allNodes);
  
  //   console.log('Hierarchical Data:', hierarchicalData); // Debugging: log hierarchical data
  
  //   return { data: hierarchicalData };
  // },
  
  // async getAncestors(node) {
  //   const ancestors = [];
  //   let currentNode = node;
  //   while (currentNode.parent) {
  //     const parent = await strapi.entityService.findOne('api::tree.tree', currentNode.parent.id);
  //     if (!parent) {
  //       throw new Error('Ancestor not found');
  //     }
  //     ancestors.push(parent);
  //     currentNode = parent;
  //   }
  //   return ancestors;
  // }  

 
  
  
};
