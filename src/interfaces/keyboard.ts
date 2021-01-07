export type DefaultButtonAction = "first" | "back" | "stop" | "next" | "last";
export type DefaultButtonLabel = "⏪" | "◀️" | "⏹" | "▶️" | "⏩";
export type DefaultButtonsMap = Map<DefaultButtonAction, DefaultButtonLabel>;

export interface ISetDefaultButtonsOptions {
    buttons?: DefaultButtonAction[];
    type?: "text" | "callback";
}
