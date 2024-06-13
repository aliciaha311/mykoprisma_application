let temperatureChart = null;
let humidityChart = null;
let co2Chart = null;

function createChart() {
    const timeRange = document.getElementById('timeRange').value;

    const now = Math.floor(Date.now() / 1000);
    const from = now - timeRange;

    fetch(`http://mykologic.com:3603/getMeas?from=${from}`)
        .then(response => response.json())
        .then(data => {

        const filteredData = data.filter(measurement =>
            measurement.temperature > 0 &&
            measurement.humidity > 0 &&
            measurement.co2 > 0
        );

        const timestamps = filteredData.map(measurement => new Date(measurement.timestamp * 1000));
        const temperatureData = filteredData.map(measurement => measurement.temperature);
        const humidityData = filteredData.map(measurement => measurement.humidity);
        const co2Data = filteredData.map(measurement => measurement.co2);

        if (temperatureChart){
            temperatureChart.destroy();
        }
        
        if (humidityChart){
            humidityChart.destroy();
        }

        if (co2Chart){
            co2Chart.destroy();
        }

        const temperatureCtx = document.getElementById('temperatureChart');
        temperatureChart = new Chart(temperatureCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Temperature',
                    data: temperatureData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM d',
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Temperature (C)"
                        }
                    }
                }
            }
        });

        const humidityCtx = document.getElementById('humidityChart');
        humidityChart = new Chart(humidityCtx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Humidity',
                    data: humidityData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM d',
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Humidity (%)"
                        }
                    }
                }
            }
        });

        const co2Ctx = document.getElementById('co2Chart');
        co2Chart = new Chart(co2Ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'CO2',
                    data: co2Data,
                    backgroundColor: 'rgba(178, 56, 255, 0.2)',
                    borderColor: 'rgba(178, 56, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MMM d',
                                hour: 'HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: "Timestamp"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "CO2 Levels (ppm)"
                        }
                    }
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createChart();
});