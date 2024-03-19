import React from 'react'
import "./styles/chatBoxStyle.scss";

const ChatBox = () => {
    const messages = [
        {
            "message": "Hi, how are you?",
            "timestamp": "Sent on 10-02-24 - 10:43 PM",
            "sender": 1
        },
        {
            "message": "I'm doing well, thanks! How about you?",
            "timestamp": "Sent on 10-02-24 - 10:45 PM",
            "sender": 1
        },
        {
            "message": "I'm good too, just relaxing.",
            "timestamp": "Sent on 10-02-24 - 10:46 PM",
            "sender": 2
        },
        {
            "message": "That sounds nice. Have any plans for the weekend?",
            "timestamp": "Sent on 10-02-24 - 10:47 PM",
            "sender": 1
        },
        {
            "message": "Not really, just going to catch up on some reading.",
            "timestamp": "Sent on 10-02-24 - 10:49 PM",
            "sender": 1
        },
        {
            "message": "Sounds relaxing. Enjoy your weekend!",
            "timestamp": "Sent on 10-02-24 - 10:51 PM",
            "sender": 2
        },
        {
            "message": "Thanks! You too!",
            "timestamp": "Sent on 10-02-24 - 10:53 PM",
            "sender": 1
        },
        {
            "message": "Hey, did you watch the game last night?",
            "timestamp": "Sent on 10-02-25 - 8:30 AM",
            "sender": 1
        },
        {
            "message": "No, I missed it. Who won?",
            "timestamp": "Sent on 10-02-25 - 8:32 AM",
            "sender": 1
        },
        {
            "message": "The Lions won by 10 points.",
            "timestamp": "Sent on 10-02-25 - 8:35 AM",
            "sender": 2
        },
        {
            "message": "Wow, that's surprising!",
            "timestamp": "Sent on 10-02-25 - 8:37 AM",
            "sender": 1
        },
        {
            "message": "Yeah, they played really well.",
            "timestamp": "Sent on 10-02-25 - 8:40 AM",
            "sender": 1
        },
        {
            "message": "I'll have to catch the highlights later.",
            "timestamp": "Sent on 10-02-25 - 8:42 AM",
            "sender": 1
        },
        {
            "message": "Definitely worth watching!",
            "timestamp": "Sent on 10-02-25 - 8:45 AM",
            "sender": 2
        },
        {
            "message": "Hey, did you see the new movie that came out?",
            "timestamp": "Sent on 10-02-26 - 1:20 PM",
            "sender": 1
        },
        {
            "message": "No, not yet. Was it any good?",
            "timestamp": "Sent on 10-02-26 - 1:22 PM",
            "sender": 1
        },
        {
            "message": "Yeah, it was really good. You should check it out.",
            "timestamp": "Sent on 10-02-26 - 1:25 PM",
            "sender": 2
        },
        {
            "message": "I'll add it to my list!",
            "timestamp": "Sent on 10-02-26 - 1:27 PM",
            "sender": 1
        },
        {
            "message": "Let me know what you think!",
            "timestamp": "Sent on 10-02-26 - 1:30 PM",
            "sender": 1
        }
    ];



    return (
        <div className='chat-box-body'>
            {messages.map((message, index) => (
                message.sender !== 2 ? (
                    <div className="message-body-left" key={index}>
                        <div className="message">{message.message}</div>
                        <div className="message-timestamp">{message.timestamp}</div>
                    </div>
                ) : (
                    <div className="message-body-right" key={index}>
                        <div className="message">{message.message}</div>
                        <div className="message-timestamp">{message.timestamp}</div>
                    </div>
                )
            ))}
        </div>
    );
}

export default ChatBox