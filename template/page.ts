import { Template, Metadata } from "../src/type";



export function generatePageHtml({ template, metadata, content }: { template: Template, metadata: Metadata, content: string }) {

    // Extract all links from the content
    const links = content.match(/<a href="([^"]+)">/g)?.map(link => link.match(/<a href="([^"]+)">/)?.[1]);

    console.log("links", links);



    return `
        <!DOCTYPE html>
        <html>
            ${template.head
            .replace("{{title}}", metadata.title)
            .replace("{{description}}", metadata.description)
        }
        <body>
            ${template.header
            .replace("{{title}}", metadata.title)
            .replace("{{date}}", metadata.date.toString())}
            ${template.main.replace("{{content}}", content)}
            ${template.footer.replace("{{content}}",
                `<ol>
                ${links?.map(link => `<li><a href="${link}.html">${link}</a></li>`).join("") || ""
                } </ol>`)}
        </body>
        </html>
        `;
}

