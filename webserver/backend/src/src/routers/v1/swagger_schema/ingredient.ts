export const Ingredient = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'The name of the ingredient',
    },
    alergens: {
      type: 'array',
      items: {
        type: 'string',
      },  
      description: 'The alergens of the ingredient',
    },
    price_per_unit: {
      type: 'number',
      description: 'The price_per_unit of the ingredient',
    },
    unit: {
      type: 'string',
      description: 'The unit of the ingredient',
    }
  },
  required: []
};