function pageloadUploaded() {
    $('#textAreaForOutput').text(ocrText);

    //disable button if device is not mobile & applicable for Share Btn
    // if(!navigator.share) {
    //     $('#shareBtn').attr("disabled", true);	

    //     setTimeout(() => {
    //         $('#shareButtonTooltip').animate({ opacity: 1 }, { duration: 500 });
    //     }, 1500);
    // }
}

function shareText() {
    let sharePromise = window.navigator.share({
        title: 'simpleOCR output',
        text: $('#textAreaForOutput').text(),
    });

    console.log(sharePromise);
}

function copyToClipboard() {
    const toCopy = document.getElementById('textAreaForOutput');

    toCopy.select();

    // needed for some devices
    try {
        toCopy.setSelectionRange(0, 99999);
    } catch (e) {
        // ...
    }
    document.execCommand("copy");


    // generate pop up

    $('#copiedPopup').animate({ opacity: 1 }, { duration: 100 });

    setTimeout(() => {
        $('#copiedPopup').animate({ opacity: 0 }, { duration: 500 });
    }, 1000);
}

function checkIfDeviceIsMobile() {
    if((navigator.appName=='Netscape') && (navigator.appCodeName=='Mozilla') && (navigator.platform=='MacIntel' || navigator.platform=='Linux armv8l')) {
        if (window.matchMedia("(max-device-width: 600px)").matches) {
            return true;
        }
        else if ((window.matchMedia("(device-width: 768px)").matches) || (window.matchMedia("(device-width: 834px)").matches) || (window.matchMedia("(device-width: 1024px)").matches)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}