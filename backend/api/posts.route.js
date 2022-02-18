import express from 'express'
import PostsCtrl from "./posts.controller.js"

const router = express.Router()

router
.route("/")
.get(PostsCtrl.apiGetPosts)
.post(PostsCtrl.apiAddPost)
.put(PostsCtrl.apiUpdatePost)
.delete(PostsCtrl.apiDeletePost)

router.route("/id/:id").get(PostsCtrl.apiGetPostById)

export default router