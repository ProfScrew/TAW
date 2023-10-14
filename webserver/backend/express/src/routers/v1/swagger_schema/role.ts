export const Role = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the role',
      },
      canCreateUsers: {
        type: 'boolean',
        description: 'The canCreateUsers of the role',
      },
      canReadUsers: {
        type: 'boolean',
        description: 'The canReadUsers of the role',
      },
      canEditUsers: {
        type: 'boolean',
        description: 'The canUpdateUsers of the role',
      },
      canDeleteUsers: {
        type: 'boolean',
        description: 'The canDeleteUsers of the role',
      },
      canCreateRoles: {
        type: 'boolean',
        description: 'The canCreateRoles of the role',
      },  
      canReadRoles: {
        type: 'boolean',
        description: 'The canReadRoles of the role',
      },
      canEditRoles: {
        type: 'boolean',
        description: 'The canUpdateRoles of the role',
      },
      canDeleteRoles: {
        type: 'boolean',
        description: 'The canDeleteRoles of the role',
      },
      canCreatePhysicalTables: {
        type: 'boolean',
        description: 'The canCreatePhysicalTables of the role',
      },
      canReadPhysicalTables: {
        type: 'boolean',
        description: 'The canReadPhysicalTables of the role',
      },
      canEditPhysicalTables: {
        type: 'boolean',
        description: 'The canUpdatePhysicalTables of the role',
      },
      canDeletePhysicalTables: {
        type: 'boolean',
        description: 'The canDeletePhysicalTables of the role',
      },
      canCreateTables: {
        type: 'boolean',
        description: 'The canCreateTables of the role',
      },
      canReadTables: {
        type: 'boolean',
        description: 'The canReadTables of the role',
      },
      canEditTables: {
        type: 'boolean',
        description: 'The canUpdateTables of the role',
      },
      canDeleteTables: {
        type: 'boolean',
        description: 'The canDeleteTables of the role',
      },
      canCreateRecipes: {
        type: 'boolean',
        description: 'The canCreateRecipes of the role',
      },
      canReadRecipes: {
        type: 'boolean',
        description: 'The canReadRecipes of the role',
      },
      canEditRecipes: {
        type: 'boolean',
        description: 'The canUpdateRecipes of the role',
      },
      canDeleteRecipes: {
        type: 'boolean',
        description: 'The canDeleteRecipes of the role',
      },
      canCreateIngredients: {
        type: 'boolean',
        description: 'The canCreateIngredients of the role',
      },
      canReadIngredients: {
        type: 'boolean',
        description: 'The canReadIngredients of the role',
      },
      canEditIngredients: {
        type: 'boolean',
        description: 'The canUpdateIngredients of the role',
      },
      canDeleteIngredients: {
        type: 'boolean',
        description: 'The canDeleteIngredients of the role',
      },
      canCreateDishes: {
        type: 'boolean',
        description: 'The canCreateDishes of the role',
      },
      canReadDishes: {
        type: 'boolean',
        description: 'The canReadDishes of the role',
      },
      canEditDishes: {
        type: 'boolean',
        description: 'The canUpdateDishes of the role',
      },
      canDeleteDishes: {
        type: 'boolean',
        description: 'The canDeleteDishes of the role',
      },
      canCreateOrders: {
        type: 'boolean',
        description: 'The canCreateOrders of the role',
      },
      canReadOrders: {
        type: 'boolean',
        description: 'The canReadOrders of the role',
      },
      canEditOrders: {
        type: 'boolean',
        description: 'The canUpdateOrders of the role',
      },
      canDeleteOrders: {
        type: 'boolean',
        description: 'The canDeleteOrders of the role',
      },
      canReadServingQueue: {
        type: 'boolean',
        description: 'The canReadServingQueue of the role',
      },
      canPushServingQueue: {
        type: 'boolean',
        description: 'The canPushServingQueue of the role',
      },
      canPopServingQueue: {
        type: 'boolean',
        description: 'The canPopServingQueue of the role',
      },
      canReadProductionQueue: {
        type: 'boolean',
        description: 'The canReadProductionQueue of the role',
      },
      canPushProductionQueue: {
        type: 'boolean',
        description: 'The canPushProductionQueue of the role',
      },
      canPopProductionQueue: {
        type: 'boolean',
        description: 'The canPopProductionQueue of the role',
      },
      canManagePayment: {
        type: 'boolean',
        description: 'The canManagePayment of the role',
      },
      canManageRestaurant: {
        type: 'boolean',
        description: 'The canManageRestaurant of the role',
      },
      productionGUI: {
        type: 'boolean',
        description: 'The productionGUI of the role',
      },
      analyticsGUI: {
        type: 'boolean',
        description: 'The analyticsGUI of the role',
      },
      cashierGUI: {
        type: 'boolean',
        description: 'The cashierGUI of the role',
      },
      waiterGUI: {
        type: 'boolean',
        description: 'The waiterGUI of the role',
      },
      adminGUI: {
        type: 'boolean',
        description: 'The adminGUI of the role',
      },
      canReadAnalytics: {
        type: 'boolean',
        description: 'The canReadAnalytics of the role',
      },
    },
    required: []
};