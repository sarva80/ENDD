import React, { useState, useEffect } from 'react';
import './App.css';

const PASSWORD = 'mypassword123';

function App() {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('people');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [locationMet, setLocationMet] = useState('');
  const [importance, setImportance] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('notes') || '';
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');

  const GALLERY_PASSWORD = 'us7';

  const [galleryPassword, setGalleryPassword] = useState('');
  const [isGalleryAuthenticated, setIsGalleryAuthenticated] = useState(false);
  const [galleryImages, setGalleryImages] = useState(() => {
    const saved = localStorage.getItem('galleryImages');
    return saved ? JSON.parse(saved) : [];
  });
  const [galleryImageFile, setGalleryImageFile] = useState(null);

  // States needed for editing people
  const [editPersonId, setEditPersonId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    contact: '',
    locationMet: '',
    importance: '',
    image: null,
  });

  const handleGalleryPasswordSubmit = (e) => {
    e.preventDefault();
    if (galleryPassword === GALLERY_PASSWORD) {
      setIsGalleryAuthenticated(true);
    } else {
      alert('Incorrect gallery password, try again!');
      setGalleryPassword('');
    }
  };

  const handleGalleryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryImageFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (!galleryImageFile) return alert('Please select an image.');

    const newImage = {
      id: Date.now(),
      src: galleryImageFile,
    };

    const updatedGallery = [...galleryImages, newImage];
    setGalleryImages(updatedGallery);
    localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
    setGalleryImageFile(null);
  };

  const handleDeleteGalleryImage = (id) => {
    const updatedGallery = galleryImages.filter(img => img.id !== id);
    setGalleryImages(updatedGallery);
    localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
  };

  const handleEditClick = (person) => {
    setEditPersonId(person.id);
    setEditFormData({
      name: person.name,
      contact: person.contact,
      locationMet: person.locationMet,
      importance: person.importance,
      image: person.image,
    });
  };

  const handleSaveEdit = (id) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, ...editFormData } : person
      )
    );
    setEditPersonId(null);
  };

  const handleDeletePerson = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      setPeople((prevPeople) => prevPeople.filter((person) => person.id !== id));
    }
  };

  // Filter people based on search term (case-insensitive)
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.locationMet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.importance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('notes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password, try again!');
      setEnteredPassword('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert('Please enter a name.');

    const newPerson = {
      id: Date.now(),
      name,
      contact,
      locationMet,
      importance,
      image,
    };

    setPeople([...people, newPerson]);

    // Clear form fields
    setName('');
    setContact('');
    setLocationMet('');
    setImportance('');
    setImage(null);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '400px', margin: 'auto' }}>
        <h2>Please enter the password to access People Memory Tracker</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '700px', margin: 'auto' }}>
      <h1>People Memory Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Where you met"
          value={locationMet}
          onChange={(e) => setLocationMet(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Why important"
          value={importance}
          onChange={(e) => setImportance(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />

        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Upload Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {image && (
          <img
            src={image}
            alt="Preview"
            style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: '1rem', borderRadius: 8 }}
          />
        )}

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Add Person
        </button>
      </form>

      <input
        type="text"
        placeholder="Search people..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
      />

      <h2>People you've added:</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredPeople.map((person) => (
          <li
            key={person.id}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {editPersonId === person.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(person.id);
                }}
                style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}
              >
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editFormData.contact}
                  onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                  placeholder="Contact Info"
                />
                <input
                  type="text"
                  value={editFormData.locationMet}
                  onChange={(e) => setEditFormData({ ...editFormData, locationMet: e.target.value })}
                  placeholder="Where you met"
                />
                <input
                  type="text"
                  value={editFormData.importance}
                  onChange={(e) => setEditFormData({ ...editFormData, importance: e.target.value })}
                  placeholder="Why important"
                />
                <div>
                  <button type="submit" style={{ marginRight: '8px' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setEditPersonId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {person.image && (
                  <img
                    src={person.image}
                    alt={`${person.name}'s pic`}
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <strong>{person.name}</strong>
                  <br />
                  {person.contact}
                  <br />
                  Met at: {person.locationMet}
                  <br />
                  Important because: {person.importance}
                </div>
                <div>
                  <button onClick={() => handleEditClick(person)} style={{ marginRight: '8px' }}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePerson(person.id)}
                    style={{ color: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Notes Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>General Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write any general notes here..."
          style={{
            width: '100%',
            height: '150px',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Chatbot Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Chat with People Memory Bot</h2>
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            height: '300px',
            overflowY: 'auto',
            marginBottom: '1rem',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {messages.length === 0 && <p>No messages yet. Say hi!</p>}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#e0e0e0',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;

            const userMsg = { sender: 'user', text: newMessage.trim() };
            setMessages((prev) => [...prev, userMsg]);

            // Simple echo bot logic, can be replaced by more advanced AI
            setTimeout(() => {
              const botMsg = {
                sender: 'bot',
                text: `You said: "${newMessage.trim()}". Remember, this is just a demo bot.`,
              };
              setMessages((prev) => [...prev, botMsg]);
            }, 500);

            setNewMessage('');
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '80%', padding: '0.5rem', fontSize: '1rem' }}
          />
          <button type="submit" style={{ width: '18%', padding: '0.5rem', marginLeft: '2%' }}>
            Send
          </button>
        </form>
      </div>

      {/* Gallery Section */}
      <div style={{ marginTop: '2rem' }}>
        <h2>Gallery</h2>

        {!isGalleryAuthenticated ? (
          <form onSubmit={handleGalleryPasswordSubmit}>
            <input
              type="password"
              placeholder="Enter gallery password"
              value={galleryPassword}
              onChange={(e) => setGalleryPassword(e.target.value)}
              style={{ padding: '0.5rem', width: '70%', marginRight: '0.5rem' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>
              Enter
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleAddGalleryImage} style={{ marginBottom: '1rem' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryImageChange}
                style={{ marginBottom: '0.5rem' }}
              />
              <button type="submit" style={{ padding: '0.5rem 1rem' }}>
                Add Image
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {galleryImages.length === 0 && <p>No images in gallery yet.</p>}
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative',
                    width: '150px',
                    height: '150px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={img.src}
                    alt="Gallery"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => handleDeleteGalleryImage(img.id)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 0, 0, 0.7)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      lineHeight: '22px',
                      padding: 0,
                    }}
                    aria-label="Delete image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
