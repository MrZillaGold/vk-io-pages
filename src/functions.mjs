import { pagesStorage } from "./PagesBuilder.mjs";

export function randomString(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz";

    let string = "";

    for (let i = 0; i < length; i++) {
        string += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return string;
}

/**
 * @description Функция для проверки наличия сборщика
 * @param {string} builderId - ID-Сборщика
 * @return {boolean} - Логическое значение наличия сборщика
 */
export function hasBuilder(builderId) {
    return pagesStorage.has(builderId);
}

export function cleanUpKeyboard(keyboard, pageNumber) {
    keyboard.rows = [...keyboard.rows, keyboard.currentRow];
    keyboard.currentRow = [];

    keyboard.rows = keyboard.rows.map((row) =>
        row.filter((button) => {
            try {
                const payload = JSON.parse(button.action.payload);

                if (
                    Object.keys(payload)
                        .filter((key) => key !== "builder_action" && key !== "builder_id")
                        .length > 0
                ) {
                    return true;
                }

                const { builder_action } = payload;

                if (builder_action) {
                    return !(
                        (pageNumber === 1 && (builder_action === "first" || builder_action === "back")) ||
                        (pageNumber === this.pages.length && (builder_action === "last" || builder_action === "next"))
                    );
                }
            } catch {}

            return true;
        })
    )
        .filter((row) => row.length);

    return keyboard;
}
