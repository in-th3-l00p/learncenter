export function getLimitedText(text: string, length: number = 20) {
    return text.length > length ? text.substring(0, length) + '...' : text
}