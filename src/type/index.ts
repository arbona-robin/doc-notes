interface Template {
    head: string;
    header: string;
    main: string;
    footer: string;
}

interface Metadata {
    title: string;
    description: string;
    date: Date | string;
    tags: string[];
}

export type { Template, Metadata };