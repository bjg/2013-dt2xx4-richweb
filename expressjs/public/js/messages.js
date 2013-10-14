$("#messageText").on("keyup", function() {
  var n = $(this).val().length;
  $("#messageCounter").html(140 - n);
});

$("#submit").on("click", function() {
  $.post("/messages", {"text": $("#messageText").val() })
  .done(function (data) {
    $('#messageList').prepend("<li>" + data.text + "</li>");
  })
  .fail(function() {
    alert("Error when saving message to server");
  })
  .always(function() {
    $("#messageText").val("");
    $("#messageCounter").html(140);
  });
});