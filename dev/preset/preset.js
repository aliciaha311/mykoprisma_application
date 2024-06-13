//mushroom object
function Mushroom(number, name, tempLow, tempHigh, humidLow, humidHigh, co2, light) {
    this.number = number;
    this.name = name;
    this.tempLow = tempLow;
    this.tempHigh = tempHigh;
    this.humidLow = humidLow;
    this.humidHigh = humidHigh;
    this.co2 = co2;
    this.light = light;
}

var mushroomList = [];

// Function to fetch and parse the JSON file
async function fetchPresetList() {
    try {
        const response = await fetch('./presetlist.json');
        // Dynamically set Content-Type header to ensure correct parsing
        const data = await response.json();

        const list = data.map(mushroomData => {
            return new Mushroom(
                mushroomData.number + 1,
                mushroomData.name,
                mushroomData.tempLow,
                mushroomData.tempHigh,
                mushroomData.humidLow,
                mushroomData.humidHigh,
                mushroomData.co2,
                mushroomData.light
            );
        });

        console.log("Current list: ", list);

        return list;
    } catch (error) {
        console.error('Error fetching presetlist.json:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Call the function to fetch the mushroom list
    fetchPresetList().then(result => {
        // Now you can use the mushroomList in your code
        mushroomList = result;

        let mushroomContainer = document.getElementById('preset-container');

        if (mushroomContainer){
            mushroomList.forEach((mushroom, index) => {
                let mushroomDiv = document.createElement('div');
                mushroomDiv.id = 'preset-div';
    
                mushroomDiv.classList.add('selectable'); // Add a class for styling
    
                // Add an event listener for the click event
                mushroomDiv.addEventListener('click', () => {
                    document.querySelectorAll('#preset-div').forEach(div => {
                        div.classList.remove('selected');
                    });

                    // Toggle the 'selected' class on click
                    mushroomDiv.classList.toggle('selected');
                });

                document.getElementById('set-button').addEventListener('click', () =>{
                    if (mushroomDiv.classList.contains('selected')){
                        setPresetInMain(mushroomList[index]);
                    }
                });
    
                mushroomDiv.innerHTML = `
                    <div class="preset-grid">
                        <div class="preset-index-name-grid">
                            <div id="index">
                                <p>${index+1}</p>
                            </div>
                            <div id="preset-name">
                                <p>${mushroom.name.toUpperCase()}</p>
                            </div>
                        </div>
                        <div class="preset-measurement-grid">
                            <div id="temp-humid-grid">
                                <div class="measurement-label">
                                    <p>TEMPERATURE</p>
                                    <p>HUMIDITY</p>
                                </div>
                                <div class="measurement-value">
                                    <p>${mushroom.tempLow}-${mushroom.tempHigh}&degF</p>
                                    <p>${mushroom.humidLow}-${mushroom.humidHigh}%</p>
                                </div>
                            </div>
                            <div id="co2-light-grid">
                                <div class="measurement-label">
                                    <p>CO<sub>2</sub></p>
                                    <p>LIGHT</p>
                                </div>
                                <div class="measurement-value">
                                    <p>&gt;${mushroom.co2} ppm</p>
                                    <p>${mushroom.light} hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                mushroomContainer.appendChild(mushroomDiv);
            });
        } else {
            console.warn('Element with ID "preset-container" not found.');
        }
    });
});

/*
// Function to update the JSON file
//todo later...
async function updateJsonFile(updatedList) {
    try {
        const response = await fetch('/presetlist.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedList)
        });

        const jsonData = await response.json();
        console.log('Updated JSON:', jsonData);

        if (response.ok) {
            console.log('JSON file updated successfully.');
        }
        else if (!response.ok) {
            console.log('Failed to update JSON file. Status:' + response.status);
        }
        else {
            console.error('Failed to update JSON file.');
        }
    } catch (error) {
        console.error('Error updating JSON file:', error);
    }
}

// Function to add a new preset to the list
export function addPreset(name, tempLow, tempHigh, humidLow, humidHigh, co2, light) {
    console.log("In addPreset");
    // Create a new Mushroom object
    const newMushroom = new Mushroom(
        mushroomList.length, // Number based on the length of the list
        name,
        tempLow,
        tempHigh,
        humidLow,
        humidHigh,
        co2,
        light
    );

    // Add the new mushroom to the list
    mushroomList.push(newMushroom);
    console.log("After push:", mushroomList);

    // Update the JSON file
    updateJsonFile(mushroomList);
    console.log("updateJsonFile called");
}

function deletePreset(index) {
    // Check if the index is valid
    if (index >= 0 && index < mushroomList.length) {
        // Remove the mushroom at the specified index
        mushroomList.splice(index, 1);

        // Update the JSON file
        updateJsonFile(mushroomList);

        mushroomList.forEach(mushroom => {
            if (mushroom.number > 3){
                mushroom.number -= 1;
            }
        });

    } else {
        console.error('Invalid index for deletion.');
    }
}
*/

async function setPresetInMain(mushroomSelected){
    const mushroomToWrite = {
        tempLow: mushroomSelected.tempLow,
        tempHigh: mushroomSelected.tempHigh,
        humidLow: mushroomSelected.humidLow,
        humidHigh: mushroomSelected.humidHigh,
        //add co2Low later
        co2: mushroomSelected.co2,
        light: mushroomSelected.light
    };

    //we need high and low temp, high and low humidity later
    const mushroomPreset = {
        presetHumidityL: mushroomToWrite.humidLow,
        presetHumidityH: mushroomToWrite.humidHigh,
        presetCo2L: 40,
        presetC2H: mushroomToWrite.co2,
        presetTemperatureL: mushroomToWrite.tempLow,
        presetTemperatureH: mushroomToWrite.tempHigh,
        presetBlueLight: mushroomToWrite.light,
        presetUVLight: mushroomToWrite.light
    }

    await fetch('http://mykoprisma.com:3603/setPreset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mushroomPreset)
    });

    console.log("Done!");
}