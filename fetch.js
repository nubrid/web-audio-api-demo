import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
    const data = ref(null)
    const error = ref(null)

    const isUrlReactive = isRef(url)

    async function doFetch() {
        // reset state before fetching..
        if (isUrlReactive) {
            data.value = null
            error.value = null
        }

        // resolve the url value synchronously so it's tracked as a dependency by watchEffect()
        const urlValue = unref(url)

        try {
            // unref() will return the ref value if it's a ref
            // otherwise the value will be returned as-is
            const response = await fetch(urlValue)
            data.value = urlValue.endsWith('.ogg') ? response : await response.json()
        } catch (fetchError) {
            error.value = fetchError
        }
    }

    if (isUrlReactive) {
        // setup reactive re-fetch if input URL is a ref
        watchEffect(doFetch)
    } else {
        // otherwise, just fetch once
        doFetch()
    }

    return { data, error, retry: doFetch }
}
