import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, setDoc, query, orderBy } from 'firebase/firestore';
import { useUser } from './UserContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    const { user } = useUser();
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState(['General', 'Personal', 'Work', 'Ideas']);
    const [loading, setLoading] = useState(true);

    // Sync Notes & Folders
    useEffect(() => {
        if (!user) {
            setNotes([]);
            setLoading(false);
            return;
        }

        // 1. Sync Notes
        const q = query(collection(db, 'users', user.uid, 'notes'), orderBy('updatedAt', 'desc'));
        const unsubNotes = onSnapshot(q, (snapshot) => {
            setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Sync Folders (stored in users/{uid}/settings/notes)
        const folderRef = doc(db, 'users', user.uid, 'settings', 'notes');
        const unsubFolders = onSnapshot(folderRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().folders) {
                setFolders(docSnap.data().folders);
            } else {
                // Initialize default folders if not exists
                setDoc(folderRef, { folders: ['General', 'Personal', 'Work', 'Ideas'] }, { merge: true });
            }
        });

        setLoading(false);
        return () => {
            unsubNotes();
            unsubFolders();
        };
    }, [user]);

    const addNote = async (title, content, folder = 'General', tags = []) => {
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'notes'), {
            title: title || 'Untitled Note',
            content,
            folder,
            tags,
            updatedAt: new Date().toISOString()
        });
    };

    const updateNote = async (id, updates) => {
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid, 'notes', id), {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    };

    const deleteNote = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
    };

    const addFolder = async (name) => {
        if (!user || folders.includes(name)) return;
        const newFolders = [...folders, name];
        await setDoc(doc(db, 'users', user.uid, 'settings', 'notes'), { folders: newFolders }, { merge: true });
    };

    return (
        <NotesContext.Provider value={{ notes, folders, loading, addNote, updateNote, deleteNote, addFolder }}>
            {children}
        </NotesContext.Provider>
    );
};
