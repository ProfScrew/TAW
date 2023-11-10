const OrderArchive = {
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
      tables: {
        type: 'array',
        items: {
          type: 'string',
          format: 'ObjectId',
        },
        description: 'An array of table IDs associated with the order',
      },
      logs_order: {
        type: 'object',
        properties: {
          created_order: {
            type: 'UserAction',
            required: true,
          },
        },
        required: ['created_order'],
      },
      charges_persons: {
        type: 'number',
        required: true,
      },
      final_price: {
        type: 'number',
        required: true,
      },
      courses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            logs_course: {
              type: 'object',
              properties: {
                created_course: {
                  type: 'UserAction',
                  required: true,
                },
                served_course: {
                  type: 'UserAction',
                },
                deleted_course: {
                  type: 'UserAction',
                },
              },
              required: ['created_course'],
            },
            dishes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  recipe: {
                    type: 'string',
                    format: 'ObjectId',
                    required: true,
                  },
                  actual_price: {
                    type: 'number',
                    required: true,
                  },
                  notes: {
                    type: 'string',
                  },
                  logs_status: {
                    type: 'object',
                    properties: {
                      start_cooking: {
                        type: 'UserAction',
                        required: true,
                      },
                      finish_cooking: {
                        type: 'UserAction',
                        required: true,
                      },
                    },
                    required: ['start_cooking', 'finish_cooking'],
                  },
                  modifications: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ingredient: {
                          type: 'string',
                          format: 'ObjectId',
                          required: true,
                        },
                        type: {
                          type: 'string',
                          enum: ['add', 'remove', 'more'],
                          required: true,
                        },
                        price: {
                          type: 'number',
                          required: true,
                        },
                      },
                    },
                  },
                },
                required: ['recipe', 'actual_price', 'logs_status'],
              },
            },
          },
          required: ['logs_course', 'dishes'],
        },
      },
    },
    required: ['guests', 'capacity', 'tables', 'charges_persons', 'final_price'],
  };
  
  export { OrderArchive };
  