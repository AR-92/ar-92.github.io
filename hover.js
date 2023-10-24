const elementsWithIDs = document.querySelectorAll('[id]');
const MAX_CLOSEST_DIVS = 5;
const closestDivs = [];

elementsWithIDs.forEach(element => {
    element.addEventListener('mouseenter', function (event) {
        if (closestDivs.length < MAX_CLOSEST_DIVS) {
            closestDivs.push(this);
            this.style.border = '1px dashed red';
        } else {
            const furthestDiv = closestDivs.shift();
            furthestDiv.removeAttribute('style');
            closestDivs.push(this);
            this.style.border = '1px dashed red';
        }
        event.stopPropagation();
    });

    element.addEventListener('mouseleave', function (event) {
        const index = closestDivs.indexOf(this);
        if (index !== -1) {
            closestDivs.splice(index, 1);
            this.removeAttribute('style');
        }
        event.stopPropagation();
    });

    element.addEventListener('click', function (event) {
        const eventData = { id: this.id };
        console.log('Element clicked:', this.id, eventData);

        window.parent.postMessage({
            type: 'CustomEventFromIframe',
            data: eventData,
        }, '*');
        event.stopPropagation();
    });
});


// Function to save the scroll position when the page unloads
window.addEventListener('beforeunload', function () {
    localStorage.setItem('scrollPosition', window.scrollY);
});

// Function to restore the scroll position when the page loads
window.addEventListener('load', function () {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
    }
});

// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'tooltip flex flex-col gap-3';
document.body.appendChild(tooltip);

// Function to show element information in a tooltip
function showElementInfo(event) {
    const element = event.target;

    // Get element information
    const tagName = element.tagName.toLowerCase();
    // const classes = Array.from(element.classList).join(', ');
    const attributes = Array.from(element.attributes).map(attr => `<div>${attr.name}="${attr.value}"</div>`).join(' ');
    // Set the tooltip content
    tooltip.innerHTML = `${tagName} ${attributes}`;

    // Position the tooltip
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 30) + 'px';

    // Show the tooltip
    tooltip.style.display = 'block';
}

// Function to hide the tooltip
function hideElementInfo() {
    tooltip.style.display = 'none';
}

// Attach event listeners to all elements on the page
const elements = document.querySelectorAll('*');
elements.forEach(element => {
    element.addEventListener('mouseover', showElementInfo);
    element.addEventListener('mouseout', hideElementInfo);
});



