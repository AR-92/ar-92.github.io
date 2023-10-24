function findObjectById(root, id) {
    if (root.id == id) {
        console.log("Object found:", root);
        return root;
    }

    for (const child of root.children) {
        const result = findObjectById(child, id);
        if (result) {
            return result;
        }
    }

    if (root.children && root.children.length > 0) {
        for (const child of root.children) {
            const result = findObjectById(child, id);
            if (result) {
                return result;
            }
        }
    }

    return null; // Return null if the object with the specified id is not found
}
function findObjectByName(root, name) {
    if (root.name == name) {
        console.log("Object found:", root);
        return root;
    }

    for (const child of root.children) {
        const result = findObjectById(child, id);
        if (result) {
            return result;
        }
    }

    if (root.children && root.children.length > 0) {
        for (const child of root.children) {
            const result = findObjectById(child, id);
            if (result) {
                return result;
            }
        }
    }

    return null; // Return null if the object with the specified id is not found
}
function searchFile(root, fileName) {
    const threshold = 0.4; // Adjust the threshold as needed
    const matches = [];

    fileName = fileName.toLowerCase();
    const fileNameWords = fileName.split(" ");

    for (const item of root.children) {
        if (item.name) {
            const itemName = item.name.toLowerCase();
            const itemNameWords = itemName.split(" ");

            for (const nameWord of itemNameWords) {
                for (const searchWord of fileNameWords) {
                    const similarity = calculateSimilarity(
                        nameWord,
                        searchWord
                    );
                    if (similarity >= threshold) {
                        matches.push({ item, similarity });
                        break; // Found a match, move to the next item
                    }
                }
            }
        }
    }

    if (matches.length > 0) {
        matches.sort((a, b) => b.similarity - a.similarity); // Sort by similarity
        console.log(
            `Found similar files in "${fileName}":`,
            matches
        );
        var o = {
            id: Date.now(),
            name: `Search files in "${fileName}"`,
            children: [],
            content: null,
        };
        matches.forEach((match) => {
            o.children.push(match.item);
        });
        return o
    } else {
        console.log(
            `No similar files found in "${fileName}".`
        );
        return null
    }
}
function calculateSimilarity(word1, word2) {
    const maxLength = Math.max(word1.length, word2.length);
    const editDistance = calculateLevenshteinDistance(
        word1,
        word2
    );
    return 1 - editDistance / maxLength;
};
function calculateLevenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = new Array(m + 1)
        .fill(0)
        .map(() => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] =
                    1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}
function moveArrayItem(array, fromIndex, toIndex) {
    const item = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, item);
}
function getDate() {
    // Get the current date
    const currentDate = new Date();

    // Create an array of month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get the month, day, year, hour, minute, and second components
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();

    // Function to add 'st', 'nd', 'rd', or 'th' to the day
    function getDayWithOrdinal(day) {
        if (day >= 11 && day <= 13) {
            return day + 'th';
        }
        switch (day % 10) {
            case 1:
                return day + 'st';
            case 2:
                return day + 'nd';
            case 3:
                return day + 'rd';
            default:
                return day + 'th';
        }
    }

    // Function to format the time as AM/PM
    function formatAMPM(hours) {
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}-${ampm}`;
    }

    // Create the formatted date and time string
    const formattedDate = `${month}-${getDayWithOrdinal(day)}-${year}-${formatAMPM(hour)}`;

    console.log(formattedDate); // Output: "October-23rd-2023-7:47:35-pm"
    return formattedDate
}
function generateRandomAlphanumericId(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        id += charset.charAt(randomIndex);
    }

    return id;
}
function parseHtmlToJSObject(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const rootElement = doc.documentElement;

    function parseElement(element) {
        const obj = {
            id: generateRandomAlphanumericId(13),
            name: element.tagName.toLowerCase(),
            children: [],
            classes: Array.from(element.classList),
            attributes: Array.from(element.attributes).map(attribute => ({
                name: attribute.name,
                value: attribute.value
            })),
            content: "",
            isElement: true,
        };

        // Check if the element has an 'id' attribute and include it in the object
        // if (element.hasAttribute('id')) {
        //     obj.id = element.getAttribute('id');
        // }

        // If the element has child nodes, check and set the content property
        if (element.hasChildNodes()) {
            for (const child of element.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    obj.content += child.textContent.trim();
                }
            }
        }

        for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
            obj.children.push(parseElement(child));
        }

        return obj;
    }

    return parseElement(rootElement);
}
function pasteFromClipboard(value) {
    // Check if the Clipboard API is available in the current browser
    if (navigator.clipboard) {
        navigator.clipboard.readText()
            .then(text => {
                // 'text' contains the text from the clipboard
                // You can now use 'text' in your application
                var t = parseHtmlToJSObject(text);
                t=t.children[1].children[0];
                console.log('Pasted from clipboard: ', t);
                value.push(t)
                // return t
            })
            .catch(error => {
                console.error('Failed to paste from clipboard: ' + error);
            });
    }
}