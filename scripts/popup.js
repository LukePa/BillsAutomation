const WIFI_COST = 40;


const priceSection = document.querySelector('#price-section');
const getCostButton = document.querySelector('#get-cost-button');
const submitButton = document.querySelector('#submit-button');


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

let priceValue = null;
const setPrice = (price) => {
    const priceDisplay = document.createElement('h2');
    priceDisplay.innerHTML = price;

    priceSection.removeChild(getCostButton);
    priceSection.appendChild(priceDisplay);

    //parse price string and set price
    priceValue = Number(price.slice(1))
}

const validPerson = (person) => {
    if ((person.start && person.end) && (person.start.getDate() <= person.end.getDate())) return true;
    if (!person.start && !person.end) return true;
    return false
}

const isFormValid = () => {
    if (!priceValue) return false;
    if (!validPerson(formState.luke)) return false;
    if (!validPerson(formState.bea)) return false;
    if (!validPerson(formState.amelia)) return false;
    if (!validPerson(formState.gary)) return false;

    return true;
}

const getDaysInMonth = (dateIndex) => {
    if ([0, 2, 4, 7, 9, 11].includes(dateIndex)) {
        return 31;
    }

    if ([3, 5, 8, 10].includes(dateIndex)) {
        return 30;
    }

    if (dateIndex === 1) {
        // Does not currently support leap years
        return 28;
    }

    throw new Error('Date index is out of range')
}

const formatMonth = (month) => {
    const monthStr = month.toString();
    if (monthStr.length === 1) return `0${monthStr}`
    else return monthStr
}

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth();
const lastMonth = currentMonth > 0 ? currentMonth - 1 : 11;
const daysInLastMonth = getDaysInMonth(lastMonth);

// Set up form actions
Object.keys(formState).forEach((name) => {
    clearButton = document.querySelector(`#${name}-clear-button`)
    startInput = document.querySelector(`#${name}-start`);
    endInput = document.querySelector(`#${name}-end`);
    

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








const getDaysAway = (person) => {
    if (!person.start || !person.end) return 0;
    else return person.end.getDate() - (person.start.getDate() - 1)
}
const getPayingDays = (person) => {
    return daysInLastMonth - getDaysAway(person)
}
const getTotalPayDays = () => {
    return getPayingDays(formState.luke) + getPayingDays(formState.bea) + getPayingDays(formState.gary) + getPayingDays(formState.amelia);
}
const individualBillSplit = (person) => {
    return priceValue * (getPayingDays(person) / getTotalPayDays(person))
}
const getOwes = (person) => {
    return (WIFI_COST / 4) + individualBillSplit(person)
}


const formatMoney = (amount) => {
    return `${amount.toFixed(2)}`
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

const billsObjectToMessage = (billsObject) => {
    let message = "BILLS\n";
    message += `Utilities total: ${formatMoney(billsObject.bills)}\n`;
    message += `Wifi total: ${formatMoney(billsObject.wifi)}\n`;
    message += "\n";
    let awayAdded = false;

    ["Luke", "Bea", "Amelia", "Gary"].forEach((name) => {
        if (billsObject[name.toLowerCase()].daysAway > 0) {
            message += `${name} was away for ${billsObject[name.toLowerCase()].daysAway} days\n`
            awayAdded = true;
        }
    })

    if (awayAdded) message += "\n";
    message += "TOTALS TO PAY\n";

    ["Luke", "Bea", "Amelia", "Gary"].forEach((name) => {
        message += `${name}: ${formatMoney(billsObject[name.toLowerCase()].owes)}\n`
    })

    message += "\nPlease send a message when you have paid, thanks!"
    message += "\n(This is an auto generated message cause I'm cool like that)"

    return message;
}

submitButton.addEventListener('click', async () => {
    if (!isFormValid()) {
        alert("Invalid form state")
        return
    };
    

    const billsObject = getBillsObject()
    await navigator.clipboard.writeText(billsObjectToMessage(billsObject))
    window.open("https://www.messenger.com/t/5397372580384173")
})