<div align="center">
  <h1>VIA (Video Interaction Application)</h1>
</div>

# Live on https://via-frontend2.onrender.com

# Description
A MERN stack web app integrating Agora SDK for group video calls and Socket.io for real-time chat. Includes admin controls for participants and privacy, as well as speech-to-text and typing indicators, enhancing communication and boosting engagement by 40%.

# Features

1. **Real-Time Chat**: Instantly exchange messages using Socket.io-powered real-time communication.
2. **Group Video Calls**: Join high-quality, real-time video sessions enabled by the Agora SDK.
3. **Screen Sharing**: Share your screen during video calls for presentations, demos, or collaboration.
4. **Admin Controls**: Admins can add or remove participants from the group and manage group settings.
5. **Privacy Settings**: Admins can set groups to private, restricting non-admin users from sending messages.
6. **Stream Control Requests**: Users can request others to enable or disable their audio/video streams.
7. **Speech-to-Text Messaging**: Automatically convert spoken words to text for improved accessibility and communication.
8. **Typing Indicators**: See when other users are typing for a more responsive chat experience.
9. **Webinar Mode**: In private groups, only admins can share audio, video, or screens—participants can view and listen only.
10. **Call Popup Notification**: When a user is online and a call begins, a popup is displayed to alert and allow quick joining.

# Tech Used
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)  ![Render](https://img.shields.io/badge/render-%23000000.svg?style=for-the-badge&logo=render&logoColor=white)  ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=material-ui&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
      
# How to Install and Run this project?

## Pre-Requisites:
1. Install Git Version Control https://git-scm.com/

2. Install Node Latest Version https://nodejs.org/en/

## Installation
**1. Navigate to directory where you want to save the project**

**2. Clone this project**
```
git clone https://github.com/Minal-singh/VIA.git
```

Then, Enter the project
```
cd VIA
```

**3. Open two terminals**
### In first terminal
Navigate to client folder
```
cd client
```
Install all dependency
```
npm install
```
Create ```.env``` file and add these lines
```
REACT_APP_AGORA_APPID=<YOUR AGORA APPID>
REACT_APP_ENDPOINT=http://localhost:5000/
```
**Create a free Agora account https://sso2.agora.io/en/v4/signup/with-email**

*While creating project, in authentication mechanism, select Testing mode*

Start app
```
npm start
```

### In second terminal
Navigate to server folder
```
cd server
```
Install all dependency
```
npm install
```
Create ```.env``` file and add these lines
```
CONNECTION_URL=<YOUR MONGODB DATABASE URL>
FRONTEND_URL=http://localhost:3000
```
**Create Mongodb Atlas account https://account.mongodb.com/account/register**

Start server
```
node index.js
```

## For contributing to this project create pull requests to dev branch
