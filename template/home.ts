import { Template, Metadata } from "../src/type";

export function generateHomeHtml({ template, metadata, pagesMetadata }: { template: Template, metadata: Metadata, pagesMetadata: Map<string, Metadata> }) {
    return `
    <!DOCTYPE html>
    <html>
            ${template.head
            .replace("{{title}}", metadata.title)
            .replace("{{description}}", metadata.title)
        }
            ${template.header.replace("{{title}}", metadata.title)}
            <body>
            ${template.main.replace("{{content}}", `
            <ul>
                ${Array.from(pagesMetadata).map(([key, value]) => {
            return `
                    <li>
                        <a href="${key}.html">${value.title}</a> ${value.description}
                    </li>
                `;
        }
        ).join("")}
            </ul>
            `)}
            ${template.footer}
        </body>
        </html>
    `;;
}