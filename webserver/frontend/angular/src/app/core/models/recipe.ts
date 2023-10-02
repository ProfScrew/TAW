export interface iSubMenu {
    name: string;
    color?: string;
}

export interface iIngredient {
    _id?:           string;
    name:           string;
    alergens:       string[];
    price_per_unit: number;
    unit:           string;
}

export interface iRecipe {
    _id?:        string;
    name:        string;
    ingredients: iIngredient[];
    base_price:  number;
    submenu:     iSubMenu;
}