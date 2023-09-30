export const Table = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the table',
      },
      status: {
        type: 'string',
        description: 'The status of the table',
      },
      physical_tables: {
        type: 'number',
        description: 'The physical tables of the table',
      },
      guests: {
        type: 'number',
        description: 'The number of guests of the table',
      },
      capacity: {
        type: 'number',
        description: 'The capacity of the table',
      },
      room: {
        type: 'string',
        description: 'The room of the table',
      },
      order: {
        type: 'string',
        description: 'The order of the table',
      },
      booking: {
        type: 'object',
        description: 'The booking of the table',
      },
    },
    required: ['name', 'status', 'physical_tables', 'guests', 'capacity', 'room'],
  };