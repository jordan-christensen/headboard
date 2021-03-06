import PostsDAO from "../dao/postsDAO.js";

export default class PostsController {
  static async apiGetPosts(req, res, next) {
    const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerpage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.date) {
      filters.date = req.query.date
    } else if (req.query.objective) {
      filters.objective = req.query.objective
    }

    const { postsList, totalNumPosts } = await PostsDAO.getPosts({
      filters,
      page,
      postsPerPage,
    }) 

    let response = {
      posts: postsList,
      page: page,
      filters: filters,
      entries_per_page: postsPerPage,
      total_results: totalNumPosts, 
    }
    res.json(response)
  }
  
  static async apiGetPostById(req, res, next) {
    try {
      let id = req.params.id || {}
      let post = await PostsDAO.getPostByID(id)
      if (!post) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(post)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiAddPost(req, res, next) {
    try {
      const objective = req.body.objective
      const plan = req.body.plan
      const strengths = req.body.strengths
      const weakness = req.body.weakness
      const motivation = req.body.motivation
      const anxiety = req.body.anxiety
      const concentration = req.body.concentration
      const confidence = req.body.confidence
      const decision_making = req.body.decision_making
      const notes = req.body.notes
      const date = new Date()

      const postResponse = await PostsDAO.addPost(
        objective,
        plan,
        strengths,
        weakness,
        motivation,
        anxiety,
        concentration,
        confidence,
        decision_making,
        notes,
        date
      )
      console.log(postResponse)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdatePost(req, res, next) {
    try {
      const postId = req.body.post_id
      const objective = req.body.objective
      const plan = req.body.plan
      const strengths = req.body.strengths
      const weakness = req.body.weakness
      const motivation = req.body.motivation
      const anxiety = req.body.anxiety
      const concentration = req.body.concentration
      const confidence = req.body.confidence
      const decisionMaking = req.body.decision_making
      const notes = req.body.notes
      const date = req.body.date

      const postResponse = await PostsDAO.updatePost(
        postId,
        objective,
        plan,
        strengths,
        weakness,
        motivation,
        anxiety,
        concentration,
        confidence,
        decisionMaking,
        notes,
        date
      )

      var { error } = postResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (postResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update post"
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeletePost(req, res, next) {
    try {
      const postId = req.query.id
      console.log(postId)
      const postResponse = await PostsDAO.deletePost(
        postId,
      )
      console.log(postResponse)
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}