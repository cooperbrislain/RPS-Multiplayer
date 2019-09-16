/* FIREBASE */
var firebaseConfig = {
    apiKey: "AIzaSyACSShSnvrgEte-P-TJKPiumWr5OuFu80c",
    authDomain: "rps-multiplayer-eb98c.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-eb98c.firebaseio.com",
    projectId: "rps-multiplayer-eb98c",
    storageBucket: "",
    messagingSenderId: "96095048698",
    appId: "1:96095048698:web:3e050f256b6e7265378a43"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

/* END FIREBASE */


$(document).ready(() => {
    $('#exampleModal').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        var modal = $(this);
        // Use above variables to manipulate the DOM
        
    });
});

