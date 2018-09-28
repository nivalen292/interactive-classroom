const postRequest = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

const getRequest = (url) => {
    return fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => Promise.resolve(data))
            .catch((err) => console.log(err));
}

export { postRequest, getRequest };