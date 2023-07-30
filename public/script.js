const joinBtn = document.querySelector("#join-btn");
const msgContainer = document.querySelector('.msg-container');

const socket = io();

let username = '';
let userId = '';

joinBtn.addEventListener("click", (event) => {
  event.preventDefault();
  username = document.getElementById("username").value;

  if(username.trim() !== ''){
    document.querySelector('.login-form').style.display = 'none';
    document.querySelector('.chat-room').style.display = 'flex';
  }
  console.log('inside on click fn: ', username);
  socket.emit('join', username);
  userId = socket.id;
});

document.querySelector('#send-btn').addEventListener('click', (event) => {
  event.preventDefault();

  const data = {
    username: username,
    userId: socket.id,
    message: document.getElementById('msg-input').value,
  }
  if(data.message.trim() === '') return;
  socket.emit('message', data);
  document.getElementById("msg-input").value = '';
  renderSentMessage(data);
});

socket.on('join', username =>{
  renderAlertMessage(username, 'joined');
})
socket.on('disconnect', username => {
  socket.emit('disconnect', username);
})
socket.on('left', username=>{
  renderAlertMessage(username, 'left');
})

socket.on('message', data =>{
  if(data.userId !== userId){
    renderRecievedMessage(data);
  }
})

function renderAlertMessage(name, status){
  console.log(name);
  const div = document.createElement('div');
  div.className = status === 'joined' ? 'joined-chat' : 'left-chat';
  message = status === 'joined' ? 'joined' : 'left';
  div.innerText = `${name} ${message} the chat`;
  msgContainer.appendChild(div);
}

function renderRecievedMessage(data){
  const div = document.createElement('div');
  div.className = 'msg recieved';
  div.innerHTML = `<div class="name sender">${data.username}</div>${data.message}`;
  msgContainer.appendChild(div);
}

function renderSentMessage(data){
  const div = document.createElement('div');
  div.className = 'msg sent';
  div.innerHTML = `<div class="name reciever">${data.username}</div>${data.message}`
  msgContainer.appendChild(div);
}