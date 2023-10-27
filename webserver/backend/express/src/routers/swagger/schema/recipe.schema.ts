export const Recipe = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the recipe',
      },
      description: {
        type: 'string',
        description: 'The description of the recipe',
      },
      ingredients: {
        type: 'array',
        items: {
          type: 'string',
        },  
        description: 'The ingredients of the recipe',
      },
      base_price: {
        type: 'number',
        description: 'The base price of the recipe(without modifications)',
      },
      category: {
        type: 'string',
        description: 'The category of the recipe(eg. drinks, first course, second course, dessert, etc.)',
      }
    },
    required: ['name', 'base_price', 'ingredients']
  };