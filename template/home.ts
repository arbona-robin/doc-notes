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
            <input type="text" id="search" placeholder="Search">
            <ul>
                ${Array.from(pagesMetadata)
                .sort((a, b) => a[1].date > b[1].date ? -1 : 1)
                .map(([key, value]) => {
                    return `
                    <li>
                        <a 
                            href="${key}.html"  
                            search-data-tags="${value.tags.join(" ")}" 
                            search-data-title="${value.title}"
                            search-data-description="${value.description}"
                            >${value.title}</a> - ${value.date} - ${value.description}
                    </li>
                `;
                }
                ).join("")}
            </ul>
            `)}
            ${template.footer}

            <script src="search.js" defer></script>

        </body>
        </html>
    `;;
}