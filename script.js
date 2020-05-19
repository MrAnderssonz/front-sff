var movieList = document.getElementById("movieList");
var triviaList = document.getElementById("triviaList");
var userPart = document.getElementById("user");
var userPartError = document.getElementById("usererror");

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
    "<div> Filmstudio <input type='text' id='userName'>  Lösenord <input type='password' id='userPass'> <button class='button' id='userLogin'>Logga in</button> </div>")

    var loginbutton = document.getElementById("userLogin");
    loginbutton.addEventListener("click", function()
    {
        var userName = document.getElementById("userName").value;
        var userPass = document.getElementById("userPass").value;
        login(userName, userPass);

    });
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

        movieList.innerHTML = "";
        triviaList.innerHTML = "";
        
        json.sort((a, b) => (a.name > b.name) ? 1 : -1);
        movieList.insertAdjacentHTML("beforeend", "<div> FILMER </div>");

        for (i = 0; i < json.length; i++)
        {
            console.log(json[i].name)
            movieList.insertAdjacentHTML
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
        movieList.innerHTML = "";
        movieList.insertAdjacentHTML("beforeend", "<div class='movie'>" + json.name + "</div>");
        movieList.insertAdjacentHTML("beforeend", "<div class='movie'> <img src='media/moviePoster.jpg' alt='Poster' style='width: 75%;' > </div>");

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
        
        triviaList.innerHTML = "";
        triviaList.insertAdjacentHTML("beforeend", "<div class='triviaName'>" + "Trivia" + "</div>");


        for ( i=0; i < filterMovie.length; i++)
        {
            triviaList.insertAdjacentHTML("beforeend", "<div class='trivia'>" + "* " + filterMovie[i].trivia + "</div>");
        }
        triviaList.insertAdjacentHTML("beforeend", "<div><button class='button' onclick='printList()'> Gå tillbaka</button></div>");

    });
};

function newFilmclubForm()
{
    movieList.innerHTML = "";
    triviaList.innerHTML = "";
    triviaList.insertAdjacentHTML("beforeend", "<div> SKAPA NY FILMSTUDIO </div>")
    triviaList.insertAdjacentHTML("beforeend", "<div> Namn/Stad: <input type:'text' id='newStudioName'> </div>")
    triviaList.insertAdjacentHTML("beforeend", "<div> Lösenord: <input type:'text' id='newStudioPassword'> </div>")
    triviaList.insertAdjacentHTML("beforeend", "<div> <button class='button' onclick='printList()'> Gå tillbaka </button> <button class='button' id='saveNewFilmclub'> Skicka in! </button></div>")

    var saveFilmclubButton = document.getElementById("saveNewFilmclub");
    saveFilmclubButton.addEventListener("click", function()
{
    var newStudioName = document.getElementById("newStudioName").value;
    var newStudioPassword = document.getElementById("newStudioPassword").value;
    //console.log("Skicka in: " + newStudioName + newStudioPassword);
    creatFilmclub(newStudioName, newStudioPassword);

});
}

function creatFilmclub(name, password)
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
                name: name,
                password: password
            }),
    })
    .then(response => response.json())
    .then(data =>
        {
            console.log('Success');
            printList();
        })
    .catch((error) =>
    {
        console.error('Error:', error)
    });

}