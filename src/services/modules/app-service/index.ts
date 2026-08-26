import authorAppService, { authorKeys } from "./author.app-service";
import blogAppService, { type BlogArticle, type BlogSitemapEntry } from "./blog-seo.app-service";
import blogsAppService, { blogsKeys } from "./blogs.app-service";
import contactAppService, { contactKeys } from "./contact.app-service";
import languageAppService, { languageKeys } from "./language.app-service";
import systemAppService, { systemKeys } from "./system.app-service";
import translateAppService, { type TranslateCatalog, translateKeys } from "./translate.app-service";
import translateContentAppService, { translateContentKeys } from "./translate-content.app-service";
export {
    authorAppService,
    authorKeys,
    blogAppService,
    blogsAppService,
    blogsKeys,
    contactAppService,
    contactKeys,
    languageAppService,
    languageKeys,
    systemAppService,
    systemKeys,
    translateAppService,
    translateContentAppService,
    translateContentKeys,
    translateKeys,
};

export type {
    BlogArticle,
    BlogSitemapEntry,
    TranslateCatalog,
};
