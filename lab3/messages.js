$("#messageText").on("keyup", function() {
  var n = $(this).val().length;
  $("#messageCounter").html(140 - n);
});

$("#submit").on("click", function() {
  var msg = "<li>" + $("#messageText").val() + "</li>";
  $('#messageList').prepend(msg);
  $("#messageText").val("");
  $("#messageCounter").html(140);
});