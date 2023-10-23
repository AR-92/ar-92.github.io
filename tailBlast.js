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

document.addEventListener("alpine:init", () => {
    Alpine.data("tailBlast", () => {
        return {
            backgroundColor: "bg-white",
            mainCode: "",
            insert: "",
            showBlast: true,
            mainMenu: false,
            projectMenu: false,
            editor: false,
            isDragging: false,
            dragIndex: null,
            fullScreen: false,
            darkMode: false,
            searchInput: false,
            editInput: false,
            fileInput: false,
            elementInput: false,
            openInsertion: false,
            currentItem: {},
            currentItemCopyed: {},
            selectedItem: {},
            element: {},
            attNameRef: "",
            attValueRef: "",
            rename: {},
            itemStack: [],
            top: 10,
            left: 10,
            xOffset: 0,
            yOffset: 0,
            redoArray: [],
            undoArray: [],
            root: {
                id: Date.now(),
                name: "Home",
                children: [],
                content: null,
                isFolder: true,
                base: true,
            },
            notification: {
                show: false,
                type: "",
                header: "",
                body: "",
            },
            renderCode: {},
            startDragging(event) {
                this.isDragging = true;
                this.xOffset = event.clientX - this.left;
                this.yOffset = event.clientY - this.top;
            },
            dragging(event) {
                if (this.isDragging) {
                    this.top = event.clientY - this.yOffset;
                    this.left = event.clientX - this.xOffset;
                    localStorage.setItem("top", this.top);
                    localStorage.setItem("left", this.left);
                }
            },
            openBlast() {
                this.closeAll();
                this.isDragging = false;
                this.mainMenu = true;
                this.updateNavState();
            },
            openProjectMenu() {
                this.closeAll();
                this.projectMenu = !this.projectMenu;
                localStorage.setItem("showBlast", this.showBlast);
                localStorage.setItem("mainMenu", this.mainMenu);
                localStorage.setItem("projectMenu", this.projectMenu);
                console.log("openProjectMenu");
            },
            applyFullscreen() {
                if (this.fullScreen === true) {
                    document.webkitExitFullscreen();
                    this.fullScreen = false;
                } else {
                    document.documentElement.webkitRequestFullscreen();
                    this.fullScreen = true;
                }
            },
            applyMode() {
                this.undoArray.push({
                    new: !this.darkMode,
                    old: this.darkMode,
                    obj: "darkMode",
                });
                this.darkMode = !this.darkMode;
                var m = "";
                if (this.darkMode) {
                    m = "Dark Mode is Enabled !";
                } else {
                    m = "Dark Mode is Disabled !";
                }
                this.notify("success", "Dark Mode", m);
                localStorage.setItem("darkMode", this.darkMode);
            },
            applybg(value) {
                this.undoArray.push({
                    new: value,
                    old: this.backgroundColor,
                    obj: "backgroundColor",
                });
                this.backgroundColor = value;
                this.notify(
                    "success",
                    "Change Background Color !",
                    `Background Color is Set To ${this.backgroundColor}`
                );
                localStorage.setItem("backgroundColor", this.backgroundColor);
            },
            undo() {
                if (this.undoArray.length > 0) {
                    const lastChange = this.undoArray.pop();
                    console.log("undo", lastChange);
                    this[lastChange.obj] = lastChange.old;
                    this.redoArray.push({
                        new: lastChange.old,
                        old: lastChange.new,
                        obj: lastChange.obj,
                    });
                    this.notify("warning", "Undo", `${lastChange.obj} was changed`);
                }
            },
            redo() {
                if (this.redoArray.length > 0) {
                    const lastChange = this.redoArray.pop();
                    console.log("redo", lastChange);
                    this[lastChange.obj] = lastChange.old;
                    this.undoArray.push({
                        new: lastChange.old,
                        old: lastChange.new,
                        obj: lastChange.obj,
                    });
                    this.notify("warning", "Redo", `${lastChange.obj} was changed`);
                }
            },
            change() {
                console.log(this.mainCode)

                this.render(this.currentItem.children);
                localStorage.setItem('root', JSON.stringify(this.root));
                document.addEventListener("keydown", (event) => {
                    if (event.ctrlKey && event.key === "z") {
                        this.undo();
                    }
                    if (event.ctrlKey && event.key === "y") {
                        this.redo();
                    }
                    if (event.shiftKey && event.key === "D") {
                        this.applyMode();
                    }
                    if (event.shiftKey && event.key === "O") {
                        this.openProjectMenu();
                    }
                });
            },
            notify(type, header, body) {
                this.notification = {
                    show: true,
                    type,
                    header,
                    body,
                };
                setTimeout(() => {
                    this.notification.show = false;
                }, 5000);
            },
            mainClose() {
                this.closeAll();
                this.showBlast = true;
                this.updateNavState();
            },
            projectClose() {
                this.closeAll();
                this.showBlast = true;
                this.updateNavState();
            },
            backtomainMenu() {
                this.closeAll();
                this.mainMenu = true;
                this.updateNavState();
            },
            closeAll() {
                this.showBlast = false;
                this.mainMenu = false;
                this.projectMenu = false;
                this.editor = false;
            },
            updateNavState() {
                localStorage.setItem("showBlast", this.showBlast);
                localStorage.setItem("mainMenu", this.mainMenu);
                localStorage.setItem("projectMenu", this.projectMenu);
            },
            getNavState() {
                this.backgroundColor = localStorage.getItem("backgroundColor") ?? "bg-white";
                this.darkMode =
                    JSON.parse(localStorage.getItem("darkMode")) ?? false;
                this.top = localStorage.getItem("top") ?? "10";
                this.left = localStorage.getItem("left") ?? "10";
                this.showBlast =
                    JSON.parse(localStorage.getItem("showBlast")) ?? true;
                this.mainMenu =
                    JSON.parse(localStorage.getItem("mainMenu")) ?? false;
                this.projectMenu =
                    JSON.parse(localStorage.getItem("projectMenu")) ?? false;
                console.log("getNAvstate function");
            },
            getData() {
                this.root = JSON.parse(localStorage.getItem('root')) ?? this.root;
                this.currentItem = this.root;
                this.getNavState();
            },
            closeInsertion() {
                this.searchInput = false;
                this.fileInput = false;
                this.elementInput = false;
                this.openInsertion = false;
                this.editInput = false;
            },
            getItemValue(el) {
                console.log('createItem', this.insert, el.getAttribute('name'));
                if (el.getAttribute('name') === 'project') {
                    if (this.insert.includes(".html")) {
                        this.currentItem.children.push({
                            id: Date.now(),
                            name: this.insert,
                            children: [],
                            isFile: true,
                        });
                        this.notify(
                            "success",
                            "File Added !",
                            `File item is added ${this.insert}`
                        );
                        this.insert = '';

                        localStorage.setItem('root', JSON.stringify(this.root));

                        return;
                    }
                    this.currentItem.children.push({
                        id: Date.now(),
                        name: this.insert,
                        children: [],
                        isFolder: true,
                    });
                    this.notify(
                        "success",
                        "Folder Added !",
                        `Folder item is added ${this.insert}`
                    );
                    this.insert = '';

                    console.log("project created");
                }
                if (el.getAttribute('name') === 'element') {
                    this.currentItem.children.push({
                        name: this.insert,
                        children: [],
                        classes: [],
                        attributes: [],
                        content: "",
                        isElement: true,
                        id: Date.now(),
                    });
                    console.log("element created")
                    this.notify(
                        "success",
                        "Element Added !",
                        `Element item is added ${this.insert}`
                    );
                    this.insert = '';

                    localStorage.setItem('root', JSON.stringify(this.root));

                    return
                }
                if (el.getAttribute('name') === 'rename') {
                    this.rename.name = this.insert;
                    this.notify(
                        "warning",
                        "Renamed Item !",
                        `Item is renamed ${this.insert}`
                    );
                    this.insert = '';

                    localStorage.setItem('root', JSON.stringify(this.root));

                    return
                }
                if (el.getAttribute('name') === 'search') {
                    this.searchItemByName(this.insert)
                    console.log("search created")
                }
                console.log("this is the data >> ", this.root)
                localStorage.setItem('root', JSON.stringify(this.root));

            },
            currentlySelected(f) {
                this.selectedItem = f;
                console.log("currently selected >", f)
            },
            navto(f) {
                this.itemStack.push(this.currentItem);
                this.currentItem = f;
                console.log("navigate to >", f)
            },
            navBack() {
                if (this.itemStack.length > 0) {
                    this.currentItem = this.itemStack.pop();
                } else {
                    console.log("You are already at the root.");
                }
            },
            pastInItem(f) {
                var o = JSON.parse(JSON.stringify(this.currentItemCopyed)); // Creates a deep copy
                o.id = Date.now() + Math.floor(Math.random() * 1000);
                f.children.push(o);
                console.log('past item here in +', f);
                this.notify(
                    "success",
                    "Pasted Item !",
                    `Item is paseted ${this.currentItemCopyed.name}`
                );
            },
            deleteAll(f) {
                this.currentItem.children = []
                console.log('delete all childern -', f)
                this.notify(
                    "error",
                    "Deleted Items !",
                    `All Items are deleted from ${this.currentItem.name}`
                );
            },
            renameItem(f) {
                this.closeInsertion()
                this.openInsertion = true;
                this.editInput = true;
                this.rename = f;
                this.insert = f.name
                console.log("rename this item >", f)

            },
            deleteItem(index) {
                this.currentItem.children.splice(index, 1);
            },
            copyItem(f) {
                this.currentItemCopyed = f;
                console.log("copy this item >", this.currentItemCopyed);
                this.notify(
                    "success",
                    "Copied Item !",
                    `Item is copied  ${this.currentItemCopyed.name}`
                );
            },
            searchItemByName(name) {
                this.itemStack.push(this.currentItem);
                this.currentItem = searchFile(this.root, name);
                console.log("search item result?", this.currentItem, this.itemStack)
            },
            openEditor(f) {
                this.closeAll();
                this.editor = true;
                this.element = f;
                if (this.currentItem.isFile !== undefined) {
                    this.render(this.currentItem.children);
                };
                console.log("this element", this.element, f)
            },
            processElement(element) {
                let elementString = `<${element.name} id="${element.id}"`;

                // Add attributes
                for (const attribute of element.attributes) {
                    elementString += ` ${attribute.name}="${attribute.value}"`;
                }

                // Add classes
                if (element.classes.length > 0) {
                    elementString += ` class="hoverable ${element.classes.join(
                        " "
                    )}"`;
                }
                // elementString += `x-on:click='divopen(${element.id})'>`;

                elementString += ">";

                // Add content
                if (element.content) {
                    elementString += element.content;
                }

                // Process children
                for (const child of element.children) {
                    if (child.isElement) {
                        elementString += this.processElement(child);
                    } else {
                        elementString += child;
                    }
                }

                elementString += `</${element.name}>`;

                return elementString;
            },
            render(elements) {
                let htmlString = `<script src="./tw.js"></script>
                <script src="./tailwindConfig.js"></script>
                <link rel="stylesheet" href="./animate.css" />
                <link rel="stylesheet" href="./custom.css" />`;
                if (this.currentItem.isFile) {
                    this.renderCode = this.currentItem.children;
                }
                if (this.currentItem.isFile || this.currentItem.isElement) {
                    // this.renderCode=this.currentItem
                    console.log('elements########', this.renderCode)
                    for (const element of this.renderCode) {
                        if (element.isElement) {
                            htmlString += this.processElement(element);
                        } else {
                            htmlString += element;
                        }
                    }
                    this.mainCode = htmlString;
                    console.log('this is render', this.mainCode, htmlString)
                }
                if (this.currentItem.isFolder) {
                    this.mainCode = htmlString;
                }
            },
            addClass(name) {
                if (name.value === "") return;
                this.element.classes.push(name.value);
                name.value = "";
                this.notify(
                    "success",
                    "Class Addedd !",
                    `Class is added To ${this.element.name}`
                );
            },
            removeClass(i) {
                this.element.classes.splice(i, 1);
                this.notify(
                    "success",
                    "Class Removed !",
                    `Class is removed from ${this.element.name}`
                );
            },
            addAttribute() {
                // console.log(name,value)
                this.element.attributes.push({
                    name: this.attNameRef,
                    value: this.attValueRef,
                });
                this.attNameRef = "";
                this.attValueRef = "";
                this.notify(
                    "success",
                    "Attribute is Added !",
                    `Attribute is added to ${this.element.name}`
                );
            },
            removeAttribute(i) {
                this.element.attributes.splice(i, 1);
                this.notify(
                    "success",
                    "Attribute is Removed !",
                    `Attribute is removed from ${this.element.name}`
                );
            },
            closeEditor() {
                this.closeAll();
                this.showBlast = true;
            },
            backProject() {
                this.closeAll();
                this.projectMenu = true;
            },
            dragover(index) {
                if (this.dragIndex !== null) {
                    moveArrayItem(
                        this.currentItem.children,
                        this.dragIndex,
                        index
                    )
                    this.dragIndex = index;
                }
            },
            downloadHTML() {
                const iframe = document.getElementById("pageContent");
                const iframeDocument = iframe.contentDocument;
                const iframeContent = iframeDocument.documentElement.outerHTML;

                // Create a Blob with the iframe content
                const blob = new Blob([iframeContent], { type: "text/html" });

                // Create a temporary anchor element to trigger the download
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = this.currentItem.name;
                a.style.display = "none";

                // Append the anchor to the document and trigger the download
                document.body.appendChild(a);
                a.click();

                // Clean up
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);

            }
        };
    });
});