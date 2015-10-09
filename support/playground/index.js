var CONTAINERS = {
  LOCK: 1,
  CODE: 2,
  OUTPUT: 3
};

var currentLockContainerSelector;
var remember;

function bindEvents () {
  hljs.configure({
    classPrefix: ''
  });

  $('form input, form textarea').on('change keydown keypress keyup mousedown click mouseup', function() {
    updateShownLock();
  });

  $('form select').on('change', function() {
    updateShownLock();
  });

  $('input[name=container]').on('change keydown keypress keyup mousedown click mouseup', function() {
      updateTargetContainer($(this).val());
  });

  $('#show-lock').on('click', showLockHandler);

  $('body').on('click', '.auth0-lock-close-button', function(ev) {
    ev.preventDefault();

    if($(this).parents('.output-box-result').length) {
      return;
    }

    showLockHandler();
  });

  $('body').on('keydown', function(ev) {
    if($('.auth0-lock-opened').length && ev.keyCode) {
      if($('.auth0-lock-opened').parents('.output-box-result').length) {
        return;
      }

      showLockHandler();
    }
  });
}

function updateShownLock() {
  updateLockInitializationCode();

  showLockHandler();
}

function showLockHandler(ev) {
    if(ev) {
      ev.preventDefault();
    }

    var method = $('[name="method"]').val();
    var clientID = $('[name="clientID"]').val();
    var domain = $('[name="domain"]').val();

    try {
      if ($('.auth0-lock').length) {
        window.lock.close();
      }

      window.lock = new Auth0LockPasswordless(clientID, domain);

      var options = getOptions();

      if(!ev) {
        options = getOptions('container');
      }

      // Execute Lock with options
      lock[method](options, function (err, profile, id_token, access_token, state, refresh_token) {
        showContainer(CONTAINERS.OUTPUT);
        $('#output code').removeClass('text-danger');
        $('#output code').text('');

        if (err) {
          $('#output code').removeClass('text-danger');
          $('#output code').text('Lock encountered an error' + (err.description ? ':\n' + err.description : '.'));
          return;
        }

        if (method === 'magiclink') {
          $('#output code').text('Email sent to ' + profile);
        } else {
          $('#output code').text('{\n  access_token: "' + access_token + '",\n  id_token: "' + id_token + '"\n}');
          hljs.highlightBlock(outputContainer.get(0));
        }
      });

      setTimeout(function () {
        remember.except('.auth0-lock-input');
      }, 0);

      if (options.container === currentLockContainerSelector) {
        showContainer(CONTAINERS.LOCK);
      }

    } catch (e) {
      $('#output code').text(e.message);
      $('#output code').addClass('text-danger');
      showContainer(CONTAINERS.OUTPUT);
    }
}

function showContainer (container) {
  switch (container) {
  case CONTAINERS.CODE: $('#output-tabs a[href="#lock-code-panel"]').tab('show'); break;
  case CONTAINERS.OUTPUT: $('#output-tabs a[href="#output-panel"]').tab('show'); break;
  case CONTAINERS.LOCK: $('#lock-container-box').show(); break;
  default: break;
  }
}

function updateTargetContainer (selector) {
  var sanitizedSelector = (selector ? selector.replace("#", "") : '') || 'container';
  $('.lock-container').prop('id', sanitizedSelector);
  $("#container-panel-title").text(sanitizedSelector);
  currentLockContainerSelector = sanitizedSelector;
}

function updateLockInitializationCode () {
   $('#lock-code code').text(getLockInitializationCode());
   hljs.highlightBlock($('#lock-code code').get(0));
}

function getLockInitializationCode () {
  var template = $('#lock-init-template').val();
  var templateValues = {};

  templateValues.options = JSON.stringify(getOptions());
  templateValues.method = $('[name="method"]').val();
  templateValues.clientID = $('[name="clientID"]').val();
  templateValues.domain = $('[name="domain"]').val();

  return Mustache.render(template, templateValues);
}

function getOptions (container) {
  var options = {};

  // Strings
  options.icon = $('[name="icon"]').val();
  options.container = container || ($('[name="container"]').val() || '').replace('#', '');
  options.defaultLocation = $('[name="defaultLocation"]').val();
  options.primaryColor = $('[name="primaryColor"]').val();
  options.callbackURL = $('[name="callbackURL"]').val() || undefined;
  options.responseType = $('[name="responseType"]').val() || undefined;

  // Booleans
  options.autoclose = !!$('[name="autoclose"]:checked').val();
  options.closable = !!$('[name="closable"]:checked').val();
  options.focusInput = !!$('[name="focusInput"]:checked').val();
  options.gravatar = !!$('[name="gravatar"]:checked').val();
  options.forceJSONP = !!$('[name="forceJSONP"]:checked').val();

  // Textareas + parsings
  try { options.dict = JSON.parse($('[name="dict"]').val()); } catch (e) {}
  try { options.authParams = JSON.parse($('[name="authParams"]').val() ); } catch (e) {}

  options = removeDefaultOptions(options);
  return options;
}

function removeKeys(object, keys, evalFunction) {
  $.each(keys, function (i, key) {
    if (evalFunction(object[key])) {
      delete object[key];
    }
  });
}

function removeDefaultOptions (options) {
  // remove keys whit default value true
  removeKeys(options, ['closable', 'focusInput', 'gravatar', 'rememberLastLogin'], function (value) { return value === true; });

  // remove keys whit default value false
  removeKeys(options, ['autoclose', 'forceJSONP'], function (value) { return value === false; });

  // remove keys whit default value empty
  removeKeys(options, ['container', 'dict', 'icon', 'primaryColor', 'authParams', 'callbackURL', 'defaultLocation'], function (value) { return !value; });

  if (options.defaultLocation && options.defaultLocation.toLowerCase() === 'us') {
    delete options.defaultLocation;
  }

  return options;
}

function renderAuthenticationSuccessMessage (authResponse) {
  var template = $('#authentication-success-template').val();
  var templateValues = {};

  templateValues.access_token = authResponse.access_token || '';
  templateValues.id_token = authResponse.id_token || '';
  templateValues.refresh_token = authResponse.refresh_token || '';
  templateValues.state = authResponse.state || '';
  templateValues.profile = JSON.stringify(authResponse.profile);

  $('#output code').text(Mustache.render(template, authResponse));
  hljs.highlightBlock($('#output code').get(0));

  showContainer(CONTAINERS.OUTPUT);
}

function tryDisplayAuthenticatedFeedback () {
  var clientID = $('[name="clientID"]').val();
  var domain = $('[name="domain"]').val();

  try {
    var lock = new Auth0LockPasswordless(clientID, domain);
    var response = lock.parseHash(window.location.hash);

    if (response.error) {
      return;
    }

    renderAuthenticationSuccessMessage(response);
  } catch (e) {
    // fail silently..
  }
}

$(function() {
  remember = require('remember')();

  bindEvents();
  showContainer(CONTAINERS.CODE);

  setTimeout(function () {
    updateLockInitializationCode();
    showLockHandler();
  }, 500);

  remember.except('input[name=container]');
  $("[rel=tooltip]").tooltip({ placement: 'right'});

  if (window.location.hash) {
    setTimeout(tryDisplayAuthenticatedFeedback, 500);
  }
});
