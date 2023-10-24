const elementsWithIDs = document.querySelectorAll('[id]');

// Add hover effect for elements with specific IDs
elementsWithIDs.forEach(element => {
    element.addEventListener('mouseover', function () {
        this.classList.add('red-border-on-hover');
    });

    element.addEventListener('mouseout', function () {
        this.classList.remove('red-border-on-hover');
    });

    element.addEventListener('click', function (event) {
        // Remove the hover effect from other elements
        elementsWithIDs.forEach(el => {
            if (el !== this) {
                el.classList.remove('red-border-on-hover');
            }
        });
        const eventData = { id: this.id };
        window.parent.postMessage({
            type: 'CustomEventFromIframe',
            data: eventData,
        }, '*');

        // console.log('Element clicked:', this.id);
        event.stopPropagation(); // Prevent the click event from bubbling up
    });
});




