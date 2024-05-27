import React, { useState, useEffect, use, useRef } from "react";
import Nav from "../../../components/Nav/Nav";
import { useRouter } from "next/router";
import axios from "axios";
import { getToken } from "../../../utils/helpers";
import toast from "react-hot-toast";
import LoaderSpinner from "../../../components/LoaderSpinner/LoaderSpinner";
import moment from 'moment-timezone';
import { Avatar, Icon } from "@mui/material";
import { io } from "socket.io-client";
import { apiUrlWihoutApi } from "../../../utils/constants";
// import TagChat from "../../components/TagChat/TagChat";
import { useDropzone } from "react-dropzone";
import AttachFileIcon from '@mui/icons-material/AttachFile';



function Chat() {
  const router = useRouter();
  const { id, name } = router.query;



  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const getChats = () => {
    setLoadingChats(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/asesorChats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then((response) => {
      setChats(response.data);
    })
    .catch((error) => {
      toast.error("Error al cargar los chats");
      console.error(error);
    })
    .finally(() => {
      setLoadingChats(false);
    });
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="container">
        <Nav />
      <div className="chatContainer">
        <div className="cardHeaderContainer">
          <h1>Chat</h1>
        </div>
        <div className="chatCompleteContainer">
          <div className="messagesContainer">
            {loadingChats && chats.length === 0 && <LoaderSpinner />}
            {chats.length === 0 && !loadingChats && <p>No hay chats</p>}
            {chats.map((chat, index) => (
              <Message key={index} chatBody={chat} />
            ))}
          </div>
          <div className="messagesChatContainer">
            <ChatContainer phoneNumber={id} name={name} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({ chatBody }:any) {
  const router = useRouter();

  const getDeltaTime = () => {
    // const lastMessageAgo = moment(chatBody.lastMessage?.timestamp).subtract(5, 'hours').tz('Etc/GMT+5').fromNow();
    const lastMessageAgo = moment(chatBody.lastMessage?.timestamp * 1000).tz('America/Bogota').fromNow();
  
    return lastMessageAgo;
  }

  const handleChat = () => {
    router.push(`/chat/${chatBody.id._serialized}/${chatBody.name}`);
  };

  return (
      <div className="message" onClick={handleChat}>
        <p className="messagePhoneNumber">{chatBody.name}</p>
        <div className="bottomMessage">
          <p className="messageText" style={{ fontWeight: (chatBody?.lastMessage?.fromMe === false)  ? '700' : 'normal'}}>{chatBody.lastMessage?.body.substring(0, 20)} {chatBody.lastMessage?.body.length > 20 && '...'}</p>
          <p className="messageText">{getDeltaTime()}</p>
        </div>
      </div>
  );
}

function ChatContainer({phoneNumber, name}:any) {
  const [messages, setMessages] : any = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState({ text: "" });
  const [files, setFiles] = useState([] as any);

  const messagesEndRef:any = useRef(null);

  const onDrop = (acceptedFiles:any) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
		multiple: true,
		onDrop
	});

  const socket = io(apiUrlWihoutApi)

  socket.on('connect', () => {
    socket.emit('join', phoneNumber)
  })

  socket.on('message', (message:any) => {
    setMessages([...messages, message]);
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }


  const getMessages = () => {
    setLoadingMessages(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/listChatMessages/${phoneNumber}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => {
      setMessages(response.data);
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error al cargar los mensajes");
    })
    .finally(() => {
      setLoadingMessages(false);
    });
  }

  const sendMessage = () => {
    const formData = new FormData();
  
    // Si hay archivos, añádelos al formData
    if (files) {
      for (let i = 0; i < files.length; i++) {
        console.log({file: files[i]})
        formData.append('files', files[i]);
      }
    }

    formData.append('phoneNumber', phoneNumber);
    formData.append('message', message.text);


  
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/sendMessage`, 
      formData
    , {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then(() => {
      if (files.length > 0) {
        // los files con object File, necesito pasarlo a base64
        const reader:any = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          // quita toda la primer parte del string que no es base64
          setMessages([...messages, { body: message.text, fromMe: true, timestamp: Math.floor(Date.now() / 1000), hasMedia: true, _data: {body: reader.result.split(',')[1], mimetype: files[0].type, filename: files[0].name}}]);
        }
      } else {
        setMessages([...messages, { body: message.text, fromMe: true, timestamp: Math.floor(Date.now() / 1000)}]);
      }
      setMessage({ text: "" });
      setFiles([]);
      // getMessages();
    })
    .catch((error) => {
      console.error(error);
      toast.error("Error al enviar el mensaje");
    });
  };

  const getHour = (timestamp:any) => {
    const timestampInMilliseconds = timestamp * 1000;
    return moment(timestampInMilliseconds).tz('America/Bogota').format('HH:mm a');
  }

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  useEffect(scrollToBottom, [messages]);

  if (!phoneNumber || parseInt(phoneNumber) === 0) {
    return (
      <div className="chatMessagesContainer">
        <div className="noChat">
        <p>No has seleccionado un chat</p>
        </div>
      </div>
    )
  }

  if (loadingMessages) {
    return (
      <div className="chatMessagesContainer">
        <div className="noChat">
          <LoaderSpinner />
        </div>
      </div>
    )
  }
 
  return (
    <>
      <div className="chatMessagesContainer">
        <div className="chatHeader">
          <Avatar style={{ marginRight: 10 }} />
          <p>Chat con {name}</p>

          {/* <TagChat phoneNumber={phoneNumber} /> */}
        </div>
        <div className="messagesChatContainerCard">
          {messages.map((message:any, index:any) => (
            <>
              <div style={{ width: '100%', display: 'flex', justifyContent:message.fromMe ? 'end' : 'start', marginTop: '15px'}}>
                <div className={message.fromMe ? "messageCardPro" : 'messageCardSec'} style={{ background: message.fromMe ? '#ffb1b1' : '#b1ffb1',  width: message.hasMedia ? '70%' : ''}}>
                  {message.hasMedia && (
                    <div className="imageMessageContainer">
                      {message._data.mimetype.startsWith('image') ? (
                        <img src={'data:image/jpeg;base64,' + message._data.body} />
                        ) : (
                          // necesito crear un tipo file para que sea descargado
                          <a 
                            href={'data:' + message._data.mimetype + ';base64,' + message._data.body} 
                            download={message._data.filename || 'downloaded_file'}
                            style={{ display: '' }} // Ocultar el enlace
                            id={'download-link-' + message._data.id} // Asignar un ID único al enlace
                          >
                            Descargar archivo
                          </a>
                        )}
                    </div>
                  )}
                  <div className="messageTextContainer" style={{ marginTop: message.hasMedia ? '10px' : ''}}>
                    <p style={{ width: message.hasMedia ? '90%' : ''}}>{message.body}</p>
                    <div className="hourMessageChatContainer">
                      <p className="hourMessageChat">{getHour(message.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
          <div ref={messagesEndRef} />

        </div>

        <div className="messagesChatBotton">
          <input 
            className="inputChat" 
            type="text" 
            placeholder="Escribe un mensaje" 
            value={message.text}
            onChange={ev => setMessage({...message, text: ev.target.value})}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }} 
          />
          <div {...getRootProps({})} style={{ cursor: 'pointer', display: 'flex' }}>
            <input {...getInputProps()} />
            <AttachFileIcon />
            {files.length > 0 && <p>{files.length}</p>}
          </div>
          <button className="primaryButton" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </>
  )
}

export default Chat;