async function download(){
    fetch('http://mykoprisma.com:3603/getCSV')
    .then(response => response.blob())
    .then(blob => {
        // Do something with the blob, for example create a URL and use it to download the file
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'measurements.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });
}