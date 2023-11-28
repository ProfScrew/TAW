


export interface iDynamicTableForm {

    
    routeModify: string;
    routeDelete: string;

    formName: string;

    textFields?: {
        name: string;
        label: string;
        type: string;
        required: boolean;
        value: string;
    }[];

    checkBoxes?: {
        name: string;
        elements: {
            name: string;
            label: string;
            value: boolean;
        }[];
    };

    arrayTextFields?: {
        name: string;
        label: string;
        type: string;
        value: string[];
    };

    elementsFromDatabaseSingleChoice?: {
        name: string;
        label: string;
        route: string;
        value: string;
    }[];

    elementsFromDatabaseMultipleChoice?: {
        name: string;
        label: string;
        route: string;
        value: string[];
    }[];


}