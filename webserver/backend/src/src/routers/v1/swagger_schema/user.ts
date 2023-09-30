export const User = {
    type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'The username of the user',
          },
          name: {
            type: 'string',
            description: 'The username of the user',
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
          role:{
            type: 'string',
            description: 'The role of the user',
          }
        },
        required: ['username', 'name', 'surname', 'phone', 'password']
};
  