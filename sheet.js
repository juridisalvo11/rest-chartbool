$.ajax({
  url: 'http://157.230.17.132:4008/sales',
  method: 'GET',
  success: function(data) {
    console.log(data);

    var totale_vendite = {};

    for (var i = 0; i < data.length; i++) {
      var dati_vendite = data[i]
      console.log(dati_vendite);
      var venditori = dati_vendite.salesman;
      console.log(venditori);
      var cifra_vendita = dati_vendite.amount;
      console.log(cifra_vendita);
    }

    if(!totale_vendite.hasOwnProperty(venditori)) {
      totale_vendite[venditori] = cifra_vendita;
    } else {
      totale_vendite[venditori] += cifra_vendita;
    }
    console.log(totale_vendite);
  },
  error: function() {
    alert('Si è verificato un errore')
  }
})
