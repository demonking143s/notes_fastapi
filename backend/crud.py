from . import models
from sqlalchemy.orm import Session

def get_notes(db: Session):
    return db.query(models.Note).all()

def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()

def create_note(db: Session, title: str, content: str):
    note = models.Note(title=title, content=content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def update_note(db: Session, note_id: int, title: str, content: str):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if note:
        note.title = title
        note.content = content
        db.commit()
        db.refresh(note)
    return note

def delete_note(db: Session, note_id: int):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if note:
        db.delete(note)
        db.commit()
    return