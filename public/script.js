window.addEventListener('DOMContentLoaded', (event)=>{
    document.getElementById('file').onchange = function() {
        document.getElementsByClassName('file-upload-title')[0].innerHTML = 'File uploaded';
        document.getElementsByClassName('file-upload')[0].style.color = '#32a852'
    }
});

let MONTHS = []

function updateMonths(){
    document.getElementById("months").innerHTML = '';
    for (let i = 0; i < MONTHS.length; i++) {
        const month = MONTHS[i];
        document.getElementById("months").innerHTML += '<div class="month">'+month['m']+' / '+month['y']+'<button onclick="removeMonth(\''+month['m']+'\',\''+month['y']+'\')">Remove</button></div>'
    }
}

function addMonth(){
    MONTHS.push({'m': document.getElementById("addM").value, 'y': document.getElementById("addY").value});
    console.log(MONTHS);
    updateMonths();
}
function removeMonth(m, y) {
    MONTHS.splice(MONTHS.indexOf({'m': m, 'y': y}), 1);
    updateMonths();
}

function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function makeFile(data){
    let FILTERED = [];
    let USERS = {};
    rows = data.split('\n');
    rows = rows.map((row)=> row.split("\"").join('').split(','));
    rows.splice(0, 1);
    MONTHS.forEach((MONTH)=>{
        FILTERED = FILTERED.concat((rows.filter((row) => row[1].substr(0, MONTH['m'].toString().length) == MONTH['m'].toString() && row[1].includes(MONTH['y']))));
        console.log(FILTERED);
    });

    FILTERED.forEach(item => {
        if(USERS.hasOwnProperty(item[4])){
            USERS[item[4]] += parseFloat(item[5]);
        } else{
            USERS[item[4]] = parseFloat(item[5]);
        }
    });

    let DATA = '"User Id", "Amount"\n';
    
    let total = 0;
    Object.keys(USERS).forEach(function(key) {
        DATA += '"' + key + '", "' + USERS[key] + '"\n';
        total += USERS[key];
    });

    DATA += ",\nTotal:, "+total+'\n';

    download('result.csv', DATA);

}

function importPortfolioFunction( arg ) {
    console.log(document.getElementById('file'));
    var file = document.getElementById('file').files[0];   
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        console.log(file.type);
        if(file.type == 'text/csv'){
            console.log(event.target.result);
            makeFile(event.target.result);
        } else{
            console.error('NOT A CSV FILE');
        }
    });
    reader.readAsText(file);
}