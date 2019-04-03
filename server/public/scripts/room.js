"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function featureExists(t,e,n){return!(t in e&&n)||_typeof(e[t])===n}if(featureExists("querySelectorAll",document.body,"function")&&featureExists("forEach",Array.prototype,"function")&&featureExists("addEventListener",document.body,"function")){var modals=document.querySelectorAll(".Modal");turnOffTabIndexForOffScreenElements(modals),activateTabIndexOnHashChange(modals)}function turnOffTabIndexForOffScreenElements(t){t&&0<t.length&&t.forEach(function(t){var e=t.querySelectorAll("button, a, input, textarea");e&&0<e.length&&e.forEach(function(t){t.setAttribute("tabindex","-1")})})}function activateTabIndexOnHashChange(t){window.addEventListener("hashchange",function(){var r=window.location.hash;r&&0<r.length&&t.forEach(function(t){var e=r.replace("#","");if(t.id===e){var n=t.querySelectorAll("button, a, input, textarea"),o=t.querySelector(".Modal__close-button");n&&0<n.length&&n.forEach(function(t){t.removeAttribute("tabindex")}),o&&o.addEventListener("click",function(){o.setAttribute("tabindex","-1")})}})})}