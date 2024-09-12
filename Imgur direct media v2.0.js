// ==UserScript==
// @name        Imgur direct media page without HTML
// @icon        https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @description Prevents Imgur from redirecting direct media URLs to their HTML page, keeping the correct file extension for images, GIFs and videos.
// @include     /^https?:\/\/imgur\.com\/[A-Za-z0-9]+$/
// @include     /^https?:\/\/i\.imgur\.com\/[A-Za-z0-9]+\.(jpeg|png|jpg|gif|mp4)$/
// @exclude     *imgur.com/vidgif
// @exclude     *imgur.com/jobs
// @exclude     *imgur.com/about
// @exclude     *imgur.com/apps
// @exclude     *imgur.com/tos
// @exclude     *imgur.com/privacy
// @exclude     *imgur.com/removalrequest
// @exclude     *imgur.com/advertise
// @exclude     *imgur.com/blog
// @exclude     *imgur.com/random
// @exclude     *imgur.com/search
// @exclude     *imgur.com/*.webm
// @exclude     *imgur.com/upload
// @version     2.0
// @license     MIT
// @grant       none
// @run-at      document-start
// ==/UserScript==
     
const contentTypes = ["image/gif", "video/mp4", "image/jpeg", "image/png"];
     
const fix_page = async function () {
  const currentUrl = window.location.href;
  if (!/^https?:\/\/imgur\.com\/[A-Za-z0-9]+$/.test(currentUrl)) {return;}
  const imageId = currentUrl.match(/imgur\.com\/([A-Za-z0-9]+)/)[1];
  for (const contentType of contentTypes) {
    const extension = contentType.split("/")[1];
    const url = `https://i.imgur.com/${imageId}.${extension}`;
    const response = await fetch(url, {method: "HEAD"});
    if (response.ok && response.headers.get("content-type").split(",").includes(contentType)) {
      window.location.replace(url);
      break;
    }
  }
};
     
fix_page();

