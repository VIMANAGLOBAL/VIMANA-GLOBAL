export const handleFetch = (url, method, value) =>
    fetch(`/api${url}`, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(value)
    }).then((res) => res.json());

export const handleUpload = (url, value) =>
    fetch(`/api${url}`, {
        method: 'POST',
        credentials: 'include',
        body: value
    }).then((res) => res.json());
