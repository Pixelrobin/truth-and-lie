export function updatePageData(data) {
    const keys = Object.keys(data);

    for (const key of keys) {
        const dataElements = document.querySelectorAll(`[data-game-data="${ key }"]`);
        for (const element of dataElements) {
            element.innerText = data[key].toString();
        }
    }
}