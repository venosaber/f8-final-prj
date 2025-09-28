import api from '../plugins/api.ts'

export const getMethod = async (endpoint: string) => {
    try {
        const {data} = await api.get(endpoint);
        return data;
    } catch (e) {
        console.log(e);
    }

    return null;
}

export const postMethod = async (endpoint: string, payload: unknown) => {
    try {
        const {data} = await api.post(endpoint, payload);
        return data;
    } catch (e) {
        console.log(e);
    }

    return null;
}

export const putMethod = async (endpoint: string, payload: unknown) => {
    try {
        const {data} = await api.put(endpoint, payload);
        return data;
    } catch (e) {
        console.log(e);
    }

    return null;
}

export const deleteMethod = async (endpoint: string) => {
    try {
        const {data} = await api.delete(endpoint);
        return data;
    } catch (e) {
        console.log(e);
    }

    return null;
}