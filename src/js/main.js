(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyA1POhHUFJPvnBfUhz24Py02I-n39qfeQA",
    authDomain: "reunite-9b323.firebaseapp.com",
    databaseURL: "https://reunite-9b323.firebaseio.com",
    projectId: "reunite-9b323",
    storageBucket: "reunite-9b323.appspot.com",
    messagingSenderId: "1099049407435"
  };

  firebase.initializeApp(firebaseConfig);

  var functions = firebase.functions();

  // Dev mode
  //functions.useFunctionsEmulator('http://localhost:5001');

  var playerStats = functions.httpsCallable('playerStats');

  playerStats(['nitrino']).then(function(result) {
    console.log(result);
  });

})();
