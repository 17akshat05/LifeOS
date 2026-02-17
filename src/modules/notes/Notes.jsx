import React, { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import Card from '../../components/Card';
import { Plus, Search, Folder, ChevronLeft, Save, Trash2, Tag, Lock } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
    const { notes, folders, addNote, updateNote, deleteNote, addFolder } = useNotes();
    const [search, setSearch] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('All');

    // Editor State
    const [activeNote, setActiveNote] = useState(null); // null = list view, object = editor view
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editFolder, setEditFolder] = useState('General');

    // Create new note
    const handleCreate = () => {
        const newNoteId = 'temp-new';
        setActiveNote({ id: newNoteId, title: '', content: '', folder: selectedFolder === 'All' ? 'General' : selectedFolder });
        setEditTitle('');
        setEditContent('');
        setEditFolder(selectedFolder === 'All' ? 'General' : selectedFolder);
    };

    const handleEdit = (note) => {
        setActiveNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditFolder(note.folder);
    };

    const handleSave = () => {
        if (activeNote.id === 'temp-new') {
            addNote(editTitle, editContent, editFolder);
        } else {
            updateNote(activeNote.id, { title: editTitle, content: editContent, folder: editFolder });
        }
        setActiveNote(null);
    };

    const handleDelete = () => {
        if (activeNote.id !== 'temp-new') {
            deleteNote(activeNote.id);
        }
        setActiveNote(null);
    };

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || note.content.toLowerCase().includes(search.toLowerCase());
        const matchesFolder = selectedFolder === 'All' || note.folder === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    if (activeNote) {
        return (
            <div style={{ padding: '20px', paddingBottom: '100px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setActiveNote(null)} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {activeNote.id !== 'temp-new' && (
                            <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#EF4444' }}>
                                <Trash2 size={24} />
                            </button>
                        )}
                        <button onClick={handleSave} style={{ background: 'none', border: 'none', color: 'var(--color-notes)' }}>
                            <Save size={24} />
                        </button>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Title"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        outline: 'none'
                    }}
                />

                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                    <select
                        value={editFolder}
                        onChange={e => setEditFolder(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            outline: 'none'
                        }}
                    >
                        {folders.map(f => <option key={f} value={f} style={{ color: 'black' }}>{f}</option>)}
                    </select>
                </div>

                <textarea
                    placeholder="Start typing..."
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        resize: 'none',
                        outline: 'none'
                    }}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Notes</h1>
                <button onClick={handleCreate} style={{ background: 'var(--color-notes)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}>
                    <Plus size={24} color="white" />
                </button>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: '12px', marginBottom: '20px' }}>
                <Search size={20} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                />
            </div>

            {/* Folders */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
                <button
                    onClick={() => setSelectedFolder('All')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: selectedFolder === 'All' ? 'white' : 'rgba(255,255,255,0.1)',
                        color: selectedFolder === 'All' ? 'black' : 'white',
                        border: 'none',
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All
                </button>
                {folders.map(f => (
                    <button
                        key={f}
                        onClick={() => setSelectedFolder(f)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            background: selectedFolder === f ? 'white' : 'rgba(255,255,255,0.1)',
                            color: selectedFolder === f ? 'black' : 'white',
                            border: 'none',
                            fontSize: '14px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Notes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {filteredNotes.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>No notes found.</div>
                ) : filteredNotes.map(note => (
                    <Card key={note.id} onClick={() => handleEdit(note)} style={{ height: '180px', display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {note.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                            {note.content}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>
                            <span>{format(new Date(note.updatedAt), 'MMM d')}</span>
                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{note.folder}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notes;
