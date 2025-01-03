document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchInput = document.getElementById('search');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        userList.innerHTML = '';
        reposList.innerHTML = '';

        const query = searchInput.value.trim();
        if (!query) return;
        
        const url = `https://api.github.com/search/users?q=${query}`

        try {
            const response = await fetch(url, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            if (!response.ok) throw Error('Network response was not ok');
            
            const data = await response.json();
            data.items.forEach((user) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login}'s avatar">
                    <a href="${user.html_url}" target="_blank">${user.login}</a>
                `;
                listItem.addEventListener('click', () => fetchAndDisplayRepos(user.login));
                userList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    async function fetchAndDisplayRepos(username) {
        reposList.innerHTML = '';
        const url = `https://api.github.com/search/users/${username}/repos`;

        try {
            const response = await fetch (url, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                }
            });
            if (!response.ok) throw Error('Network response was not ok');
            
            const repos = await response.json();
            repos.forEach((repo) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="${repo.html_url} target="_blank">${repo.name}</a>
                `;
                reposList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching repos:', error);
        }
    }
});

