"""
File upload utilities.
"""
import os
import uuid
from pathlib import Path
from fastapi import UploadFile
from app.config import get_settings

settings = get_settings()


async def save_upload(file: UploadFile, subfolder: str = "") -> str:
    """
    Save an uploaded file to disk.
    Returns the relative path to the saved file.
    """
    upload_dir = Path(settings.UPLOAD_DIR) / subfolder
    upload_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename or "file").suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = upload_dir / filename

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    return str(filepath)
