
import { 
    Person,
    Bills,
    getMonthStringFromInt
} from "./popupModel.js";


export const WIFI_COST = 40;

const luke = new Person("Luke");
const amelia = new Person("Amelia");
const bea = new Person("Bea");
const gary = new Person("Gary");


const bills = new Bills([luke, amelia, bea, gary], WIFI_COST);



class BillsViewFactory {
    constructor(bills) {
        this.bills = bills;
    }

    createFullForm() {
        const container = document.createElement("div");
        container.append(this.createUtilityCostInput());
        container.append(this.createMonthSelect());
        container.append(this.createPeopleForm());
        container.append(this.createGenerateMessageButton());
        return container;
    }

    createUtilityCostInput() {
        const container = document.createElement("div");
        const label = document.createElement("label");
        label.innerHTML = "Utility Cost: ";
        container.append(label);
        const inputElement = document.createElement("input");
        inputElement.addEventListener("change", (e) => {
            this.bills.utilitiesCost = e.target.value;
        })
        container.append(inputElement);
        return container;
    }


    createPeopleForm() {
        const formElement = document.createElement("form");


        this.bills.people.forEach(person => {
            const factory = new PersonViewFactory(person);

            formElement.append(factory.createFormSection());
        });

        return formElement;
    }

    createGenerateMessageButton() {
        const button = document.createElement("button");
        button.innerHTML = "Generate Message";
        button.addEventListener("click", (e) => {
            e.preventDefault();
            this.bills.getMessageAndOpenMessenger();
            console.log(this.bills)
            console.log(this.bills.daysInMonth)
        });
        return button;
    }

    createMonthSelect() {
        const monthSelect = document.createElement("select");
        monthSelect.append(this.createMonthOption(1));
        monthSelect.append(this.createMonthOption(2));
        monthSelect.append(this.createMonthOption(3));
        monthSelect.append(this.createMonthOption(4));
        monthSelect.append(this.createMonthOption(5));
        monthSelect.append(this.createMonthOption(6));
        monthSelect.append(this.createMonthOption(7));
        monthSelect.append(this.createMonthOption(8));
        monthSelect.append(this.createMonthOption(9));
        monthSelect.append(this.createMonthOption(10));
        monthSelect.append(this.createMonthOption(11));
        monthSelect.append(this.createMonthOption(12));

        monthSelect.value = this.bills.month;

        monthSelect.addEventListener("change", (e) => {
            e.preventDefault();
            this.bills.month = e.target.value;
        })

        return monthSelect
        
    }

    createMonthOption(monthInt) {
        const monthString = getMonthStringFromInt(monthInt);
        const option = document.createElement("option");
        option.setAttribute("value", monthInt);
        option.innerHTML = monthString;
        return option;
    }
}


class PersonViewFactory {

    /**
     * @param {Person} person 
     */
    constructor(person) {
        this.person = person;
    }


    createFormSection = () => {
        const containingDiv = document.createElement('div');
        const nameText = document.createElement('span');
        nameText.innerHTML = this.person.name;
        
        const fromOption = this._createPersonDateOption("From");
        fromOption.addEventListener("change", (e) => {
            this.person.fromDate = e.target.value;
            e.stopPropagation();
        })
        const toOption = this._createPersonDateOption("To", "toDate");
        toOption.addEventListener("change", (e) => {
            this.person.toDate = e.target.value;
            e.stopPropagation();
        });
        

        containingDiv.append(nameText);
        containingDiv.append(fromOption);
        containingDiv.append(toOption);


        return containingDiv;
    }

    /**
     * 
     * @param {String} label 
     */
    _createPersonDateOption(labelText) {
        const container = document.createElement('div');
        container.classList.add("space-apart")

        const label = document.createElement('label');
        label.innerHTML = labelText;
        container.append(label);

        const option = document.createElement('input');
        option.setAttribute('type', 'date');
        container.append(option);


        return container;
    }
}

const factory = new BillsViewFactory(bills);

const test = document.querySelector("body");
test.append(factory.createFullForm());





























// const formStateModelCourier = (name) => {
//     return {
//         set(obj, prop, value) {
//             const startInput = document.querySelector(`#${name}-start`);
//             const endInput = document.querySelector(`#${name}-end`);

            
//             if (prop === "start") {
//                 if (value === null) startInput.value = null;
//                 obj[prop] = value ? new Date(value) : null
//             }
//             else if (prop === "end") {
//                 if (value === null) endInput.value = null;
//                 obj[prop] = value ? new Date(value) : null;
//             }
//             else obj[prop] = value;
//         }
//     }
// }
// const formState = {
//     luke: new Proxy({
//         start: null,
//         end: null,
//     }, formStateModelCourier("luke")),
//     bea: new Proxy({
//         start: null,
//         end: null,
//     }, formStateModelCourier("bea")),
//     amelia: new Proxy({
//         start: null,
//         end: null,
//     }, formStateModelCourier("amelia")),
//     gary: new Proxy({
//         start: null,
//         end: null,
//     }, formStateModelCourier("gary")),
// }

// const isFormValid = () => {
//     if (!priceValue) return false;
//     if (!validPerson(formState.luke)) return false;
//     if (!validPerson(formState.bea)) return false;
//     if (!validPerson(formState.amelia)) return false;
//     if (!validPerson(formState.gary)) return false;

//     return true;
// }

// const getBillsObject = () => {
//     return {
//         bills: priceValue,
//         wifi: WIFI_COST,
//         total: priceValue + WIFI_COST,
//         luke: {
//             owes: getOwes(formState.luke),
//             daysAway: getDaysAway(formState.luke)
//         },
//         bea: {
//             owes: getOwes(formState.bea),
//             daysAway: getDaysAway(formState.bea)
//         },
//         amelia: {
//             owes: getOwes(formState.amelia),
//             daysAway: getDaysAway(formState.amelia)
//         },
//         gary: {
//             owes: getOwes(formState.gary),
//             daysAway: getDaysAway(formState.gary)
//         }
//     }
// }





// const priceSection = document.querySelector('#price-section');
// const getCostButton = document.querySelector('#get-cost-button');
// const submitButton = document.querySelector('#submit-button');

// let priceValue = null;
// const setPrice = (price) => {
//     const priceDisplay = document.createElement('h2');
//     priceDisplay.innerHTML = price;

//     priceSection.removeChild(getCostButton);
//     priceSection.appendChild(priceDisplay);

//     //parse price string and set price
//     priceValue = Number(price.slice(1))
// }



// const date = new Date();
// const currentYear = date.getFullYear();
// const currentMonth = date.getMonth();
// const lastMonth = currentMonth > 0 ? currentMonth - 1 : 11;
// const daysInLastMonth = getDaysInMonth(lastMonth);

// // Set up form actions
// Object.keys(formState).forEach((name) => {
//     const clearButton = document.querySelector(`#${name}-clear-button`)
//     const startInput = document.querySelector(`#${name}-start`);
//     const endInput = document.querySelector(`#${name}-end`);
    

//     startInput.min = `${currentYear}-${formatMonth(lastMonth + 1)}-01`;
//     startInput.max = `${currentYear}-${formatMonth(lastMonth + 1)}-${daysInLastMonth}`;
//     endInput.min = `${currentYear}-${formatMonth(lastMonth + 1)}-01`;
//     endInput.max = `${currentYear}-${formatMonth(lastMonth + 1)}-${daysInLastMonth}`;


//     clearButton.addEventListener("click", () => {
//         formState[name].start = null;
//         formState[name].end = null;
//     });

//     startInput.addEventListener("input", (event) => {
//         event.preventDefault();
//         formState[name].start = event.target.value;
//     });

//     endInput.addEventListener("input", (event) => {
//         event.preventDefault();
//         formState[name].end = event.target.value;
//     })
// });

// getCostButton.addEventListener('click', async () => {
//     chrome.tabs.query({active: true}, async (tabs) => {
//         const price = await chrome.tabs.sendMessage(tabs[0].id, {action: "getPrice"})
//         if(price) setPrice(price)
//     })
// })


// submitButton.addEventListener('click', async () => {
//     if (!isFormValid()) {
//         alert("Invalid form state")
//         return
//     };
    

//     const billsObject = getBillsObject()
//     await navigator.clipboard.writeText(billsObjectToMessage(billsObject))
//     window.open("https://www.messenger.com/t/5397372580384173")
// })