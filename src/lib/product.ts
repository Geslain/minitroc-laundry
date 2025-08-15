import {Category, Gender, Season} from "@prisma/client";

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

// Labels pour l'affichage (seule chose vraiment nécessaire)
export const genderLabels: Record<Gender, string> = {
    [Gender.Empty]: '',
    [Gender.M]: 'Homme',
    [Gender.F]: 'Femme',
    [Gender.Unisex]: 'Unisexe',
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

