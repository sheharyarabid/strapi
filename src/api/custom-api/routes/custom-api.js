// src/api/custom-api/routes/custom-api.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tree/get',
      handler: 'custom-api.get',
    },
    {
      method: 'POST',
      path: '/tree/create',
      handler: 'custom-api.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PATCH',
      path: '/tree/update/:id',
      handler: 'custom-api.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // {
    //   method: 'PUT',
    //   path: '/custom-api/:id',
    //   handler: 'custom-api.update',
    //   config: {
    //     policies: [],
    //     middlewares: [],
    //   },
    // },
    {
      method: 'DELETE',
      path: '/tree/delete/:id',
      handler: 'custom-api.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
