from fastapi import FastAPI, Depends, HTTPException;
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from . import models, database, crud

models.Base.metadata.create_all(bind= database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class NoteBase(BaseModel):
    id: int
    title: str
    content: str

notes = []

@app.get("/notes")
def get_notes(db: Session = Depends(database.get_db)):
    return crud.get_notes(db)

@app.get("/notes/{note_id}")
def get_note(note_id: int, db: Session = Depends(database.get_db)):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=400, detail="Note not found")
    return note

@app.post("/notes")
def create(note: NoteBase, db: Session = Depends(database.get_db)):
    return crud.create_note(db, note.title, note.content)

@app.put("/notes/{note_id}")
def update(note_id: int, note: NoteBase, db: Session = Depends(database.get_db)):
    updated = crud.update_note(db, note_id, note.title, note.content)
    if not updated:
        raise HTTPException(status_code=400, detail="Note not found")
    return updated
    
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(database.get_db)):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=400, detail="Note not found")
    deleted = crud.delete_note(db, note_id)
    return {"message": "Note deleted successfully"}