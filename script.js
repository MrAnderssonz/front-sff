var movieList = document.getElementById("movieList");
var triviaList = document.getElementById("triviaList");

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

        for (i = 0; i < json.length; i++)
        {
            console.log(json[i].name)
            movieList.insertAdjacentHTML
            ("beforeend", "<div><button onclick='showMovie(" + json[i].id + ")'> " + json[i].name + "</button>" +"</div>");
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
        triviaList.insertAdjacentHTML("beforeend", "<div><button onclick='printList()'> Gå tillbaka</button></div>");

    });
};