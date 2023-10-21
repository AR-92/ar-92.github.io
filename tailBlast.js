document.addEventListener("alpine:init", () => {
    Alpine.data("tailBlast", () => {
        return {
            bgColor: "bg-white",
            mainCode: "",
            showBlast: true,
            mainMenu: false,
            projectMenu: false,
            isDragging: false,
            fullScreen: false,
            darkMode: false,
            top: 10,
            left: 10,
            xOffset: 0,
            yOffset: 0,
            redoArray: [],
            undoArray: [],
            notification: {
                show: false,
                type: "",
                header: "",
                body: "",
            },
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
                    old: this.bgColor,
                    obj: "bgColor",
                });
                this.bgColor = value;
                this.notify(
                    "success",
                    "Change Background Color !",
                    `Background Color is Set To ${this.bgColor}`
                );
                localStorage.setItem("bgColor", this.bgColor);
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
                console.log("change >>> ", this.bgColor);
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
            },
            updateNavState() {
                localStorage.setItem("showBlast", this.showBlast);
                localStorage.setItem("mainMenu", this.mainMenu);
                localStorage.setItem("projectMenu", this.projectMenu);
            },
            getNavState() {
                this.bgColor = localStorage.getItem("bgColor") ?? "bg-white";
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
                this.getNavState();
            },
        };
    });
});