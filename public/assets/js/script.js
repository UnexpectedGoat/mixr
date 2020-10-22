console.log("WOOOOO");

$("#signup-button").on("click", function (event){
    const user = {
        username: $("#signup-username").val(),
        password: $("#signup-password").val(),
    }
    $.ajax({
        method:"POST",
        url:"/signup",
        data:user
    }).then(apiRes=>{
        console.log(apiRes);
        window.location.href="/drinks"
    })
})