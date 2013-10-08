$("#messageText").on("keyup", function() {
  var n = $(this).val().length;
  $("#messageCounter").html(140 - n);
});

$("#submit").on("click", function() {
  var jqxhr = $.post("/messages", {"text": $("#messageText").val() }, function (data) {
    $('#messageList').prepend("<li>" + data.text + "</li>");
  }).fail(function() {
    alert("Error when saving message to server")
  });
  $("#messageText").val("");
  $("#messageCounter").html(140);
});