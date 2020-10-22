function randomString(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz";

    let string = "";

    for (let i = 0; i < length; i++) {
        string += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return string;
}

export {
    randomString
}
