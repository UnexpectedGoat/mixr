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
        window.location.href="/drinks"
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
        window.location.href="/drinks"
    })
})