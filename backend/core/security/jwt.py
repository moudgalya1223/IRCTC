import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Mapping

from authlib.jose import JsonWebToken, JoseError
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parents[2] / ".env")

_ALGORITHM = "HS256"
_DEFAULT_EXPIRY = timedelta(minutes=60)
_SECRET_ENV_VAR = "JWT_SECRET"
_jwt = JsonWebToken([_ALGORITHM])


class InvalidTokenError(ValueError):
    """Raised when a JWT cannot be created or verified."""


def _get_secret() -> str:
    secret = os.getenv(_SECRET_ENV_VAR)
    if not secret:
        raise RuntimeError(
            f"{_SECRET_ENV_VAR} must be configured before using JWT authentication."
        )
    return secret


def create_access_token(
    subject: str,
    expires_in: timedelta = _DEFAULT_EXPIRY,
    additional_claims: Mapping[str, Any] | None = None,
) -> str:
    if not subject:
        raise ValueError("JWT subject must not be empty.")
    if expires_in <= timedelta(0):
        raise ValueError("JWT expiry must be greater than zero.")

    now = datetime.now(timezone.utc)
    claims: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_in).timestamp()),
    }
    if additional_claims:
        claims.update(additional_claims)

    try:
        return _jwt.encode({"alg": _ALGORITHM, "typ": "JWT"}, claims, _get_secret()).decode(
            "ascii"
        )
    except (JoseError, UnicodeDecodeError) as exc:
        raise InvalidTokenError("Unable to create access token.") from exc


def decode_access_token(token: str) -> dict[str, Any]:
    if not token:
        raise InvalidTokenError("JWT must not be empty.")

    try:
        claims = _jwt.decode(token, _get_secret())
        claims.validate()
    except (JoseError, ValueError, TypeError) as exc:
        raise InvalidTokenError("Invalid or expired access token.") from exc

    return dict(claims)