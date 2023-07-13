const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose
  .connect('mongodb://localhost:27017/', {
    dbName: 'WikiDB',
  })
  .then(() => {
    console.log('MongoDB connected')
  })

const articleSchema = {
  title: String,
  content: String,
}

const Article = mongoose.model('Article', articleSchema)
app
  .route('/articles')
  .get(async (req, res) => {
    try {
      const foundArticles = await Article.find()
      res.send(foundArticles)
    } catch (error) {
      // console.log(error)
      res.send(error)
    }
  })
  .post(async (req, res) => {
    // console.log(req.body.title)
    // console.log(req.body.content)

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    try {
      const result = await newArticle.save()
      res.send(result)
    } catch (error) {
      res.send(error)
    }
  })
  .delete(async (req, res) => {
    try {
      await Article.deleteMany()
      res.send('Deleted successfully')
    } catch (error) {
      res.send(error)
    }
  })

// get all articles route
// app.get('/articles', async(req,res)=>{
//     try {
//         const foundArticles = await Article.find();
//         res.send(foundArticles);
//     } catch (error) {
//         // console.log(error)
//         res.send(error)
//     }
// })

// create new request
// app.post('/articles', async(req,res)=>{
//     // console.log(req.body.title)
//     // console.log(req.body.content)

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     })
//     try {
//         const result = await newArticle.save();
//         res.send(result)
//     } catch (error) {
//         res.send(error)
//     }

// })

// delete all articles
// app.delete('/articles', async(req,res)=>{
//     try {
//         await Article.deleteMany();
//         res.send("Deleted successfully")

//     } catch (error) {
//         res.send(error)
//     }
// })

// routes chained for targeting specific routes
app
  .route('/articles/:articleTitle')
  .get(async (req, res) => {
    const articleTitle = req.params.articleTitle
    try {
      const foundArticle = await Article.findOne({ title: articleTitle })
      if (foundArticle) res.send(foundArticle)
      else res.send('No articles found')
    } catch (error) {
      res.send(error)
    }
  })
  .put(async (req, res) => {
    const articleTitle = req.params.articleTitle
    try {
      await Article.replaceOne(
        { title: articleTitle },
        { title: req.body.title, content: req.body.content }
      )
        .then(res.send('Updated successfully'))
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  })
  .patch(async (req, res) => {
    const articleTitle = req.params.articleTitle
    try {
      const updated = await Article.updateOne(
        { title: articleTitle },
        { $set:req.body}
      )
        if(updated) res.send("Updated")
        else res.send("Error")
        
    } catch (error) {
      console.log(error)
    }
  })
  .delete(async (req,res)=>{
    const articleTitle = req.params.articleTitle
    await Article.deleteOne({title: articleTitle})
  })

app.listen(3000, () => {
  console.log('Server started at port 3000')
})
