export const filterEvents = (events: any[], filter: {
    categories: number[],
    dateFrom: string | undefined,
    dateTo: string | undefined,
    limit: number,
    page: number
}) => {
    let listEvent = events;

    if (filter.categories?.length) {
        listEvent = events.filter((event: any) => filter.categories.some(value => event?.types?.includes(value)))
    }

    if (filter.dateFrom?.length) {
        const dateFrom = new Date(filter.dateFrom);

        listEvent = listEvent.filter((event: any) => {
            const end = new Date(event.end_date);

            return end >= dateFrom;
        });
    }

    if (filter.dateTo?.length) {
        const dateTo = new Date(filter.dateTo);

        listEvent = listEvent.filter((event: any) => {
            const start = new Date(event.date);

            return start <= dateTo;
        });
    }

    const skip = (filter.page - 1) * filter.limit;

    return {
        events: listEvent.slice(skip, skip + filter.limit),
        totalPages: Math.ceil(listEvent.length / filter.limit || 1),
    }
}