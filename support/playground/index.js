function bindEvents () {
  $('#code-modal').on('show.bs.modal', function (e) {
    $('#code-modal').css('display','block');
  });

  $('form input, form textarea, form select').on('change keydown keypress keyup mousedown click mouseup', function() {
      updateLockInitializationCode();
  });

  $('.panel-heading a').on('click',function(e){
      if($(this).parents('.panel').children('.panel-collapse').hasClass('in')){
          e.stopPropagation();
      }
      e.preventDefault();
  });

  $('#show-lock').on('click', function (ev) {
    ev.preventDefault();

    var method = $('[name="method"]').val();
    var clientID = $('[name="clientID"]').val();
    var domain = $('[name="domain"]').val();

    showPanel('container-panel');

    try {
      var lock = new Auth0LockPasswordless(clientID, domain);

      var options = getOptions();
      var outputContainer = $('#output code');

      // Exectue Lock with options
      lock[method](options, function (err, profile, id_token, access_token, state, refresh_token) {

        showPanel('output-panel');
        
        if (err) {
          outputContainer.text('Lock encountered an error:\n' + err.description);
          return;
        }

        if (method === 'magiclink') {
          outputContainer.text('Email sent to ' + profile);
        } else {
          outputContainer.text('{\n  access_token: "' + access_token + '",\n  id_token: "' + id_token + '"\n}');
          hljs.highlightBlock(outputContainer.get(0));
        }
      });
    } catch (e) {
      outputContainer.text(e.message);
      showPanel('output-panel');
    }
  });
}

function showPanel(panelId) {
  $("#" + panelId).prev().find('a').click();
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

function getOptions () {
  var options = {};

  // Strings
  options.icon = $('[name="icon"]').val();
  options.container = ($('[name="container"]').val() || '').replace('#', '');
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

  return options;
}

bindEvents();
updateLockInitializationCode();
showPanel('lock-code-panel');
