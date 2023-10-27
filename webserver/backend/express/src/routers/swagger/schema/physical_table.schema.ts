export const PhysicalTable = {
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
      }
    },
    required: ['capacity', 'room'],
};