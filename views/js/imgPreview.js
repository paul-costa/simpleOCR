function loadImgPreview() {
    const backgroundImageUrl = `./css/${imgName}`;

    setTimeout(() => {
        $('#imagePicContainer').animate({ opacity: 1 }, { duration: 1000 });
        
        $('#imagePicContainer').css('background-image', `url('${backgroundImageUrl}')`);
    }, 100);
}


function submitImage() {
    $('#loadingSpinner').css('display', 'inline-block');
    $('#loadingSpinner').animate({ opacity: 1 }, { duration: 500 });
    $('#formSubmitButton').click();
}

function rotateImg(direction) {
    let angle=0;
    let rotationToRight=0;

    switch ($('#imagePicContainer').css('transform')) {
        case 'matrix(1, 0, 0, 1, 0, 0)':
            angle=90;
            break;
        
        case 'matrix(6.12323e-17, 1, -1, 6.12323e-17, 0, 0)': case 'matrix(6.12323e-17, -1, 1, 6.12323e-17, 0, 0)':
            angle=180;
            break;

        case 'matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)': case 'matrix(-1, -1.22465e-16, 1.22465e-16, -1, 0, 0)':
            angle=270;
            break;

        case 'matrix(-1.83697e-16, -1, 1, -1.83697e-16, 0, 0)':
            angle=0;
            break;
    
        default:
            break;
    }

    if(direction=='right') {
        angle=(angle)*(1);
    } 
    else if (direction=='left') {
        angle=(angle)*(-1);
    }

    switch (angle) {
        case 0: case -0:
            rotationToRight=0;
            break;
        case 90: case -270:
            rotationToRight=90;
            break;
        case 180: case -180:
            rotationToRight=180;
            break;
        case 270: case -90:
            rotationToRight=270;
            break;
    
        default:
            rotationToRight=0;
            break;
    }

    $('#rotationToRight').val(rotationToRight);
    $('#imagePicContainer').css('transform', `rotate(${angle}deg)`);
}