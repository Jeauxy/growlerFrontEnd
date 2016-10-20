$(document).ready(function() {

  $('#btn-login').on('click', function (e) {
    e.preventDefault();
    lock.show();
  });

  $('#logout').on('click', function (e) {
    e.preventDefault();
    logout();
  });

  $(document).on('click', 'a.delete-link', deleteGrowl)

  if (isLoggedIn()){
    loadGrowls();
    showProfile();
    addNewGrowl();
    $('#welcome').hide();
  }

});

function deleteGrowl(e) {
  e.preventDefault();
  e.stopPropagation();
  var link = $(this)
  $.ajax({
    url: link.attr('href'),
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function () {
    link.parent('li').remove();
  })
}


function showProfile() {
  $('#btn-login').hide();
  $('#user-info').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      console.log('profile', profile);
      $('#fullName').text(profile.given_name);
    }
  })
}

function addNewGrowl() {
  $('#new-growl-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'https://mysterious-atoll-77194.herokuapp.com/growls',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      },
      data: {
        text: $('#growl-name').val()
      }
    }).done(function (newGrowl) {
      loadGrowl(newGrowl)
      $('#growl-name').val('').focus()
    })
  })
}

function loadGrowls() {
  $.ajax({
    url: 'https://mysterious-atoll-77194.herokuapp.com/growls',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadGrowl(datum)
  })
})
}

function loadGrowl(growl) {
    var li = $('<li />')
    li.text(growl.text + ' ')
    li.data('id', growl._id);
    if (growl.text){
      li.addClass('done');
    }
    var deleteLink = $('<a />');
    deleteLink.text('Delete')
    deleteLink.attr('href','https://mysterious-atoll-77194.herokuapp.com/growls/' + growl._id)
    deleteLink.addClass('delete-link')

    li.append(deleteLink)

    $('#growls').append(li);
}

var lock = new
//1. Client ID, 2. Client Domain, 3. Oject of Attr
  Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
    }
  }
});

function isLoggedIn() {
  var token = localStorage.getItem('idToken')
  var expired = isJwtValid(token);

  if (token) {
    return true;
  } else {
    return false;
  }
}


function isJwtValid(token) {
  var token = localStorage.getItem('idToken');
  if (!token){
    return false;
  }
}


lock.on('authenticated', function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  console.log('Logged In!');
  loadGrowls();
  showProfile();
  addNewGrowl();
  $('#welcome').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
}
