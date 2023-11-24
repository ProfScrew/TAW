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

    subModelInput?:{
        // implement later for expandable forms
    }




}