import {Brand, Category, State} from "@prisma/client";

export const brandValues: Record<Brand, number> = {
    [Brand.jacadi]: 2,
    [Brand.petit_bateau]: 2,
    [Brand.sergent_major]: 2,
    [Brand.zara]: 1,
    [Brand.hm]: 1,
    [Brand.kiabi]: 1,
    [Brand.no_name]: 0,
    [Brand.bonpoint]: 3,
    [Brand.tartine_et_chocolat]: 2,
    [Brand.bonton]: 3,
    [Brand.okaidi]: 1,
    [Brand.dpam]: 1,
    [Brand.tape_a_loeil]: 1,
    [Brand.vertbaudet]: 2,
    [Brand.catimini]: 2,
    [Brand.ca]: 1,
    [Brand.tex_carrefour]: 1,
    [Brand.in_extenso_auchan]: 1,
    [Brand.gemo]: 1,
    [Brand.zeeman]: 0,
    [Brand.primark]: 0,
    [Brand.lidl]: 0,
    [Brand.monoprix]: 2,
    [Brand.la_redoute]: 2,
    [Brand.orchestra]: 1,
    [Brand.grain_de_ble]: 1,
    [Brand.boutchou_monoprix]: 2,
    [Brand.ikks]: 2,
    [Brand.absorba]: 2,
    [Brand.natalys]: 3,
    [Brand.Empty]: 0
};

export const categoryValues: Record<Category, number> = {
    [Category.jacket]: 8,
    [Category.socks]: 0,
    [Category.accessories]: 2,
    [Category.pajamas]: 4,
    [Category.set]: 8,
    [Category.dress]: 5,
    [Category.coat]: 8,
    [Category.tshirt_short]: 2,
    [Category.tshirt_long]: 3,
    [Category.sweatshirt]: 5,
    [Category.pants]: 4,
    [Category.bodysuit]: 3,
    [Category.Empty]: 0
};

export const stateValues: Record<State, number> = {
    [State.new]: 1.5,
    [State.very_good]: 1.2,
    [State.good]: 1,
    [State.fair]: 0.7,
    [State.donation]: 0
};

export function calculatePrice(brand: Brand | undefined, category: Category | undefined, state: State | undefined) {
    if(!brand || !category || !state) return 0;
    return brandValues[brand] * categoryValues[category] * stateValues[state];
}
