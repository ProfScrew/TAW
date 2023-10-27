import swaggerJsDoc from 'swagger-jsdoc';
import { User } from './schema/user.schema';
import { UserUpdate } from './schema/user_update.schema';
import { Room } from './schema/room.schema';
import { Ingredient } from './schema/ingredient.schema';
import { PhysicalTable } from './schema/physical_table.schema';
import { Table } from './schema/table.schema';
import { Category } from './schema/category.schema';


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API for CookHub',
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
      Ingredient: Ingredient,
      PhysicalTable: PhysicalTable,
      Table: Table,
      Room: Room,
      Category: Category,
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
  docExpansion: 'none',
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["**/*.ts"],
  docExpansion: 'none',
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;