function selectFileForInput() {    
    $('#takePictureIcon').animate({
        width: '-=1em'
    },50);
    $('#takePictureIcon').animate({
        width: '+=1em'
    },200);

    setTimeout(() => {
        $('#pictureInput').click();        
    }, 250);
}


function submitForm() {
    $('#formSubmitButton').click();
}