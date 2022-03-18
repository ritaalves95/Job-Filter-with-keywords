const searchBar = document.getElementById('search-bar');
const searchTags = document.getElementById('search-tags');
const clearBtn = document.getElementById('clear');
const showTags = document.getElementById('search-tags');
const contentContainer = document.getElementById('content-container');
const listItems = [];
let listTags = [];

getData();
//fetch
    async function getData(){
        const res = await fetch('./data.json');
        const results = await res.json();

        results.forEach(user => {
            const item = document.createElement('div');
            item.classList.add('content-item')
            listItems.push(item);

            item.innerHTML = `
            <div>
                <article>
                    <img src=${user.logo} alt=${user.company} />
                </article>
                <article>
                    <p>${user.company}</p>
                    ${user.new ?
                    `<span class="new-job">New!</span>` : ''}
                    ${user.new ?
                    `<span class="feature-job">Featured</span>` : ''}
                    <a href="#">${user.position}</a>
                    <ul>
                        <li>${user.postedAt} </li>
                        <li>${user.contract}</li>
                        <li>${user.location}</li>
                    </ul>
                </article>
            </div>
            <article class="tags">
                <ul>
                    ${user.languages.map(lang => 
                        `<li class='tag' data-lang=${lang}>
                            ${lang}
                        </li> `
                        ).join('')}
                </ul>
            </article> 
            `;


            contentContainer.appendChild(item);
        })
        addEvent('.tag', createTag)
    }
    
// add event to an element
    function addEvent(elmnt, onclick) {
        const el = document.querySelectorAll(elmnt)
        el.forEach(el => el.onclick = onclick)
    }

// create tags
    function createTag(e) {
        if(!listTags.includes(e.currentTarget.getAttribute('data-lang'))){
            listTags.push(e.currentTarget.getAttribute('data-lang'));

            searchBar.classList.remove('hidden');

            searchTags.innerHTML = `
                <ul>
                    ${listTags.map(tag => `
                    <li class='tag-search' id=${tag}>
                        ${tag}
                        <span>
                        <i class='fa-solid fa-xmark'></i>
                        </span>
                    </li> 
                    `).join('')}
                </ul>`

            addEvent('.tag-search', removeTag)
        }

        filterData()
    }

// remove tags
    function removeTag(e) {
        let newList = listTags.filter(item => item !== e.currentTarget.id);
        listTags = newList
        const item = document.getElementById(e.currentTarget.id);
        item.remove()
        
        if(!listTags.length){
            searchBar.classList.add('hidden');
        }

        filterData()
    }

//  clear search
    clearBtn.addEventListener('click', () => {
        listTags.forEach(item => {
            const search = document.getElementById(item);
            search.remove();

            listTags = [];
        })
        searchBar.classList.add('hidden');
        filterData()
    }) 

//  filter jobs
function filterData(e){
    for (let i = 0; i < listItems.length; i++) {
        const tags = listItems[i].children[1].children[0].children

        for (let i = 0; i < listItems.length; i++) {
            listItems[i].setAttribute('data-display', false)

            listTags.forEach(tag => {
                if(!listItems[i].innerHTML.includes(tag) && listItems[i].getAttribute('data-display') === 'false'){
                    listItems[i].style.display = 'none';
                    listItems[i].setAttribute('data-display', false)
                }else{
                    listItems[i].setAttribute('data-display', true)
                    listItems[i].style.display = 'flex';
                }
            })
            
        }
    }

    if(!listTags.length){
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].style.display = 'flex';
        }
    }
}