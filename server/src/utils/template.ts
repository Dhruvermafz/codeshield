import fs from "fs"

function getHtmlTemplate(filePath: string, replacements: any) {
    let html = fs.readFileSync(filePath, "utf-8")

    for(const key in replacements) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    }

    return html
}


export {getHtmlTemplate}