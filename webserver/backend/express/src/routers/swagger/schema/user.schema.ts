export const User = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      description: 'The username of the user',
    },
    name: {
      type: 'string',
      description: 'The name of the user',
    },
    surname: {
      type: 'string',
      description: 'The surname of the user',
    },
    phone: {
      type: 'string',
      description: 'The phone of the user',
    },
    password: {
      type: 'string',
      description: 'The password of the user',
    },
    role: {
      type: 'object',
      properties: {
        admin: {
          type: 'boolean',
          description: 'User has an admin role',
        },
        waiter: {
          type: 'boolean',
          description: 'User has a waiter role',
        },
        production: {
          type: 'boolean',
          description: 'User has a production role',
        },
        cashier: {
          type: 'boolean',
          description: 'User has a cashier role',
        },
        analytics: {
          type: 'boolean',
          description: 'User has an analytics role',
        }
      },
      description: 'User roles',
    },
    category: {
      type: 'array',
      items: {
        type: 'string',
        description: 'array of ids for category',
      },
    },
    room: {
      type: 'array',
      items: {
        type: 'string',
        description: 'array of ids for room',
      },
    },
  },
  required: ['username','name', 'surname', 'phone', 'password', 'role'],
};
