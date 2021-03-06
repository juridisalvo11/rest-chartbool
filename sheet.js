$(document).ready(function() {
  //Effettuo chiamata Ajax per recuperare i dati

  chiamata_ajax();

  $('#add-sale').click(function(){
    var nuova_vendita = $('.input-sale').val();
    //console.log(nuova_vendita);
    var scelta_mese = $('#mesi').val();
    //console.log(scelta_mese);
    var scelta_venditore = $('#venditori').val();
      //console.log(scelta_venditore);

    if (scelta_venditore != '' && scelta_mese != '' && nuova_vendita > 0 ) {
      var nuova_data = moment().format('DD/' + scelta_mese + '/2017')
        //console.log(nuova_data);

      $.ajax({
        url: 'http://157.230.17.132:4008/sales',
        method: 'POST',
        data: {
          'salesman' : scelta_venditore,
          'date' :  nuova_data,
          'amount' : nuova_vendita,
        },
        success: function(data) {

          chiamata_ajax()

        },
        error: function() {
          alert('Si è verificato un errore')
        }
      })
    } else if (scelta_venditore == '') {
      alert('Inserisci un venditore valido');
    } else if (scelta_mese == '') {
      alert('Inserisci un mese valido');
    } else {
      alert('Inserisci un importo valido');
    }

  })

  function chiamata_ajax() {
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
  }

  //FUNZIONE PER GESTIRE LE VENDITE MENSILI
  function gestione_mensile(mese) {
    //  //Creo l'oggetto vendite_mensili dove andare ad inserire i dati recuperati delle vendite mese per mese
    //var vendite_mensili = {};

    var vendite_mensili = {};

    for (var i = 1; i < 12; i++) {
      var nome_mese = moment(i, 'M').format('MMMM');
      vendite_mensili[nome_mese] = 0;
      }

    for (var i = 0; i < mese.length; i++) {
      var dati_correnti = mese[i];

      var data_vendite = moment(dati_correnti.date, 'DD,MM,YYYY').format('MMMM');

      var ammontare_vendite = parseInt(dati_correnti.amount);

      vendite_mensili[data_vendite] += ammontare_vendite;

      if(!vendite_mensili.hasOwnProperty(data_vendite)) {
        vendite_mensili[data_vendite] = ammontare_vendite;
      } else {
        vendite_mensili[data_vendite] += ammontare_vendite;
      }
    }

    //console.log('vendite mensili', vendite_mensili);

    var mesi = Object.keys(vendite_mensili);

    var vendita_corrente = Object.values(vendite_mensili);

    scrivi_mese(mesi)

    grafico_mensile(mesi, vendita_corrente);
  }

  function grafico_mensile(chiavi, valori) {

    $('#box-vendite-mesi').empty();
    $('#box-vendite-mesi').append('<canvas id="grafico-mesi"></canvas>');

    var myChart = new Chart($('#grafico-mesi')[0].getContext('2d'), {
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
      //console.log(dati_vendite);
      var cifra_vendita = parseInt(dati_vendite.amount);
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
    }

    for (var vendita in totale_vendite) {
      var importo_venditore = totale_vendite[vendita];
      var percentuale = (importo_venditore * 100 / somma_totale_vendite).toFixed(1);
      totale_vendite[vendita] = percentuale;
    }

    //Recupero le chiavi dell'oggetto
    var keys = Object.keys(totale_vendite);
    //Recupero il valore delle chiavi dell'oggetto
    var values = Object.values(totale_vendite);
    scrivi_venditore(keys);

    //Richiamo il grafico per andare ad inserire i dati
    grafico_venditori(keys, values);

  }


  // FUNZIONE PER CREARE IL GRAFICO DEI VENDITORI
  function grafico_venditori(chiavi, valori) {

    $('#box-vendite-singole').empty();
    $('#box-vendite-singole').append('<canvas id="grafico-singole-vendite"></canvas>');

    var myChart = new Chart($('#grafico-singole-vendite')[0].getContext('2d'), {
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
          tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                  var percentuale_venditore = data.labels[tooltipItem.index];
                  var percentuale_vendite = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                  return percentuale_venditore + ':' + percentuale_vendite + '%';
                }
              }
            }
        }
    });
  }

  function scrivi_mese(mesi_options) {
    $('#mesi').empty();
    $('#mesi').append('<option value""> Months </option>');
    for (var i = 0; i < mesi_options.length; i++) {
      var numero_mese = i + 1;
      if (numero_mese < 10) {
        numero_mese = '0' + numero_mese
      }
      var mesi_select = $('#mesi').append('<option value="' + numero_mese + '">' + mesi_options[i] + '</options>')
    }
  }

  function scrivi_venditore(venditori_options) {
    $('#venditori').empty();
    $('#venditori').append('<option value""> Sellers </option>');
    for (var i = 0; i < venditori_options.length; i++) {
      var mesi_select = $('#venditori').append('<option value="' + venditori_options[i] + '">' + venditori_options[i] + '</options>')
    }
  }
})
