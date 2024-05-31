import { initSentry } from "./logger";
import { handleRequest } from './handler'

declare const ACCESS_CONTROL_ALLOW_ORIGIN: string;

addEventListener("fetch", (event) => {
  const sentry = initSentry(event);

  // You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/handle/form')) {
    event.respondWith(handleRequest(event.request, sentry));
  }

  const notFoundResponse = new Response('These are not the droids you are looking for', { status: 404 });
  notFoundResponse.headers.set('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
  event.respondWith(notFoundResponse);
});
