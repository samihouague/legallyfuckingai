import * as cheerio from "cheerio";
import { Document } from "@langchain/core/documents";

export async function loadWebPage(
    url,
    selector = "body"
) {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    return [
        new Document({
            pageContent: $(selector).text(),
            metadata: { source: url },
        }),
    ];
}