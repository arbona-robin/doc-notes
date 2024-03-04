import { Template, Metadata } from "../src/type";

export function generateHomeHtml({ template, metadata, pagesMetadata }: { template: Template, metadata: Metadata, pagesMetadata: Map<string, Metadata> }) {
    return `
    <!DOCTYPE html>
    <html>
            ${template.head
            .replace("{{title}}", metadata.title)
            .replace("{{description}}", metadata.title)
        }
            ${template.header
            .replace("{{title}}", "Robin's doc-notes")
            .replace("{{date}}", "© 2024")
            .replace('<div><a href="./">back</a></div>', metadata.title)
        }
            <body>
            ${template.main.replace("{{content}}", `

            <div id="list-menu">
                <input type="text" id="search" placeholder="Search">

                <p>
                    Sort by:
                    <button id="sort-by-date" class="reverse-selected">DATE</button>
                    <button id="sort-by-alphabet">A-Z</button>
                </p>
            </div>
            <ul id="article-list">
                ${Array.from(pagesMetadata)
                .sort((a, b) => a[1].date > b[1].date ? -1 : 1)
                .map(([key, value]) => {
                    return `
                    <li>
                        <a 
                            href="${key}.html"  
                            data-tags="${value.tags.join(" ")}" 
                            data-title="${value.title}"
                            data-description="${value.description}"
                            data-date="${value.date}"
                            >${value.title}</a> - ${value.date} - ${value.description}
                    </li>
                `;
                }
                ).join("")}
            </ul>
            `)}
            ${template.footer.replace("{{content}}", `
            <p><a href="mailto:arbona.robin@gmail.com">arbona.robin@gmail.com</a></p>
            <p><a href="https://github.com/arbona-robin/doc-notes">github.com/arbona-robin/doc-notes</a></p>
            `)}

            <script src="search.js" defer></script>
            <script src="sort.js" defer></script>

        </body>
        </html>
    `;;
}