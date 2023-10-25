import swaggerJsDoc from 'swagger-jsdoc';
import { User } from './schema/user.schema';
import { UserUpdate } from './schema/user_update.schema';
import { Role } from './schema/role.schema';
import { Ingredient } from './schema/ingredient.schema';
import { PhysicalTable } from './schema/physical_table.schema';
import { Table } from './schema/table.schema';


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API for TableTopHQ',
    version: '1.0.0',
    description:
      'This is a REST API for an application made with Express. It retrieves data from MongoDB.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      basicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    schemas: {
      User: User,
      UserUpdate: UserUpdate,
      Role: Role,
      Ingredient: Ingredient,
      PhysicalTable: PhysicalTable,
      Table: Table,
    },
  },
  security: [
    {
      bearerAuth: [],
      basicAuth: [],
    },
  ],
  servers: [
    {
      url: '/api/v1/',
      description: 'Development server',
    },
  ],
};

const swaggerOptions = {
      swaggerDefinition,
      apis: ["**/*.ts"],
};
  
const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;