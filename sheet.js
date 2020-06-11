$(document).ready(function() {
  //Effettuo chiamata Ajax per recuperare i dati

  $.ajax({
    url: 'http://157.230.17.132:4008/sales',
    method: 'GET',
    success: function(data) {

      var dati_vendite = data;

      //Richiamo la funzione per recuperare e gestire i dati delle vendite mensili
      gestione_mensile(dati_vendite);
      //Richiamo la funzione per recuperare e gestire i dati dei singoli venditori e delle singole vendite
      singole_vendite(dati_vendite);

    },
    error: function() {
      alert('Si è verificato un errore')
    }
  })

  $('#add-sale').on('click', function(){
    var nuova_vendita = $('.input-sale').val();
    console.log(new_sale);
    var scelta_mese = $('.mesi').text();
    console.log(scelta_mese);
    var scelta_venditore = $('.venditori').text();
    console.log(scelta_venditore);
    // $.ajax({
    //   url: 'http://157.230.17.132:4008/sales',
    //   method: 'POST',
    //   data: {
    //     'salesman' :
    //     'date' :
    //     'amount' :
    //   },
    //   success: function(data) {
    //
    //   },
    //   error: function() {
    //     alert('Si è verificato un errore')
    //   }
    // })

  })

  //FUNZIONE PER GESTIRE LE VENDITE MENSILI
  function gestione_mensile(mese) {
    //  //Creo l'oggetto vendite_mensili dove andare ad inserire i dati recuperati delle vendite mese per mese
    //var vendite_mensili = {};

    var vendite_mensili = {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0
    };

    for (var i = 0; i < mese.length; i++) {
      var dati_correnti = mese[i];

      var data_vendite = moment(dati_correnti.date, 'DD,MM,YYYY').format('MMMM');

      var ammontare_vendite = dati_correnti.amount;

      vendite_mensili[data_vendite] += ammontare_vendite;

      // if(!vendite_mensili.hasOwnProperty(data_vendite)) {
      //   vendite_mensili[data_vendite] = ammontare_vendite;
      // } else {
      //   vendite_mensili[data_vendite] += ammontare_vendite;
      // }
    }

    var mesi = Object.keys(vendite_mensili);

    var vendita_corrente = Object.values(vendite_mensili);

    grafico_mensile(mesi, vendita_corrente);
  }

  function grafico_mensile(chiavi, valori) {
    var ctx = $('#grafico-mesi')[0].getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chiavi,
            datasets: [{
                label: 'Sales per Month',
                data: valori,
                pointBackgroundColor:
                    'rgba(54, 162, 235, 1)',
                pointBorderColor:
                    'rgba(54, 162, 235, 1)',
                borderColor:
                    'rgba(0, 255, 0, 0.4)',
                borderWidth: 1,
                fill: false
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

  //FUNZIONE PER GESTIRE I SINGOLI VENDITORI
  function singole_vendite(vendite) {
    //Creo L'oggetto totale_vendite dove andare ad inserire i dati recuperati delle vendite
    var totale_vendite = {};

    var somma_totale_vendite = 0;
    //Imposto un ciclo for per andare a prendere i dati relativi ai singoli venditori
    for (var i = 0; i < vendite.length; i++) {
      var dati_vendite = vendite[i]
      console.log(dati_vendite);
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
      somma_totale_vendite += cifra_vendita;

      // for (var vendita in totale_vendite) {
      //   var importo_venditore = totale_vendite[vendita];
      //   var percentuale = (importo_vendita * 100 / somma_totale_vendite).toFixed(1);
      // }
      // console.log(somma_totale_vendite);
    }

    //console.log(somma_totale_vendite);

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
})
