export function getFetchInitProps(method, body) {
    const res = {
        body: undefined,
        credentials: "include",
        headers: new Headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
        }),
        method,
        mode: "same-origin",
    };

    if (body) {
        res.body = body;
    }

    return res;
}