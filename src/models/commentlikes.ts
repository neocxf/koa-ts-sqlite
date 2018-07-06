import {conn, sequelize} from '../conn'

let CommentLikes = conn.define('comment-likes', {
  commentId: sequelize.INTEGER,
  userId: sequelize.INTEGER,
  likes: sequelize.INTEGER,
  disLikes: sequelize.INTEGER
})


export {CommentLikes}
