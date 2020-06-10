//Effettuo chiamata Ajax per recuperare i dati

$.ajax({
  url: 'http://157.230.17.132:4008/sales',
  method: 'GET',
  success: function(data) {

    var dati_vendite = data;
    //Richiamo la funzione per recuperare e gestire i dati dei singoli venditori e delle singole vendite
    singole_vendite(dati_vendite);
    //Richiamo la funzione per recuperare e gestire i dati delle vendite mensili
    gestione_mensile(dati_vendite);
  },
  error: function() {
    alert('Si è verificato un errore')
  }
})

//FUNZIONE PER GESTIRE I SINGOLI VENDITORI
function singole_vendite(vendite) {
  //Creo L'oggetto totale_vendite dove andare ad inserire i dati recuperati delle vendite
  var totale_vendite = {};
  //Imposto un ciclo for per andare a prendere i dati relativi ai singoli venditori
  for (var i = 0; i < vendite.length; i++) {
    var dati_vendite = vendite[i]
    //console.log(dati_vendite);
    var cifra_vendita = dati_vendite.amount;
    //console.log(cifra_vendita);
    var venditori = dati_vendite.salesman;
    //console.log(venditori);

    //Imposto le condizioni per verificare se nell'oggetto sia già presente  la chiave del singolo venditore
    if(!totale_vendite.hasOwnProperty(venditori)) {
      //Se il venditore non è presente viene creata una nuova chiave con il valore del venditore corrente
      totale_vendite[venditori] = cifra_vendita;
    } else {
      //Se il venditore è già presente viene sommato la cifra delle vendita corrente a quella delle precedenti
      totale_vendite[venditori] += cifra_vendita;
    }
    //console.log(totale_vendite);
  }

  //Recupero le chiavi dell'oggetto
  var keys = Object.keys(totale_vendite);
  //Recupero il valore delle chiavi dell'oggetto
  var values = Object.values(totale_vendite);

  //Richiamo il grafico per andare ad inserire i dati
  grafico_venditori(keys, values);

}


// FUNZIONE PER CREARE IL GRAFICO DEI VENDITORI
function grafico_venditori(chiavi, valori) {
  var ctx = $('#grafico-singole-vendite')[0].getContext('2d');

  var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: chiavi,
          datasets: [{
              label: 'Single Sales',
              data: valori,
              backgroundColor: [
                  'rgba(111, 0, 255, 0.4)',
                  'rgba(13, 74, 40, 0.4)',
                  'rgba(252, 163, 10, 0.4)',
                  'rgba(255, 0, 0, 0.4)',
              ],
              borderColor: [
                  'rgba(111, 0, 255, 1)',
                  'rgba(13, 74, 40, 1)',
                  'rgba(252, 163, 10, 1)',
                  'rgba(255, 0, 0, 1)',
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}

//FUNZIONE PER GESTIRE LE VENDITE MENSILI
function gestione_mensile(mese) {
  //  //Creo l'oggetto vendite_mensili dove andare ad inserire i dati recuperati delle vendite mese per mese
  var vendite_mensili = {};

  for (var i = 0; i < mese.length; i++) {
    var dati_correnti = mese[i];

    var data_vendite = moment(dati_correnti.date, 'DD,MM,YYYY').format('MM');

    var ammontare_vendite = dati_correnti.amount;

    if(!vendite_mensili.hasOwnProperty(data_vendite)) {
      vendite_mensili[data_vendite] = ammontare_vendite;
    } else {
      vendite_mensili[data_vendite] += ammontare_vendite;
    }
  }

  var mesi = Object.keys(vendite_mensili);

  var vendita_corrente = Object.values(vendite_mensili);

  grafico_mensile(mesi, vendita_corrente);
}

function grafico_mensile(chiavi, valori) {
  var ctx = $('#grafico-mesi')[0].getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: chiavi,
          datasets: [{
              label: 'Sales per Month',
              data: valori,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.4)',
                  'rgba(54, 162, 235, 0.4)',
                  'rgba(255, 206, 86, 0.4)',
                  'rgba(0, 255, 0, 0.4)',
                  'rgba(128, 128, 0, 0.4)',
                  'rgba(210, 105, 30, 0.4)',
                  'rgba(111, 0, 255, 0.4)',
                  'rgba(54, 162, 235, 0.4)',
                  'rgba(13, 74, 40, 0.4)',
                  'rgba(128, 128, 128, 0.4)',
                  'rgba(255, 0, 0, 0.4)',
                  'rgba(238, 255, 0, 0.4)',
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 0.4)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(0, 255, 0, 1)',
                  'rgba(128, 128, 0, 1)',
                  'rgba(210, 105, 30, 1)',
                  'rgba(111, 0, 255, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(13, 74, 40, 1)',
                  'rgba(128, 128, 128, 1)',
                  'rgba(255, 0, 0, 1)',
                  'rgba(238, 255, 0, 1)',
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}
