export const getCookie = (name) => {
    const matches = document.cookie.match(
        new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`)
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

export function setCookie(name, value) {
    document.cookie = `${name}=${value}`;
}
