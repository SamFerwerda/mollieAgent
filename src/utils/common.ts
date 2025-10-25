export function saveJsonParser(stringData: string){
    try {
        if (stringData && typeof stringData === 'string') {
            return JSON.parse(stringData);
        }
        return null;
    } catch (error) {
        console.error('Error parsing JSON string:', error);
        return null;
    }
}