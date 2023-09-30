export enum Color {
    RED = 'red',
    ORANGE = 'orange',
    AMBER = 'amber',
    YELLOW = 'yellow',
    LIME = 'lime',
    GREEN = 'green',
    EMERALD = 'emerald',
    TEAL = 'teal',
    CYAN = 'cyan',
    SKY = 'sky',
    BLUE = 'blue',
    INDIGO = 'indigo',
    VIOLET = 'violet',
    PURPLE = 'purple',
    FUCHSIA = 'fuchsia',
    PINK = 'pink',
    ROSE = 'rose',
    SLATE = 'slate',
    ZINC = 'zinc',
    BROWN = 'brown'
}

export function randomColor(): Color {
    const colors = [
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "pink",
        "fuchsia",
        "rose",
        "slate",
        "zinc",
        "brown"
    ];

    return colors[Math.floor(Math.random() * colors.length)] as Color;
}