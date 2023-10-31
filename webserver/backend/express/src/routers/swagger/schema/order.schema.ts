export const Order = {
  type: 'object',
  properties: {
    guests: {
      type: 'integer',
      description: 'The number of guests for the order',
    },
    capacity: {
      type: 'integer',
      description: 'The capacity of tables for the order',
    },
    status: {
      type: 'string',
      enum: ['waiting', 'ordering', 'serving', 'delivered'],
      description: 'The status of the order',
    },
    room: {
      type: 'string',
      format: 'ObjectId',
      description: 'The room where the order is placed',
    },
    tables: {
      type: 'array',
      items: {
        type: 'string',
        format: 'ObjectId',
      },
      description: 'An array of table IDs associated with the order',
    },
    courses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dishes: {
            type: 'array',
            items: {
              type: 'string',
              format: 'ObjectId',
            },
            description: 'An array of dish IDs for the course',
          },
        },
      },
      description: 'An array of courses for the order',
    },
  },
  required: ['guests', 'capacity', 'room', 'tables'],
};
