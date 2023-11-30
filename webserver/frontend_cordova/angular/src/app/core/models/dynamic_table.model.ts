import { iDynamicTableForm } from "./dynamic_table_form.model";
export enum eListenChannels {
    ingredients = "backendAdminIngredients",
    categories = "backendAdminCategories",
    recipes = "backendAdminRecipes",
    rooms = "backendAdminRooms",
    tables = "backendAdminTables",
    users = "backendAdminUsers",
    restaurantInformation = "backendAdminRestaurantInformation",
}
export interface iDynamicTable {
    route: string;
    archive: boolean;
    
    tableListener: eListenChannels;
    columns: 
        {
            name: string;
            label: string;
            type: string; // text, array
            subTable?: boolean;
            subTableRoute?: string;
        }[];
    
    expandable: boolean;

    subModelInput?: iDynamicTableForm;

}