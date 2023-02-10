const continentsContainer = document.querySelector(".continentsContainer");
var arrCountries = [];
var arrPopulationCountries = [];
var arrDate=[];
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'];
const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'];
const backgroundColorsForChartsJs = [];
const borderColorsForChartsJs = [];
const continents = ["Africa", "Asia", "Europe", "Americas", "Oceania"];
const chartJs = document.querySelector("#chartJs");
const chartJsButton = document.querySelector("#chartJsButton");
const divButton = document.querySelector("#divButton");
const h2 = document.getElementById("errormsg")
function buildContinents() {
    continents.forEach(element => {
        const div = document.createElement("div");
        const button = document.createElement("button");
        button.innerHTML = element;
        button.addEventListener("click", (event) => {
            getDataByContinents(event.target.innerHTML);
        })
        div.appendChild(button);
        continentsContainer.appendChild(div);
    });
}
buildContinents();

async function getDataByContinents(nameContinent) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${nameContinent}`);
        console.log(`https://restcountries.com/v3.1/region/${nameContinent}`);
        const data = await response.json();
        console.log(data);
        
        if (data) {
            // console.log(config.datasets.data);
            arrCountries = [];
            arrPopulationCountries = [];
            data.forEach(el => {
                arrCountries.push(el.name.common);
                arrPopulationCountries.push(el.population);
            })
            console.log(arrCountries);
            console.log(arrPopulationCountries);

            arrCountries.forEach(element => {
                const rnd = Math.floor(Math.random() * (5 - 1 + 1) + 1);
                backgroundColorsForChartsJs.push(backgroundColors[rnd]);
                borderColorsForChartsJs.push(borderColors[rnd]);
            });

            chartJs.style.display = "block";
            chartJsButton.style.display = "block";
            setConfig();
            setButtonInSection();
        }
        else {
            h2.innerText = "No data found"
        }
    } catch (err) {
        console.log(new Error("the link not worke"));
        h2.innerText = "No data found"
    }
}

function setConfig() {
    const config = {
        type: 'line',
        labels: arrCountries,

        datasets: [
            {
                label: ['Population'],
                data: arrPopulationCountries,
                fill: false,
                borderColor: "#ff6384",
                BackgroundColor: backgroundColorsForChartsJs,
                pointBorderColor: borderColorsForChartsJs,
                tension: 0.1,
                border: 1,
            },
        ],
    }
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: config,
        options: {}
    });
}

function setConfigCity() {
    const config = {
        type: 'line',
        labels: arrCountries,

        datasets: [
            {
                label:"p",
                data: arrPopulationCountries,
                fill: false,
                borderColor: "#ff6384",
                BackgroundColor: backgroundColorsForChartsJs,
                pointBorderColor: borderColorsForChartsJs,
                tension: 0.1,
                border: 1,
            },
        ],
    }
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: config,
        options: {}
    });
}

function setButtonInSection() {
    divButton.innerHTML = "";
    arrCountries.forEach(element => {
        const btn = document.createElement("button");
        btn.innerHTML = element;
        divButton.appendChild(btn);
    });
}

divButton.addEventListener("click", (event) => {
    if (event.target.className.includes("btnDiv")) return;
    console.log(event.target);
    getDataCity(event.target.innerHTML);
});

async function getDataCity(country) {
    try {
        let res = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                "limit": 10,
                "order": "asc",
                "orderBy": "name",
                "country": country

            }),
            redirect: "follow"
        });
        // console.log(res.text())
        if (!res.ok) {
            h2.innerText = "No data found"
            // throw new Error('Something went wrong');
        }
        const data = await res.json();
        console.log(data.data);
        arrCountries=[];
        arrPopulationCountries=[];
        data.data.forEach(el=>{
            arrCountries.push(el.city);
            arrPopulationCountries.push(el.populationCounts[0].value);
        })
        data.data[0].populationCounts.forEach(el=>{
            arrDate.push(el.year);
        });
        console.log(arrDate);
        console.log(arrCountries);
        console.log(arrPopulationCountries);
        setConfigCity();
    } catch (err) {
        console.log(err);
    }
}