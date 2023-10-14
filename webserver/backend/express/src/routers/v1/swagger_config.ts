import swaggerJsDoc from 'swagger-jsdoc';
import { User } from './swagger_schema/user';
import { UserUpdate } from './swagger_schema/user_update';
import { Role } from './swagger_schema/role';
import { Ingredient } from './swagger_schema/ingredient';
import { PhysicalTable } from './swagger_schema/physical_table';
import { Table } from './swagger_schema/table';


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
      url: 'http://localhost:8080/v1/',
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