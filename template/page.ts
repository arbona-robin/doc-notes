import { Template, Metadata } from "../src/type";



export function generatePageHtml({ template, metadata, content }: { template: Template, metadata: Metadata, content: string }) {
    return `
        <!DOCTYPE html>
        <html>
            ${template.head
            .replace("{{title}}", metadata.title)
            .replace("{{description}}", metadata.description)
        }
        <body>
            ${template.header.replace("{{title}}", metadata.title)}
            ${template.main.replace("{{content}}", content)}
            ${template.footer}
        </body>
        </html>
        `;
}

