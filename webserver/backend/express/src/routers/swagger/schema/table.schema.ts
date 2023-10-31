export const Table = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the physical table',
      },
      capacity: {
        type: 'number',
        description: 'The capacity of the physical table',
      },
      room: {
        type: 'string',
        description: 'The room of the physical table',
      },
      status: {
        type: 'string',
        description: 'The status of the physical table',
        enum: ['free', 'busy'],
      }
    },

    required: ['capacity', 'room'],
};