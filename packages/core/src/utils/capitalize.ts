export const capitalize = (str: string): string => {
    str = str.trim();
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}