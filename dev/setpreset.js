// Function to fetch and parse the JSON file
async function fetchPreset() {
    try {
        const response = await fetch('http://mykoprisma.com:3603/getPreset');
        // Dynamically set Content-Type header to ensure correct parsing
        const data = await response.json();

        console.log("Current preset: ", data);
        setPreset(data);
    } catch (error) {
        console.error('Error fetching preset.json:', error);
        return [];
    }
}

function setPreset(mushroom){
    if (mushroom){
        console.log("setPreset() retrieved mushroom: ", mushroom);

        let tempLowC = (mushroom.presetTemperatureL - 32) * 5 / 9;
        let tempHighC = (mushroom.presetTemperatureH - 32) * 5 / 9;
        //18-20 &degC / 65-68 &degF
        document.getElementById('desiredTemp').innerText = "Desired: " +
            mushroom.presetTemperatureL + "-" + mushroom.presetTemperatureH + " \u00B0F / "
                + tempLowC.toFixed(0) + "-" + tempHighC.toFixed(0) + " \u00B0C";
        document.getElementById('desiredHumid').innerText = "Desired: " +
            mushroom.presetHumidityL + "-" + mushroom.presetHumidityH + "%";
        document.getElementById('desiredCO2').innerText = "Desired:  " +
            mushroom.presetCo2L + " - " + mushroom.presetC2H + " ppm";
        //document.getElementById("mushroom-type").innerText = mushroom.name.toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchPreset();
});