import { eListenChannels } from "./channels.enum";
import { iDynamicTableForm } from "./dynamic_table_form.model";

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