var socket = io.connect('http://localhost');


$(function() {
	var $status = $('#status');
	var $registerForm = $('#join-form');


	socket.on('joined', function(user) {
		addUser(user);
	});

	socket.on('user-list', function(users) {
		updateStatus('Connected.');

		for (var i=users.length; i--;) {
			addUser(users[i]);
		}
	});


	$('form', $registerForm).submit(function() {
		var username = $('#username').val();
		var user = {username: username};

		updateStatus('Connecting to server..')
		socket.emit('join', user);

		$registerForm.hide();
		$('#game-area').show();

		return false;
	})

	$('button', $registerForm).click(function() {
		$('form', $registerForm).submit();
	});

	function addUser(user) {
		$('#users-list').append('<li>' + user.username + '</li>');
	}

	function updateStatus(message) {
		$status.html(message);
	}

	updateStatus('Loaded');
});