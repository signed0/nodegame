var socket = io.connect('/');

$(function() {
	var $status = $('#status');
	var $registerForm = $('#join-form');
    
	var users = [];

    // set up listeners
    socket.on('user-list', function(users) {
        for (var i=users.length; i--;) {
            addUser(users[i]);
        }
    });	

	socket.on('joined', function(user) {
		addUser(user);
	});

	socket.on('left', function(user) {
		removeUser(user);
	});

	socket.on('ready', function() {
		updateStatus('Ready');
		loadUsers();
	});

	$('#start-game').click(function() {
		socket.emit('start-game');	
		$(this).hide();
	})
	

	socket.on('game-started', function() {
		$('start-game"').hide();
		updateStatus('Game Started');
	});

	socket.on('assignment', function() {

	});

	function loadUsers() {
        socket.emit('get-users');
	}

	$('form', $registerForm).submit(function() {
		var username = $('#username').val();
		var user = {name: username};

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
		if (user == null) {
			return;
		}

		users.push(user);
		users.sort(function(a, b){ return a.id - b.id  });

		refreshUsers();
	}

	function removeUser(user) {
		for (var i=users.length; i--;) {
			if (users[i].id == user.id) {
				users.splice(i, 1);
				break;
			}
		}

		refreshUsers();
	}

	function updateStatus(message) {
		$status.html(message);
	}

	function onReady() {
		updateStatus('Loaded');
		$registerForm.modal();
	}

	function refreshUsers() {
		var parts = [];
		for (var i=users.length; i--;) {
			var user = users[i];
			parts.push('<li data-id="' + user.id + '">' + user.name + '</li>');
		}
		$('#users-list').html(parts.join(''));
	}

	onReady();
});
