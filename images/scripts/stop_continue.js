export     function replacePage(url) {
jatos.onLoad(async function () {


    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                html = html.replace('<script src="jatos.js"></script>', ''); // remove the script tag
                // html = html.replace('<script type="module" src="scripts/main.js"></script>', ''); // remove the script tag
                document.open();
                document.write(html);
                document.close();
                resolve();
            })
            .catch(error => {
                console.error('Error fetching new page:', error);
                reject(error);
            });
    });

});

}