var $noteHead = $(".note-head");
var $noteBody = $(".note-textbody");
var $confirmNoteBtn = $(".saveNote");
var $createNoteBtn = $(".create-new-note");
var $allNotes = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textbody
var activeNote = {};

// Getting all the notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// Saving a note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// Deleting a note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  })
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {
  $confirmNoteBtn.hide();

  if (typeof activeNote.id === "number") {
    $noteHead.attr("readonly", true);
    $noteBody.attr("readonly", true);
    $noteHead.val(activeNote.title);
    $noteBody.val(activeNote.text);
  } else {
    $noteHead.attr("readonly", false);
    $noteBody.attr("readonly", false);
    $noteHead.val("");
    $noteBody.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  var newNote = {
    title: $noteHead.val(),
    text: $noteBody.val()
  };

  saveNote(newNote);
    getAndRenderNotes();
    renderActiveNote();
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this).data('id');

  if (activeNote.id === note) {
    activeNote = {};
  }

  deleteNote(note);
  getAndRenderNotes();
  renderActiveNote();
};

// Sets the activeNote and displays it
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function() {
  if (!$noteHead.val().trim() || !$noteBody.val().trim()) {
    $confirmNoteBtn.hide();
  } else {
    $confirmNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  $allNotes.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    $li.data('id',i);

    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note' data-id="+i+">"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $allNotes.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$confirmNoteBtn.on("click", handleNoteSave);
$allNotes.on("click", ".list-group-item", handleNoteView);
$createNoteBtn.on("click", handleNewNoteView);
$allNotes.on("click", ".delete-note", handleNoteDelete);
$noteHead.on("keyup", handleRenderSaveBtn);
$noteBody.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();