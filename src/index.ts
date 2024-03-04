import * as fs from "fs";
import marked from "marked";
import path from "path";
import { Template, Metadata } from "./type";
import { generatePageHtml } from "../template/page";
import { generateHomeHtml } from "../template/home";


function loadTemplate(): Template {
    let template: Template = {
        head: "",
        header: "",
        main: "",
        footer: ""
    };
    // Load the template
    console.log("Loading template");
    const templateDir = process.env.TEMPLATE_DIR;
    if (!templateDir) {
        throw new Error("TEMPLATE_DIR environment variable is not set");
    }
    fs.readdirSync(templateDir).forEach(file => {
        let key = file.replace(/\.html$/, "");

        if (key in template) {
            console.log("-> loading file: " + file);
            const content = fs.readFileSync(path.join(templateDir, file), "utf8");
            template[key as keyof Template] = content;
        }
    });

    return template;
}

function loadContent(): Map<string, string> {
    console.log("Loading content");
    const contentDir = process.env.CONTENT_DIR;
    const contents = new Map<string, string>();
    if (!contentDir) {
        throw new Error("CONTENT_DIR environment variable is not set");
    }
    fs.readdirSync(contentDir).forEach(file => {
        let key = file.replace(/\.md$/, "");
        console.log("-> loading file: " + file);
        const content = fs.readFileSync(path.join(contentDir, file), "utf8");
        contents.set(key, content);
    });

    return contents;
}

function generatePages({ template, content }: { template: Template, content: Map<string, string> }): Map<string, Metadata> {
    // Generate the pages
    const pagesMetadata = new Map<string, Metadata>();

    console.log("Generating site");
    for (let [key, value] of content) {

        // Extract metadata from the content if any
        const metadata = value.match(/^---\n([\s\S]+?)\n---/)?.[0]

        // Convert the metadata to a JSON object
        let metadataObj: Metadata = {
            title: "",
            description: "",
            date: "",
            tags: []
        };
        if (metadata) {
            value = value.replace(metadata, "");
            metadata?.split("\n").forEach((line) => {
                const [key, value] = line.split(": ");
                if (key in metadataObj) {
                    if (key === "tags") {
                        metadataObj.tags = value.split(", ");
                    } else {

                        metadataObj[key as keyof Metadata] = value as any;
                    }
                }
            });
        }

        // Generate the HTML
        const htmlContent = marked.parse(value, { async: false }) as string

        const html = generatePageHtml({ template, metadata: metadataObj, content: htmlContent });

        // Write the HTML to a file
        console.log("-> writing file: " + key + ".html");
        fs.writeFileSync(path.join("site", key + ".html"), html);

        // Store the metadata
        pagesMetadata.set(key, metadataObj);
    }

    return pagesMetadata;
}

function copyAssets() {
    // Copy the assets
    console.log("Copying assets");
    const staticDir = process.env.STATIC_DIR;
    if (!staticDir) {
        throw new Error("STATIC_DIR environment variable is not set");
    }
    fs.readdirSync(staticDir).forEach(file => {
        console.log("-> copying file: " + file);
        fs.copyFileSync(path.join(staticDir, file), path.join("site", file));
    });
}

function generateIndexPage({ template, pagesMetadata }: {
    template: Template,
    pagesMetadata: Map<string, Metadata>
}) {
    // Generate the index page
    console.log("Generating index page");

    const metadata = {
        title: "Documentation, note, article ... list",
        description: "This is my blog",
        date: "",
        tags: []
    };


    let html = generateHomeHtml({ template, metadata, pagesMetadata });

    // Write the index page to a file
    console.log("-> writing file: index.html");
    fs.writeFileSync(path.join("site", "index.html"), html);
}


// Generate HTML from a template and content
async function generateSite(): Promise<void> {
    // Load the template
    const template = loadTemplate();

    // Load the content
    const content = loadContent();

    // Create the site directory
    if (!fs.existsSync("site")) {
        fs.mkdirSync("site");
    }

    // Generate pages
    const pagesMetadata = generatePages({ template, content });

    // Generate the index page
    generateIndexPage({ template, pagesMetadata });

    // Copy the assets
    copyAssets();

}

console.log("Starting site generation");
console.time("site generation");
generateSite();
console.timeEnd("site generation");
console.log("Site generation complete");

