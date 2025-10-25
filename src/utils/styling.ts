import { RunToolApprovalItem } from "@openai/agents";
import { saveJsonParser } from "./common";

/**
 * This function makes a json string more readable for the users in the front end.
 * @param jsonString a stringified json object
 * @returns a string with markdown formatting
 */
export function applyHtmlToArguments(jsonString: string): string {
    let markdownResult = ``;
    try {
        const jsonObj = saveJsonParser(jsonString);
        
        if (!jsonObj) return jsonString;

        for (const key in jsonObj) {
            const value = jsonObj[key];
            if (value !== null && value !== undefined) {
                markdownResult += `<b>${key}</b>: ${typeof value === 'string' ? value : JSON.stringify(value)}<br/>`;
            }
        }
        return markdownResult;
    } catch (error) {
        console.error('Error beautifying JSON string:', error);
        return jsonString;
    }
}

export function getApprovalMessageForInterruption(interruption: RunToolApprovalItem): string {
    return `The agent would like to perform action <b>${interruption.rawItem.name}</b> with the following parameters: ` + 
    `<br/><br/> ${applyHtmlToArguments(interruption.rawItem.arguments ?? '')}` + 
    `<br/> Do you approve?`;
}