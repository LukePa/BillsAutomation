
console.log("content script")




chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getPrice") {
        const priceParagraph = document.querySelector('.MuiTypography-root.MuiTypography-h3.MuiTypography-paragraph.uw-cwui-Typography-primary.css-l1vi3a');
        sendResponse(String(priceParagraph.innerHTML))
    }
})