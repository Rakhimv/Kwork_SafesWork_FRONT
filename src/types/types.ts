export interface Safe {
    id: number,
    image: string,
    number: any,
    name: string,
    description: string,

    dop: {
        workshop: string | null,
        year: string | null,
        place: string | null,
        material: string | null,
        author: string | null,
        size: string | null,
        casting: string | null,
    }

}

export interface SafeInArray {
    id: number,
    image: string,
    number: any,
}


export const dopLabels: any = {
    workshop: "Мастерская",
    year: "Год",
    place: "Место",
    material: "Материал",
    author: "Автор",
    size: "Размер",
    casting: "Литье"
};
