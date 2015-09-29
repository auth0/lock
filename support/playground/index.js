$('#code-modal').on('show.bs.modal', function (e) {
  $('#code-modal').css('display','block');
});

$('#show-code').on('click', function (ev) {
  $('#lock-code code').text(getLockInitializationCode());
  hljs.highlightBlock($('#lock-code code').get(0));
});

$('#show-lock').on('click', function (ev) {
  ev.preventDefault();

  var method = $('[name="method"]').val();
  var clientID = $('[name="clientID"]').val();
  var domain = $('[name="domain"]').val();
  var lock = new Auth0LockPasswordless(clientID, domain);

  var options = getOptions();

  // Exectue Lock with options
  lock[method](options, function (err, profile, id_token, access_token, state, refresh_token) {
    var outputContainer = $('#output code');

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
});

function getLockInitializationCode () {
  var template = $('#lock-init-template').text();
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
  options.closable = !!$('[name="closable"]').val();
  options.focusInput = !!$('[name="focusInput"]').val();
  options.gravatar = !!$('[name="gravatar"]').val();
  options.forceJSONP = !!$('[name="forceJSONP"]').val();

  // Textareas + parsings
  try { options.dict = JSON.parse($('[name="dict"]').val()); } catch (e) {}
  try { options.authParams = JSON.parse($('[name="authParams"]').val() ); } catch (e) {}

  return options;
}
