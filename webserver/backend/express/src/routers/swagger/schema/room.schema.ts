export const Room = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the room',
      }
    },
    required: ['name'],
  };