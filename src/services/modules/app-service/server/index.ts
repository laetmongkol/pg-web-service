import authorAppServiceServer from "./author.app-service.server";
import blogAppServiceServer from "./blog.app-service.server";
import faqsAppServiceServer from "./faqs.app-service.server";
import languageAppServiceServer from "./language.app-service.server";
import pageSeoAppServiceServer from "./page-seo.app-service.server";
import translateAppServiceServer from "./translate.app-service.server";
import translateContentAppServiceServer from "./translate-content.app-service.server";
import urlRedirectAppServiceServer from "./url-redirect.app-service.server";

export {
    authorAppServiceServer,
    blogAppServiceServer,
    faqsAppServiceServer,
    languageAppServiceServer,
    pageSeoAppServiceServer,
    translateAppServiceServer,
    translateContentAppServiceServer,
    urlRedirectAppServiceServer,
};

export { createRevalidateInit, REVALIDATE_SECONDS } from "./server-cache";
