import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux'
import CommentSection from "./CommentSection"
import axios from 'axios';
/**
 * Entry point of the Comment
 * provide a comment component includng: add comment, add reply, show comment, you need to provide props.recipeId 
 * @method Comment
 */
const Comment = (props) => {
    const user = useSelector((state) => (state.user.userInfo))
    const recipeId = props.recipeId
    const [comment, setComment] = useState([])

    // it will be passed into child component of comment section
    const fresh = () => {
        axios.get(`/api/recipe/comments?id=${recipeId}`).
        then((res)=>{
            console.log(res.data.comments)
            if(res.data.comments === undefined) {
                setComment([])
            }else{
                setComment(res.data.comments)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    useEffect(() => {
        fresh()
    }, [])
    // count the comment number
    let count = 0;
    comment.map(i => {count+=1; i.replies && i.replies.map(i=> count+=1)} )
    return (
            <div className="commentSection">
                <div className="header">{count} Comments</div>
                <CommentSection recipeId={recipeId} comments={comment} currentUser={{ userId:user.id, avatarUrl:user.avatar, fullName:user.name}} refresh={fresh}/>
            </div>
            )
}
export default Comment;