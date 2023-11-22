

export interface iDynamicForm {
    route: string;

    formName: string;

    textFields?:
    {
        name: string;
        label: string;
        type: string;
        required: boolean;
        value?: string;
    }[];

    checkBoxes?: {
        name: string;
        elements:
        {
            name: string;
            label: string;
            value: boolean;
        }[];

    };

    arrayTextFields?: {
        name: string;
        label: string;
    };

    elementsFromDatabaseSingleChoice?:
    {
        name: string;
        label: string;
        route: string;
    }[];
    elementsFromDatabaseMultipleChoice?:
    {
        name: string;
        label: string;
        route: string;
    }[];

}