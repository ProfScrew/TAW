export const Category = {
    type: 'object',
    properties: {
    name: {
      type: 'string',
      description: 'The name of the category',
    },
    color: {
      type: 'string',
      description: 'The color for the category',
    },
    order: {
      type: 'number',
      description: 'The order of the category',
    }
  },
  required: ['name','color']
};