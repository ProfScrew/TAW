import { Schema, model } from "mongoose";

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



const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    
    canReadPhysicalTables:  { type: Boolean, required: true, default: false },
    canReadTables:          { type: Boolean, required: true, default: false },
    canReadRecipes:         { type: Boolean, required: true, default: false },
    canReadIngredients:     { type: Boolean, required: true, default: false },
    canReadDishes:          { type: Boolean, required: true, default: false },
    canReadOrders:          { type: Boolean, required: true, default: false },
    canReadServingQueue:    { type: Boolean, required: true, default: false },
    canReadProductionQueue: { type: Boolean, required: true, default: false },
    canReadAnalytics:       { type: Boolean, required: true, default: false },
    canReadUsers:           { type: Boolean, required: true, default: false },
    canReadRoles:           { type: Boolean, required: true, default: false },

    canEditPhysicalTables:  { type: Boolean, required: true, default: false },
    canEditTables:          { type: Boolean, required: true, default: false },
    canEditRecipes:         { type: Boolean, required: true, default: false },
    canEditIngredients:     { type: Boolean, required: true, default: false },
    canEditDishes:          { type: Boolean, required: true, default: false },
    canEditOrders:          { type: Boolean, required: true, default: false },
    canEditUsers:           { type: Boolean, required: true, default: false },
    canEditRoles:           { type: Boolean, required: true, default: false },
    
    canPushServingQueue:    { type: Boolean, required: true, default: false },
    canPopServingQueue:     { type: Boolean, required: true, default: false },
    canPushProductionQueue: { type: Boolean, required: true, default: false },
    canPopProductionQueue:  { type: Boolean, required: true, default: false },

    canCreatePhysicalTables: { type: Boolean, required: true, default: false },
    canCreateTables:        { type: Boolean, required: true, default: false },
    canCreateRecipes:       { type: Boolean, required: true, default: false },
    canCreateIngredients:   { type: Boolean, required: true, default: false },
    canCreateDishes:        { type: Boolean, required: true, default: false },
    canCreateOrders:        { type: Boolean, required: true, default: false },
    canCreateUsers:         { type: Boolean, required: true, default: false },
    canCreateRoles:         { type: Boolean, required: true, default: false },

    canDeletePhysicalTables: { type: Boolean, required: true, default: false },
    canDeleteTables:        { type: Boolean, required: true, default: false },
    canDeleteRecipes:       { type: Boolean, required: true, default: false },
    canDeleteIngredients:   { type: Boolean, required: true, default: false },
    canDeleteDishes:        { type: Boolean, required: true, default: false },
    canDeleteOrders:        { type: Boolean, required: true, default: false },
    canDeleteUsers:         { type: Boolean, required: true, default: false },
    canDeleteRoles:         { type: Boolean, required: true, default: false },

    canManagePayment:       { type: Boolean, required: true, default: false },
    canManageRestaurant:    { type: Boolean, required: true, default: false },

    productionGUI:          { type: Boolean, required: true, default: false },
    analyticsGUI:           { type: Boolean, required: true, default: false },
    cashierGUI:             { type: Boolean, required: true, default: false },
    waiterGUI:              { type: Boolean, required: true, default: false },
    adminGUI:               { type: Boolean, required: true, default: false }
},{
    versionKey: false,
    collection: 'Role'
});

export const Role = model<iRole>('Role', RoleSchema);
