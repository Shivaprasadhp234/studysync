export const getPlayerLevel = (points: number) => {
    if (points >= 500) return { name: "Campus Legend", color: "bg-purple-500/20 text-purple-500 ring-purple-500/30" };
    if (points >= 150) return { name: "Neural Navigator", color: "bg-blue-500/20 text-blue-500 ring-blue-500/30" };
    if (points >= 50) return { name: "Rising Star", color: "bg-emerald-500/20 text-emerald-500 ring-emerald-500/30" };
    return { name: "Novice", color: "bg-slate-500/20 text-slate-500 ring-slate-500/30" };
};
