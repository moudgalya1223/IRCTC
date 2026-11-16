from abc import ABC, abstractmethod
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.security.jwt import InvalidTokenError, decode_access_token


_bearer_scheme = HTTPBearer()


class commonheader(ABC):
    @abstractmethod
    def validate(
        self,
        credentials: HTTPAuthorizationCredentials,
    ) -> dict[str, Any]:
        pass


class jwttokenheader(commonheader):
    def __call__(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
    ) -> dict[str, Any]:
        return self.validate(credentials)

    def validate(
        self,
        credentials: HTTPAuthorizationCredentials,
    ) -> dict[str, Any]:
        try:
            return decode_access_token(credentials.credentials)
        except InvalidTokenError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired access token.",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc
