async function updateImage(){  
    const data = {
        photoOverride: 1
    };

    await fetch('http://mykologic.com:3603/setPhoto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) //must fix this :<
    });

    console.log("Image changed!");
}

var button = document.getElementById("update-camera");
button.addEventListener("click", updateImage);