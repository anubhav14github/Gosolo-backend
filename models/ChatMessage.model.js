const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');


const MESSAGE_TYPES = {
    TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
    {
        _id: false,
        readByUserId: String,
        readAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: false,
    }
);

const chatMessageSchema = new mongoose.Schema(
    {
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chatroom"
        },
        message: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            default: () => MESSAGE_TYPES.TYPE_TEXT,
        },
        postedByUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        readByRecipients: [readByRecipientSchema],
    },
    {
        timestamps: true,
    }
);

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
    try {
        const post = await this.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: { readByUserId: postedByUser }
        });

        // const aggregate = await this.aggregate([
        //     // get post where _id = post._id
        //     { $match: { _id: post._id } },
        //     // do a join on another table called users, and 
        //     // get me a user whose _id = postedByUser
        //     // {
        //     //     $lookup: {
        //     //         from: 'Users',
        //     //         localField: 'postedByUser',
        //     //         foreignField: '_id',
        //     //         as: 'postedByUserID',
        //     //     }
        //     // },
        //     // { $unwind: '$postedByUser' },
        //     // do a join on another table called chatrooms, and 
        //     // get me a chatroom whose _id = chatRoomId
        //     {
        //         $lookup: {
        //             from: 'chatrooms',
        //             localField: 'chatRoomId',
        //             foreignField: '_id',
        //             as: 'chatRoomInfo',
        //         }
        //     },
        //     { $unwind: '$chatRoomInfo' },
        //     //{ $unwind: '$chatRoomInfo.userIds' },
        //     // do a join on another table called users, and 
        //     // get me a user whose _id = userIds
        //     {
        //         $lookup: {
        //             from: 'Users',
        //             localField: 'chatRoomInfo.userIds',
        //             foreignField: '_id',
        //             as: 'chatRoomInfo.userProfile',
        //         }
        //     },
        //     { $unwind: '$chatRoomInfo.userProfile' },
        //     // group data
        //     {
        //         $group: {
        //             _id: '$chatRoomInfo._id',
        //             postId: { $last: '$_id' },
        //             chatRoomId: { $last: '$chatRoomInfo._id' },
        //             message: { $last: '$message' },
        //             type: { $last: '$type' },
        //             readByRecipients: { $last: '$readByRecipients' },
        //             chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
        //             createdAt: { $last: '$createdAt' },
        //             updatedAt: { $last: '$updatedAt' },
        //         }
        //     }
        // ]);

        // return aggregate;
        return post
    } catch (error) {
        console.log(error)
    }
}

chatMessageSchema.statics.getConversationByRoomId = async function (chatRoomId, options, postedByUser) {
    try {
        const msgs = await chatMessage.find({ chatRoomId: chatRoomId })
        .select('message postedByUser').populate('message')
        .sort({createdAt: 1} )
        .limit(50)
        return msgs
        // const agg = this.aggregate([
        //     { $match: { chatRoomId } },
        //     { $sort: { createdAt: -1 } },
        //     // do a join on another table called users, and 
        //     // get me a user whose _id = postedByUser
        //     {
        //         $lookup: {
        //             from: 'Users',
        //             localField: 'postedByUser',
        //             foreignField: '_id',
        //             as: 'postedByUser',
        //         }
        //     },
        //     { $unwind: "$postedByUser" },
        //     // apply pagination
        //     { $skip: options.page * options.limit },
        //     { $limit: options.limit },
        //     { $sort: { createdAt: 1 } },
        // ]);

        // return agg
    } catch (error) {
        throw error;
    }
}

chatMessageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
    try {
        return this.updateMany(
            {
                chatRoomId,
                'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
            },
            {
                $addToSet: {
                    readByRecipients: { readByUserId: currentUserOnlineId }
                }
            },
            {
                multi: true
            }
        );
    } catch (error) {
        throw error;
    }
}
const chatMessage = mongoose.model("chatmsg", chatMessageSchema);
module.exports = chatMessage;
// export default mongoose.model("ChatMessage", chatMessageSchema);