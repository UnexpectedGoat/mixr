console.log("WOOOOO");
// listens for signup button click
$("#signup-button").on("click", function (event){
    // create user object based off values entered in input
    const user = {
        username: $("#signup-username").val(),
        password: $("#signup-password").val(),
    }
    //make an ajax POST call to our express server
    $.ajax({
        method:"POST",
        //route being called
        url:"/signup",
        //data being passed
        data:user
    }).then(apiRes=>{
        //user now has a login so log them in and take them to drinks
        window.location.href="/mycocktails"
    })
})

//listens for a login button click
$("#login-button").on("click", function (event){
    //builds a user obeject based on the values entered
    const user = {
        username: $("#login-username").val(),
        password: $("#login-password").val(),
    }
    //ajax POST call to our server
    $.ajax({
        method:"POST",
        // route being hit
        url:"/login",
        //data being passed
        data:user
    }).then(apiRes=>{
        //user has logged in so direct to drinks page
        window.location.href="/mycocktails"
    })
})
//listens for a add cocktail button click
$(".add-cocktail-button").on("click", function (event){
    const cocktail = {
        id:$(this).attr("data-cocktailId")
    }
    
    //ajax POST call to our server
    $.ajax({
        method:"POST",
        // route being hit
        url:"/addcocktail",
        //data being passed
        data:cocktail
    }).then(apiRes=>{
        //user has logged in so direct to drinks page
        // TODO: Updat with mycocktails route
        window.location.href="/mycocktails"
    })
})
$("#add-pantry-button").on("click", function (event){
    console.log("add Pantry")
    const data ={
        ingredient:$("#autocomplete-input").val()
    } 
    // ajax POST call to our server
    $.ajax({
        method:"POST",
        // route being hit
        url:"/pantry",
        //data being passed
        data:data
    }).then(apiRes=>{
        //user has logged in so direct to drinks page
        // TODO: Updat with mycocktails route
        window.location.href="/pantry"
    })
})

$(".delete-pantry-button").on("click", function (event){
    console.log("hi-delete me")
    const ingredientId = {
        id:$(this).attr("id")
    }
    
    //ajax POST call to our server
    $.ajax({
        method:"DELETE",
        // route being hit
        url:"/pantry",
        //data being passed
        data:ingredientId
    }).then(apiRes=>{
        //user has logged in so direct to drinks page
        // TODO: Updat with mycocktails route
        window.location.href="/pantry"
    })
})

// Building the cloudinary widget for uploads on button click below
var myWidget = cloudinary.createUploadWidget(
  {
    //specifies to send it to jkemps account
    cloudName: "k3m9",
    //the upload preset is the unsigned version
    uploadPreset: "ulnivdif",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      //returns the login info, we will want to bring that info into a variable and send it along
      //with our form data for the image url field
      console.log("Done! Here is the image info: ", result.info);
    }
  }
);

//the event listener for the upload widget button
document.getElementById("upload_widget").addEventListener(
  "click",
  function () {
    myWidget.open();
  },
  false
);

// Side Nav bar
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instance = M.Sidenav.getInstance(elems);
  });
  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
  // var collapsibleElem = document.querySelector('.collapsible');
  // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);
  // Or with jQuery
  $(document).ready(function () {
    $('.sidenav').sidenav();
  });

