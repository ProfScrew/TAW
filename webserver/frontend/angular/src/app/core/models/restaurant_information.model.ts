export interface iRestaurantInformation {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string; //TODO: reverse proxy static folder 
    iva: string;

    //chages per person(improvised solution simple ... i know 😢 )
    charge_per_person: number;
}