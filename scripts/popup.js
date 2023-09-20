const priceSection = document.querySelector('#price-section');
const getCostButton = document.querySelector('#get-cost-button');
const submitButton = document.querySelector('#submit-button');




const formStateModelCourier = (name) => {
    return {
        set(obj, prop, value) {
            const startInput = document.querySelector(`#${name}-start`);
            const endInput = document.querySelector(`#${name}-end`);


            if (prop === "start") startInput.value = value;
            else if (prop === "end") endInput.value = value;

            obj[prop] = value;
        }
    }
}



const formState = {
    luke: new Proxy({
        start: null,
        end: null,
    }, formStateModelCourier("luke")),
    bea: new Proxy({
        start: null,
        end: null,
    }, formStateModelCourier("bea")),
    amelia: new Proxy({
        start: null,
        end: null,
    }, formStateModelCourier("amelia")),
    gary: new Proxy({
        start: null,
        end: null,
    }, formStateModelCourier("gary")),
}

const validPerson = (person) => {
    console.log(`${person.start} - ${person.end}`)
    if (person.start && person.end) return true;
    if (!person.start && !person.end) return true;
    return false
}

const isFormValid = () => {
    // Needs to check start date is before end date
    if (!validPerson(formState.luke)) return false;
    if (!validPerson(formState.bea)) return false;
    if (!validPerson(formState.amelia)) return false;
    if (!validPerson(formState.gary)) return false;

    return true;
}


// Set up form actions
Object.keys(formState).forEach((name) => {
    // Needs to set input ranges as last month
    const clearButton = document.querySelector(`#${name}-clear-button`);
    const startInput = document.querySelector(`#${name}-start`);
    const endInput = document.querySelector(`#${name}-end`);

    clearButton.addEventListener("click", () => {
        formState[name].start = null;
        formState[name].end = null;
    });

    startInput.addEventListener("input", (event) => {
        event.preventDefault();
        formState[name].start = event.target.value;
    });

    endInput.addEventListener("input", (event) => {
        event.preventDefault();
        formState[name].end = event.target.value;
    })
});






getCostButton.addEventListener('click', async () => {
    chrome.tabs.query({active: true}, async (tabs) => {
        const price = await chrome.tabs.sendMessage(tabs[0].id, {action: "getPrice"})
        if(price) setPrice(price)
    })
})

submitButton.addEventListener('click', async () => {
    console.log(isFormValid())
});







let price = null;
const setPrice = (price) => {
    const priceDisplay = document.createElement('h2');
    priceDisplay.innerHTML = price;

    priceSection.removeChild(getCostButton);
    priceSection.appendChild(priceDisplay);

    //parse price string and set price
}









console.log("Popup script")