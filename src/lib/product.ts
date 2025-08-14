export function mapGender(g: string) {
    if (!g) return "Empty";
    if (g === "Unisex") return "Unisex";
    if (g === "M" || g === "F") return g;
    return "Empty";
}
export function mapSeason(s: string) {
    if (!s) return "Empty";
    if (s === "all seasons") return "all_seasons";
    if (["summer","winter","autumn","spring"].includes(s)) return s as any;
    return "Empty";
}