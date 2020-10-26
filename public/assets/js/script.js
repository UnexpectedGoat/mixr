console.log("WOOOOO");
// listens for signup button click
$("#signup-button").on("click", function (event){
    // create user object based off values entered in input
    event.preventDefault()
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
        window.location.href="/pantry"
    })
})

//listens for a login button click
$("#login-button").on("click", function (event){
   event.preventDefault()
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

//liseten for the create cocktail button to be clicked
$("#create-cocktail-button").on("click", function (event){
    console.log("hi-create me")
    // create an obejct that we will pass in as response body
    const cocktail = {
        // load the keys with the values off the input page
      name: $("#drink_name").val(),
      instructions: $("#drink_instructions").val(),
      img_url: $("#upload_widget").attr("data-imgUrl"),
      ingredients: [
      ],
    };
    // this for loop is for parsing through the ingredient inputs
    for (let i = 1; i < 11; i++) {
        // if it hits a value that is null, so the user hasn't added it break the loop
       if($(`#ing${i} > .col > .ingredient`).val().length === 0){
           break;
       }
    //    otherwise build and ingredient object out of those ingredient items
        const ingredients ={
            ingredient: $(`#ing${i} > .col > .ingredient`).val(),
            amount: $(`#ing${i} > .col > .amount`).val(),
            measure: $(`#ing${i} > .col > .measurement`).val(),
        }
        // push that object into our cocktail obejct
        cocktail.ingredients.push(ingredients)
        
    }
    
    //ajax POST call to our server
    $.ajax({
        method:"POST",
        // route being hit
        url:"/createcocktail",
        //data being passed
        data:cocktail
    }).then(apiRes=>{
        //user has logged in so direct to drinks page
        // TODO: Updat with mycocktails route
        window.location.href="/mycocktails"
    })
});

// Click Event for Database Search
$("#search").on("click", event => {
    event.preventDefault();
    const search = {
        name: $("#searchBarDB").val()
    };
    console.log(search);
    $.ajax({
        method: "POST",
        url: "/drinksearch",
        data: search
    }).then(searchResult => {
        console.log(searchResult);
        window.location.href="/index"
    })
});

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
let ingIndex = 2
$("#more-ing-button").on("click", function (event) {
    $(`#ing${ingIndex}`).removeClass("hide")
    ingIndex++
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
      $("#upload_widget").attr("data-imgUrl",result.info.url)
      $("#upload-img").attr("src", result.info.url)
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

