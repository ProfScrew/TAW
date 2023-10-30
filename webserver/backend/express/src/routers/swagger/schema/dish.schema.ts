export const Dish = {
    type: 'object',
    properties: {
        recipe: {
            type: 'string',
            description: 'The ID of the recipe associated with the dish.',
        },
        actual_price: {
            type: 'number',
            description: 'The actual price of the dish(in case of modification)',
        },
        notes: {
            type: 'string',
            description: 'The notes of the dish',
        },
        status: {
            type: 'string',
            enum: ['waiting', 'working', 'ready'],
            description: 'The status of the dish (waiting, working, ready).',
        },
        /*
        logs_status: { 
            type: 'object',
            properties: {
                start_cooking: {
                    type: 'object',
                    properties: {
                        // Define properties for start_cooking here (iUserAction)
                    },
                    description: 'Information about when the dish cooking started.',
                },
                finish_cooking: {
                    type: 'object',
                    properties: {
                        // Define properties for finish_cooking here (iUserAction)
                    },
                    description: 'Information about when the dish cooking finished.',
                },
            },
            description: 'Log entries for the status of the dish.',
        },
        */
        modifications: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    ingredient: {
                        type: 'string',
                        description: 'The ID of the ingredient being modified.',
                    },
                    type: {
                        type: 'string',
                        enum: ['add', 'remove', 'more', 'less'],
                        description: 'The type of modification (add, remove, more, less).',
                    },
                },
            },
            description: 'Array of dish modifications.',
        }
    },
required: ['name', 'modification_price', 'modification_percentage']
};