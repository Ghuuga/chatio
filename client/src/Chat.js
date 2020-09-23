import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid/dist/v4'

const myId = uuid()

const socket = io('http://localhost:8080')
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'))

const Chat = () => {
    const [message, updateMessage] = useState('')
    const [messages, updateMessages] = useState([])
        
    useEffect(() => {
       const handleNewMessage = newMessage =>
          updateMessages([...messages, newMessage])
       socket.on('chat.message', handleNewMessage)
       return () => socket.off('chat.message, handleNewMessage')
    }, [messages])

    const handleFormSubmit = event => {
        event.preventDefault()
        // '' => ''
        // '   ' => ''
        // 'olá' => 'olá'
        if (message.trim()) {
            socket.emit('chat.message', {
                id: myId,
                message
            })
            updateMessage('') 
        }
    }

    const handleInputChange = event =>
        updateMessage(event.target.value)

    return (  
    <main className="container">
        <div className="list">
            { messages.map((m, index) => (
            <div 
              className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`}
              key={index}
            >
            <div className="item">
             <div className="user">
                 <img  class="avatarUser" src="https://cdn.ppconcursos.com.br/uploads/depoimentos/padrao.png" alt="Usuario" width="60" height="60"/>
             </div>
             <span className={`message message--${m.id === myId ? 'mine' : 'other'}`}>
                  { m.message }
             </span>
            </div>
        </div>
            ))}
        </div>
        <form className="form" onSubmit={handleFormSubmit}>
            <input
            className="form__field"
            placeholder="Type a message here"
            onChange={handleInputChange}
            type="text"
            value={message}
            />
        </form>
    </main>
)
}

export default Chat;