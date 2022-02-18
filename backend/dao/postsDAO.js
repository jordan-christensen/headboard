import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId
let posts

export default class PostsDAO {
  // connect to and reference db
  static async injectDB(conn) {
    if (posts) {
      return
    }
    try {
      posts = await conn.db(process.env.HEADBOARD_NS).collection("posts")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in postsDAO: ${e}`,
      )
    }
  }

  static async getPosts({
    filters = null,
    page = 0,
    postsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("objective" in filters) {
        query = { $text: { search: filters["objective"] } } 
      } else if ("objective" in filters) {
        query = { "date": { $eq: filters["date"] } }
      }
    }

    let cursor

    try {
      cursor = await posts
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { postsList: [], totalNumPosts: 0 }
    }

    const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page)

    try {
      const postsList = await displayCursor.toArray()
      const totalNumPosts = await posts.countDocuments(query)

      return { postsList, totalNumPosts }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      )
      return { postsList: [], totalNumPosts: 0 }
    }
  }

  static async getPostByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "posts",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$post_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "posts",
                  },
              },
              {
                  $addFields: {
                      posts: "$posts",
                  },
              },
          ]
      return await posts.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getPostByID: ${e}`)
      throw e
    }
  }

  static async addPost(
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
  ) {
    try {
      const postDoc = {
        objective: objective,
        plan: plan,
        strengths: strengths,
        weakness: weakness,
        motivation: motivation,
        anxiety: anxiety,
        concentration: concentration,
        confidence: confidence,
        decisionMaking: decisionMaking,
        notes: notes,
        date: date
      }

      return await posts.insertOne(postDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async updatePost(
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
  ) {
    try {
      const updateResponse = await posts.updateOne(
        {_id: ObjectId(postId)},
        { $set: {
          objective: objective,
          plan: plan,
          strengths: strengths,
          weakness: weakness,
          motivation: motivation,
          anxiety: anxiety,
          concentration: concentration,
          confidence: confidence,
          decision_making: decisionMaking,
          notes: notes,
          date: date
        } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update post: ${e}`)
      return { error: e }
    }
  }

  static async deletePost(postId) {
    try {
      const deleteResponse = await posts.deleteOne({
        _id: ObjectId(postId)
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete post: ${e}`)
      return { error: e }
    }
  }
}
