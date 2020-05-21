var admin = "admin";
var adminPassword = "admin";

var leftSidePage = document.getElementById("leftSidePage");
var rightSidePage = document.getElementById("rightSidePage");
var userPart = document.getElementById("user");
var userPartError = document.getElementById("usererror");
var footerPart = document.getElementById("footerPart");

if (localStorage.getItem("adminId") === "null")
{
    showLoginPage();

}  
else
{
    showUserInfo();
}

function menyPage()
{
    leftSidePage.innerHTML = "";
    rightSidePage.innerHTML = "";

    leftSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='filmclubList()'> FilmStudios </button>" +"</div>");
    leftSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='addMovieForm()'> Lägg till ny film </button>" +"</div>");
    leftSidePage.insertAdjacentHTML("beforeend", "<div><button class='buttonMovie' onclick='listNewClubs()'> Verified ny studio</button>" +"</div>");
}

function showUserInfo()
{
    var adminName = localStorage.getItem("adminName")

    userPart.innerHTML = "";
    userPart.insertAdjacentHTML("beforeend", 
    "<div> Inloggad som: " + adminName + "<button class='button' id='userLogout'>Logga ut</button><button class='button' onclick='menyPage()'> Till huvudmeny</button></div>")
    menyPage();

    var logoutButton = document.getElementById("userLogout");
    logoutButton.addEventListener("click", function()
    {
        localStorage.setItem("adminId", null);
        leftSidePage.innerHTML = "";
        rightSidePage.innerHTML = "";

        showLoginPage();
    });
}

function showLoginPage()
{
    userPart.innerHTML = "";
    userPart.insertAdjacentHTML("beforeend", 
    "<div><input type='text' id='adminName' Placeholder='Admin'> <input type='password' id='adminPass' Placeholder='Lösenord'> <button class='button' id='adminLogin'>Logga in</button> </div>")

    var loginbutton = document.getElementById("adminLogin");
    loginbutton.addEventListener("click", function()
    {
        var adminName = document.getElementById("adminName").value;
        var adminPass = document.getElementById("adminPass").value;
        login(adminName, adminPass);

    });
}

function login(name, password)
{
    userPartError.innerHTML = "";


    if (name == admin && password == adminPassword)
    {
        console.log("Inloggad")
        localStorage.setItem("adminId", "admin")
        localStorage.setItem("adminName", "Hal 9000")
    }
    else
    {
        console.log("fel");
    }
    if (localStorage.getItem("adminId") !== "null")
    {
        showUserInfo();
    }
    else
    {
        errorLogin();
    }
}
function errorLogin()
{
    userPartError.innerHTML = "";
    userPartError.insertAdjacentHTML("beforeend", "<div>Namn eller lösenord är fel, försök igen</div>");
}

function filmclubList()
{
    fetch("https://localhost:5001/api/filmstudio")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("printList", json);

        leftSidePage.innerHTML = "";
        rightSidePage.innerHTML = "";
        
        //json.sort((a, b) => (a.name > b.name) ? 1 : -1);
        var studios = json.filter(a => a.verified == true).sort((a, b) => (a.name > b.name) ? 1 : -1);
        leftSidePage.insertAdjacentHTML("beforeend", "<div> Film Studios </div>");

        for (i = 0; i < studios.length; i++)
        {
            leftSidePage.insertAdjacentHTML
            ("beforeend", "<div><button class='buttonMovie' onclick='getClubRentals(" + studios[i].id + ",\"" + studios[i].name + "\")'> " + studios[i].name + "</button>" +"</div>");
        }
    });
};

function getClubRentals(id, studioName)
{
    fetch('https://localhost:5001/api/rentedfilm')
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        var rentals = json.filter(a => a.studioId == id);
        showClubRentals(studioName, rentals);
    });
}

function showClubRentals(studioName, rentals)
{   
    fetch("https://localhost:5001/api/film")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        
        rightSidePage.innerHTML = "";
        rightSidePage.insertAdjacentHTML("beforeend", "<div class='movie'><b> Utlåningar " + studioName + "</b></div>");

        if (rentals == 0)
        {
            rightSidePage.insertAdjacentHTML("beforeend", "<div class='trivia'> Finns inga utlånade filmer än.</div>");
        }
        else
        {

            for ( i=0; i < json.length; i++)
            {
                for ( j=0; j < rentals.length; j++)
                {
                    if (json[i].id == rentals[j].filmId && rentals[j].returned == true)
                    {
                        rightSidePage.insertAdjacentHTML("beforeend", "<div class='rentReturned'>" + "* " + json[i].name + " (Återlämnad)</div>");
                    }
                    else if (json[i].id == rentals[j].filmId)
                    {
                        rightSidePage.insertAdjacentHTML("beforeend", "<div class='rent'>" + "* " + json[i].name + " (Ej återlämnad)</div>");
                    }
                }
            }
        }

    });
};

function addMovieForm()
{
    rightSidePage.innerHTML = "";
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Lägg till film </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Namn: <input type:'text' id='movieName'> </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div> Antal: <input type:'text' id='movieStock'> </div>")
    rightSidePage.insertAdjacentHTML("beforeend", "<div><button class='button' id='saveNewMovie'> Lägg till! </button></div>")

    var saveNewMovie = document.getElementById("saveNewMovie");
    saveNewMovie.addEventListener("click", function()
    {
        var movieName = document.getElementById("movieName").value;
        var movieStock = parseInt(document.getElementById("movieStock").value);
        addMovie(movieName, movieStock);

    });
}

function addMovie(name, stock)
{
    fetch('https://localhost:5001/api/film',
    {
        method: 'POST',
        headers:
        { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                name: name,
                stock: stock
            }),
    })
    .then(response => response.json())
    .then(data =>
        {
            console.log('Success', data);
            menyPage();
        })
    .catch((error) =>
    {
        console.error('Error:', error)
    });
}

function listNewClubs()
{
    fetch("https://localhost:5001/api/filmstudio")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("printList", json);
        
        leftSidePage.innerHTML = "";
        rightSidePage.innerHTML = "";
        
        var studios = json.filter(a => a.verified == false);
        rightSidePage.insertAdjacentHTML("beforeend", "<div> Ansökningar </div>");

        for (i = 0; i < studios.length; i++)
        {
            // need to add mail when it fixed
            rightSidePage.insertAdjacentHTML
            ("beforeend", "<div><button class='buttonMovie'onclick='verifyNewClub(" + studios[i].id + ",\"" + studios[i].name + "\" ,\"" + studios[i].password + "\")'> " + studios[i].name + "</button>" +"</div>");
        }
    });
}

function verifyNewClub(id, name, password)
{
    console.log(id, name, password)
    fetch('https://localhost:5001/api/filmstudio/' + id,
    {
        method: 'PUT',
        headers:
        { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                id: id,
                name: name,
                password: password,
                verified: true
            }),
    })
    .then(data =>
        {
            console.log('Success:', data);
            menyPage();
        })
}