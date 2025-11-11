'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { Note } from '@/app/lib/notes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const EditNotePage = () => {

  const params = useParams();
  const noteId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  type NoteInput = Pick<Note, "id" | "title" | "content">;

  const [formData, setFormData] = useState<NoteInput>({
    id: 0,
    title: "",
    content: ""
  })

  const {data: note} = useQuery<unknown, Error, Note>({
    queryKey:["note", noteId],
    queryFn: async () => {
      try {
        const res = await fetch(`${api}/notes/${noteId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          }
        })
        const data = await res.json();
        console.log(data);
        if(!res.ok){
          throw new Error (data.error || "something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    }
  })

  useEffect(()=>{
    if(note) {
    setFormData({
      id: note.id,
      title: note.title || '',
      content: note.content || ''
    })
    }
  }, [note])

  const {mutate: updateNote, isPending, isError, error} = useMutation<unknown, Error, NoteInput>({
    mutationFn: async ({id, title, content}) => {
      try {
        const res = await fetch(`${api}/notes/${noteId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({id, title, content})
        })
        const data = await res.json();
        console.log(data);
        if(!res.ok) {
          throw new Error(data.error || "something went wrong")
        }
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("note updated successfully")
      queryClient.invalidateQueries({
        queryKey:["update Note", noteId]
      })
      router.push("/notes")
    }
  })

  const handleInputChanges = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData({...formData,  [name]: value})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNote(formData);
  }

  if (!note) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-3">Edit Note</h1>
      <input
      type='text'
      name='title'
        className="border p-2 w-full mb-2 rounded"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChanges}
      />
      <textarea
      name='content'
        className="border p-2 w-full mb-2 rounded h-32"
        placeholder="Content"
        value={formData.content}
        onChange={handleInputChanges}
      />      
      <button
        type='submit'
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending? <LoadingSpinner size={20} color='white' />:"save note"}
      </button>
      {isError && <p className='text-red-400'>{error.message}</p>}
    </form>
  )
}

export default EditNotePage