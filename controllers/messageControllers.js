import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
    }

    //Socket.IO functionality

    // await conversation.save();
    // await newMessage.save(); // this two will take more time than below one thats why
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (err) {
    console.log('error in sendMessage controller:', err.message);
    res.status(500).json({
      status: 'failed',
      error: err.message,
      message: 'Internal server error',
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('message');

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.message);
  } catch (err) {
    console.log('error in getMessage controller:', err.message);
    res.status(500).json({
      status: 'failed',
      error: err.message,
      message: 'Internal server error',
    });
  }
};
