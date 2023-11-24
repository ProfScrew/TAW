import { iDynamicTableForm } from "./dynamic_table_form.model";

export interface iDynamicTable {
    route: string;
    shadow: boolean;

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