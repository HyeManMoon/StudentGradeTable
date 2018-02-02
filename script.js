/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input:
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var studentArray = [];
var globalResult;


/***************************************************************************************************
 * initializeApp
 * @params {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
  addClickHandlersToElements();
  getDataFromServer();


}

/***************************************************************************************************
 * addClickHandlerstoElements
 * @params {undefined}
 * @returns  {undefined}
 *
 */
function addClickHandlersToElements() {
  $('.btn-success').on('click', handleAddClicked);
  $('.btn-default').on('click', handleCancelClick);
  $('.btn-info').on('click', getDataFromServer);



}
/***************************************************************************************************
 *send the data to the api server
 */
function sendDataToServer(students) {
  $.ajax({
    url: "http://s-apis.learningfuze.com/sgt/create",
    method: 'post',
    data: {
      api_key: 'd2dcw7I6wO',
      name: students.name,
      grade: students.grade,
      course: students.course
    },
    dataTypes: 'JSON',
    success: function(response) {
      console.log('the sending was successful' + response);
      var sendData = JSON.parse(response);
      studentArray[studentArray.length - 1].id = sendData.new_id;
      console.log(studentArray[studentArray.length - 1]);

    }
  })
}
/***************************************************************************************************
 *delete student request
 */
function requestDeleteServer(student) {
  $.ajax({
    url: "http://s-apis.learningfuze.com/sgt/delete",
    method: 'post',
    data: {
      api_key: 'd2dcw7I6wO',
      student_id: student.id
    },
    dataType: 'JSON',
    success: function() {
      console.log('deleted stuff');
    }
  })
}
/***************************************************************************************************
 *get the data from the api server
 */

function getDataFromServer() {
  $.ajax({
    url: "http://s-apis.learningfuze.com/sgt/get",
    method: 'post',
    data: {
      api_key: 'd2dcw7I6wO'
    },
    dataType: 'JSON',
    success: function(response) {
      console.log("the operation succeeded");
      console.log(response);
      //updateStudentList(data.data);
      var dataObj = response;
      studentArray = dataObj.data;
      updateStudentList(studentArray);
    }
    // error: function(err) {
    //   console.log('error:' + err)
    // }
  })
}
/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return:
       none
 */
function handleAddClicked(event) {
  addStudent();

}
/***************************************************************************************************
 * handleCancelClick - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
  clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
  var studentObj = {};
  var stuName = $('#studentName');
  var stuCourse = $('#course');
  var stuGrade = $('#studentGrade');
  studentObj.name = stuName.val();
  studentObj.course = stuCourse.val();
  studentObj.grade = stuGrade.val();
  studentArray.push(studentObj);
  sendDataToServer(studentObj);
  updateStudentList(studentArray);
  clearAddStudentFormInputs();
}
/***************************************************************************************************
 * clearAddStudentFormInputs - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
  $('#studentName').val('');
  $('#course').val('');
  $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(student) {
  var nameInput = student.name;
  var courseInput = student.course;
  var gradeInput = student.grade;
  var operations = $('<button>').addClass('btn btn-danger').text('DELETE');
  var newTr = $('<tr>').addClass('student');
  var newTd1 = $('<td>').text(nameInput);
  var newTd2 = $('<td>').text(courseInput);
  var newTd3 = $('<td>').text(gradeInput);
  var newTd4 = $('<td>');
  student.displayRow = newTr;
  newTr.appendTo($('thead'));
  newTr.append(newTd1, newTd2, newTd3, newTd4.append(operations));
  operations.on('click', function() {
    removeStudent(student);
  })
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(students) {
  //remove the students that are there
  $(".student").remove();
  var average = calculateGradeAverage(students);
  for (var studentIndex = 0; studentIndex < students.length; studentIndex++) {
    renderStudentOnDom(students[studentIndex]);
  }
  renderGradeAverage(average);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array) {
  var gradeTotal = null;
  for (var stuIndex = 0; stuIndex < array.length; stuIndex++) {
    gradeTotal += parseInt(array[stuIndex].grade);
  }
  return gradeTotal / array.length
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(number) {
  $('.label-default').text(number.toFixed(0));
}
/***************************************************************************************************
 *removeStudent - removes the student from the List
 */
function removeStudent(student) {
  //remoevs students from array
  requestDeleteServer(student);
  var studentIndex = studentArray.indexOf(student);
  studentArray.splice(studentIndex, 1);
  student.displayRow.remove();
  var average = calculateGradeAverage(studentArray);
  renderGradeAverage(average);

  //  updateStudentList(studentArray);

}