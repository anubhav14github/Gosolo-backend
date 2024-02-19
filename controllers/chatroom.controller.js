const mongoose = require('mongoose');
const ChatRoom = require('../models/chatRoom.model');
const chatMessage = require('../models/ChatMessage.model');
const User = require('../models/user.model');
const makeValidation = require('@withvoid/make-validation');

module.exports.initiate = async (req, res) => {
    try {
        const { userIds, type,postID } = req.body;
        const chatInitiator = req.userId;
        const chatRoom = await ChatRoom.initiateChat(userIds, type, chatInitiator,postID);
        return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports.postMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
                messageText: { type: types.string },
            }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });

        const messagePayload = {
            messageText: req.body.messageText,
        };
        const currentLoggedUser = req.userId;
        const post = await chatMessage.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);

        if (post) {
            res.status(200).json(post);
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports.markConversationReadByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoom.getChatRoomByRoomId(roomId)
        if (!room) {
            return res.status(400).json({
                success: false,
                message: 'No room exists for this id',
            })
        }

        const currentLoggedUser = req.userId;
        const result = await chatMessage.markMessageRead(roomId, currentLoggedUser);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
    }
}

module.exports.getConversationByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoom.getChatRoomByRoomId(roomId)
        if (!room) {
            return res.status(400).json({
                success: false,
                message: 'No room exists for this id',
            })
        }
        const users = await User.getUserByIds(room.userIds)
        const options = {
            page: parseInt(req.query.page) || 0,
            limit: parseInt(req.query.limit) || 10,
        };
        const conversation = await chatMessage.getConversationByRoomId(roomId, options,req.UserId);

        res.status(200).json({
            success: true,
            conversation,
            users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error });

    }
}

module.exports.deleteRoomById = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoom.findByIdAndDelete({ _id: roomId });
        const messages = await chatMessage.deleteMany({ chatRoomId: roomId });
        if (messages) {
            res.status(200).json({
                success: true,
                message: "Operation performed succesfully",
                deletedRoomsCount: room,
                deletedMessagesCount: messages,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
}

module.exports.deleteMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const msg = await chatMessage.findByIdAndDelete({ _id: messageId });
        
        if (msg) {
            res.status(200).json({
                success: true,
                message: msg
            });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}