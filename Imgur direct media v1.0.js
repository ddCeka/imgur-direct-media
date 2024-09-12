// ==UserScript==
// @name        Imgur direct media page
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
// @version     1.0
// @license     MIT
// @grant       none
// @run-at      document-start
     
(function() {
    const currentUrl = window.location.href;
     
    if (/^https?:\/\/imgur\.com\/[A-Za-z0-9]+$/.test(currentUrl)) {
        const imageId = currentUrl.match(/imgur\.com\/([A-Za-z0-9]+)/)[1];
     
        // Handle the response and redirect if valid
        function handleResponse(xhr, extension, contentType, callback) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 && xhr.getResponseHeader("Content-Type").includes(contentType)) {
                    window.location.replace(`https://i.imgur.com/${imageId}.${extension}`);
                } else if (callback) {
                    callback();
                }
            }
        }
     
        // Check for GIF
        const xhrGif = new XMLHttpRequest();
        xhrGif.open('HEAD', `https://i.imgur.com/${imageId}.gif`, true);
        xhrGif.onreadystatechange = function() {
            handleResponse(xhrGif, "gif", "image/gif", function() {
                // If GIF not found, check for MP4
                const xhrMp4 = new XMLHttpRequest();
                xhrMp4.open('HEAD', `https://i.imgur.com/${imageId}.mp4`, true);
                xhrMp4.onreadystatechange = function() {
                    handleResponse(xhrMp4, "mp4", "video/mp4", function() {
                        // If MP4 not found, check for JPEG
                        const xhrJpeg = new XMLHttpRequest();
                        xhrJpeg.open('HEAD', `https://i.imgur.com/${imageId}.jpeg`, true);
                        xhrJpeg.onreadystatechange = function() {
                            handleResponse(xhrJpeg, "jpeg", "image/jpeg", function() {
                                // If JPEG not found, check for PNG
                                const xhrPng = new XMLHttpRequest();
                                xhrPng.open('HEAD', `https://i.imgur.com/${imageId}.png`, true);
                                xhrPng.onreadystatechange = function() {
                                    handleResponse(xhrPng, "png", "image/png");
                                };
                                xhrPng.send();
                            });
                        };
                        xhrJpeg.send();
                    });
                };
                xhrMp4.send();
            });
        };
        xhrGif.send();
    }
})();
