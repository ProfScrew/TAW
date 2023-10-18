import { Schema, model } from 'mongoose';
import { iRecipe } from './recipe';
import { iUser } from './user';
import { iIngredient } from './ingredient';
import { UserAction, iUserAction } from './typedef';

export type tDishStatus           = 'inserted' | 'dispatched' | 'ready' | 'served' | 'cancelled';
export type tDishModificationType = 'add' | 'remove' | 'more' | 'less';

export interface iDishModification {
    ingredient: iIngredient['_id'];
    type:       tDishModificationType;
    quantity:   number;
    mod_price:  number;
    added_by:   iUser['username'];
    

}


export interface iDish {
    _id:                Schema.Types.ObjectId;
    recipe:             iRecipe['_id'];
    status:             tDishStatus;
    price:              number;
    notes:              string[];
    production_node_id: iUser['username'];
    modifications:      iDishModification[];
    //regrounp variables, so to distinguish what does waiter and what does kitchen
    
    archive: (action: iUserAction) => Promise<iHistoricalDish>;
    //remove this...
    
    //add fields DELETED and COMPLETED
}

export interface iHistoricalDish extends iDish {
    deleted?:          iUserAction;
    completed?:        iUserAction;
}

const DishSchema = new Schema<iDish>({
    recipe:             {type: Number, ref: "Recipe", required: true},
    added_by:           {type: String, ref: "User", required: true},
    added_at:           {type: Date,   required: true},
    status:             {type: String, required: true},
    price:              {type: Number, required: true},
    notes:              {type: [String]},
    production_node_id: {type: String, ref: "Production", required: true},
    
    modifications:  {type: [{
        ingredient: {type: Number, ref: "Ingredient", required: true},
        type:       {type: String, required: true},
        quantity:   {type: Number, required: true},
        mod_price:  {type: Number, required: true},
        added_by:   {type: String, ref: "User", required: true},
    }]},
},{
    versionKey: false,collection: "Dish"});

const HistoricalDishSchema = new Schema<iHistoricalDish>({//delete this
    ...DishSchema.obj,
    deleted:   {type: UserAction, required: false},
    completed: {type: UserAction, required: false},
},{
    versionKey: false,collection: "HistoricalDish"});



export const Dish = model<iDish>('Dish', DishSchema);
export const HistoricalDish = model<iHistoricalDish>('HistoricalDish', HistoricalDishSchema);


DishSchema.methods.archive = async function(action: iUserAction): Promise<iHistoricalDish> {
    const dish = this.toObject() as Partial<iDish>;
    const status = dish.status;
    delete dish._id;

    const historicalDish = new HistoricalDish({ ...dish });

    // Check if the dish was served
    if (status === 'served') {
        historicalDish.completed = action;
    } else {
        historicalDish.deleted = action;
    }
    
    // Adds the historical dish
    await Dish.deleteOne({ _id: this._id }).maxTimeMS(1000).orFail();
    await historicalDish.save();

    return historicalDish;
}

