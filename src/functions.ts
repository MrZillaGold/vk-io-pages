import { pagesStorage } from "./PagesBuilder";

export function randomString(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyz";

    let string = "";

    for (let i = 0; i < length; i++) {
        string += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return string;
}

/**
 * Функция для проверки наличия сборщика
 */
export function hasBuilder(builderId: string): boolean {
    return pagesStorage.has(builderId);
}
