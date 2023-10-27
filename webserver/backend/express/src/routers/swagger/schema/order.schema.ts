export const Ingredient = {
    type: 'object',
    properties: {
      courses: {
        type: 'array',
        items: {
          type: 'object',
            properties: {
                dish: {
                type: 'string',
                description: 'The key to the dish',
                },
            },
        },  
        description: 'The alergens of the ingredient',
      },
    },
    required: ['name', 'modification_price', 'modification_percentage']
  };