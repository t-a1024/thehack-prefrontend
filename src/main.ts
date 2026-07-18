const classElement = document.querySelector(".class")!;

classElement.addEventListener("pointerdown", () => {
    classElement.classList.add("dragging");
});

window.addEventListener("pointerup", () => {
    classElement.classList.remove("dragging");
});