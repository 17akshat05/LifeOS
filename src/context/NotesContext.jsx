import useDataSync from '../hooks/useDataSync';
import { v4 as uuidv4 } from 'uuid';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useDataSync('lifeos_notes', [
        {
            id: 'welcome-note',
            title: 'Welcome to Notes',
            content: 'This is your new digital brain. \n\nFeatures:\n- Create folders\n- Add tags\n- Secure private notes',
            folder: 'General',
            tags: ['welcome', 'info'],
            updatedAt: new Date().toISOString()
        }
    ]);

    const [folders, setFolders] = useDataSync('lifeos_folders', ['General', 'Personal', 'Work', 'Ideas']);

    const addNote = (title, content, folder = 'General', tags = []) => {
        const newNote = {
            id: uuidv4(),
            title: title || 'Untitled Note',
            content,
            folder,
            tags,
            updatedAt: new Date().toISOString()
        };
        setNotes(prev => [newNote, ...prev]);
    };

    const updateNote = (id, updates) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const addFolder = (name) => {
        if (!folders.includes(name)) {
            setFolders(prev => [...prev, name]);
        }
    };

    return (
        <NotesContext.Provider value={{ notes, folders, addNote, updateNote, deleteNote, addFolder }}>
            {children}
        </NotesContext.Provider>
    );
};
