from django.core.cache import caches


class Cache:

    RedisCache = caches["default"]

    def get_cache(
        key: str,
        query: callable = lambda: any,
        timeout: int = 10,
        cache: any = RedisCache,
    ) -> any:
        data = cache.get(key)
        if data is None:
            data = query()
            cache.set(key, data, timeout)
        return data
