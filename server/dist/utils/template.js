"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHtmlTemplate = getHtmlTemplate;
const fs_1 = __importDefault(require("fs"));
function getHtmlTemplate(filePath, replacements) {
    let html = fs_1.default.readFileSync(filePath, "utf-8");
    for (const key in replacements) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    }
    return html;
}
//# sourceMappingURL=template.js.map