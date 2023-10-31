export const RestaurantInformation ={
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the restaurant',
      },
      address: {
        type: 'string',
        description: 'The address of the restaurant',
      },
      phone: {
        type: 'number',
        description: 'The phone number of the restaurant',
      },
      email: {
        type: 'string',
        description: 'The email of the restaurant',
      },
      logo: {
        type: 'string',
        description: 'The logo of the restaurant(url of the static file)',
      },
      iva: {
        type: 'string',
        description: 'The iva of the restaurant',
      }
    },
    required: ['name', 'address', 'phone', 'email','iva'],
  };