const { useState, useEffect } = React;

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handlePostComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObject = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString(),
        replies: [],
      };
      setComments([newCommentObject, ...comments]);
      setNewComment("");
    }
  };

  const handleReplyComment = (commentId) => {
    setReplyCommentId(commentId);
  };

  const handlePostReply = () => {
    if (replyText.trim() !== "") {
      const updatedComments = comments.map((comment) => {
        if (comment.id === replyCommentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                text: replyText,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyCommentId(null);
      setReplyText("");
    }
  };

  const handleDeleteComment = (commentId, replyId) => {
    if (replyId) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } else {
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
    }
  };

  useEffect(() => {
    // You can use this block if you want to dynamically set text color based on background luminance
    // const commentSectionElement = document.getElementById('comment-section');
    // const backgroundColor = window.getComputedStyle(commentSectionElement).backgroundColor;
    // const textColor = determineTextColor(backgroundColor);
    // document.documentElement.style.setProperty('--text-color', textColor);
  }, [comments]);

  const renderReplies = (replies, commentId) => {
    return replies.map((reply) => (
      <div key={reply.id} style={{ marginBottom: "10px", marginLeft: "20px" }}>
        <p>{reply.text}</p>
        <small>{reply.timestamp}</small>
        <button
          className="delete-button"
          onClick={() => handleDeleteComment(commentId, reply.id)}
        >
          Delete
        </button>
      </div>
    ));
  };

  const renderComments = () => {
    return comments.map((comment) => (
      <div key={comment.id} style={{ marginBottom: "10px" }}>
        <p>{comment.text}</p>
        <small>{comment.timestamp}</small>
        <button
          className="reply-button"
          onClick={() => handleReplyComment(comment.id)}
          disabled={replyCommentId === comment.id}
        >
          Reply
        </button>
        <button
          className="delete-button"
          onClick={() => handleDeleteComment(comment.id)}
        >
          Delete
        </button>
        {replyCommentId === comment.id && (
          <div>
            <textarea
              rows="3"
              value={replyText}
              onChange={handleReplyChange}
              placeholder="Write your reply..."
            />
            <br />
            <button onClick={handlePostReply}>Post Reply</button>
          </div>
        )}
        {renderReplies(comment.replies, comment.id)}
      </div>
    ));
  };

  return (
    <div id="comment-section">
      <h1>Image Title</h1>
      <div>
        <textarea
          rows="4"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Write your comment..."
        />
        <br />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>
      <div>
        <h2>Comments</h2>
        {renderComments()}
      </div>
    </div>
  );
};

ReactDOM.render(<CommentSection />, document.getElementById("root"));
