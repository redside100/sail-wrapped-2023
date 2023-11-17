import { API_BASE } from "./consts";

export const login = async (code) => {
    const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code
        })
    });
    return res.json();
};

export const logout = async (token) => {
    const res = await fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        headers: {
          token
        }
    });
    return res.json();
};

export const getInfo = async (token) => {
    const res = await fetch(`${API_BASE}/api/info`, {
        method: 'POST',
        headers: {
          token
        }
    });
    return res.json();
}

export const refreshToken = async (refreshToken) => {
    const res = await fetch(`${API_BASE}/api/refresh`, {
        method: 'POST',
        headers: {
          token: refreshToken
        }
    });
    return res.json();
}