export const filterCategoriesByEvent = (events: any[], types: any[]): any[] => {
    const typesInEvents = new Map<number, number>();

    for (let i = 0; i < events.length; i++) {
        if (events[i]?.types) {
            events[i].types.forEach((el: number) => {
                typesInEvents.set(el, 1);
            });
        }
    }

    return types.filter(((type: { id: number }) => typesInEvents.has(type.id)));
}