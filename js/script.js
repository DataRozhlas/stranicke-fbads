import { ads } from "./ads";
import { kraje } from "./kraje";
import { ads_sums } from "./ads_sums";

function niceNum(x) { // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#answer-2901298
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

let ageCats = [
    "13-17", 
    "18-24",
    "25-34",
    "35-44", 
    "45-54",  
    "55-64", 
    "65+",
]

let ordered_spends = Object.keys(ads_sums).map(function(k) {
    return [k, ads_sums[k].spends]
})
ordered_spends.sort(function(a, b) {
    return b[1] - a[1]
})

let cont = '<select id="partysel">'
ordered_spends.forEach((e) => 
    cont += '<option value="' + e[0] + '">' + e[0] + ' (' + niceNum(e[1]) + ' Kč)' +  '</option>'
)
cont += '</select>'
    + '<div id="stats"></div><div id="grafiky"><div class="viz" id="gender"></div>'
    + '<div class="viz" id="regiony"></div></div>'
document.getElementById('dboard').innerHTML = cont

function writeStats(party) {
    document.getElementById('stats').innerHTML = 'Reklam: <b>' + niceNum(ads_sums[party].ads) + '</b> v celkové ceně <b>' + niceNum(ads_sums[party].spends) + ' Kč</b>'

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
                text: 'Průměrný podíl na zobrazené reklamě'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:12px; font-weight: bold;">Věk {point.key}</span><table>',
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
            tickPixelInterval: 100,
            minColor: '#f2f0f7',
            maxColor: '#54278f',
        },
        tooltip: {
            formatter: function(e) {
                return '<b>' + this.point.properties.NAZ_CZNUTS3 + '</b><br>'
                    + 'průměrný podíl na zobrazené reklamě: '
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
                    color: '#3f007d'
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

$(document).ready(function() {
    $('#partysel').select2();
    $('#partysel').on('change', function(){
        drawGender(this.value)
        drawMap(this.value)
        writeStats(this.value)
    });
});