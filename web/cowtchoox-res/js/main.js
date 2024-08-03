
// The file have been modified to remove page handling code

/** Errors will be stored here until cowtchoox evaluate this to show them in the terminal
 * @type{Array<String>}
 */
let errors = [];


main().then(() => {}).catch(err => {
    errors.push(err.message);
    console.error(err);
    createErrorElement();
});


async function main() {
    replaceEvaluate(document);
    replaceLastValues(document);
    createErrorElement();
}


/**
 * Will replace all values of evaluate tags
 @param {HTMLElement} parent
 */
function replaceEvaluate(parent) {
    // Search for get tags
    for (let evalTag of parent.querySelectorAll("evaluate")) {
        let tag = evalTag.querySelector("inner");
        let expression = tag.textContent;

        try {
            let result = function() { return eval(expression) }.call(evalTag);
            tag.innerHTML = result;
        } catch (err) {
            logError(`Failed to parse the evaluate tag that contains "${tag.textContent}". The error is: "${err.message}"`)
            tag.innerHTML = "Evaluation failed.";
        }
    }
}


/**
 * Will replace all values of last-tag-value tags
 @param {HTMLElement} parent
 */
function replaceLastValues(parent) {
    // Search for get tags
    for (let tag of parent.querySelectorAll("last-tag-value > span > text")) {
        let tagName = tag.innerHTML;

        let lastId = tag.id;
        tag.id = "replace-temp-id" // Creates a temporary id to match this tag later

        let finalContent = "";

        // Query all tag with this name, including this tag
        let nodeList = document.querySelectorAll(tagName, "#replace-temp-id");
        for (let node of nodeList) {
            if (node == tag) {
                break;
            } else {
                finalContent = node.innerHTML;
            }
        }

        tag.innerHTML = finalContent;
        tag.id = lastId;
    }
}


/**
 * Crates an element 
 * @param {String} message
 */
function logError(message) {
    errors.push(message);
}


/**
 * Creates an element on the page so that cowtchoox can show the errors in the log
 */
function createErrorElement() {
    let el = document.createElement("div");
    el.id = "cowtchoox-error-reporter"
    el.style.display = "none";
    el.textContent = errors.join("\0");

    document.body.appendChild(el);
}

