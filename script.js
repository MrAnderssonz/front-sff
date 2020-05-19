var leftSidePage = document.getElementById("leftSidePage");
var rightSidePage = document.getElementById("rightSidePage");
var userPart = document.getElementById("user");
var userPartError = document.getElementById("usererror");
var footerPart = document.getElementById("footerPart");

if (localStorage.getItem("userId") === "null")
{
    showLoginPage();
}  
else
{
    showUserInfo();
}

function showUserInfo()
{
    var userName = localStorage.getItem("userName")

    userPart.innerHTML = "";
    userPart.insertAdjacentHTML("beforeend", 
    "<div> Inloggad som: " + userName + "<button class='button' id='userLogout'>Logga ut</button> </div>")

    var logoutButton = document.getElementById("userLogout");
    logoutButton.addEventListener("click", function()
    {
        localStorage.setItem("userId", null);
        showLoginPage();
    });


}

function showLoginPage()
{
    userPart.innerHTML = "";
    userPart.insertAdjacentHTML("beforeend", 
    "<div><input type='text' id='userName' Placeholder='Filmstudio'> <input type='password' id='userPass' Placeholder='Lösenord'> <button class='button' id='userLogin'>Logga in</button> </div>")

    var loginbutton = document.getElementById("userLogin");
    loginbutton.addEventListener("click", function()
    {
        var userName = document.getElementById("userName").value;
        var userPass = document.getElementById("userPass").value;
        login(userName, userPass);

    });
    footerPart.innerHTML = "";
    footerPart.insertAdjacentHTML("beforeend", "<div> Sugen på att skapa en egen filmstudio? Ansök <button class='button' onclick='newFilmclubForm()'>Här</button></div>")
}

function login(name, password)
{
    userPartError.innerHTML = "";
    fetch("https://localhost:5001/api/filmstudio")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        for (i = 0; i < json.length; i++)
        {
            if (name == json[i].name && password == json[i].password && json[i].verified == true)
            {
                console.log("Inloggad")
                localStorage.setItem("userId", i)
                localStorage.setItem("userName", json[i].name)
            }
            else
            {
                console.log("fel");
            }
        }
        if (localStorage.getItem("userId") !== "null")
        {
            showUserInfo();
        }
        else
        {
            errorLogin();
        }
    });

}

function errorLogin()
{
    userPartError.innerHTML = "";
    userPartError.insertAdjacentHTML("beforeend", "<div>Filmstudio eller lösenord är fel, försök igen</div>");
}

printList();
function printList()
{
    fetch("https://localhost:5001/api/film")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("printList", json);

        leftSidePage.innerHTML = "";
        rightSidePage.innerHTML = "";
        
        json.sort((a, b) => (a.name > b.name) ? 1 : -1);
        leftSidePage.insertAdjacentHTML("beforeend", "<div> FILMER </div>");

        for (i = 0; i < json.length; i++)
        {
            console.log(json[i].name)
            leftSidePage.insertAdjacentHTML
            ("beforeend", "<div><button class='buttonMovie' onclick='showMovie(" + json[i].id + ")'> " + json[i].name + "</button>" +"</div>");
        }
    });
};

function showMovie(id)
{
    console.log("ShowMovie", id);
    fetch('https://localhost:5001/api/film/' + id)
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        //var findMovie = json.find(a => a.id === "1");
        console.log(json.name);
        leftSidePage.innerHTML = "";
        leftSidePage.insertAdjacentHTML("beforeend", "<div class='movie'><b>" + json.name + "</b></div>");

        if (localStorage.getItem("userId") !== "null")
        {
            leftSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='rentMoviePage(" + id + "," + json.stock + ")'> Utlåningssida</button></div>");
        }
        else
        {
            leftSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie disabled'> Utlåningssida</button></div>");
        }

        leftSidePage.insertAdjacentHTML("beforeend", "<div class='movie'> <img src='media/moviePoster.jpg' alt='Poster' style='width: 75%;' > </div>");


    });
    fetch("https://localhost:5001/api/filmtrivia")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        var filterMovie = json.filter(a => a.filmId == id);
        console.log(filterMovie);
        
        rightSidePage.innerHTML = "";
        rightSidePage.insertAdjacentHTML("beforeend", "<div class='triviaName'>" + "Trivia" + "<button class='button' onclick='printList()'> Till startsidan</button></div>");


        for ( i=0; i < filterMovie.length; i++)
        {
            rightSidePage.insertAdjacentHTML("beforeend", "<div class='trivia'>" + "* " + filterMovie[i].trivia + "</div>");
        }
        if (filterMovie == 0)
        {
            rightSidePage.insertAdjacentHTML("beforeend", "<div class='trivia'> Finns ingen trivia än för denna film.</div>");
        }
    });
};

function rentMoviePage(movieId, stock)
{
    //var moviesOut;
    var studioId = localStorage.getItem("userId");
    fetch("https://localhost:5001/api/rentedfilm")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        var moviesOut = json.filter(a => a.filmId == movieId && a.returned == false).length;
        var rentExist = json.filter(a => a.studioId == studioId && a.filmId == movieId && a.returned == false).length;
        //var rentId = rentExist.id;
        console.log("vad: "+ rentExist);

        rightSidePage.innerHTML = "";
        rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='button' onclick='printList()'> Till startsidan</button></div>");
        rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='rentMovie(" + movieId + "," + studioId +")'> Skriv trivia</button></div>");
        
        if (moviesOut < stock)
        {
            console.log("går att hyra");
            rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='rentMovie(" + movieId + "," + studioId +")'> Hyr film</button></div>");
        }
        else
        {
            //rightSidePage.innerHTML = "";
            console.log("går inte att hyra");
            rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie disabled' > HYR FILM</button></div>");
        }
        
        if (rentExist > 0)
        {
            var rent = json.find(a => a.studioId == studioId && a.filmId == movieId && a.returned == false);
            var rentId = rent.id;
            console.log("Finns utlåning");
            rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='returnMovie(" + rentId + "," + movieId + "," + studioId +")'> Återlämna film</button></div>");      
        }
        
    });
}
function rentMovie(movieId, studioId)
{
    console.log("Låna!")

    fetch('https://localhost:5001/api/rentedfilm',
    {
        method: 'POST',
        headers:
        { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                filmId: movieId,
                studioId: studioId
            }),
    })
    .then(response => response.json())
    .then(data =>
        {
            console.log('Success:', data);
            printList();
        })
    .catch((error) =>
    {
        console.error('Error:', error)
    });
}

function returnMovie(id, movieId, studioId)
{
    console.log("Lämna tillbaka")

    fetch('https://localhost:5001/api/rentedfilm/' + id,
    {
        method: 'PUT',
        headers:
        { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                id: id,
                filmId: movieId,
                studioId: studioId,
                returned: true
            }),
    })
    .then(data =>
        {
            console.log('Success:', data);
            printList();
        })
}

function newFilmclubForm()
{
    leftSidePage.innerHTML = "";
    leftSidePage.insertAdjacentHTML("beforeend", "<div> The first rule of SFF is: You do not talk about SFF <br> The second rule of SFF is: You do not talk about SFF! <br> --- </div>")
    leftSidePage.insertAdjacentHTML("beforeend", "<div> När ni skickat in er ansökan, får ni ett mail när ni <br> blivit verifierade och kan då börja låna filmer. </div>")
    rightSidePage.innerHTML = "";
    rightSidePage.insertAdjacentHTML("beforeend", "<div> SKAPA NY FILMSTUDIO </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Namn/Stad: <input type:'text' id='newStudioName'> </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Epost: <input type:'text' id='newStudioMail'> </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Lösenord: <input type:'text' id='newStudioPassword'> </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> <button class='button' onclick='printList()'> Gå tillbaka </button> <button class='button' id='saveNewFilmclub'> Skicka in! </button></div>")

    var saveFilmclubButton = document.getElementById("saveNewFilmclub");
    saveFilmclubButton.addEventListener("click", function()
{
    var newStudioName = document.getElementById("newStudioName").value;
    var newStudioMail = document.getElementById("newStudioMail").value;
    var newStudioPassword = document.getElementById("newStudioPassword").value;
    //console.log("Skicka in: " + newStudioName + newStudioPassword);
    creatFilmclub(newStudioName, newStudioMail, newStudioPassword);

});
}

function creatFilmclub(name, mail, password)
{
    fetch('https://localhost:5001/api/filmstudio',
    {
        method: 'POST',
        headers:
        { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                // Add mail when database is fixed
                //mail: mail,
                name: name,
                password: password
            }),
    })
    .then(response => response.json())
    .then(data =>
        {
            console.log('Success', data);
            printList();
        })
    .catch((error) =>
    {
        console.error('Error:', error)
    });

}
