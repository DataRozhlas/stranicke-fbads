import { ads } from "./ads";
import { kraje } from "./kraje";
import { ads_sums } from "./ads_sums";

let ageCats = [
    "13-17", 
    "18-24",
    "25-34",
    "35-44", 
    "45-54",  
    "55-64", 
    "65+",
]

let cont = '<select id="partysel">'

Object.keys(ads).forEach((e) => 
    cont += '<option value="' + e + '">' + e + '</option>'
)
cont += '</select>'
    + '<div id="stats"></div><div id="grafiky"><div id="gender"></div>'
    + '<div id="regiony"></div></div>'

document.getElementById('dboard').innerHTML = cont

function writeStats(party) {
    console.log(ads_sums[party])
    document.getElementById('stats').innerHTML = 'Celkem ' + ads_sums[party].ads + ' reklam za ' + ads_sums[party].spends + ' Kč'

}

function drawGender(party) {
    let women = []
    let men = []

    ageCats.forEach((c) =>
        {
            women.push(ads[party]['female'][c])
            men.push(ads[party]['male'][c])
        }
    )

    Highcharts.chart('gender', {
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Věk a pohlaví'
        },
        xAxis: {
            categories: ageCats,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Průměrný podíl na viděné reklamě'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">Věk {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'muži',
            color: '#0571b0',
            data: men
        }, {
            name: 'ženy',
            color: '#ca0020',
            data: women
        }]
    });
}

function drawMap(party) {
    let data = []
    Object.keys(ads[party]['regions']).forEach((v) =>
        data.push([v, ads[party]['regions'][v]])
    )
    Highcharts.mapChart('regiony', {
        chart: {
            map: kraje
        },
        credits: {
            href: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=political_and_issue_ads&country=CZ',
            text: 'Facebook Ad Library'
        },
        title: {
            text: 'Kraje'
        },
        mapNavigation: {
            enabled: false,
        },
        colorAxis: {
            tickPixelInterval: 100
        },
        tooltip: {
            formatter: function(e) {
                console.log(this)
                return this.point.properties.NAZ_CZNUTS3 + '<br>'
                    + 'průměrný podíl na reklamě: '
                    + Math.round(this.point.value * 10)/10 + ' %'
            }
        },
        series: [{
            data: data,
            keys: ['KOD_CZNUTS3', 'value', 'NAZ_CZNUTS3'],
            joinBy: 'KOD_CZNUTS3',
            name: 'Průměrný podíl',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            dataLabels: {
                enabled: false,
                format: '{point.properties.NAZ_CZNUTS3}'
            }
        }]
    });
}

drawGender('ČSSD')
drawMap('ČSSD')
writeStats('ČSSD')
document.getElementById('partysel').addEventListener("change", function(e) {
    drawGender(e.target.selectedOptions[0].value)
    drawMap(e.target.selectedOptions[0].value)
    writeStats(e.target.selectedOptions[0].value)
});