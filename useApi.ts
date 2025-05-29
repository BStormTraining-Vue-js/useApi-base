import { ref, type Ref } from 'vue';

export namespace useApi {
    export type ApiResult<T> = [data: Ref<T|undefined>, error: Ref<unknown>, isLoading: Ref<boolean>];
    export type ApiCallBack = (...args: unknown[]) => void;
    export type ApiRequest<T> = (...args: unknown[]) => Promise<T>;
}

export function useApi<T>(apiRequest: useApi.ApiRequest<T>): [useApi.ApiCallBack, useApi.ApiResult<T>] {
    const data = ref<T>();
    const error = ref<any>();
    const isLoading = ref<boolean>(false);

    async function callback(...args: unknown[]) {
        isLoading.value = true;
        try {
            const response = await apiRequest(...args);
            data.value = response
        } catch(err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    return [
        callback,
        [data, error, isLoading]
    ];
}
