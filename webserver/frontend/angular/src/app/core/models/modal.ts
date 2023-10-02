
export type TModalOption = {
    display:    string;
    color?:     string;
    thickness?: string | number;

    url?:    string;
    action?: Function;
} & (
    | { url: string; action?: never }
    | { url?: never; action: Function }
);
