'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Note } from '@/app/lib/notes'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/app/lib/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { randomUUID } from 'crypto';

const AddNotePage = () => {
    const router = useRouter();
    const queryClinet = useQueryClient();
    type NoteInput = Pick<Note, "id" | "title" | "content">
    const [formData, setFormData] = useState<NoteInput>({
      id: 0,
      title: "",
      content: ""
    })

    const {mutate: addNote, isPending, isError, error} = useMutation<unknown, Error, NoteInput>({
      mutationFn: async ({id, title, content}) => {
        try {
          const res = await fetch(`${api}/notes`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({id, title, content})
          })
          const data = await res.json();
          console.log(data)
          if(!res.ok){
            throw new Error(data.error || "something went wrong")
          }
        } catch (error) {
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("new note added sucessfully");
        queryClinet.invalidateQueries({
          queryKey:["addNote"]
        })
        router.push('/notes')
      }
    })

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target;
      setFormData({...formData, [name]:value})
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormData({...formData, id: Math.floor(Math.random() * 1000000)})
      addNote(formData)
    }
  return(
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-3">Add New Note</h1>
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
        {isPending?<LoadingSpinner size={20} color='white' />:"save"}
      </button>
      {isError&&<p className='text-red-400'>{error.message}</p>}
    </form>
  )
}

export default AddNotePage