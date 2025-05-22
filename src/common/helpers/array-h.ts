export const toNumberArray = (value: string | string[]) => {
    if (!value) return [];

    if (Array.isArray(value))
        return value.map(Number);

    return [Number(value)];
};