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

//AUtocomplete function for ingredients
$(document).ready(function(){
    //first get teh data in our igredients table
    $.ajax({
        method:"GET",
        // route being hit
        url:"/api/ingredient",
    }).then(apiRes=>{
        //create the object we will use in our lookup, "lookupvalue":null
        let data = {}
        //map over our response (array of objs)
        const ingredientList = apiRes.map(e=>{
            //for each obejct set the name value as the key in data, and set value to null
            data[e.name] = null
        })
        //put that data into our autocomplete method provided by materialize attached ot input.autocompplete items
        $('input.autocomplete').autocomplete({
            data
          });
    })
    
  });


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

