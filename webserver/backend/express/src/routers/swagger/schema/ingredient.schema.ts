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
    modification_price: {
      type: 'number',
      description: 'The price_per_unit of the ingredient',
    },
    modification_percentage: {
      type: 'number',
      description: 'The percentage of cost of the ingredient, in case of modification(more, less',
    }
  },
  required: ['name', 'modification_price', 'modification_percentage']
};