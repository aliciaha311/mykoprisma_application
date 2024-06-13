const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const co2Element = document.getElementById('co2');
const actuator1StatusElement = document.getElementById('actuator1Status');
const actuator2StatusElement = document.getElementById('actuator2Status');
const actuator3StatusElement = document.getElementById('actuator3Status');
const actuator4StatusElement = document.getElementById('actuator4Status');
const actuator5StatusElement = document.getElementById('actuator5Status');

async function getLatestMeasurement() {
    const response = await fetch('http://mykologic.com:3603/getMeas');
    const data = await response.json();
    return data[data.length - 1];
}

async function updateDashboard(data) {
    const timestamps = data.map(measurement => new Date(measurement.timestamp));
    const temperatureData = data.map(measurement => measurement.temperature);
    const humidityData = data.map(measurement => measurement.humidity);
    const co2Data = data.map(measurement => measurement.co2);
    document.getElementById('actuator1Status').textContent = data.actuator1Status ? 'ON' : 'OFF';
    document.getElementById('actuator2Status').textContent = data.actuator2Status ? 'ON' : 'OFF';
    document.getElementById('actuator3Status').textContent = data.actuator3Status ? 'ON' : 'OFF';
    document.getElementById('actuator4Status').textContent = data.actuator4Status ? 'ON' : 'OFF';
    document.getElementById('actuator5Status').textContent = data.actuator5Status ? 'ON' : 'OFF';
}

async function updateUI(latestMeasurement) {
    const {
        temperature,
        humidity,
        co2,
        //waterLevel,
        actuator1Status,
        actuator2Status,
        actuator3Status,
        actuator4Status,
        actuator5Status
    } = latestMeasurement;

    const temperatureF = temperature * 9 / 5 + 32;

    if (humidity > 0) {
        temperatureElement.textContent = `${temperatureF.toFixed(2)}\u00B0F / ${temperature.toFixed(2)}\u00B0C`;
        humidityElement.textContent = `${humidity.toFixed(2)}%`;
        co2Element.textContent = `${co2.toFixed()} ppm`;
    } else {
        temperatureElement.textContent = `OFFLINE`;
        humidityElement.textContent = `OFFLINE`;
        co2Element.textContent = `OFFLINE`;
    }

    //i have this as a constant for now
    const waterLevel = 88;

    if (waterLevel >= 0) { 
	    const waterPercent = document.getElementById('water-level-percentage');
    	waterPercent.textContent = `${waterLevel}%`;
    	updateWaterLevel(waterLevel);
    } else {
        waterPercent.textContent = `${waterLevel}%`;
        updateWaterLevel(0);
    }

    actuator1StatusElement.textContent = actuator1Status ? 'ON' : 'OFF';
    actuator2StatusElement.textContent = actuator2Status ? 'ON' : 'OFF';
    actuator3StatusElement.textContent = actuator3Status ? 'ON' : 'OFF';
    actuator4StatusElement.textContent = actuator4Status ? 'ON' : 'OFF';
    actuator5StatusElement.textContent = actuator4Status ? 'ON' : 'OFF';

    createChart();
}

function updateWaterLevel(waterLevel){
    /*
    Change color of levels based on level of water:
    100% = 5/5
    80-99% = 4/5
    60-79% = 3/5
    40-59% = 2/5
    20-39% = 1/5
    0-19% = 0/5
    TBD later on...
    */

    for (let i = 1; i <= Math.floor(waterLevel / 20); i++){
        const waterLevel = document.getElementById(`level${i}`);
        waterLevel.style.backgroundColor = "#43C2F3";
    }

    for (let i = 5; i >= 5 - Math.floor((5 - waterLevel) / 20); i--){
        const waterLevel = document.getElementById(`level${i}`);
        waterLevel.style.backgroundColor = "#5C4FC8";
    }
}

async function setActuatorOnUI(latestMeasurement){
    for (let i = 1; i <= 5; i++) {
        const actuatorElement = document.getElementById(`actuator${i}`);
        
        actuatorElement.addEventListener('change', () => {
            setActuator(i, actuatorElement.checked, latestMeasurement);
        });
    }
}

async function setRefreshRate(){
    const refreshRate = document.getElementById('refresh-rate').value;
    
    if (parseInt(refreshRate) > 0){
        await fetch('http://mykoprisma.com:3603/setInterval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refreshRate)
        });
        window.alert("Refresh rate is updated.");
        document.getElementById('refresh-rate').value = '';
    }
    else {
        window.alert("Invalid refresh rate! Try again.");
    }
}

// Update UI every second
setInterval(async () => {
    const latestMeasurement = await getLatestMeasurement();
    updateUI(latestMeasurement);
    setActuatorOnUI(latestMeasurement);
}, 1000);