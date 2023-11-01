
import { 
    getDaysAway,
    getPayingDays,
    getTotalPayDays,
    getOwes,
    formatMoney,
    billsObjectToMessage,
    validPerson,
    getDaysInMonth,
    formatMonth,
} from "./popupModel.js";


export const WIFI_COST = 40;

const formStateModelCourier = (name) => {
    return {
        set(obj, prop, value) {
            const startInput = document.querySelector(`#${name}-start`);
            const endInput = document.querySelector(`#${name}-end`);

            
            if (prop === "start") {
                if (value === null) startInput.value = null;
                obj[prop] = value ? new Date(value) : null
            }
            else if (prop === "end") {
                if (value === null) endInput.value = null;
                obj[prop] = value ? new Date(value) : null;
            }
            else obj[prop] = value;
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

const isFormValid = () => {
    if (!priceValue) return false;
    if (!validPerson(formState.luke)) return false;
    if (!validPerson(formState.bea)) return false;
    if (!validPerson(formState.amelia)) return false;
    if (!validPerson(formState.gary)) return false;

    return true;
}

const getBillsObject = () => {
    return {
        bills: priceValue,
        wifi: WIFI_COST,
        total: priceValue + WIFI_COST,
        luke: {
            owes: getOwes(formState.luke),
            daysAway: getDaysAway(formState.luke)
        },
        bea: {
            owes: getOwes(formState.bea),
            daysAway: getDaysAway(formState.bea)
        },
        amelia: {
            owes: getOwes(formState.amelia),
            daysAway: getDaysAway(formState.amelia)
        },
        gary: {
            owes: getOwes(formState.gary),
            daysAway: getDaysAway(formState.gary)
        }
    }
}





const priceSection = document.querySelector('#price-section');
const getCostButton = document.querySelector('#get-cost-button');
const submitButton = document.querySelector('#submit-button');

let priceValue = null;
const setPrice = (price) => {
    const priceDisplay = document.createElement('h2');
    priceDisplay.innerHTML = price;

    priceSection.removeChild(getCostButton);
    priceSection.appendChild(priceDisplay);

    //parse price string and set price
    priceValue = Number(price.slice(1))
}



const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const lastMonth = currentMonth > 0 ? currentMonth - 1 : 11;
const daysInLastMonth = getDaysInMonth(lastMonth);

// Set up form actions
Object.keys(formState).forEach((name) => {
    const clearButton = document.querySelector(`#${name}-clear-button`)
    const startInput = document.querySelector(`#${name}-start`);
    const endInput = document.querySelector(`#${name}-end`);
    

    startInput.min = `${currentYear}-${formatMonth(lastMonth + 1)}-01`;
    startInput.max = `${currentYear}-${formatMonth(lastMonth + 1)}-${daysInLastMonth}`;
    endInput.min = `${currentYear}-${formatMonth(lastMonth + 1)}-01`;
    endInput.max = `${currentYear}-${formatMonth(lastMonth + 1)}-${daysInLastMonth}`;


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
    if (!isFormValid()) {
        alert("Invalid form state")
        return
    };
    

    const billsObject = getBillsObject()
    await navigator.clipboard.writeText(billsObjectToMessage(billsObject))
    window.open("https://www.messenger.com/t/5397372580384173")
})