$(document).ready(function(){

  $(".collumns").html("");
  $.get("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      if(!data[i].isSaved){   
        $(".collumns").append("<div data-id='" + data[i]._id + "' class='collumn'><button id='saveButton'>Save Article</button><div class='head'><span class='headline hl3'>" + data[i].title + "</span><span id='article'>" + data[i].excerpt + "</span><figure class='figure'><img class='media' src='" + data[i].image + "'></figure></div></div>");
      }
    }
  });

  $('#scraperBtn').on("click", function() {
    $.get("/scrape", function(data) {
      alert("Added " + data.length + " new articles."); //need to add modal pop-up.
     location.reload();
    });
  });

  $('#home').on("click", function() {
    $(".collumns").html("");
    $.get("/articles", function(data) {
      for (var i = 0; i < data.length; i++) {
        if(!data[i].isSaved){   
          $(".collumns").append("<div data-id='" + data[i]._id + "' class='collumn'><button id='saveButton'>Save Article</button><div class='head'><span class='headline hl3'>" + data[i].title + "</span><span id='article'>" + data[i].excerpt + "</span><figure class='figure'><img class='media' src='" + data[i].image + "'></figure></div></div>");
        }
      }
    });
  });

  $('#savedArticles').on("click", function() {
    $(".collumns").html("");
    $.get("/savedArticles", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].isSaved);
        if(data[i].isSaved){    
          $(".collumns").append("<div data-id='" + data[i]._id + "' class='collumn'><button id='deleteButton'>Delete from Saved</button><button type='button' id='article-notes' class='btn btn-primary' data-toggle='modal' data-target='#notesModal'>Article Notes</button><div class='head'><span class='headline hl3'>" + data[i].title + "</span><span id='article'>" + data[i].excerpt + "</span><figure class='figure'><img class='media' src='" + data[i].image + "'></figure></div></div>");
        }
      }
    });
  });  
});

$(document).on("click", "#saveButton", function() {
    var thisId = $(this).parent().attr("data-id");
    
    $.ajax({
      method: "POST",
      url: "/save/" + thisId,
      data: {
        isSaved: true        
      }
    }); 
    location.reload();
  });
  
  $(document).on("click", "#deleteButton", function() { 
  var thisId = $(this).parent().attr("data-id");
  alert("here DELETE " + thisId); 
  
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId,
    data: {
      isSaved: false        
    }
  }); 
  location.reload();
});

$(document).on("click", "#article-notes", function() {
  $("#notes").empty();
  var thisId = $(this).parent().attr("data-id");
  
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<div><textarea id='bodyinput' name='body'></textarea></div><br>");
      $("#notes").append("<button type='button' class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
