import { Octokit } from "https://esm.sh/octokit";



const apiKey = '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';
let currentPage = 1;
const octokit = new Octokit({ auth: apiKey });

const getRepoButton = document.getElementById("getRepo");
const perPage =document.getElementById("perPage");

perPage.onchange = ()=>{
    currentPage = 1
}
export async function getRepositories() {
    const username = document.getElementById("username").value;
    const perPageValue = document.getElementById("perPage").value;
    const profileinfo = document.getElementById("Profile")
    const profilepic = document.getElementById("profilePicture");
    const repositoriesList = document.getElementById("repositories");
    const loader = document.getElementById("loader");
    const pagination = document.getElementById("pagination");
    const githubLink = document.getElementById("githubLink");

    // Clear previous repositories and pagination
    repositoriesList.innerHTML = "";
    pagination.innerHTML = "";

    // Show loader
    loader.style.display = "block";
    try {
        const response = await octokit.request(`GET /users/${username}/repos`, {
            per_page: perPageValue,
            page:currentPage,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        console.log(response)
        if (response.status!=200) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        try{

            var url = response.data[0].owner.avatar_url;  
        }
        finally{
            profilepic.setAttribute("src",url)
        }
        console.log(url)
        const repositories = await response.data;
        profileinfo.style.display = "block"
        

        githubLink.setAttribute("href", "https://github.com/"+username);

        repositories.forEach(repo => {
            const listItems = document.createElement("li");
            
            const linktag = document.createElement("a");
            linktag.setAttribute("href",repo.html_url);
            linktag.setAttribute("target","_blanck")
            linktag.classList.add("repository");
            linktag.className = "col-md-5 card m-2 p-2 border border-primary text-decoration-none  text-black"

            const reponame = document.createElement("h5")
            reponame.className = "text-decoration-none text-dark"
            reponame.textContent=`${repo.name}<br> `
            const repodisc = document.createElement("h6") 
            repodisc.className= "text-decoration-none text-secondary"
            repodisc.textContent=` ${repo.description || 'No description available'}`;

            linktag.appendChild(reponame)
            linktag.appendChild(repodisc)
        
            

            var topicList = document.createElement("ul");
            topicList.className = 'row mt-15 '


            repo.topics.forEach((topic)=>{

                    
                console.log(topic)    
                var topicelement = document.createElement("li");
                topicelement.classList.add("topic")
                topicelement.className = "col-auto bg-primary text-white rounded-pill m-1 px-2 py-1 list-unstyled"
                topicelement.textContent = topic;
                topicList.appendChild(topicelement);
                
            });
        
            linktag.appendChild(topicList);
            listItems.appendChild(linktag);
            repositoriesList.appendChild(linktag);


        });

        // Pagination
        
            var totalPages = 1
            if (typeof response.headers.link !== 'undefined') {
                console.log("it ran")
                let last = response.headers.link.match(/&page=(\d+)>; rel="last"/)
                let prev = response.headers.link.match(/&page=(\d+)>; rel="prev"/)
                if (last!==null) {
                    totalPages = parseInt(last[1])
                }
                else{
                    totalPages = parseInt(prev[1])+1
                }
            }
            else{
                totalPages = 1
            }
            
        
            createPaginationButtons(totalPages);
            disableUnvalidButtons(totalPages);
     
        
    }
    catch (error) {
        console.error(error.stack);
        console.log(error)
        repositoriesList.innerHTML = `<li class="repository">Error fetching repositories. Please check the username and try again.</li>`;
        customErrorHandler(error);
    }
    finally {
        loader.style.display = "none";
    }
}


function disableUnvalidButtons(totalPages){
    const prev = document.getElementById("prev")
    const next = document.getElementById("next")
    
    if(totalPages==1){
            prev.disabled = true
            next.disabled =true
    }
    if (currentPage===1){
        prev.disabled = true
    }
    else{
        prev.disabled = false
    }
    if(currentPage===totalPages){
        next.disabled = true
    }
    else{
        next.disabled = false
    }
}

    
function createPaginationButtons(totalPages) {
        const pagination = document.getElementById("pagination");
        var prev = document.createElement("button");
        prev.id = "prev"
        prev.textContent = "prev";
        prev.className = "btn btn-primary rounded-pill mr-3"
        prev.onclick = ()=>{goToPage("prev");}
        
        var next = document.createElement("button");
        next.id = "next"
        next.textContent = "next";
        next.className = "btn btn-primary rounded-pill mr-3"
        next.onclick = ()=>{ goToPage("next");}
        
        pagination.appendChild(prev);
        var startpage = NaN
        var endpage = NaN
         
        if (totalPages > 5) {
            startpage = Math.max(1, currentPage - 2,);
            endpage = Math.min(totalPages, Math.max(currentPage + 2,startpage+4));         
            startpage = Math.max(1,endpage-4)
            }
        else{
            startpage=1
            endpage=totalPages
            }

        
        console.log(startpage,endpage)
        for(let i = startpage; i <= endpage; i++) {
            console.log(i)
            var pagenumber = document.createElement("button");
            pagenumber.textContent = i;
            if (i==currentPage){
                pagenumber.classList.add("active")
                pagenumber.className = "btn btn-primary rounded-pill margin mr-3"
            }
            else{
                pagenumber.classList.remove("active")
                pagenumber.className = "btn btn-secondary rounded-pill margin mr-3"

            }
            pagenumber.onclick = function () {
                
                currentPage = i;
                getRepositories();
            };
            pagination.appendChild(pagenumber);}
            pagination.appendChild(next);
            
            
        }

function goToPage(direction) {
    console.log(direction)
    if (direction === 'prev' ) {
        currentPage--;
        getRepositories();

    } else if (direction === 'next' ) {
        currentPage++;
        getRepositories();

    }
}
window.callModuleFunction = function() {
    getRepoButton.disabled = true;

    setTimeout(function () {
    getRepoButton.disabled = false;
    }, 800);
  
    import('./script.js')
        .then(module => module.getRepositories())
        .catch(error => console.error(error));
};
