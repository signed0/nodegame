var socket = io.connect('/');


$(function() {
	var $status = $('#status');
	var $registerForm = $('#join-form');
        
    // set up listeners
    socket.on('user-list', function(users) {
        for (var i=users.length; i--;) {
            addUser(users[i]);
        }
    });	


	socket.on('joined', function(user) {
		addUser(user);
	});

	socket.on('ready', function() {
		updateStatus('Ready');
		loadUsers();
	});

	function loadUsers() {
        socket.emit('get-users');
	}

	$('form', $registerForm).submit(function() {
		var username = $('#username').val();
		var user = {username: username};

		updateStatus('Connecting to server..')
		socket.emit('join', user);

		$registerForm.modal('hide');
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

	function onReady() {
		updateStatus('Loaded');
		$registerForm.modal();
	}

	onReady();
});
