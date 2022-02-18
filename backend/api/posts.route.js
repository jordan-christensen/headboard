import express from 'express'
import PostsCtrl from "./posts.controller.js"

const router = express.Router()

router.route("/").get(PostsCtrl.apiGetPosts)
router.route("/id/:id").get(PostsCtrl.apiGetPostById)

router
  .route("/posts")
  .post(PostsCtrl.apiAddPost)
  .put(PostsCtrl.apiUpdatePost)
  .delete(PostsCtrl.apiDeleteReview)

export default router