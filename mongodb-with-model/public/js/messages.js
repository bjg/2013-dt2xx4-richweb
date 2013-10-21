// Update counter
$("#messageText").on("keyup", function(e) {
  var n = $(this).val().length;
  $("#messageCounter").html(140 - n);
});

// Create/update message
$("#submit").on("click", function() {
  var editing, entry, text, id;
  text = $("#messageText").val();
  /*
   * Two cases to consider: Create and update
   */
  editing = $("#messageList").find('.editing');
  if (editing.length === 0) {
    // Creating a new message
    $.post("/collections/messages", {"text": text})
      .done(function(data) {
        var msg =
          '<tr data-id=' + data._id + '>' +
            '<td class="messageEntry">' + data.text + '</td>' +
            '<td><a class="messageEdit"   href="javascript:void(0)"><i class="icon-edit"></i></a></td>' +
            '<td><a class="messageRemove" href="javascript:void(0)"><i class="icon-remove"></i></a></td>' +
          '</tr>';
        $('#messageList').prepend(msg);
      })
      .error(function() {
      });
  } else {
    // Update existing message
    $.ajax({url: "/collections/messages/" + editing.data('id'), data: {"text": text}, type: "PUT"})
      .done(function(response) {
        editing.removeClass('editing');
        editing.find('.messageEntry').html(text);
      })
      .error(function(response) {
        // TODO
      });
  }
  $("#messageText").val("");
  $("#messageCounter").html(140);
});

// Edit a message
$('.messageEdit').on('click', function(e) {
  var entry;
  e.preventDefault();
  entry = $(this).parents('tr');
  entry.addClass('editing');
  $("#messageText").val(entry.find('.messageEntry').html()).focus();
});

// Remove a message
$(".messageRemove").on("click", function(e) {
  var entry;
  e.preventDefault();
  entry = $(this).parents('tr');
  $.ajax({url: "/collections/messages/" + entry.data('id'), type: "DELETE"})
    .done(function(response) {
      entry.remove();
    })
    .error(function(response) {
      // TODO
    })
})