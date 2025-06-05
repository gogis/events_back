function parseDate(str: string): Date {
    return new Date(str);
}

export const filterEvents = (events: any[], filter: {
    categories: number[],
    dateFrom?: string | undefined,
    dateTo?: string | undefined,
    limit: number,
    page: number
}) => {
    let listEvent = events;

    if (filter?.categories?.length) {
        listEvent = events.filter((event: any) => filter.categories.some(value => event?.types?.includes(value)))
    }

    if (filter.dateFrom?.length && filter.dateTo?.length) {
        const from = parseDate(filter.dateFrom);
        const to = parseDate(filter.dateTo);

        listEvent = listEvent.filter((event: any) => {
            const start = parseDate(event.date);
            const end = parseDate(event.end_date);
            return end >= from && start <= to;
        });
    } else if (filter.dateFrom?.length) {
        const from = parseDate(filter.dateFrom);

        listEvent = listEvent.filter((event: any) => {
            const end = parseDate(event.end_date);
            return end >= from;
        });
    } else if (filter.dateTo?.length) {
        const to = parseDate(filter.dateTo);

        listEvent = listEvent.filter((event: any) => {
            const start = parseDate(event.date);
            return start <= to;
        });
    }

    const skip = (filter.page - 1) * filter.limit;

    return {
        events: listEvent.slice(skip, skip + filter.limit),
        totalPages: Math.ceil(listEvent.length / filter.limit || 1),
    }
}

