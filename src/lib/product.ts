import {Category, Gender, Season, Size, Status, State, Brand} from "@prisma/client";

// Fonctions de validation simples
export function mapGender(input: string): Gender {
    if(Object.values(Gender).includes(input as Gender))
        return input as Gender
    throw new Error("Gender not found");
}

export function mapSeason(input: string): Season {
    if(Object.values(Season).includes(input as Season))
        return input as Season
    throw new Error("Season not found");
}

export function mapCategory(input: string): Category {
    if(Object.values(Category).includes(input as Category))
        return input as Category
    throw new Error('Category not found')
}

export function mapSize(input: string): Size {
    if(Object.values(Size).includes(input as Size))
        return input as Size
    throw new Error('Size not found')
}

export function mapStatus(input: string): Status {
    return Object.values(Status).includes(input as Status) ? input as Status : Status.collected;
}

export function mapState(input: string): State {
    return Object.values(State).includes(input as State) ? input as State : State.good;
}

export function mapBrand(input: string): Brand {
    if(Object.values(Brand).includes(input as Brand))
        return input as Brand;
    throw new Error('Brand not found')
}


export const genderLabels: Record<Gender, string> = {
    [Gender.M]: 'Garçon',
    [Gender.F]: 'Fille',
    [Gender.Unisex]: 'Mixte',
};

export const seasonLabels: Record<Season, string> = {
    [Season.hot]: 'Chaud',
    [Season.cold]: 'Froid',
    [Season.mid_season]: 'Mi-saison',
};

export const categoryLabels: Record<Category, string> = {
    [Category.jacket]: 'Veste',
    [Category.socks]: 'Chaussettes',
    [Category.accessories]: 'Accessoires',
    [Category.pajamas]: 'Pyjama',
    [Category.set]: 'Ensemble',
    [Category.dress]: 'Robe / Combishort',
    [Category.coat]: 'Blouson / Manteau',
    [Category.tshirt_short]: 'T-shirt manches courtes',
    [Category.tshirt_long]: 'T-shirt manches longues',
    [Category.sweatshirt]: 'Sweat',
    [Category.pants]: 'Pantalon/Bas',
    [Category.bodysuit]: 'Bodies',
    [Category.sleeping_bag]: 'Turbulette',
};

export const sizeLabels: Record<Size, string> = {
    [Size.zero_months]: "0 mois",
    [Size.one_month]: "1 mois",
    [Size.three_months]: "3 mois",
    [Size.six_months]: "6 mois",
    [Size.nine_months]: "9 mois",
    [Size.twelve_months]: "12 mois",
    [Size.eighteen_months]: "18 mois",
    [Size.twenty_four_months]: "24 mois",
    [Size.two_years]: "2 ans",
    [Size.three_years]: "3 ans",
    [Size.four_years]: "4 ans",
    [Size.five_years]: "5 ans",
    [Size.six_years]: "6 ans",
};

export const statusLabels: Record<Status, string> = {
    [Status.finished]: "Terminé",
    [Status.in_progress]: "En cours",
    [Status.collected]: "Collecté",
    [Status.pending]: "En attente",
    [Status.sold]: "Vendu",
    [Status.reserved]: "Réservé",
    [Status.available]: "Disponible"
};

export const stateLabels: Record<State, string> = {
    [State.new]: "Comme neuf",
    [State.very_good]: "Très bon état",
    [State.good]: "Bon état",
    [State.fair]: "Usage correct",
    [State.donation]: "Don pur"
};

export const brandLabels: Record<Brand, string> = {
    [Brand.jacadi]: "Jacadi",
    [Brand.petit_bateau]: "Petit Bateau",
    [Brand.sergent_major]: "Sergent Major",
    [Brand.zara]: "Zara",
    [Brand.hm]: "H&M",
    [Brand.kiabi]: "Kiabi",
    [Brand.no_name]: "No name",
    [Brand.bonpoint]: "Bonpoint",
    [Brand.tartine_et_chocolat]: "Tartine et Chocolat",
    [Brand.bonton]: "Bonton",
    [Brand.okaidi]: "Okaïdi",
    [Brand.dpam]: "DPAM",
    [Brand.tape_a_loeil]: "Tape à l'œil",
    [Brand.vertbaudet]: "Vertbaudet",
    [Brand.catimini]: "Catimini",
    [Brand.ca]: "C&A",
    [Brand.tex_carrefour]: "Tex (Carrefour)",
    [Brand.in_extenso_auchan]: "In Extenso (Auchan)",
    [Brand.gemo]: "Gémo",
    [Brand.zeeman]: "Zeeman",
    [Brand.primark]: "Primark",
    [Brand.lidl]: "Lidl",
    [Brand.la_redoute]: "La Redoute",
    [Brand.orchestra]: "Orchestra",
    [Brand.grain_de_ble]: "Grain de Blé",
    [Brand.boutchou_monoprix]: "Bout'chou (Monoprix)",
    [Brand.ikks]: "IKKS",
    [Brand.absorba]: "Absorba",
    [Brand.natalys]: "Natalys",
    [Brand.bebel]: "Bebel",
    [Brand.shein]: "Chine (Shein)",
    [Brand.uniqlo]: "Uniqlo",
    [Brand.benetton]: "United colours of Benetton",
};
