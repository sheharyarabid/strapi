module.exports = {

    async get(element) {
     try {
      element.send({ message: 'Test route working' });
     } catch (error) {
      element.send({ message: 'Test route not working' });
     }
    },
  
  async create(element) {
    try {
      const data = element.request.body;
      const createdEntity = await strapi.services['custom-api'].create(data);
      return element.send(createdEntity);
    } catch (err) {
      element.throw(400, err);
    }
  },

  async update(element) {
    try {
      const { id } = element.params;
      const data = element.request.body;
      const updatedEntity = await strapi.services['custom-api'].update({ id }, data);
      return element.send(updatedEntity);
    } catch (err) {
      element.throw(400, err);
    }
  },

  async delete(element) {
    try {
      const { id } = element.params;
      await strapi.services['custom-api'].delete({ id });
      return element.send({ message: 'Entity deleted successfully' });
    } catch (err) {
      element.throw(400, err);
    }
  },
};