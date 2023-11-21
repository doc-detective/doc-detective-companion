let eventsLogged = [];

function logEvent(event) {
    let eventData = {
        eventType: event.type,
        element: event.target.tagName,
        id: event.target.id,
        class: event.target.className,
        additionalInfo: {}
    };

    switch (event.type) {
        case 'keydown':
        case 'keyup':
        case 'keypress':
            eventData.additionalInfo.key = event.key;
            break;
        case 'click':
        case 'dblclick':
        case 'mousedown':
        case 'mouseup':
            eventData.additionalInfo.mouseButton = event.button;
            eventData.additionalInfo.clientX = event.clientX;
            eventData.additionalInfo.clientY = event.clientY;
            break;
        case 'touchstart':
        case 'touchmove':
        case 'touchend':
            eventData.additionalInfo.touches = event.touches.length;
            break;
        // Add more cases for other events as needed
    }

    eventsLogged.push(eventData);
}

// List of events to listen for
const eventsToTrack = ['click', 'dblclick', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress', 'touchstart', 'touchmove', 'touchend'];

eventsToTrack.forEach(eventType => {
    document.addEventListener(eventType, logEvent);
});

// Function to view the logged events
function viewLoggedEvents() {
    console.log(eventsLogged);
}
