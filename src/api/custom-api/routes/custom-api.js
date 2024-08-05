// src/api/custom-api/routes/custom-api.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/custom-api',
      handler: 'custom-api.get',
    },
    {
      method: 'POST',
      path: '/custom-api',
      handler: 'custom-api.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/custom-api/:id',
      handler: 'custom-api.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/custom-api/:id',
      handler: 'custom-api.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
