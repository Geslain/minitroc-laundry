import {Category, Gender, Season, Size} from "@prisma/client";

// Fonctions de validation simples
export function mapGender(input: string): Gender {
    return Object.values(Gender).includes(input as Gender) ? input as Gender : Gender.Empty;
}

export function mapSeason(input: string): Season {
    return Object.values(Season).includes(input as Season) ? input as Season : Season.Empty;
}

export function mapCategory(input: string): Category {
    return Object.values(Category).includes(input as Category) ? input as Category : Category.Empty;
}

export function mapSize(input: string): Size {
    return Object.values(Size).includes(input as Size) ? input as Size : Size.Empty;
}

export const genderLabels: Record<Gender, string> = {
    [Gender.Empty]: '',
    [Gender.M]: 'Homme',
    [Gender.F]: 'Femme',
    [Gender.Unisex]: 'Mixte',
};

export const seasonLabels: Record<Season, string> = {
    [Season.Empty]: '',
    [Season.hot]: 'Chaud',
    [Season.cold]: 'Froid',
    [Season.mid_season]: 'Mi-saison',
};

export const categoryLabels: Record<Category, string> = {
    [Category.Empty]: '',
    [Category.jacket]: 'Veste',
    [Category.socks]: 'Chaussettes',
    [Category.accessories]: 'Accessoires',
    [Category.pajamas]: 'Pyjama',
    [Category.set]: 'Ensemble',
    [Category.dress]: 'Robe / Combishort',
    [Category.coat]: 'Blouson / Manteau',
    [Category.tshirt_short]: 'T-shirt MC',
    [Category.tshirt_long]: 'T-shirt ML',
    [Category.sweatshirt]: 'Sweat',
    [Category.pants]: 'Pantalon/Bas',
    [Category.bodysuit]: 'Bodies',
};

export const sizeLabels: Record<Size, string> = {
    [Size.Empty]: "",
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