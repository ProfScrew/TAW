export interface iRole {
    name: string;

    canReadPhysicalTables:  boolean;
    canReadTables:          boolean;
    canReadRecipes:         boolean;
    canReadIngredients:     boolean;
    canReadDishes:          boolean;
    canReadOrders:          boolean;
    canReadServingQueue:    boolean;
    canReadProductionQueue: boolean;
    canReadAnalytics:       boolean;
    canReadUsers:           boolean;
    canReadRoles:           boolean;

    canEditPhysicalTables:  boolean;
    canEditTables:          boolean;
    canEditRecipes:         boolean;
    canEditIngredients:     boolean;
    canEditDishes:          boolean;
    canEditOrders:          boolean;
    canEditUsers:           boolean;
    canEditRoles:           boolean;
    
    canPushServingQueue:    boolean;
    canPopServingQueue:     boolean;
    canPushProductionQueue: boolean;
    canPopProductionQueue:  boolean;

    canCreatePhysicalTables: boolean;
    canCreateTables:         boolean;
    canCreateRecipes:        boolean;
    canCreateIngredients:    boolean;
    canCreateDishes:         boolean;
    canCreateOrders:         boolean;
    canCreateUsers:          boolean;
    canCreateRoles:          boolean;
    
    canDeletePhysicalTables: boolean;
    canDeleteTables:         boolean;
    canDeleteRecipes:        boolean;
    canDeleteIngredients:    boolean;
    canDeleteDishes:         boolean;
    canDeleteOrders:         boolean;
    canDeleteUsers:          boolean;
    canDeleteRoles:          boolean;

    canManagePayment:       boolean;
    canManageRestaurant:    boolean;

    productionGUI:          boolean;
    analyticsGUI:           boolean;
    cashierGUI:             boolean;
    waiterGUI:              boolean;
    adminGUI:               boolean;
}