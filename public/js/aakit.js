var Storage = {
    set: function(key, value) {
        localStorage[key] = JSON.stringify(value);
    },
    get: function(key) {
        return localStorage[key] ? JSON.parse(localStorage[key]) : null;
    }
};
function hideHeader() {
    $('#user-header-full').slideUp(500);//, function() {
        $('#collapsed-user-header').show();//slideDown(100);
    //});
    $('#hide-header-toggle-up').hide();
    $('#hide-header-toggle-down').show();

   var h1 = $('#header').height();
    var h2 = $('#collapsed-user-header').height();
    $('#aa-user-header').animate({'height': h1 + h2 + 2}, 300);
    $('#aa-header-to-stick').animate({'height': h2 }, 300);
    Storage.set('collapsed', true);
}
function showHeader() {
    $('#collapsed-user-header').slideUp(200);//, function() {
        $('#user-header-full').show();
    //});
    $('#hide-header-toggle-up').show();
    $('#hide-header-toggle-down').hide();

    var h1 = $('#header').height();
    var h2 = $('#user-header-full').height();
    $('#aa-user-header').animate({'height': h1 + h2 + 2}, 500);
    $('#aa-header-to-stick').animate({'height': h2 }, 500);
    Storage.set('collapsed', false);
}
function checkCollapsedStatus() {
    var status = Storage.get('collapsed');
    if (status) {
        $('#user-header-full').hide();
        $('#collapsed-user-header').show();
        $('#hide-header-toggle-up').hide();
        $('#hide-header-toggle-down').show();
    }
}