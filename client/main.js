var socket = io.connect('http://localhost');

$(function() {
	$('#user-form form').submit(function() {
		var username = $('#username', this).val();

		socket.emit('register', {username: username});

		alert(username);
		return false;
	});
});