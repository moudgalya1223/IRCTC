import logging

from api.loginapi import app
from api.registerapi import app as registration_app


api_routers = [
    registration_app.router,
]

for api_router in api_routers:
    app.include_router(api_router)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)


__all__ = ["app"]