"""
Reusable validators.
"""
import re


def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))


def validate_password_strength(password: str) -> str | None:
    """Returns an error message if weak, else None."""
    if len(password) < 6:
        return "Password must be at least 6 characters"
    return None
